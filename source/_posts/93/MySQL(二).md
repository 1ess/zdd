---
title: MySQL(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog93.jpg
date: 2019/01/07
---

本篇，我们来说说 SQL 的基本操作 —— 库操作、表操作以及数据操作。

## 库操作
***  
### 创建数据库
基本语法: create database {数据库名} [库选项];
``` sql
-- 创建数据库
create database mydatabase;
```

库选项: 
- 字符集: charset {指定字符集}，不指定则采用安装时默认字符集
- 校对集: collate {指定校对集}

### 显示数据库
#### 显示全部
基本语法: show databases;
``` sql
-- 显示全部数据库
show databases;
```

#### 显示部分
基本语法: show databases like '{模式匹配}';
- _: 匹配当前位置单个字符
- %: 匹配指定位置多个字符

``` sql
-- 显示部分数据库
show databases like 'my%';
```

#### 显示数据库创建语句
基本语法: show create database {数据库名};

``` sql
-- 显示数据库创建语句
show create database mydatabase;
```

### 选择数据库
基本语法: use {数据库名};
在命令行会出现: Database changed

``` sql
-- 选择数据库
use mydatabase;
```

### 修改数据库
5.5 版本之后，只能修改库选项，不能再修改库名了。
基本语法: alter databse {数据库名} {库选项};

``` sql
-- 修改库选项
alter database mydatabase charset gbk;
```

### 删除数据库
基本语法: drop database {数据库名};

``` sql
-- 删除数据库
drop database mydatabase;
```

## 表操作
***  
### 创建数据表
#### 普通创建表
基本语法: create table {表名}(字段 字段类型 [字段属性], ...) [表选项];

``` sql
-- 普通创建表
create table mydatabase.class(name varchar(10));
-- 或者
use mydatabase;
create table class(name varchar(10));
```
注意: 表必须放在对应的数据库之下，有两种方式: 
1. 在表名前加上数据库名，用"."连接
2. 在创建表之前，先选择数据库(即 use {数据库名};)

表选项与库选项类似，包括: 
1. 存储引擎: engine {引擎名}
2. 字符集: charset {字符集}
3. 校对集: collate {校对集}

#### 复制已存在表结构
基本语法: create table {表名} like {表名};

``` sql
-- 复制表结构
create table mydatabase.test like mydatabase2.class;
```

### 显示数据表
#### 显示全部
基本语法: show tables;
``` sql
-- 显示全部数据表
show tables;
```

#### 显示部分
基本语法: show tables like '{模式匹配}';
- _: 匹配当前位置单个字符
- %: 匹配指定位置多个字符

``` sql
-- 显示部分数据表
show tables like 'c%';
```

#### 显示表结构(字段名，字段类型，字段属性等)
基本语法: desc {表名};

``` sql
-- 显示表结构
desc test;
```

### 修改数据表
#### 修改表属性
基本语法: alter table {表名} {表选项};

``` sql
-- 修改表选项
alter table test engine innodb;
```

#### 修改表结构
##### 修改表名
基本语法: rename table {旧表名} to {新表名};

``` sql
-- 修改表名
rename table test to test1;
```

##### 新增字段
基本语法: alter table {表名} add {字段名} {字段类型} [字段属性];

``` sql
-- 新增字段
alter table test1 add age int;
```

##### 修改字段名
基本语法: alter table {表名} change {旧字段名} {新字段名} {字段类型} [字段属性];

``` sql
-- 修改字段名
alter table test1 change age new_age int;
```

##### 修改字段类型或属性
基本语法: alter table {表名} modify {字段名} {新字段类型} [新字段属性];

``` sql
-- 修改字段类型或属性
alter table test1 modify name varchar(20);
```

##### 删除字段
基本语法: alter table {表名} drop {字段名};

``` sql
-- 删除字段
alter table test1 drop new_age;
```

#### 删除数据表
基本语法: drop table {表名};

``` sql
-- 删除数据表
drop table test1;
```

## 数据操作
***  
### 插入数据操作
基本语法: insert into {表名} [({字段1}, {字段2}, ...)] values({字段值1}, {字段值2}, ...); 

``` sql
-- 插入数据
insert into test (name, age) values('Tom', 20);
-- 或者
insert into test values('Lisi', 18);
```

### 查询数据操作
基本语法: select * from {表名} [where 字段名 =/like 字段值];

``` sql
-- 查询数据
select * from test;
-- 或者
select name, age from test where name='Lisi';
```

### 删除数据操作
基本语法: delete from {表名} [where 字段名 =/like 字段值];

``` sql
-- 删除数据
delete from test where age>=20;
```

### 更新数据操作
基本语法: update {表名} set {字段名}={新值} [where 字段名 =/like 字段值];

``` sql
-- 更新操作
update test set age=30 where name='Lisi';
```

## 其他常见命令
### 查看 MySQL 服务端版本
``` sql
select version();
--  +-----------+
--  | version() |
--  +-----------+
--  | 8.0.16    |
--  +-----------+
```

### 查看当前选择的数据库
``` sql
select database();
--  +------------+
--  | database() |
--  +------------+
--  | test       |
--  +------------+
```