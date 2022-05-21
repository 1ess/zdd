---
title: 重学 SQL(五)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog160.jpg
date: 2020/08/16
---

前几篇，我们介绍了 SQL 的基本操作，这一篇，我们来介绍 SQL 中的如何进行复杂查询，帮助提升编写复杂查询的能力。

## Subqueries
***  
### WHERE 子句中的子查询
子查询最常见的情况是位于 WHERE 子句中，可以位于关系运算符之后，也可以位于 IN/NOT IN/EXISTS 运算符之后。
``` sql
SELECT * 
FROM products
WHERE product_id NOT IN (
	SELECT DISTINCT product_id
	FROM order_items
);

-- 或者
SELECT * 
FROM employees
WHERE salary > (
	SELECT AVG(salary)
	FROM employees
);
```

注意: 作为子查询的 SELECT 语句只能查询单个列，企图检索多个列将返回错误。

### Subqueries VS Joins
子查询和连接通常可以互相转化，例如: 
``` sql
SELECT * 
FROM clients
WHERE client_id NOT IN (
	SELECT DISTINCT client_id
	FROM invoices
);

-- 可以改写为
SELECT * 
FROM clients c
LEFT JOIN invoices i
    USING (client_id)
WHERE i .client_id IS NULL
```

### ALL Keyword
我们可以使用 ALL 关键字使得比较运算符可以比较一组结果，例如: 
``` sql
SELECT *
FROM invoices
WHERE invoice_total > (
    SELECT MAX(invoice_total)
    FROM invoices
    WHERE client_id = 3
);

-- 可以改写成
SELECT *
FROM invoices
WHERE invoice_total > ALL (
    SELECT invoice_total
    FROM invoices
    WHERE client_id = 3
);
```

注意: 每当我们使用 ALL 关键字，我们都可以使用聚合函数 MAX() 改写。

### ANY Keyword
上面的 ALL 关键字表示所有结果均需满足条件，而 ANY 关键字表示任意结果满足条件即可。
注意: = ANY 和 IN 作用一致。
``` sql
SELECT *
FROM clients
WHERE client_id IN (
    SELECT client_id
    FROM invoices
    GROUP BY client_id
    HAVING COUNT(*) >= 2
)

-- 可以改写成
SELECT *
FROM clients
WHERE client_id = ANY (
    SELECT client_id
    FROM invoices
    GROUP BY client_id
    HAVING COUNT(*) >= 2
)
```

### 相关子查询
有时，主查询和子查询存在相关性，我们将其称为相关子查询，例如: 
``` sql
SELECT *
FROM employees e
WHERE salary > (
	SELECT AVG(salary)
	FROM employees
	WHERE office_id = e.office_id
)
```

### EXISTS 运算符
之前我们使用过两种方法查询存在发票的客户，一个是子查询，一个是左连接，现在我们看看第三种方法。
``` sql
SELECT *
FROM clients c
WHERE EXISTS (
    SELECT client_id
    FROM invoices
    WHERE client_id = c.client_id
)
```

## SELECT 子句中的子查询
*** 
``` sql
SELECT 
	invoice_id,
	invoice_total,
	(SELECT AVG(invoice_total) FROM invoices) AS invoice_average,
	invoice_total - (SELECT invoice_average) AS difference
FROM invoices
```

如果在同一 SELECT 语句中使用新产生的列，必须再次使用 SELECT。
``` sql
SELECT 
	client_id,
	name,
	(SELECT SUM(invoice_total) FROM invoices WHERE client_id = c.client_id) AS total_sales,
	(SELECT AVG(invoice_total) FROM invoices) AS average,
	(SELECT total_sales - average) AS difference
FROM clients c
```

## FROM 子句中的子查询
***  
我们也可以把查询出来的表当作真是存在的表一样来处理: 
``` sql
SELECT * 
FROM (
    SELECT 
        client_id,
        name,
        (SELECT SUM(invoice_total) FROM invoices WHERE client_id = c.client_id) AS total_sales,
        (SELECT AVG(invoice_total) FROM invoices) AS average,
        (SELECT total_sales - average) AS difference
    FROM clients c
) AS sales_summary;
```

注意: FROM 子句使用子查询，必须给子查询结果起一个别名，不论是否使用该名称，否则会报错 Every derived table must have its own alias。
通常我们不会在 FROM 子句使用子查询，这会使我们的主查询变得复杂，通常会使用这段子查询作为视图存储在数据库中，有关视图的知识我们会在之后讲到。