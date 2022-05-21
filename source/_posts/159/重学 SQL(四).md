---
title: 重学 SQL(四)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog159.jpg
date: 2020/08/13
---

本篇，我们来介绍一下 SQL 中常用的聚合函数(Aggregate Functions)和 GROUP BY 子句的使用。

### Aggregate Functions
聚合函数作用时为数据汇总编写查询。常用的聚合函数有: 
- MAX()
- MIN()
- AVG()
- SUM()
- COUNT()

所有的函数都要使用括号来调用执行。并且与之后要介绍的数据处理函数不同，SQL 的聚集函数在各种主要 SQL 实现中得到了相当一致的支持。
``` sql
SELECT 
    MAX(invoice_total) AS highest,
    MIN(invoice_total) AS lowest,
    AVG(invoice_total) AS average,
    SUM(invoice_total) AS total,
    COUNT(invoice_total) AS number_of_invoices,
    COUNT(payment_date) AS number_of_payment,
    COUNT(*) AS total_records,
    COUNT(DISTINCT client_id)
FROM invoices;
```

注意: 除 COUNT() 聚合函数外，其余聚集函数只运行非空值，如果列中有空值，不会被聚合函数计算。COUNT() 函数比较特殊，如果指定列名，则 COUNT() 函数会忽略指定列的值为空的行，但如果 COUNT() 函数中用的是通配符，则不忽略。

### GROUP BY 子句
GROUP BY 子句作用是用于数据分组，语法为: 
``` sql
SELECT 
    client_id,
    SUM(invoice_total) AS total
FROM invoices
WHERE payment_date <= '2019-06-30'
GROUP BY client_id
ORDER BY total DESC;
```

使用 GROUP BY 子句有几个规定: 
1. GROUP BY 子句可以包含任意数目的列，因而可以对分组进行嵌套，更细致地进行数据分组
2. 如果在 GROUP BY 子句中嵌套了分组，数据将在最后指定的分组上进行汇总
3. GROUP BY 子句中列出的每一列都必须是检索列或有效的表达式(但不能是聚集函数)。如果在 SELECT 中使用表达式，则必须在 GROUP BY 子句中指定相同的表达式，不能使用别名
4. 除聚集计算语句外，SELECT 语句中的每一列都必须在 GROUP BY 子句中给出
5. 如果分组列中包含具有 NULL 值的行，则 NULL 将作为一个分组返回。如果列中有多行 NULL 值，它们将分为一组
6. GROUP BY 子句的位置必须在 WHERE 子句之后，ORDER BY 子句之前

``` sql
SELECT 
	date,
	pm.`name` AS payment_method,
	SUM(amount) AS total_payment
FROM `payments` p
JOIN payment_methods pm
ON p.payment_method = pm.payment_method_id
GROUP BY date, payment_method
ORDER BY date;
```

### HAVING 子句
``` sql
SELECT 
	date,
	pm.`name` AS payment_method,
	SUM(amount) AS total_payment
FROM `payments` p
JOIN payment_methods pm
ON p.payment_method = pm.payment_method_id
GROUP BY date, payment_method
HAVING total_payment > 10
ORDER BY date;
```

注意: WHERE 子句用于分组前筛选，HAVING 子句允许我们对分组之后的数据进行筛选，并且 HAVING 子句所使用的列必须是 SELECT 子句选择的列，或者聚合函数列，WHERE 子句中不能使用聚合函数。