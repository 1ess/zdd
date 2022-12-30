---
title: MySQL(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog95.jpg
date: 2019/01/11
---

本篇，我们说说 MySQL 对于数据的增删改查操作以及运算符。

## 新增数据
***  
### 多数据插入
基本语法: insert into {表名}({字段列表}) values({值列表1}), ({值列表2}), ...
``` sql
insert into my_advance_insert(name, age) values('zhangsan', 15), ('Lisi', 20);
```

### 主键冲突
在有的表中，使用的是业务主键，但是往往在进行数据插入时，又不确定数据表中是否存在对应的主键。
``` sql
create table my_stud (
    stud_id varchar(10) primary key comment '主键，学生ID',
    name not null
) charset utf8;

insert into my_stud values('stu0001', 'a'), ('stu0002', 'b'), ('stu0003', 'c');

-- 主键冲突
insert into my_stud values('stu0003', 'd');
```

解决方案: 
1. 主键冲突更新，类似插入语法，如果插入过程主键冲突，采用更新方法。基本语法: insert into {表名}({字段列表}) values({值列表1}) on duplicate key update {字段}={新值};

``` sql
-- 主键冲突更新
insert into my_stud values('stu0003', 'd') on duplicate key update name='d';
```
2. 主键冲突替换，先删除，再重新插入。基本语法: replace into {表名}({字段列表}) values({值列表1});

``` sql
replace into my_stud values('stu0001', 'e');
```

### 蠕虫复制
基本语法: insert into {表名}({字段列表}) select * from {其他表名或本身表};
``` sql
create table my_stud2 (
    stud_id varchar(10) primary key comment '主键，学生ID',
    name not null
) charset utf8;

-- 复制到本身
insert into my_stud select * from my_stud;

-- 复制到新表
insert into my_stud2 select * from my_stud;
```

注意: 
1. 蠕虫复制可以在短期快速增加数据量，从而测试表压力，测试索引效率
2. 注意主键冲突

## 更新数据
***  
在更新数据时，要特别注意，通常一定要跟随条件进行更新。而且还可以使用 limit 来限制更新数量。
基本语法: update {表名} set {字段名}={字段值} [where 条件] [limit {数量}];
``` sql
update my_stud set name='x' where name='c' limit 4;
```

## 删除数据
***  
删除数据时，也要特别注意，通常一定要跟随条件进行删除。而且也可以使用 limit 来限制删除数量。
基本语法: delete from {表名} [where 条件] [limit {数量}];
``` sql
update my_stud set name='x' where name='c' limit 4;
```

要注意: delete 删除数据时，无法重置 auto_increment。要解决这个问题，我们可以使用: truncate {表名};
``` sql
truncate my_stud; -- 相当于先 drop，再 create
```

## 查询数据
***  
完整的查询指令: select [select 选项] {字段列表/*} from {数据源} [where 条件] [group by 分组] [having 条件] [order by 排序] [limit 数量];

### Select 选项
select 选项用来确定如何对待查询返回的结果。
可取值为: 
1. all，默认的，保存所有返回结果

``` sql
select * from my_stud;
```
2. distinct，去重，只保留不重复的结果(所有字段值都相同才算重复)

``` sql
select distinct * from my_stud;
```

### 字段列表
字段我们可以取别名。
基本语法: {字段名} [as] {别名}
``` sql
select name as name1, name as name2 from my_stud;
```

### From 数据源
数据源只要是复合二位表结构的数据即可。

#### 单表
单表数据源就是表名。
``` sql
select * from my_stud;
```

#### 多表
基本语法: from {表名1}, {表名2}, ...
结果为: 两表记录相乘，字段数拼接。
从前一张表的每条记录，去拼凑第二张表的所有记录。这种操作在数学上定义就是笛卡尔积，在实际中要避免笛卡尔积。
``` sql
select * from my_int, my_set;
```

#### 动态
数据源不是一个实体表，而是从表中查询出来的二维结果表，也称为子查询。
基本语法: from (select [select 选项] {字段列表/*} from {数据源}) as {别名};
注意: 子查询必须使用括号和别名。
``` sql
select * from (select int_1, int_3 from my_int) as int_alias;
```

### Where 子句
用来从数据表获取数据时，进行条件筛选。

### Group By 子句
根据指定字段，将数据进行分组。分组的目的就是用于统计。
基本语法: group by {字段名}
注意: MySQL 5.7 之后，默认开启 ONLY_FULL_GROUP_BY 选项提供对 group by 合法性的检查。一条 select 语句，MySQL 允许 target list 中输出的表达式是除聚集函数或 group by column 以外的表达式。否则就是非法的。
``` sql
select * from my_stud group by class_id;
```

注意: group by 分组之后，只会取出每组的第一条记录。

有一些聚合函数可以使用: 
- Count(): 统计每组数量，如果统计目标是字段，那么不会统计为 null 字段。如果是 *，则统计记录。
- Avg(): 取平均值
- Sum(): 求和
- Max(): 求最大值
- Min(): 求最小值
- Group_concat(): 分组之后拼接字段

``` sql
select class_id, count(*), max(age), min(height), avg(age) from my_stu group by class_id;
```

#### 多分组
按某个字段分组之后，对已分组数据再进行分组。

基本语法: group by {字段1}, {字段2}, ...

先使用字段1 进行分组，分组之后再使用字段2 进行分组。
``` sql
select id, gender, group_concat(name) from my_stud group by class_id, gender;
```

#### 分组排序
按分组字段排序，注意: MySQL 8.0 不再进行隐式排序。必须使用 Order by 进行排序。
基本语法: 
- Mysql 8.0之前: group by {字段1} [asc/desc], {字段2} [asc/desc];
- Mysql 8.0之后: group by {字段1}, {字段2}, ... order by {字段a} [asc/desc], {字段b} [asc/desc], ... ;

``` sql
-- 8.0 之前
select id, gender, group_concat(name) from my_stud group by class_id, gender desc;

-- 8.0 之后
select id, gender, group_concat(name) from my_stud group by class_id, gender order by class_id asc, gender desc;
```

### Having 子句
having 与 where 类似，都是进行条件筛选，但是也有不同点，having 用于 group by 子句之后，用于分组数据进行筛选。
``` sql
select class_id, count(*) as number from my_stud group by class_id having number >= 4;
```

### Order By 子句
根据字段对数据进行排序。
基本语法: order by {字段1} [asc/desc], {字段2} [asc/desc], ...
``` sql
select * from my_stud order by height desc;
```

### Limit 子句
用来限制记录数量。

#### 记录数量限制
基本语法: limit {数量};
``` sql
select * from my_stud order by height limit 1;
```

#### 分页
利用 limit 限制获取指定区间的数量。
基本语法: limit {offset, length};
``` sql
select * from my_stud order by height desc limit 0, 2;
```

注意: limit 表示最多获取数量，如果不够，就只显示真实数量。

## 运算符
***  
### 算术运算符
算数运算符包括: +, -, *, /, %
算数运算符通常用于运算结果(select 字段中)。
``` sql
select int_1 + int_2 from my_operator;
```

需要注意: 
- 在 MySQL 中，除法运算结果是浮点数表示
- 除法中如果除数如果为 0，结果为 null
- null 进行算术运算，结果都为 null

### 关系运算符
关系运算符包括: &gt;, &gt;=, &lt;, &lt;=, =, &lt;&gt;
常用于在条件中进行结果限定。
``` sql
select * from my_stud where age >= 20 order by height;
```

注意: 
- MySQL 中数据会自动转换成相同类型，在进行比较
- MySQL 中没有布尔类型，0 表示 false，1 表示 true

在关系运算符中还可以使用: between and。
基本语法: between {条件1} and {条件2};
``` sql
select * from my_stud where age between 20 and 30;
```

注意: between and 中条件1 必须小于条件2，否则结果为空。

### 逻辑运算符
逻辑运算符包括: and, or, not
``` sql
select * from my_stud where age >= 20 and age <= 30;
```

### In 运算符
基本语法: in (结果1, 结果2, ...);
``` sql
select * from my_stud where age in (20, 21, 22);
```

### Is 运算符
is 专门用来判断字段值是否为 null。
基本语法: is null/is not null
``` sql
select * from my_stud where name is null;
```

### Like 运算符
用来进行模糊匹配。
基本语法: like '模式匹配';
``` sql
select * from my_stud where name like '%a%';
```