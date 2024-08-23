---
title: Oracle 数据库拾遗(四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog176.jpg
date: 2021/01/21
---

前面介绍的 SELECT 查询语句都是只有一个 SELECT-FROM-WHERE 形式的语句块，本篇再来看看子查询。

### 返回单行的子查询
我们仍使用之前的学生表作为示例，希望查询年龄与林玲年龄相同的学生的信息: 
``` sql
SELECT
    *
FROM student
WHERE SAGE=(
    SELECT 
        SAGE
    FROM student
    WHERE SNAME='林玲'
);
```

本实例使用了比较运算符 = 连接子查询和父查询，当我们确定结果只有一条数据时才可以。如果在 student 表中不只一个姓名为"林玲"的学生，那么上述 SQL 语句执行时将出现错误。

对于含有子查询的 SQL 语句来说，SQL 对其执行以下 3 个步骤: 
1. 执行子查询，获取指定字段的返回结果
2. 将子查询的结果代入外部查询中
3. 根据外部查询的条件，输出 SELECT 子句中指定的列值记录

因此，查询是从最里层的子查询开始，一层一层向外执行，外层的查询可以访问内层查询的结果。

### 含有聚合函数的单行子查询
前面提到过聚合函数是不能使用在 WHERE 子句中的，那么这势必会影响到某些功能的实现。例如要找出 student 表中所有学生中年龄最大的学生的所有基本信息，我们就可以使用含有聚合函数的单行子查询来实现。
``` sql
SELECT
    *
FROM student
WHERE SAGE=(
    SELECT MAX(SAGE)
    FROM student
);
```

### 用 IN 谓词实现多行子查询
前面实例介绍的单行子查询，而在具体应用中，子查询往往需要返回多个值，甚至是一个集合或一个表，那么就需要能处理多行的方法。
例如希望从表 student 中找出与学生姓名为"陈诚"在同一个班的所有学生基本信息: 
``` sql
SELECT
    *
FROM student
WHERE SDEPT IN (
    SELECT SDEPT
    FROM student
    WHERE SNAME='陈诚'
);
```

本实例中，简单地用IN谓词代替了 = 比较运算符。事实上，此处返回的结果仍然只有单行。

### FROM 子句后的子查询
前面的实例中，子查询都是出现在 WHERE 子句后，作为条件来过滤不需要的记录行。事实上，子查询也可以出现在 FROM 子句中。FROM 子句后的子查询以一个记录集的方式提供给父查询作为查询目标表。
``` sql
SELECT
    *
FROM (
    SELECT 
        SNO,
        SNAME,
        SAGE,
        SDEPT
    FROM student
)
WHERE SAGE > 20;
```

需要注意: 在 FROM 子句中以子查询代替表作为查询对象时，如果其后还包含 WHERE 子句，那么 WHERE 子句中的组成条件一定要是子查询能够返回的列值，否则语句执行将出现错误。

### SELECT 子句后的子查询
事实上，当子查询返回结果只有一行记录时，其还可以出现在 SELECT 子句后作为需返回的列名。
``` sql
SELECT
	SNAME,
    (
        SELECT SDEPT FROM student WHERE SNO='120001'
    ) AS 所在班级
FROM student;
```

注意: 在 SELECT 子句中以子查询作为返回列名时，子查询中一定要保证返回值只有一个，否则语句执行将出现错误。

### HAVING 子句后的子查询
前面实例提到 HAVING 子句也能实现条件过滤，其功能与 WHERE 子句类似，因此，HAVING 子句后也可以使用子查询实现条件过滤。
``` sql
SELECT
    SDEPT,
    COUNT(SNO)
FROM student
GROUP BY SDEPT
HAVING SDEPT IN (
    SELECT SDEPT
    FROM student
    WHERE SAGE > 22
);
```