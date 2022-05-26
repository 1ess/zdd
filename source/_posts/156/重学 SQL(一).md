---
title: 重学 SQL(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog156.jpg
date: 2020/08/04
---

从这篇开始，我们通过几章的内容，重新学习 SQL 从基础到进阶的方方面面，塑造良好的 SQL 编写思维和逻辑能力。

## 概念
***  
数据库是一个可以轻易获取的格式存储数据的集合。这里我们只介绍关系型数据库。为了管理数据库，我们使用数据库管理系统(DBMS)的软件，例如 SQL Server Management Studio 和 Navicat。

我们通过 DBMS 连接数据库，并下达查询或修改指令，DBMS 就会执行下达的指令，并返回结果。

目前流行的关系型数据库有: 
- MySQL
- SQL Server
- Oracle
- PostgreSQL

需要注意: 虽然 SQL 已经被 ANSI 组织定义为标准，不幸地是，各个不同的数据库对标准的 SQL 支持不太一致。并且，大部分数据库都在标准 SQL 上做了扩展。也就是说，如果只使用标准 SQL，理论上所有数据库都可以支持，但如果使用某个特定数据库的扩展 SQL，换一个数据库就不能执行了。例如，Oracle 把自己扩展的 SQL 称为 PL/SQL，Microsoft 把自己扩展的 SQL 称为 T-SQL。

总的来说，SQL 语言定义了这么几种操作数据库的能力: 
1. DDL(Data Definition Language): DDL 允许用户定义数据，也就是创建表、删除表、修改表结构等操作。通常，DDL 由数据库管理员执行
2. DML(Data Manipulation Language): DML 为用户提供添加、删除、更新数据的能力，这些是应用程序对数据库的日常操作
3. DQL(Data Query Language): DQL 允许用户查询数据，这通常也是最频繁的数据库操作

这一系列文章我们使用 MySQL 来学习 SQL。

关于 NoSQL，和关系型数据库有很大的不同，完全是另外一个话题，等以后有机会，我们会详细介绍，但它不是本系列教程的内容。

点击下载创建本课程数据库的[脚本](https://cdn-fawn.vercel.app/contentImg/sql/create-databases.sql)。

## 查询
***  
### SELECT 语句
在执行查询前，我们需要先确定我们将要查询的数据库，使用 USE 关键字: 
``` sql
USE [database_name];
```

注意: SQL 是不区分大小写的语言，但是关键字我们最好使用大写形式，其余使用小写。

SELECT 语句基本语法为: 
``` sql
SELECT [DISTINCT] [column_name, ...] 
FROM [table_name]
WHERE [condition]
ORDER BY [column_name];
-- 或者
SELECT * 
FROM [table_name]
WHERE [condition]
ORDER BY [column_name];
```

其中 FROM 子句、WHERE 子句和 ORDER BY 子句都是可选的，并且顺序不能变。
我们把每个子句分别写在一行在复杂查询中是十分有用的。

### SELECT 子句
我们可以使用 * 返回全部列，或者单独指定希望返回的列名列表。
我们还可以对列进行算数运算，使用 AS 对某列指定别名。
如果需要对某些列去重，我们可以使用 DISTINCT 关键字。
``` sql
-- 返回全部列
SELECT * 
FROM customers;

-- 返回某些列
SELECT first_name, age 
FROM customers;

-- 对列进行算数运算
SELECT first_name, points + 10 
FROM customers;

-- 指定别名
SELECT first_name, points + 10 AS discount_factor 
FROM customers;

-- 结果集去重
SELECT DISTINCT state 
FROM customers;
```

### WHERE 子句
WHERE 子句用于过滤我们的结果集，我们在 WHERE 子句中可以使用比较运算符，不等于使用符号表示为 != 或者 <>。
``` sql
SELECT * 
FROM customers
WHERE state = 'VA';
```

#### AND、OR 和 NOT
我们可以使用 AND、OR 和 NOT 来结合多条搜索条件: 
``` sql
-- AND
SELECT *
FROM customers
WHERE birth_date > '1990-01-01' AND points > 1000;

-- NOT
SELECT * 
FROM customers
WHERE NOT (points > 2000 OR points < 500);
```

#### IN/ NOT IN
我们可以使用 IN 运算符简化多个 OR 条件并列的同一属性值: 
``` sql
-- OR
SELECT * 
FROM customers
WHERE state = 'VA' OR state = 'FL';

-- IN
SELECT * 
FROM customers
WHERE state IN ('VA','FL');
```

如果 IN 运算符结合 NOT 运算符，NOT 应位于 IN 前: 
``` sql
SELECT * 
FROM customers
WHERE state NOT IN ('VA','FL');
```

#### BETWEEN
使用 BETWEEN 可以简化范围过滤: 
``` sql
SELECT * 
FROM customers
WHERE points BETWEEN 1000 AND 3000;
```

注意: BETWEEN 匹配范围中所有的值，包括指定的开始值和结束值。

#### LIKE/ NOT LIKE
在检索字符串相关行时，我们可以使用 LIKE 运算符检索特定模式: 
``` sql
-- 以 b 开头，不区分大小写
SELECT * 
FROM customers
WHERE last_name LIKE 'b%'

-- 以 b 开头 y 结尾，总共 6 字符
SELECT * 
FROM customers
WHERE last_name LIKE 'b____y'
```

注意: % 表示 0 或任意个字符，_ 表示任意单一字符。

#### REGEXP
MySQL 还支持 REGEXP 使用正则表达式来检索字符串: 
``` sql
-- 以 field 结尾字符串
SELECT * 
FROM customers
WHERE last_name REGEXP 'field$'

-- 以 b 开头字符串
SELECT * 
FROM customers
WHERE last_name REGEXP '^B'

-- 包含 bu 或 ar 的字符串
SELECT * 
FROM customers
WHERE last_name REGEXP 'bu|ar'

-- 包含 sb 或 tb 的字符串
SELECT * 
FROM customers
WHERE last_name REGEXP '[st]b'
```

#### IS NULL/ IS NOT NULL
IS NULL 用于缺失属性值的记录搜索: 
``` sql
SELECT * 
FROM customers
WHERE phone IS NULL;
```

### ORDER BY 子句
可以使用 ORDER BY 来调整结果集的排序，默认使用主键进行排序。
``` sql
-- ASC 升序
SELECT * 
FROM customers
ORDER BY first_name;

-- DESC 降序
SELECT * 
FROM customers
ORDER BY first_name DESC;

-- 多列排序
SELECT * 
FROM customers
ORDER BY state DESC, first_name DESC;
```

需要注意: DESC 关键字只应用到直接位于其前面的列名，如果想在多个列上进行降序排序，必须对每一列指定 DESC 关键字。

需要特别注意，在 MySQL 中，我们可以使用未选择列进行排序，而其他关系型数据库则会报错。
``` sql
SELECT first_name, last_name 
FROM customers
ORDER BY birth_date;
```

### LIMIT 子句
我们使用 LIMIT 子句来限制查询返回的记录。
``` sql
SELECT * 
FROM customers
LIMIT 3;

-- offset 跳过前 6 个结果后，返回 3 条数据
SELECT * 
FROM customers
LIMIT 6, 3;
```

需要注意: LIMIT 子句永远放在 SQL 语句的最后。