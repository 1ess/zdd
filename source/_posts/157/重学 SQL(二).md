---
title: 重学 SQL(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog157.jpg
date: 2020/08/08
---

上一篇，我们只介绍了一个表中数据的查询操作，本篇，我们将详细介绍如何进行多表查询以及多表查询的类型。

### Inner Join
目前为止，我们只是从单一 Table 中选取列，但在实际生产环境中，通常需要从多张 Table 中选取。
``` sql
SELECT order_id, first_name, last_name
FROM orders o
INNER JOIN customers c 
    ON o.customer_id = c.customer_id
```

注意: 内连接时，INNER 可不写。

如果连接的表中存在同名字段，我们就必须在 SELECT 子句中的该字段前指明表名前缀，否则会报错 'customer_id' in field list is ambiguous: 
``` sql
SELECT order_id, o.customer_id, first_name, last_name
FROM orders o
INNER JOIN customers c 
    ON o.customer_id = c.customer_id
```

注意: 如果跨数据库进行连接，则需要在表名前指定数据库前缀。

### Self Join
我们也可以将一张表与其自身进行连接: 
``` sql
SELECT 
	e.employee_id,
	e.first_name,
	m.first_name AS manager_name
FROM employees e
JOIN employees m
	ON e.reports_to = m.employee_id
```

### Join Multiple Tables
``` sql
SELECT  
    order_id, 
    order_date, 
    first_name, 
    last_name, 
    `name` AS status
FROM orders o
JOIN customers c
    ON o.customer_id = c.customer_id
JOIN order_statuses os
    ON os.order_status_id = o.`status`
```

### Compound Join Conditions
我们在实际生产环境也常常遇见复合主键，复合主键的连接语句如下: 
``` sql
SELECT * 
FROM order_items oi
JOIN order_item_notes oin
	ON oi.order_id = oin.order_id 
	AND oi.product_id = oin.product_id 
```

### Outer Join
之前我们说了 INNER JOIN，现在我们来看看 OUTER JOIN 解决了什么问题。
SQL 有两种类型的外连接: 
1. LEFT OUTER JOIN
2. RIGHT OUTER JOIN

当使用左连接时，所有左表记录都会返回，不论条件是否正确。
``` sql
SELECT 
	c.customer_id,
	c.first_name,
	o.order_id
FROM customers c
LEFT OUTER JOIN orders o
	ON o.customer_id = c.customer_id 
```

注意: 外连接的 OUTER 关键字可有可无，与 INNER 类似。

### Self Outer Join
``` sql
SELECT 
	e.employee_id,
	e.first_name,
	m.first_name AS manager_name
FROM employees e
LEFT JOIN employees m
	ON e.reports_to = m.employee_id
```

### Using 子句
如果连接的表的条件字段名称一致，在 MySQL 中我们可以使用 USING 子句。
``` sql
SELECT 
    o.order_id,
    c.first_name
FROM orders o
JOIN customers c
--    ON o.customer_id = c.customer_id
    USING (customer_id)
```

### Natural Join
在 MySQL 中，有一种更简便的方法来连接两个表，就是自然连接。自然连接会自动按照相同列名进行连接: 
``` sql
SELECT 
    o.order_id,
    c.first_name
FROM orders o
NATURAL JOIN customers c
```

自然连接很简便，但是因为是让数据库引擎自己猜测如何连接，所以无法控制，可能会生成意外结果，不建议使用。

### Cross Join
我们使用交叉连接来连接第一个表的每条记录和第二个表的每条记录。
``` sql
SELECT 
    c.first_name AS customer,
    p.name AS product  
FROM customers c
CROSS JOIN products p
```

### Unions
通过 UNION 运算符，我们可以合并多段查询记录，可以是一张表，也可以是不同表: 
``` sql
SELECT 
 order_id,
 order_date,
 "Active" AS status
FROM orders
WHERE order_date >= '2019-01-01'

UNION

SELECT 
 order_id,
 order_date,
 "Archive" AS status
FROM orders
WHERE order_date < '2019-01-01'
```

注意: 列名是基于第一段查询。

### 可视化 SQL JOIN
![](https://cdn.0xfee1dead.cn/contentImg/sql/Visual_SQL_JOINS_orig.jpg)