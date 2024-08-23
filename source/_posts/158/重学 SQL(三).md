---
title: 重学 SQL(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog158.jpg
date: 2020/08/12
---

前两篇，我们都是在进行查询操作，本篇，我们来详细介绍 SQL 中的插入、更新和删除操作。

## Insert
***  
### 插入单行
INSERT 语句基本语法为: 
``` sql
INSERT INTO [table_name] 
VALUES 
    (column_value, ...);
-- 或者
INSERT INTO [table_name]
    (column_name, ...) 
VALUES 
    (column_value, ...);
```

### 插入多行
``` sql
INSERT INTO [table_name] 
VALUES 
    (column_value, ...), 
    (column_value, ...),
    ...;
-- 或者
INSERT INTO [table_name]
    (column_name, ...) 
VALUES 
    (column_value, ...),
    (column_value, ...),
    ...;
```

### 复制表数据到新表
``` sql
CREATE TABLE orders_archived AS
SELECT * FROM orders;
```

注意: 使用上述方式复制时，无法复制列属性，如主键等信息。

### 使用子查询插入数据
``` sql
INSERT INTO orders_archived
SELECT * FROM
orders
WHERE order_date < '2019-01-01'
```

## Update
***  
### 更新语法
UPDATE 语句基本语法为: 
``` sql
UPDATE [table_name] 
SET column_name = column_value, 
    ...; 
WHERE [condition];
```

通常更新都需要有过滤条件。
``` sql
UPDATE invoice
SET payment_total = invoice_total * 0.5,
    payment_date = due_date
WHERE invoice_id = 1;
```

### 更新语句使用子查询
``` sql
UPDATE invoice
SET payment_total = invoice_total * 0.5,
    payment_date = due_date
WHERE client_id = (
                    SELECT client_id 
                    FROM clients
                    WHERE name = 'Mywork'
                    );
```

## Delete
***  
### 删除语法
DELETE 语句基本语法为: 
``` sql
DELETE FROM [table_name]
WHERE [condition];
```