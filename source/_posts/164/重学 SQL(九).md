---
title: 重学 SQL(九)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog164.jpg
date: 2020/08/24
---

本篇，我们介绍一个对于大型或高并发数据库影响非常有大的知识 —— 索引。了解它是如何工作的以及它为何能提升性能。
点击下载创建本章所用数据库[脚本](https://cdn.zhangdd.tech/contentImg/sql/index-simple.zip)。

## Index
***  
索引实际上是数据库用于快速检索数据的数据结构。如果没有索引，数据库会扫描每条记录。通过索引可以快速找到对应记录，这比遍历整个表的数据要高效得多。

索引的缺点: 
1. 增加数据库大小，因为索引要和表一起保存
2. 增删改数据时，MySQL 会自动更新索引，影响当前操作效率，所以我们只给特别重要的查询增加索引

注意: 我们不要根据表来创建索引，而是根据查询内容来创建。给设计好的表增加索引就像解决了不存在的问题一样，所以不要盲目地给某一列添加索引。

在具体实现上，索引通常以二叉树的方式保存的。

### 创建索引
我们先来观察一个简单的搜索。
``` sql
EXPLAIN SELECT customer_id
FROM customers
WHERE state = 'CA';
```

| type | rows |
|------|------|
| ALL  | 1010 |

如果显示 type 字段为 ALL，则说明本次查询为全表扫描，rows 为扫描的记录数。
然后我们对 state 列创建索引: 
``` sql
CREATE INDEX idx_state ON customers (state);
```

创建好索引之后，我们再次执行简单查询，观察一下有什么不同: 
``` sql
EXPLAIN SELECT customer_id
FROM customers
WHERE state = 'CA';
```

| type | key       | rows |
|------|-----------|------|
| ref  | idx_state | 112  |

### 查看索引
``` sql
SHOW INDEXES IN customers;
```

| Key_name  | Column_name | Index_type |
|-----------|-------------|------------|
| PRIMARY   | customer_id | BTREE      |
| idx_state | state       | BTREE      |

主键索引又称为聚合索引(Clustered Index)，只要我们给表添加了主键，MySQL 就会自动为其创建索引，每个表最多只能有一个聚合索引。其余索引又称为从属索引(Secondary Index)。

``` sql
SHOW INDEXES IN orders;
```

| Key_name                     | Column_name | Index_type |
|------------------------------|-------------|------------|
| PRIMARY                      | customer_id | BTREE      |
| fk_orders_customers_idx      | customer_id | BTREE      |
| fk_orders_shippers_idx       | shipper_id  | BTREE      |
| fk_orders_order_statuses_idx | status      | BTREE      |

MySQL 也会自动为外键创建索引，这样我们就可以快速连接表了。

### 前缀索引
如果要创建的索引是字符串类型，索引会占用大量磁盘空间，我们知道小索引更好，他们可以载入内存。所以我们不用将这列的所有字符都放入索引中，只需要索引前几个字符。
``` sql
CREATE INDEX idx_lastname ON customers (last_name(20));
```

#### 如何找到最佳索引字符数
``` sql
-- 首先确定总记录数
SELECT COUNT(*) FROM customers;
-- 1010

-- 确定采用多大字符数作为索引
SELECT
    COUNT(DISTINCT LEFT(last_name, 1)),
    COUNT(DISTINCT LEFT(last_name, 5)),
    COUNT(DISTINCT LEFT(last_name, 10))
FROM customers;
-- 25 966 996
```

我们观察发现，采用 5 个字符长度就可以区分绝大多数姓氏了。

### 全文索引
在 MySQL 以及其他数据库中，都有一个叫做全文索引的索引类型。用这种索引来完成复杂和有弹性的文字检索。
这种索引和传统索引有很大不同，他们包含这个字符串，他会去掉所有副词，如: in、on、the 等等。
``` sql
SELECT *
FROM posts
WHERE 
    title LIKE '%react redux%' OR
    body LIKE '%react redux%';
```

如果没有索引，随着文章的增多，查询会越来越慢。这种需求下，我们就可以使用全文索引。
``` sql
CREATE FULLTEXT INDEX idx_title_body ON posts (title, body);
```

接下来，我们使用与全文索引的匹配: 
``` sql
SELECT 
    *,
    MATCH(title, body) AGAINST('react redux')
FROM posts
WHERE 
    MATCH(title, body) AGAINST('react redux');
```

这样以任意次序，任意词分隔的数据都可以被检索出来。
全文索引还有一个好处是可以计算出相关度。相关值是一个 0 - 1 之间的浮点数。
全文索引默认是自然语言模式，还可以设置为布尔模式: 
``` sql
SELECT *
FROM posts
WHERE 
    MATCH(title, body) AGAINST('react -redux +form' IN BOOLEAN MODE);
```

减号表示禁止包含该词语，加号表示必须包含该词语。