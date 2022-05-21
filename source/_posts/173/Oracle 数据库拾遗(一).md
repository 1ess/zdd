---
title: Oracle 数据库拾遗(一)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog173.jpg
date: 2021/01/09
---

由于目前工作需要使用 Oracle 数据库，准备来看一下 PL/SQL 对标准 SQL 进行了那些补充。
在 ANSI/ISO SQL 标准中，SQL 语句可以分为 DDL(数据定义)、DML(数据操作)和 DCL(数据控制)三类。其中，表结构的操作是使用较频繁的一种操作，这也是 SQL 中 DDL 的主要部分。

## DDL
***  
### CREATE TABLE
我们之后用尖括号表示必填字段，中括号表示可选字段。
基本语法: 
``` sql
CREATE TABLE <table_name> (
    <field_name> <field_type> [(field_len, [float_len])] [NOT NULL],
);
```

Oracle 支持的列数据类型较多，其主要类型如下: 
- CHAR(length)
- VARCHAR2(length)
- NUMBER(p, s)
- DATE
- TIMESTAMP
- CLOB
- BLOB

对于 DATE、CLOB 等数据类型来说无须指明其长度，Oracle 系统将自动设定。

### ALTER TABLE
对表结构的修改需要使用 ALTER TABLE 命令来实现。

#### 新增字段
基本语法为: 
``` sql
ALTER TABLE <table_name> 
    ADD <field_name> <field_type> [(field_len, [float_len])] 
    [DEFAULT <value>] 
    [NULL | NOT NULL];
```

#### 修改字段
ALTER TABLE 命令还可以为一个已经存在的表修改其已有的字段，修改一般包括对其字段名、数据类型、长度和相关的完整性约束的修改。
``` sql
ALTER TABLE <table_name> 
    MODIFY <field_name> <field_type> [(field_len, [float_len])] 
    [DEFAULT <value>] 
    [NULL | NOT NULL];
```

#### 删除字段
ALTER TABLE 命令还可以实现删除字段操作。在实际应用中，删除字段的操作也是比较频繁的，字段删除后，其所有记录的对应字段值都自动被删除。
``` sql
ALTER TABLE <table_name>
    DROP COLUMN <field_name>;
```

### RENAME
在实际开发中，有时需要对基本表进行重命名。PL/SQL 提供了重命名基本表的命令 RENAME: 
``` sql
RENAME <origin_table_name> TO <dest_table_name>;
```

### 复制相同结构的表
``` sql
CREATE TABLE <table_name>
AS
SELECT 
    * 
FROM <origin_table_name> 
WHERE 1=2;
```

其中，AS 是复制表结构的关键字，SELECT 子句是从已存在的表中获取所有字段，WHERE 子句表示只复制表结构，不复制表数据。

### DROP TABLE
ANSI/ISO SQL 标准定义了 DROP TABLE 命令用于删除数据表，Oracle PL/SQL 也同样支持该命令语句的执行: 
``` sql
DROP TABLE <table_name>;
```

注意：使用 DROP TABLE 命令被删除的表并没有完全消失，而是重命名为一个由系统定义的名称，它存在于同一个表空间中，具有与原始表相同的结构，它还可以被恢复。

### 约束
#### 创建主键约束
基本表通常具有包含唯一标识表中每一行的值的一列或一组列，这样的一列或多列称为表的主键(PK)，用于强制表的实体完整性。
在创建或修改表时，可以通过定义 PRIMARY KEY 约束来创建主键。
一个表只能有一个 PRIMARY KEY 约束，并且 PRIMARY KEY 约束中的列不能接受空值。
创建表时创建主键约束: 
``` sql
CREATE TABLE <table_name> (
    <field_name> <field_type> PRIMARY KEY,
);
```

使用 ALTER TABLE 语句为已存在的表创建主键约束: 
``` sql
ALTER TABLE <table_name> 
    ADD CONSTRAINT <pk_name>
PRIMARY KEY (field_name);
```

#### 创建唯一性约束
唯一性约束即 UNIQUE 约束，在 SQL 基本表中，可以使用 UNIQUE 约束确保在非主键列中不输入重复的值。使用 UNIQUE 约束时需要注意的是，UNIQUE 约束允许 NULL 值而且每个字段只允许一个空值，这一点与 PRIMARY KEY 约束不同。
创建表时创建唯一性约束: 
``` sql
CREATE TABLE <table_name> (
    <field_name> <field_type> UNIQUE,
);
```

使用 ALTER TABLE 语句为已存在的表创建唯一性约束: 
``` sql
ALTER TABLE <table_name> 
    ADD CONSTRAINT <uni_name>
UNIQUE (field_name);
```

#### 创建 CHECK 约束
CHECK 约束用于限制输入到一列或多列的值的范围，如果用户想输入的数据值如果不满足 CHECK 约束中的条件(逻辑表达式)将无法正常输入。
创建表时创建 CHECK 约束: 
``` sql
CREATE TABLE <table_name> (
    <field_name> <field_type>
    CHECK([condition [AND | OR condition]])
);
```

使用 ALTER TABLE 语句为已存在的表创建 CHECK 约束: 
``` sql
ALTER TABLE <table_name> 
    ADD CONSTRAINT <ck_name>
CHECK([condition [AND | OR condition]]);
```

#### 创建外键约束
外键约束也即 FOREIGN KEY 约束，其作用是为表中的一列或者多列数据提供数据完整性参照。外键(FK)是用于建立和加强两个表数据之间的链接的一列或多列，当创建或修改表时可通过定义 FOREIGN KEY 约束来创建外键。
创建表时创建外键约束: 
``` sql
CREATE TABLE <table_name> (
    <field_name> <field_type>
    FOREIGN KEY (<field_name>) REFERENCES <table_name> (field_name)
);
```

使用 ALTER TABLE 语句为已存在的表创建外键约束: 
``` sql
ALTER TABLE <table_name> 
    ADD CONSTRAINT <ck_name>
FOREIGN KEY (<field_name>) REFERENCES <table_name> (field_name);
```

约束有如下 4 种类型: 
- P: 表明约束与主码(PRIMARY KEY)结合
- U: 表明约束与唯一性约束结合
- C: 表明约束属于 CHECK 类型，在这种情况下，RDBMS 对非空值进行检查
- R: 表明约束与外码(FOREIGN KEY)结合

#### 删除约束
基本语法为: 
``` sql
ALTER TABLE <table_name>
    DROP CONSTRAINT <constraint_name>;
```

#### 为字段设置默认值
在实际应用中，为方便用户对基本表的操作，常常为表中的某些字段设置默认值。在 Oracle PL/SQL 中，DEFAULT 关键字用来指定某个字段的默认值。在 MS T-SQL 中将 DEFAULT 作为约束操作，而 Oracle PL/SQL 将其认为是一个字段值。
需要注意: 并不是所有数据类型的数据值都可以作为默认值。在SQL 中，DEFAULT 关键字后的值只能为下列三种值中的一种: 
- 常量值
- NULL
- 系统函数

同时，由于 Oracle 中 DEFAULT 不是约束，因此在使用 SELECT 显示表的约束时，默认值不会显示出来。