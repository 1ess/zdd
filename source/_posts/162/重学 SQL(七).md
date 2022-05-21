---
title: 重学 SQL(七)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog162.jpg
date: 2020/08/21
---

本篇，我们来介绍一下 SQL 中比较重要的知识 —— 事务、事务隔离级别以及不同隔离级别所解决的问题。

## 事务(Transcation)
***  
事务是指代表单个工作单元的一组 SQL 语句，这些操作要么全做，要么全不做。

### ACID 特性
#### Atomicity
事务被视为不可分割的最小单元，事务的所有操作要么全部提交成功，要么全部失败回滚。
回滚可以用回滚日志(Undo Log)来实现，回滚日志记录着事务所执行的修改操作，在回滚时反向执行这些修改操作即可。

#### Consistency
数据库在事务执行前后都保持一致性状态。在一致性状态下，所有事务对同一个数据的读取结果都是相同的。

#### Isolation
一个事务所做的修改在最终提交以前，对其它事务是不可见的。

#### Durability
一旦事务提交，则其所做的修改将会永远保存到数据库中。即使系统发生崩溃，事务执行的结果也不能丢失。
系统发生奔溃可以用重做日志(Redo Log)进行恢复，从而实现持久性。与回滚日志记录数据的逻辑修改不同，重做日志记录的是数据页的物理修改。

注意: MySQL 默认采用自动提交模式。也就是说，如果不显式使用 START TRANSACTION 语句来开始一个事务，那么每个查询操作都会被当做一个事务并自动提交。
``` sql
SHOW VARIABLES LIKE 'autocommit';
-- autocommit ON
```

### 创建事务
``` sql
START TRANSACTION;
...

COMMIT;
-- ROLLBACK;
```

### 并发问题
- Lost Update
- Dirty Reads
- Non-Repeating Reads
- Phantom Reads

标准 SQL 实现了四个事务隔离级别(Isolation Level): 
- READ UNCOMMITTED
- READ COMMITTED
- REPEATABLE READ
- SERIALIZABLE 

| 隔离级别         | 脏读   | 不可重复读 | 幻读   |
|------------------|--------|------------|--------|
| READ UNCOMMITTED | 可能   | 可能       | 可能   |
| READ COMMITTED   | 不可能 | 可能       | 可能   |
| REPEATABLE READ  | 不可能 | 不可能     | 可能   |
| SERIALIZABLE     | 不可能 | 不可能     | 不可能 |

MySQL 中默认的隔离级别是 REPEATABLE READ，它比序列化隔离更快，并且防止了除了幻读之外的大多数并发问题。

#### 修改隔离级别
``` sql
SHOW VARIABLES LIKE 'transaction_isolation';
-- REPEATABLE-READ

SET [SESSION|GLOBAL] TRANSACTION ISOLATION LEVEL SERIALIZABLE;
```

### READ UNCOMMITTED
``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT points
FROM customers
WHERE customer_id = 1;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET points = 20
WHERE customer_id = 1;
COMMIT;
```

当客户端 2 执行 UPDATE 语句之后，COMMIT 之前时，再执行客户端 1 的所有语句，返回结果为 20，产生脏读问题。

### READ COMMITTED
``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT points
FROM customers
WHERE customer_id = 1;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET points = 20
WHERE customer_id = 1;
COMMIT;
```

当客户端 2 执行 UPDATE 语句之后，COMMIT 之前时，再执行客户端 1 的所有语句，返回结果为 2273，不会产生脏读问题。

``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
SELECT points
FROM customers
WHERE customer_id = 1;

SELECT points
FROM customers
WHERE customer_id = 1;
COMMIT;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET points = 20
WHERE customer_id = 1;
COMMIT;
```

当客户端 1 执行到第一个 SELECT 语句之后，第二个 SELECT 语句之前时，再执行客户端 2 的所有语句，第一个 SELECT 语句返回结果为 2273，第二个 SELECT 语句返回结果为 20，产生不可重复读问题。

### REPEATABLE READ
``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT points
FROM customers
WHERE customer_id = 1;

SELECT points
FROM customers
WHERE customer_id = 1;
COMMIT;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET points = 20
WHERE customer_id = 1;
COMMIT;
```

当客户端 1 执行到第一个 SELECT 语句之后，第二个 SELECT 语句之前时，再执行客户端 2 的所有语句，第一个 SELECT 语句返回结果为 2273，第二个 SELECT 语句返回结果为 2273，不会产生不可重复读问题。

``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
START TRANSACTION;
SELECT *
FROM customers
WHERE state = 'VA';
COMMIT;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET state = 'VA'
WHERE customer_id = 1;
COMMIT;
```

当客户端 1 执行 SELECT 语句之后，COMMIT 之前时，再执行客户端 2 的所有语句，客户端 1 只会查询出 1 条记录，这没问题，因为不会产生脏读和不可重复读问题。但是这时数据库实际有两个 state = 'VA' 的记录，但是客户端 1 现在只查询出一条记录，产生幻读问题。

### SERIALIZABLE
``` sql
-- 客户端1
USE sql_store;
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
START TRANSACTION;
SELECT *
FROM customers
WHERE state = 'VA';
COMMIT;

-- 客户端2
USE sql_store;
START TRANSACTION;
UPDATE customers
SET state = 'VA'
WHERE customer_id = 1;
COMMIT;
```

当客户端 1 执行 SELECT 语句之后，COMMIT 之前时，再执行客户端 2 的所有语句，客户端 1 只会查询出 1 条记录，并且客户端 2 处于阻塞状态。只有当客户端 1 COMMIT/ROLLBACK 之后，客户端 2 才能接触阻塞继续完成事务，所以不会产生幻读问题。

### DEADLOCK
数据库死锁问题产生的原因是: 不同事务持有了别的事务需要的锁，两个事务互相等待，从而导致所有事务均无法完成。死锁与隔离级别无关。