---
title: Oracle 数据库拾遗(三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog175.jpg
date: 2021/01/17
---

前面的实例介绍了 SELECT 语句的简单应用，即简单查询。在实际应用中，对一个基本表或视图做简单查询是比较少的，大多情况下都要求对数据表进行筛选、分组或排序，这就需要用到高级查询。

### 使用 GROUP BY 子句实现分组
在实际应用中，使用 SELECT 语句查询出来的数据量可能会很多，这时就需要将庞大的数据记录进行分组，便于用户查看。
``` sql
SELECT 
	MAX(SAGE) 最大年龄,
	SDEPT
FROM student
GROUP BY SDEPT;
```

上面是 GROUP BY 的基本使用，我们再来看一下 Oracle PL/SQL 中 GROUP BY 的一些特殊的地方。
Oracle 中 GROUP BY 的基本语法为: 
``` sql
GROUP BY group_by_expression
[Grouping(expression)]
[CUBE|ROLLUP(,...n)]
```

其中: 
- group_by_expression 为指明分组条件。group_by_expression 通常是一个列名，但不能是列的别名。数据类型为 IMAGE 或 BIT 等类型的列不能作为分组条件
- Grouping(expression) 是在应用程序端产生一个依据来判断某行数据是不是按照 ROLLUP 或 CUBE 进行汇总，返回值为 0 或 1
- CUBE 除了返回由 GROUP BY 子句指定的列外，还返回按组统计的行
-  ROLLUP 与 CUBE 不同的是，此选项对 GROUP BY 子句中的列顺序敏感，其只返回第一个分组条件指定的列的统计行。改变列的顺序会使返回的结果的行数发生变化

需要注意: 使用了 GROUP BY 子句的选择列表中只能包含以下项: 
- 常量
- 组合列
- 聚合函数表达式

### 按条件查询并分组
含有 GROUP BY 子句的 SELECT 语句也可以包含 WHERE 子句，并对满足条件的查询进行分组。
``` sql
SELECT 
    MAX(SAGE),
    SDEPT
FROM student
WHERE SGENTLE='男'
GROUP BY SDEPT;
```

### 使用 HAVING 子句过滤分组数据
实际应用中，在使用 GROUP BY 子句为查询记录分组时，经常需要进行过滤，这就需要用户在 SELECT 语句中增加数据过滤准则。而使用 WHERE 子句进行过滤时只能在分组之前实现，我们可以使用 HAVING 子句实现该需求。
``` sql
SELECT 
    MAX(SAGE),
    SDEPT
FROM student
GROUP BY SDEPT
HAVING MAX(SAGE) >= 25;
```

HAVING 和 WHERE 有相同的语法。都可以与 GROUP BY 语句组合使用，HAVING 和 WHERE 的不同之处在于: 
- 在 WHERE 子句中，在分组进行以前，消除不满足条件的行，在 HAVING 子句中，在分组之后条件被应用，即 WHERE 子句作用于表和视图，HAVING 子句作用于分组
- HAVING 子句可在条件中包含聚合函数，但 WHERE 不能

### 对查询进行集合运算
在实际数据库应用中，对数据的操作不可能只针对一个基本表来进行。我们再新引入一个学生成绩表 grade，表结构数据如下: 

|   | SNO    | CNAME      | SCORE |
|---|--------|------------|-------|
| 1 | 120001 | 计算机基础 | 85    |
| 2 | 120003 | 计算机基础 | 96    |
| 3 | 120004 | 计算机基础 | 70    |

在 Oracle PL/SQL 中的集合运算就是将两个或者多个集合组合成为一个结果集，集合运算包括以下 4 种: 
- INTERSECT(交集)，返回两个查询共有的记录
- UNION ALL(并集)，返回各个查询的所有记录，包括重复记录
- UNION(并集)，返回各个查询的所有记录，不包括重复记录
- MINUS(补集)，返回第一个查询检索出的记录减去第二个查询检索出的记录之后剩余的记录

``` sql
SELECT SNO FROM student
MINUS
SELECT SNO FROM grade
```

注意: 当使用集合操作的时候，查询所返回的列名可以不同，但列数以及列的数据类型必须匹配，否则无法进行运算。