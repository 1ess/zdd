---
title: MySQL(五)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog96.jpg
date: 2019/03/27
---

本篇，我们说说 MySQL 中的联合查询、连接查询以及子查询。

## 联合查询
***  
基本概念: 可合并多个相似的选择查询结果的结果集，等同于将一个表追加到另一个表，从而实现将两个表的查询结果组合到一起，使用 Union 或 Union all。
注意: 这个合并是纵向合并，字段数不变，多个查询的结果合并。

### 应用场景
1. 同一张表的不同结果，合并到一起展示
2. 在大数据量情况，会分表操作，会使用联合查询将数据存放到一起显示

### 基本语法
select 语句 union [all/distinct(默认)] select 语句;
``` sql
(select * from my_stud where gender = '男' order by height asc)
union 
(select * from my_stud where gender = '女' order by height desc);
```

注意: 如果联合查询中使用 order by，必须把该 select 语句使用括号包裹。并且 MySQL 8.0 之前，为了使 order by 生效，还必须使用 limit {大数量}

## 连接查询
***  
基本概念: 将多张表连接到一起进行查询，会导致记录的行数和字段列数发生改变。

连接查询分类: 
1. 交叉连接
2. 内连接
3. 外连接
 - 左连接
 - 右连接
4. 自然连接

### 交叉连接(Cross Join)
之前咱们说过多表查询时，就说过交叉查询的概念，只是语法不同。
基本语法: {表1} cross join {表2};
``` sql
select * from my_stud cross join my_operator;
```

### 内连接(Inner Join)
从一张表中取出所有的记录，去另一张表中匹配，利用匹配条件进行匹配，成功保留，失败舍去。
基本语法: {表1} [inner] join {表2} on {匹配条件};
注意: 如果内连接没有条件，则与交叉连接返回结果一样。
``` sql
select * from my_stud inner join my_class on my_stud.class_id = my_class.id;
```

由于表名可能很长，我们通常也使用表别名简化操作。
``` sql
select * from my_stud as a inner join my_class as b on a.class_id = b.id;
```

注意: 内连接只有匹配到的记录才会保留。

### 外连接(Outer Join)
一张表作为主表(表中记录都会保留)，根据条件去匹配另一张从表中的记录，从而得到目标数据。
外连接分为: 
- 左外连接(left join)，左表作为主表
- 右外连接(right join)，右表作为主表

左连接基本语法: {主表} left join {从表} on {匹配条件};
右连接基本语法: {从表} right join {主表} on {匹配条件};
``` sql
select * from my_stud as s left join my_class as c on s.class_id = c.id; 
```

注意: 如果从表数据都不匹配，则返回结果该条记录从表字段值都为 null。

### Using 关键字
是在连接查询中替代 on 关键字的。
使用前提是两张表连接的字段是同名的，并且最终在结果只保留一个字段。

基本语法: {表1} [inner/left/right join] {表2} using({同名字段列表});
``` sql
select * from my_stud left join my_class using(class_id);
```

## 子查询
***  
当一个查询是另一个查询的条件时，称之为子查询(Sub Query)。

### 分类
按功能来分: 
- 标量子查询: 子查询返回结果是一个数据
- 列子查询: 返回结果是一列
- 行子查询: 返回结果时一行
- 表子查询: 返回结果是多行多列
- Exists 子查询: 返回结果是 1 或 0

按位置来分: 
- Where 子查询: 子查询语句出现在 Where 子句中
- From 子查询: 子查询语句出现在 From 子句中，作为数据源

### 标量子查询
标量子查询 where 子句常使用 = 或 &lt;&gt; 操作符。
``` sql
select * from my_class as c where c.id = (select class_id from my_stud as s where s.name = 'zhangsan');
```

### 列子查询
列子查询 where 子句常使用 in 操作符。
``` sql
select * from my_class as c where c.id in (select class_id from my_stud);
```

### 行子查询
行子查询 where 子句 = 左值要是一个构造的行元素。
``` sql
select * from my_class where (age, height) = (select max(age), max(height) from my_stud);
```

### 表子查询
表子查询用于 from 数据源，之前在动态查询时已经说过。
``` sql
select * from (select * from my_stud order by height desc) as order_stud group by class_id;
```

### Exists 子查询
``` sql
select * from my_class as c where exists(select * from my_stud as s where s.class_id = c.id);
```