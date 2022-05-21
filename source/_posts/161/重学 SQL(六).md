---
title: 重学 SQL(六)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog161.jpg
date: 2020/08/20
---

本篇，我们来介绍一下 MySQL 中的基本内置函数 —— 数值函数、字符串函数和日期函数等。

需要特别注意，与 SQL 聚集函数不一样，SQL 基本内置函数不是可移植的。则意味着不同 DBMS 对同一功能有不同的实现函数，本系列教程，我们只讨论 MySQL 中的实现。

### 数值函数
#### ROUND
ROUND() 函数用于四舍五入数字。
``` sql
SELECT ROUND(5.73);
-- 6

SELECT ROUND(5.73, 1);
-- 5.7
```

注意: 第二个参数用于指定精度。

#### TRUNCATE
TRUNCATE() 函数用于截断数字。
``` sql
SELECT TRUNCATE(5.7354, 2);
-- 5.73
```

#### CEILING
CEILING() 函数会返回大于或等于函数参数的最小整数。
``` sql
SELECT CEILING(5.7);
-- 6
```

#### FLOOR
FLOOR() 函数会返回小于或等于函数参数的最大整数。
``` sql
SELECT FLOOR(5.7);
-- 5
```

#### ABS
ABS() 函数用于取绝对值。
``` sql
SELECT ABS(5.3);
-- 5.3

SELECT ABS(-5.3);
-- 5.3
```

#### RAND
RAND() 用于产生 0 - 1 的随机数。
``` sql
SELECT RAND();
-- 0.0174453...
```

### 字符串函数
#### LENGTH
LENGTH() 函数用于得到字符串中的字符数。
``` sql
SELECT LENGTH('SKY');
-- 3
```

#### UPPER 和 LOWER
UPPER() 函数用于大写字符串。
``` sql
SELECT UPPER('Sky');
-- SKY
```

LOWER() 函数用于小写字符串。
``` sql
SELECT LOWER('Sky');
-- sky
```

#### LTRIM、RTRIM 和 TRIM
LTRIM() 函数用于去除字符串左侧空格，RTRIM() 函数用于去除字符串右侧空格，TRIM() 函数用于去除字符串左右两侧空格。
``` sql
SELECT LTRIM('  Sky');
-- Sky

SELECT RTRIM('Sky  ');
-- Sky

SELECT TRIM('  Sky  ');
-- Sky  
```

#### LEFT 和 RIGHT
LEFT() 函数用于获取前 n 个字符，RIGHT() 函数用于获取后 n 个字符。
``` sql
SELECT LEFT('Kindergarten', 4);
-- Kind

SELECT RIGHT('Kindergarten', 4);
-- rten
```

#### SUBSTRING
SUBSTRING() 函数用于截取任意位置字符串。
``` sql
SELECT SUBSTRING('Kindergarten', 4, 2);
-- de
```

注意: 如果不指定第三个参数，则截取到最后。

#### LOCATE
LOCATE() 函数用于返回第一个字符串匹配的位置。
``` sql
SELECT LOCATE('n', 'Kindergarten');
-- 3

SELECT LOCATE('q', 'Kindergarten');
-- 0
```

注意: LOCATE() 函数不区分大小写。

#### REPLACE
REPLACE() 用于替换字符串。
``` sql
SELECT REPLACE('Kindergarten', 'garten', 'garden');
-- Kindergarden
```

#### CONCAT
CONCAT() 函数用于连接两个字符串。
``` sql
SELECT CONCAT(first_name, ' ', last_name)
FROM customers;
```

### 日期函数
#### NOW、CURDATE 和 CURTIME
NOW() 用于获取当前日期时间，CURDATE() 函数只返回日期，CURTIME() 函数只返回时间。
``` sql
SELECT NOW(), CURDATE(), CURTIME();
-- 2020-01-02 14:54:20  2020-01-02  14:54:20 
```

