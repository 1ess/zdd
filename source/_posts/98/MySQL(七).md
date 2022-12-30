---
title: MySQL(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog98.jpg
date: 2019/01/19
---

本篇是 MySQL 的最后一篇，我们最后讲讲变量、函数、存储过程和触发器。

## 变量
***  
MySQL 需要很多变量来保存数据。

### 系统变量
系统内部定义的变量，系统变量针对所有用户有效。

#### 查看系统变量
基本语法: show variables [{模式匹配}];
``` sql
show variables like 'autocommit';
```

#### 查看系统变量实际值
基本语法: select @@{变量名};
``` sql
select @@autocommit;
```

#### 修改系统变量
##### 局部修改
只针对当前客户端的本次连接。
基本语法: set {变量名} = {新变量值};
``` sql
set autocommit = 0;
```

##### 全局修改
针对"所有"客户端"所有"时刻。
基本语法: set global {变量名} = {新变量值}; 或者 set @@global.{变量名} = {新变量值};
``` sql
set global autocommit = 1;
-- 或者
set @@global.autocommit = 1;
```

注意: 全局修改只针对新客户端有效。

### 会话变量
会话变量又称为用户变量，只针对当前用户使用的当前客户端有效。

#### 定义用户变量
基本语法: set @{变量名} = {变量值};
``` sql
set @name := 'Hello world';
```

注意: 使用 := 是因为 MySQL 中 = 还有比较的含义，为了避免搞混，可以使用 := 来进行赋值操作。

### 局部变量
局部变量使用 declare 关键字声明，并且出现在 begin 和 end 语句之间。
基本语法: declare {变量名} {数据类型};

## 函数
***  
所有函数都是使用: select 函数名(参数列表);

#### 字符串
- char_length(): 判断字符数
- length(): 判断字节数(与字符集有关)
- concat(): 连接字符串
- instr(): 判断字符在目标字符串中是否存在，存在返回位置(从 1 开始)，不存在返回 0
- lcase(): 全部小写
- left(): 从左侧开始截取到指定位置字符串
- ltrim(): 清除左侧空格
- mid(): 从指定位置开始截取字符串到最后

#### 时间
- now(): 返回当前时间，日期和时间
- curdate(): 返回当前日期
- curtime(): 返回当前时间
- datediff(): 判断两日期天数差距
- date_add(): 进行时间增加
- unix_timestamp(): 获取时间戳(10 位)
- from_unixtime(): 从时间戳转为日期时间

#### 数学
- abs(): 绝对值
- ceiling(): 向上取整
- floor(): 向下取整
- pow(): 求指数
- rand(): 取随机数
- round(): 四舍五入

## 存储过程
简称过程(procedure)，是一组为了完成特定功能的 SQL 语句集。并且在一次编译之后无需再次编译，效率较高。

### 基本操作
#### 创建过程
基本语法: 
create procedure {过程名}([参数列表])
 begin
  {过程体}
 end
{结束符};

如果过程体中只有一条语句，可以省略 begin 和 end。
``` sql
create procedure my_proc()
select * from my_student;

delimiter $$
create procedure my_proc()
begin
    declare i int default 1;
    set @sum := 0;
    while i <= 100 do
     set @sum = @sum + i;
     set i = i + 1;
     end while;
     select @sum;
end
$$
delimiter;
```

#### 查看过程
基本语法: show procedure stutas;
``` sql
show procedure stutas;
```

#### 调用过程
基本语法: call {过程名}([参数列表]);
``` sql
call my_proc();
```

#### 删除过程
基本语法: drop procedure {过程名};
``` sql
drop procedure my_proc;
```

## 触发器
***  
触发器(trigger)是一种特殊类型的存储过程。触发器通过事件触发而被执行。

### 作用
1. 在写入数据表之前，强制检验或转换数据
2. 触发器发生错误，异动的结果会被撤销

### 优缺点
- 优点
 1. 可以实现表的级联更改
- 缺点
 1. 对触发器过分依赖，会影响数据库结构，增加维护的复杂程度
 2. 造成数据在程序层面不可控