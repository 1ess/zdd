---
title: 重学 SQL(十一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog166.jpg
date: 2020/08/30
---

本篇是我们 SQL 教程的最后一篇，这一篇，我们来详细说一说 MySQL 账户与权限相关的问题。

在练习时，我们无需考虑什么用户可以访问，以及可以访问多少数据。然而在实际生产环境中，如果我们对安全方面不重视的话，极大可能导致无法挽回的损失。因此，我们有必要对数据库的账户权限等问题有一个深入研究，提高数据库的安全性。

## 账户
***  
### 创建用户
安装 MySQL 时，我们已经创建了一个 root 用户，当我们在实际生产环境中使用数据库时，我们就需要添加一个新的账户，并且给他们配置正确的权限。
``` sql
CREATE USER 1ess@127.0.0.1 IDENTIFIED BY '123456';

-- 或者不限制访问ip
CREATE USER 1ess IDENTIFIED BY '123456';
```

### 查看用户
``` sql
SELECT * FROM mysql.user;
```

注意: 返回结果中的 Host 字段值为 % 表示可以在任意 ip 访问。

### 删除用户
``` sql
DROP USER 1ess;
```

### 修改密码
``` sql
SET PASSWORD FOR 1ess = 'qwerty';

-- 为当前用户修改密码
SET PASSWORD = 'qwerty';
```

## 权限
***  
### 权限许可
对于普通应用，我们授予增删改查权限: 
``` sql
GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
ON sql_store.*
TO 1ess;
```

对于 DBA，我们授予其合适的权限: 
``` sql
GRANT ALL
ON *.*
TO 1ess_dba;
```

所有权限我们可以参考[官方手册](https://dev.mysql.com/doc/refman/8.0/en/privileges-provided.html)。

### 查看权限
``` sql
SHOW GRANTS FOR 1ess;
```

### 撤销权限
``` sql
REVOKE CREATE VIEW
ON sql_store.*
TO 1ess;
```