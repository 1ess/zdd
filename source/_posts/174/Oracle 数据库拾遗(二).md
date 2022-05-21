---
title: Oracle 数据库拾遗(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog174.jpg
date: 2021/01/12
---

前面一章介绍的是表结构的操作，本章开始讲解表数据的操作。之前我们已经说过很多有关 SQL 查询的知识。本篇主要讲一下 Oracle 与其他数据库不一样的地方。

本篇我们使用的 student 表数据结构如下: 

|   | SNO    | SNAME  | SAGE | SGENTLE | SDEPT      | SBIRTH              |
|---|--------|--------|------|---------|------------|---------------------|
| 1 | 120001 | 陈诚   | 23   | 男      | 12计算机 | 1989-05-02 00:00:00 |
| 2 | 120002 | 李忠和 | 25   | 男      | 12图形     | 1987-03-15 00:00:00 |
| 3 | 120003 | 张清   | 21   | 女      | 12外语     | 1991-10-02 00:00:00 |
| 4 | 120004 | 杨国   | 22   | 男      | 12计算机 | 1990-07-21 00:00:00 |
| 5 | 120005 | 林玲   | 26   | 女      | 12计算机   | 1990-05-04 00:00:00 |
| 6 | 120006 | 李沙   | 26   | 男      | 12工商管理 | 1986-08-02 00:00:00 |

### 返回表中的前 N 行记录
在 MS T-SQL 中，定义了 TOP N 关键字来实现，而 Oracle PL/SQL 不支持该关键字。我们可以使用游标 ROWNUM 来实现获取表的前 N 行记录。事实上，ROWNUM 是对查询结果集加的一个伪列，其需要先查询到结果集。简单地说，ROWNUM 是符合条件的结果集的序号，其从 1 开始。
需要特别注意: ROWNUM 的使用只能用 <、<= 和 != 等比较运算符，不能用 >、>= 等运算符，这是因为 ROWNUM 从自然数 1 开始，Oracle 认为 ROWNUM>n(n>1)这种条件是不成立的，因此使用 >、>= 等运算符是无法返回数据记录的。ROWNUM 从自然数 1 开始，因此条件 ROWNUM=1 是成立的，其可以作为 WHERE 子句的条件并返回表的第 1 行记录，但 ROWNUM=n(n>1) 是不成立的，不能作为条件直接写在 WHERE 子句中，否则无法返回正确结果。
``` sql
SELECT 
    *
FROM student
WHERE ROWNUM <= 5;
```

### 函数
除了标准 SQL 的命令和语句外，Oracle PL/SQL 还提供了许多用于执行特定操作的专用函数。这些函数都是为了方便 SQL 对数据进行进一步处理而设计的，其使用大大增强了 PL/SQL 语言的功能。函数可以接受零个或者多个输入参数，并返回一个输出结果。
本章介绍两类函数的使用，通过实例对 PL/SQL 中的单行函数和聚合函数的具体应用和功能进行详细讲解。

我们之前的文章介绍过很多系统函数，如: 
- COUNT()
- SUM()
- AVG()
- MAX()
- MIN()

要特别注意: 聚合函数不能在 WHERE 子句中使用。
接下来我们主要介绍 PL/SQL 中的专用函数。

### 字符串函数
#### 查找并替换字符串
字符串操作是 PL/SQL 中使用十分频繁的操作，常用的有字符串比较、返回字符串长度、查找和替换字符串等。为方便用户对数据表中的字符串数据类型进行操作，PL/SQL 提供了大量的字符串操作函数。查找并替换字符串函数是 REPLACE(): 
``` sql
SELECT 
    REPLACE(SDEPT, '计算机', 'Computer')
FROM student;
```

#### 获取字符的 ASCII 码
在获取用户从键盘上的输入时经常需要将字符转换为 ASCII 码来进行比较运算。PL/SQL 提供了 ASCII 函数来实现字符到 ASCII 码的转换。
``` sql
SELECT 
    ASCII('A') A, 
    ASCII('Z') Z, 
    ASCII('0') ZERO, 
    ASCII(' ') SPACE
FROM dual;
```

该实例中使用的数据表 DUAL 不是预先创建的，而是 Oracle 的一个系统表。DUAL 表是 Oracle 中对所有用户可用的一个实际存在的表，这个表不能用来存储信息，在实际应用中仅用来执行 SELECT 语句。DUAL 表是一个 1 行 1 列的表，其结构已固定，用户不能向该表进行插入删除等操作。

#### 返回字符串长度
PL/SQL 中使用了 LENGTH 函数来实现字符串长度计算: 
``` sql
SELECT 
    SNAME,
    LENGTH(SNAME),
    SDEPT,
    LENGTH(SDEPT)
FROM student;
```

### 数字函数
#### 使用 ROUND 函数确定精度
在许多数据表中都涉及实数，这就需要确定输出的精度: 
``` sql
SELECT 
    ROUND(AVG(SAGE), 3)
FROM student;
```

### 日期函数
#### 日期运算
我们可以使用 ADD_MONTHS 函数进行月份的算术运算: 
``` sql
SELECT
    SNO,
    SNAME,
    ADD_MONTH(SBIRTH, 12)
FROM student;
```

注意: ADD_MONTHS 函数不仅仅可以进行月份的算术加运算，如果将第二个参数设置为负数，就能实现月份的算术减运算。

#### 日期格式化输出
函数 TO_CHAR 是将日期和数字转换为制定格式字符串函数: 
``` sql
SELECT TO_CHAR(SYSDATE, 'YYYY/MM/DD') FROM DUAL;
SELECT TO_CHAR(SYSDATE, 'YYYY/MM/DD HH:MI:SS') FROM DUAL;
SELECT TO_CHAR(SYSDATE, 'YYYY/MM/DD HH24:MI:SS') FROM DUAL;
```

#### 提取日期特定部分
提取日期的特定部分是非常必要的，比如检索本年度每个月 16 日的销售量、检索访问客户集中的时间段，这些需要对日期的特定部分进行提取。
``` sql
SELECT 
	SYSDATE,
	EXTRACT(YEAR FROM SYSDATE),
	EXTRACT(MONTH FROM SYSDATE),
	EXTRACT(DAY FROM SYSDATE),
	EXTRACT(HOUR FROM SYSTIMESTAMP),
	EXTRACT(MINUTE FROM SYSTIMESTAMP),
	EXTRACT(SECOND FROM SYSTIMESTAMP)
FROM DUAL;
```

在 Oracle PL/SQL 中，EXTRACT 函数的一般语法结构如下: 
``` sql
EXTRACT(fmt from d)
```

参数 fmt 有 YEAR、MONTH、DAY、HOUR、MINUTE、SECON 6 种。其中 YEAR、MONTH、DAY 可以为 DATE 或 TIMESTAMP 类型，但是 HOUR、MINUTE、SECOND 必须是 TIMESTAMP 类型。

### NVL
在 SQL Server 中 MS T-SQL 中提供了一个函数 ISNULL 来判断一个字符串是否为空，Oracle PL/SQL 没有提供该函数，但使用了功能更为强大的函数来替代，即 NVL 函数。
``` sql
SELECT 
	ENO,
	ENAME,
	SALARY,
	NVL(COMM, 100)
FROM SALARY
WHERE SALARY < 3000;
```

在 Oracle PL/SQL 中，NVL 函数的一般语法格式如下: 
``` sql
NVL(x, value)
```

该函数的功能是如果 x 为空，返回 value，否则返回 x。由于 NVL 函数使用的频繁性，Oracle 又提供了 NVL 函数的衍生函数: NVL2 函数，其语法格式如下所示: 
``` sql
NVL2(x, value1, value2)
```

该函数的功能是如果 x 非空，返回 value1，否则返回 value2。