#### YEAR、MONTH 和 DAY
YEAR()、MONTH() 和 DAY() 函数用于获取日期的年、月和日部分。
``` sql
SELECT YEAR(NOW()), MONTH(NOW()), DAY(NOW());
-- 2020  01  02
```

#### HOUR、MINUTE 和 SECOND
HOUR()、MINUTE() 和 SECOND() 函数用于获取时间的时、分和秒部分。
``` sql
SELECT HOUR(NOW()), MINUTE(NOW()), SECOND(NOW());
-- 14  54  20
```

#### 格式化日期和时间
``` sql
SELECT DATE_FORMAT(NOW(), '%y');
-- 20

SELECT DATE_FORMAT(NOW(), '%Y');
-- 2020

SELECT DATE_FORMAT(NOW(), '%m %Y');
-- 01 2020

SELECT DATE_FORMAT(NOW(), '%M %Y');
-- January 2020
```

我们只列出几个格式化字符串，更多的日期时间格式化字符串，我们可以参考[官方文档](https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format)。

### 计算日期和时间
#### DATE_ADD 和 DATE_SUB
``` sql
SELECT DATE_ADD(NOW(), INTERVAL 1 DAY);
-- 2020-01-03 14:54:20

SELECT DATE_ADD(NOW(), INTERVAL -1 YEAR);
-- 2019-01-02 14:54:20
```

与 DATE_ADD 类似，我们可以使用 DATE_SUB 进行日期时间计算。

#### DATEDIFF
DATEDIFF() 函数用于计算日期间隔。
``` sql
SELECT DATEDIFF('2020-01-01 08:00', '2020-01-05 18:00');
-- -4
```

注意: DATEDIFF() 函数只返回天数间隔，而不考虑时间间隔。

### IFNULL
IFNULL() 函数可以对为空值的记录返回自定义值，例如: 
``` sql
SELECT 
    order_id,
    IFNULL(shipper_id, 'Not Assigned') AS shipper
FROM orders;
```

### IF
IF() 函数可以根据条件返回不同结果，例如: 
``` sql
SELECT
    order_id,
    order_date,
    IF(
        YEAR(order_date) = YEAR(NOW()),
        'Active',
        'Archive'
    ) AS status
FROM orders;

-- 更复杂的例子
SELECT 
	product_id,
	p.`name`,
	COUNT(*) AS orders,
	IF(COUNT(*) > 1,'Many times','Once') AS frequency
FROM `order_items` oi
JOIN products p
	USING(product_id)
GROUP BY product_id
```

### CASE 运算符
我们上面使用了 IF 来根据条件返回不同结果，如果有多个可能性该怎么办呢？我们可以使用 CASE 运算符: 
``` sql
SELECT 
    order_id,
    CASE
        WHEN YEAR(order_date) = YEAR(NOW()) THEN 'Active'
        WHEN YEAR(order_date) = YEAR(NOW()) - 1 THEN 'Last Year'
        WHEN YEAR(order_date) < YEAR(NOW()) - 1 THEN 'Archive'
        ELSE 'Future'
    END AS category
FROM orders;
```

CASE 运算符常用于行转列，例如原表为: 

| student_name | course | score |
|--------------|--------|-------|
| 张三         | 数学   | 71    |
| 张三         | 语文   | 93    |
| 李四         | 数学   | 82    |
| 李四         | 语文   | 96    |
| 王五         | 数学   | 87    |
| 王五         | 语文   | 84    |
| 王五         | 英语   | 90    |

希望转为下列形式: 

| student_name | math | chinese | english |
|--------------|------|---------|---------|
| 张三         | 71   | 93      | 0       |
| 李四         | 82   | 96      | 0       |
| 王五         | 87   | 84      | 90      |

``` sql
SELECT 
    student_name,
    MAX(CASE course WHEN '数学' THEN score ELSE 0 END) AS math,
    MAX(CASE course WHEN '语文' THEN score ELSE 0 END) AS chinese,
    MAX(CASE course WHEN '英语' THEN score ELSE 0 END) AS english
FROM report_card
GROUP BY student_name;
```