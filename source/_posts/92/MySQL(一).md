---
title: MySQL(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog92.jpg
date: 2019/03/14
---

从本篇开始，我们来说说最流行的数据库 —— 关于 MySQL 的那些事儿。

## 数据库概念
***  
数据库(Database)是按照数据结构来组织、存储和管理数据的建立在计算机存储设备上的仓库。

>人们通常用数据库这个术语来代表他们使用的数据库软件。这是不正确的，它是引起混淆的根源。确切地说，数据库软件应称为 DBMS(数据库管理系统)。数据库是通过 DBMS 创建和操纵的容器。数据库可以是保存在硬设备上的文件，但也可以不是。在很大程度上说，数据库究竟是文件还是别的什么东西并不重要，因为你并不直接访问数据库; 你使用的是 DBMS，它替你访问数据库。

### 数据库分类
- 关系数据库(Relational Database)
- 非关系数据库(NoSQL)

### 关系型数据库
#### 基本概念
关系型数据库是创建在关系模型基础上的数据库，借助于集合代数等数学概念和方法来处理数据库中的数据。现实世界中的各种实体以及实体之间的各种联系均用关系模型来表示。现如今虽然对此模型有一些批评意见，但它还是数据存储的传统标准。

关系模型由**关系数据结构**、**关系操作集合**、**关系完整性约束**三部分组成。

标准数据查询语言 SQL 就是一种基于关系数据库的语言，这种语言执行对关系数据库中数据的检索和操作。

典型的关系型数据库: 
- MySQL
- PostgreSQL
- SQL Server
- Oracle
- Sqlite
- DB2

几乎所有的数据库管理系统都配备了一个开放式数据库连接(ODBC)驱动程序，令各个数据库之间得以互相集成。

### 非关系型数据库
NoSQL 一词最早出现于1998年，是 Carlo Strozzi 开发的一个轻量、开源、不提供 SQL 功能的关系数据库。当代典型的关系数据库在一些数据敏感的应用中表现了糟糕的性能，例如为巨量文档创建索引、高流量网站的网页服务，以及发送流式媒体。关系型数据库的典型实现主要被调整用于执行规模小而读写频繁，或者大批量极少写访问的事务。

典型的非关系型数据库: 
1. Key/value 硬盘存储
 - LevelDB
 - MemcacheDB

2. Key/value RAM 存储
 - Redis
 - memcached

## SQL
***  
结构化查询语言(Structured Query Language)简称 SQL，是一种特殊的编程语言，是一种数据库查询和程序设计语言，用于存储、查询、更新数据和管理关系数据库系统，同时也是数据库脚本文件的扩展名。

### SQL 分类
1. 数据查询语言(Data Query Language，DQL): 代表指令 SELECT/SHOW
2. 数据操作语言(Data Manipulation Language，DML): 代表指令 INSERT/UPDATE/DELETE
3. 事务处理语言(Transaction Process Language，TPL): 代表指令 BEGIN TRANSACTION/COMMIT/ROLLBACK
4. 数据控制语言(Data Control Language，DCL): 代表指令 GRANT/REVOKE
5. 数据定义语言(Data Definition Language，DDL): 代表指令 CREATE/DROP

## MySQL
***  
MySQL 是一种关系型数据库管理系统，目前属于 Oracle 旗下产品。

### 安装 MySQL
#### Windows
1. 直接去[官网](https://dev.mysql.com/downloads/installer/)下载 MySQL，双击安装
2. 配置环境变量，指向 mysql 的 bin 目录(默认路径: C:\Program Files\MySQL\MySQL Server 8.0\bin)
3. 配置初始化的 my.ini 配置文件

``` csharp
[mysqld]
# 设置3306端口
port=3306
# 设置mysql的安装目录
basedir=C:\Program Files\MySQL\MySQL Server 8.0\
# 设置mysql数据库的数据的存放目录
datadir=C:\Program Files\MySQL\MySQL Server 8.0\Data
# 允许最大连接数
max_connections=200
# 允许连接失败的次数。
max_connect_errors=10
# 服务端使用的字符集默认为UTF8
character-set-server=utf8
# 创建新表时将使用的默认存储引擎
default-storage-engine=INNODB
# 默认使用"mysql_native_password"插件认证
#mysql_native_password
default_authentication_plugin=mysql_native_password
[mysql]
# 设置mysql客户端默认字符集
default-character-set=utf8
[client]
# 设置mysql客户端连接服务端时默认使用的端口
port=3306
default-character-set=utf8
```
4. 在 MySQL 的安装目录的仓目录下执行命令: 

``` sh
mysqld --initialize --console
```
5. 在管理员权限下执行命令: 

``` sh
mysqld --install
```

注意: 如果提示服务已存在，则需要执行命令: 
``` sh
sc delete mysql
```

#### Mac
我们直接使用 homebrew 安装: 
``` sh
brew install mysql
```

与 Windows 类似，我们还可以修改 Mysql 中配置文件，位于目录 /usr/bin/etc/my.cnf。

### 启动和停止 MySQL 服务
MySQL 是一种 C/S 架构，包括客户端和服务端。
服务端对应的软件: mysqld.exe
客户端对应的软件: mysql.exe

#### Windows
##### 命令行方式
``` sh
# 启动 mysql 服务
net start mysql

# 关闭 mysql 服务
net stop mysql
```

##### 系统服务方式
在计算机管理-服务(services.msc)中操作 mysql 服务。

#### Mac
``` sh
# 启动 mysql 服务
brew services start mysql

# 关闭 mysql 服务
brew services stop mysql
```

### 登录和退出 MySQL 系统
通过客户端 mysql.exe 与服务器连接认证。
#### 登录
连接认证语法: 
``` sh
mysql -h{ip地址或域名} -P{mysql 监听端口，通常3306} -u{用户名} -p
```

#### 退出
我们使用完 mysql 之后，由于连接数量有限，所以注意一定要断开连接。
``` sh
\q
\quit
exit
```

注意: Mysql 8.0 版本和 Mysql 5.7 版本的身份验证插件不同: 
- Mysql 8.0 身份验证插件为 caching_sha2_password
- Mysql 5.7 身份验证插件为 mysql_native_password