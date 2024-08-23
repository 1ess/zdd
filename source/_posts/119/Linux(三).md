---
title: Linux(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog119.jpg
date: 2019/06/09
---

> 旧游无处不堪寻，无寻处，唯有少年心。

本篇，我们在来说一下在 Linux 下，用户和组的相关知识。

## Linux 下的用户管理
***  
### 用户分类
#### 超级用户
超级用户也叫管理员(root)。该用户具有所有权限，UID = 0。

#### 系统用户
系统用户由程序创建，用于程序运行时的身份。
默认不允许登录系统，UID 在 1 到 499 之间(RHEL8 中，UID 范围是 1 到 999)。如 web 服务器的管理用户 apache。

#### 普通用户
普通用户一般由管理员创建，用于对系统进行有限的管理维护操作。
默认允许登录系统。UID 在 500 到 60000 之间(RHEL8 中，UID 范围是 1000 到 60000)。

### 用户管理
#### 创建用户(useradd)
格式: 
``` sh
useradd [选项] [用户名]
```

常见选项: 
- d: 指定用户家目录
- s: 指定用户默认 shell
- g: 指定用户的默认组
- G: 指定用户的附加组

注意: 我们使用 id [用户名] 查看用户信息，使用 su - [用户名] 切换用户。
``` sh
useradd admin

id admin
# uid=1001(admin) gid=1001(admin) 组=1001(admin)

su - admin
# [admin@192 ~] #
```

#### 密码设置(passwd)
格式: 
``` sh
# 给指定用户修改密码
passwd [用户名]

# 给当前用户修改密码
passwd {直接回车}
```

注意: 管理员可以给任意用户修改密码，普通用户只可以给自己修改密码。

用户基本信息保存在 /etc/passwd 文件中，保存格式为: account:password:UID:GID:GECOS:directory:shell
例如: 
root:x:0:0:root:/root:/bin/bash

用户密码信息保存在 /etc/shadow 文件(影子化了的密码文件)中。

#### 修改信息(usermod)
格式: 
``` sh
usermod [选项] [用户名]
```

常见选项: 
- u: 指定用户 uid
- g: 指定用户的默认组
- G: 指定用户的附加组
- d: 指定用户家目录
- s: 指定用户默认 shell


#### 删除用户(userdel)
格式: 
``` sh
userdel [选项] [用户名]
```

常见选项: 
- r: 同时删除该用户的家目录和邮件
- f: 强制删除正在登录的用户

## Linux 下的组管理
***  
### 用户和组的关系
组可以用来方便管理用户，例如分配权限等操作，组信息保存在 /etc/group 下。

### 组管理
#### 创建组(groupadd)
格式: 
``` sh
groupadd [选项] [组名]
```

常见选项: 
- g: 指定组的 gid

#### 删除组(groupdel)
格式: 
``` sh
groupdel [选项] [组名]
```

注意: 如果某个组是用户的主组，则不能删除该组。

#### 组成员管理(gpasswd)
格式: 
``` sh
gpasswd [选项] [组名]
```

常见选项: 
- a: 添加用户到组
- d: 从组中删除用户
- A: 指定管理员
- M: 批量设置用户到组，注意会覆盖原来的设置