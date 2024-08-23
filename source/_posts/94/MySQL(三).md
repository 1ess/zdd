---
title: MySQL(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog94.jpg
date: 2019/01/08
---

本篇，我们再来说说 MySQL 中的列类型和列属性以及表间关系。

## 列类型
***  
### 整数类型
1. Tinyint: 迷你整型，采用 1 字节保存整型数据
2. Smallint: 小整型，采用 2 字节保存整型数据
3. Mediumint: 中整型，采用 3 字节保存整型数据
4. Int: 标准整型，采用 4 字节保存整型数据
5. Bigint: 大整型，采用 8 字节保存整型数据

``` sql
create table my_int(
    int_1 tinyint,
    int_2 smallint,
    int_3 mediumint,
    int_4 int,
    int_5 bigint
) charset utf8;
```

#### 无符号设定
默认整型是有符号的，如果只想有正数，只需要使用 unsigned。
``` sql
alter table my_int add int_6 tinyint unsigned;
```

#### 显示长度
指在数据显示的时候，最长可以显示的位数。
如果需要始终以最大长度显示，可以使用 zerofill 属性。
注意: 使用了 zerofill，一定是无符号整型。因为从左到右 0 填充。
``` sql
alter table my_int add int_7 tinyint zerofill;
```

可以手动指定显示长度，但是不能改变该类型所能表示的最大大小，只是在 zerofill 时，不足位数时，以该位数填充。
``` sql
alter table my_int add int_7 tinyint(2) zerofill;
-- 填充 1 时，显示 01，填充 100 时，显示 100
```

### 小数类型
在 MySQL 中，小数类型分为: 
1. 浮点型
 - Float: 单精度浮点型，采用 4 字节保存小数类型数据，精度大概在 7 位
 - Double: 双精度浮点型，采用 8 字节保存小数类型数据，精度大概在 15 位
2. 定点型
 - Decimal

#### 浮点型
基本语法: 
1. float(或 double): 不指定小数位
2. float(M, D)(或 double(M, D)): 表示一共存储 M 个有效数字，其中小数位占 D 位，即整数位数占 M-D 位，小数部分占 D 位

``` sql
create table my_float(
    float_1 float,
    float_2 float(10, 2)
) charset utf8;
```

注意: float 或 double 用于不需要精确记录的小数。

#### 定点型
定点型可以保证数据精确的小数。小数和整数部分分开存储，
基本语法: 
decimal(M, D): M 表示总长度，最大值不能超过 65，D 代表小数部分长度，最大值不能超过 30
``` sql
create table my_decimal(
    decimal_1 decimal(10, 2),
    float_1 float(10, 2)
) charset utf8;
```

### 日期类型
1. Date: 系统采用 3 个字节来存储数据，对应格式为: YYYY-mm-dd，初始值: 0000-00-00
2. Time: 系统采用 3 个字节来存储数据，对应格式为: HH:ii:ss，能表示的范围是: -838:59:59 ~ 838:59:59
3. Datetime: 就是将前面的 Date 类型和 Time 类型合并，系统采用 8 个字节来存储数据，对应格式为: YYYY-mm-dd HH:ii:ss
4. Timestamp: 表示从格林威治时间开始的时间戳，但是格式仍为: YYYY-mm-dd HH:ii:ss
5. Year: 系统采用 1 个字节来存储数据，能表示范围是 1900 ~ 2155

``` sql
create table my_date(
 date_1 date,
 date_2 time,
 date_3 datetime,
 date_4 timestamp,
 date_5 year
) charset utf8;
```

注意: timestamp 类型不能为 null，且存在默认值为当前时间戳的时间，当数据更新时，该字段自动更新。另外，通常我们也可以用整型来保存真正的时间戳。

### 字符串类型
1. Char: 定长字符，基本语法: char(L)，L 代表字符数，不论中英文，L 长度范围是 0 ~ 255
2. Varchar: 变长字符，基本语法: varchar(L)，L 代表字符数，不论中英文，L 长度范围是 0 ~ 65535
3. Text: 文本类型，存储普通字符文本
 - Tinytext: 系统使用 1 个字节来保存，实际能存储 2<sup>8</sup> + 1
 - Text: 系统使用 2 个字节来保存，实际能存储 2<sup>16</sup> + 2
 - Mediumtext: 系统使用 3 个字节来保存，实际能存储 2<sup>24</sup> + 3
 - Longtext: 系统使用 4 个字节来保存，实际能存储 2<sup>32</sup> + 4
4. Enum: 枚举类型，在存入之前，先预设几个项来限制可输入值，基本语法: enum({枚举值1}, {枚举值2}, ...)
5. Set: 将多个数据项同时保存，本质是将指定的项按照对应的二进制位来控制，1 表示被选中，0 表示未被选中，基本语法: set({值1}, {值2}, ...)

注意: 如果数据长度超过 255 个字符，我们一般是使用 text，而不是 char 或 varchar。
对于 Text 类型，通常我们直接使用 Text 类型即可，系统会自动选择合适的文本类型。
我们还有 Blob 类型存储二进制文本，如图片，文件等，但是一般不使用，一般都是直接存储链接。
枚举类型在 MySQL 中实际存储的整型，注意是从 1 开始。

## 列属性
***  
在 MySQL 中一共有 6 个列属性: 
1. null
2. 默认值
3. 列描述
4. 主键
5. 唯一键
6. 自增长

### Null
null 属性代表字段为空。如果为 YES，表示该字段可以为空，我们设计表时，尽量不要让数据为空。

### Default
设计表时，在用户不进行数据输入时，那么会自动填充默认值。
``` sql
create table my_default(
    name varchar(10) NOT NULL,
    age int default 18
) charset utf8;
```

### Comment
用于给开发人员进行维护的一个注释说明。
基本语法: comment '描述'
``` sql
create table my_comment(
    name varchar(10) not null comment '用户名，不能为空', --用户名，不能为空
    pass varchar(50) not null comment '密码，不能为空', --密码，不能为空
) charset utf8;
```

### Primary Key
主键是指在一张表中，值具有唯一性的字段。

#### 创建主键
##### 随表创建
1. 直接在需要当作主键的字段之后，增加 primary key 属性来确定主键

``` sql
create table my_pri1(
    username varchar(10) primary key
) charset utf8;
```
2. 在所有字段之后增加 primary key 选项，基本语法: primary key({字段列表})

``` sql
create table my_pri2(
    username varchar(10),
    primary key(username)
) charset utf8;
```

##### 表后创建
基本语法: alter table {表名} add primary key({字段});
``` sql
alter table my_pri3 add primary key(username);
```

#### 删除主键
基本语法: alter table {表名} drop primary key;
``` sql
alter table my_pri3 drop primary key;
```

#### 复合主键
``` sql
create table my_score(
    student_id char(10),
    course_id char(10),
    score tinyint not null,
    primary key(student_id, course_id)
) charset utf8;
```
#### 主键约束
1. 字段值不能为空
2. 字段值不能重复

#### 主键分类
1. 业务主键
2. 逻辑主键

### Auto_Increment
给定字段该属性之后，该列数据在未被提供确定数据时，系统会根据已存在数据进行自动增长后，填充数据。通常用于逻辑主键。
自动增长只用于数值类型。
基本语法: {字段} {字段类型} auto_increment;
``` sql
create table my_increment(
    id int primary key auto_increment,
    name varchar(10) not null comment '用户名不为空',
) charset utf8;
```

#### 修改自增长当前值
一个表最多只能有一个自增长。
``` sql
alter table my_increment auto_increment 10;
```

#### 删除自增长
``` sql
alter table my_increment modify id int;
```

#### 查看自增长初始变量
``` sql
show variables like 'auto_increment%';
```

auto_increment_increment 指步长，auto_increment_offset 指初始值。

### Unique Key
唯一键与主键一样，都是保证字段的数据唯一性的。不同的是: 
1. 一张表只能有一个主键，但可以有多个唯一键
2. 唯一键允许为 null，且可以有多个

#### 创建唯一键
1. 直接在需要当作唯一键的字段之后，增加 unique [key] 属性来确定

``` sql
create table my_unique1(
    name varchar(10) unique
) charset utf8;
```
2. 在所有字段之后，增加 unique key unique key({字段列表})

``` sql
create table my_unique2(
    name varchar(10),
    unique key(name)
) charset utf8;
```
3. 在创建完表后，也可以创建唯一键，alter table {表名} add unique key({字段列表});

``` sql
alter table my_unique3 add unique key(name);
```

#### 删除唯一键
基本语法: alter table {表名} drop index {唯一键名};
``` sql
alter table my_unique1 drop index name;
```

## 表间关系
***  
### 一对一关系
一张表中的一条记录与另一张表中最多只有一条记录有明确关系。通常，此方案设计为两张表中使用同样主键即可。

### 一对多关系
通常一对多的关系设计方案，再多关系的表中维护一个字段，通常是一关系的主键。

### 多对多关系
通常多对多的关系设计方案，需要再增加一张关系表来维护该关系。