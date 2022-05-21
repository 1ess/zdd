---
title: Linux(六)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog122.jpg
date: 2019/07/12
---

本篇，我们在来说一下在 Linux 下，有关软件管理的相关知识。

### 软件包管理器
包管理器是方便软件安装，卸载，解决软件依赖关系的工具。
- RHEL 和 CentOS 中使用 yum 包管理器，软件包格式为 rpm
- Debian 和 Ubuntu 中使用 apt 包管理器，软件包格式为 deb

### rpm 包
rpm 包格式: 
**软件名称-软件版本.系统版本.平台.rpm**
如: 
vim-common-7.4.10-5.el7.x86-64.rpm

#### rpm 命令
常用参数: 
- q: 查询软件包
- i: 安装软件包
- e: 卸载软件包

### yum 仓库
使用 rpm 会有很多依赖关系需要处理，所有出现了 yum。
通常默认源在国外，因为众所周知的原因，我们会先换成国内阿里源。

``` sh
# 首先备份
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

# 换源
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 更新缓存
yum makecache

# 有时我们会找不到某些库，可以先安装企业扩展
yum install epel-release 
```

常用参数: 
- install: 安装软件包
- remove: 卸载软件包
- update: 升级软件包
- list installed: 查看已安装软件包

### 源码编译安装
``` sh
# 先下载压缩包
wget https://..../.....tar.gz

# 解压
tar -xvzf ...tar.gz

# 进入解压目录
cd ...

# 执行 configure
./configure --prefix=/usr/local/...
# 如果报错命令未找到，先执行 yum -y install 安装

# 多核编译
# gmake -j2

# 安装
# gmake install
```
### 内核升级
#### yum 升级
``` sh
# 查看内核版本
uname -r
# 3.10.0-957.27.2.el7.x86_64

# 升级内核
yum install kernel-3.10.0

# 升级依赖
yum update
```

#### 源码编译升级
``` sh
# 安装依赖包
yum install gcc gcc-c++ make ncurses-devel openssl-devel elfutils-libelf-devel bison flex

# 下载并解压缩 https://www.kernel.org
wget https://mirrors.edge.kernel.org/pub/linux/kernel/v5.x/linux-5.2.9.tar.xz
# wget https://mirror.bjtu.edu.cn/kernel/linux/kernel/v5.x/linux-5.2.9.tar.xz
tar xvf linux-5.1.10.tar.xz -C /usr/src/kernels

# 配置内核编译参数
cd /usr/src/kernels/linux-5.1.10
make menuconfig

# 使用内核配置
cp /boot/config-kernelversion.platform /usr/src/kernels/linux-5.1.10/.config

# 编译
make -j2 all

# 安装内核模块
make modules_install

# 安装内核
make install

# 重启
reboot
```