---
title: Linux(七)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog123.jpg
date: 2019/07/19
---

> 破帽遮颜过闹市，漏船载酒泛中流，躲进小楼成一统，管他冬夏与春秋。 

本篇，我们在来说一下在 Linux 下，有关进程和内存与磁盘的相关知识。

## 进程
***  
### 进程的查看
常用查看命令: 
- ps
- pstree
- top

### 进程的控制命令
#### 跳转优先级
- nice: 范围 -20 到 19，值越小优先级越高
- renice

#### 作业控制
- ctrl+z: 停止作业
- jobs: 获取作业列表
 - fg [任务编号]: 使其为前台作业运行
 - bg [任务编号]: 使其为后台作业运行

### 进程的通信方式 —— 信号
信号是进程间通信的方式之一。
常用命令: 
- kill -l: 查看支持的信号
- ctrl+c: SIGINT
- kill -9 [pid]: SIGKILL 
- kill [pid]: SIGTERM

### 服务管理 systemctl
CentOS 7 之前，使用 service 命令来管理服务，7 之后使用 systemctl 命令来管理服务。
软件包安装的服务单元存储在 /usr/lib/systemd/system/

常见操作: 
``` sh
systemctl start/stop/restart/reload/enable/disable/status [服务名]
systemctl daemon-reload
```

### SELinux
安全增强式 Linux(SELinux，Security-Enhanced Linux)是一个 Linux 内核的安全模组，其提供了访问控制安全策略机制。

## 内存与磁盘
***  
### 查看内存和磁盘的使用率
- 内存查看常用指令: 
 1. top
 2. free
- 磁盘查看常用指令: 
 1. fdisk
 2. df
 3. du

### ext4 文件系统
Linux 支持多种文件系统，常见的有: ext4，xfs，NTFS(需要安装额外软件)
ext4 文件系统基本结构比较复杂: 
- 超级块
- 超级块副本
- inode
- datablock

其中 inode 是非常重要的，是理解 Unix/Linux 文件系统和硬盘储存的基础。
文件储存在硬盘上，硬盘的**文件存储**单位叫做"扇区"(Sector)。每个扇区储存 512 字节(相当于 0.5KB)
操作系统读取硬盘的时候，不会一个个扇区地读取，而是一次性连续读取多个扇区，即一次性读取一个"块"(block)。这种由多个扇区组成的"块"，是**文件存取**的最小单位。"块"的大小，最常见的是 4KB，即连续八个 sector 组成一个 block。

文件数据都储存在"块"中，那么很显然，我们还必须找到一个地方储存文件的元信息，比如文件的创建者、创建日期、大小等等。这种储存文件元信息的区域就叫做 inode。

可以用 stat 命令，查看某个文件的 inode 信息: 
``` sh
stat xx.md
```

**特别注意: 除了文件名以外的所有文件信息，都存在 inode 之中。**

#### inode 号码
每个 inode 都有一个号码，Unix/Linux 系统内部不使用文件名，而使用 inode 号码来识别文件。
表面上，用户通过文件名，打开文件。实际上，系统内部这个过程分成三步: 
1. 首先，系统找到这个文件名对应的 inode 号码
2. 其次，通过 inode 号码，获取 inode 信息
3. 最后，根据 inode 信息，找到文件数据所在的 block，读出数据

#### 硬链接
一般情况下，文件名和 inode 号码是"一一对应"关系，每个 inode 号码对应一个文件名。但是，Unix/Linux 系统允许，多个文件名指向同一个 inode 号码。这意味着，可以用不同的文件名访问同样的内容；对文件内容进行修改，会影响到所有文件名；但是，删除一个文件名，不影响另一个文件名的访问。这种情况就被称为"硬链接"(hard link)。
``` sh
ln [源文件] [目标文件]
```

inode 信息中有一项叫做"链接数"，记录指向该 inode 的文件名总数，这时就会增加 1。
反过来，删除一个文件名，就会使得 inode 节点中的"链接数"减 1。当这个值减到 0，系统就会回收这个 inode 号码，以及其所对应 block 区域。

注意: 每个目录都有 . 和 ..，前者的 inode 号码就是当前目录的 inode 号码，等同于当前目录的"硬链接"；后者的 inode 号码就是当前目录的父目录的 inode 号码，等同于父目录的"硬链接"。所以，任何一个目录的"硬链接"总数，总是等于 1 加上它的子目录总数。

#### 软链接
文件 A 和文件 B 的 inode 号码虽然不一样，但是文件 A 的内容是文件 B 的路径。读取文件 A 时，系统会自动将访问者导向文件 B。因此，无论打开哪一个文件，最终读取的都是文件 B。这时，文件 A 就称为文件B的"软链接"(soft link)
这意味着，文件 A 依赖于文件 B 而存在，如果删除了文件 B，打开文件 A 就会报错: "No such file or directory"。这是软链接与硬链接最大的不同。
``` sh
ln -s [源文文件或目录] [目标文件或目录]
```

## 日志
***  
Linux 中，常见的日志: 
- 定时任务: /var/log/cron
- 打印信息: /var/log/cups/
- 错误登录: /var/log/btmp，不能直接查看，需要使用 lastb 命令查看
- 重要信息: /var/log/messages，如果系统出现问题，首先要检查该文件

### 文件格式
日志文件格式为: 事件产生时间 发生事件的服务器名称 发生事件的服务名称 事件的具体信息