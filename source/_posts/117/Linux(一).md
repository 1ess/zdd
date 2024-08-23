---
title: Linux(一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog117.jpg
date: 2019/06/02
---

从本篇开始，我们分几篇来专门说一下有关 Linux 的那些事儿。

## Unix
***  
如果我们要介绍 Linux，我们就不得不首先说一下 Unix。
Unix: 一种多用户、多进程的计算机操作系统，开发于 1970 年在美国 AT&T 公司的贝尔实验室的 AT＆T Unix。
此后的 10 年，Unix 在学术机构和大型企业中得到了广泛的应用，当时的 Unix 拥有者 AT&T 公司以低廉甚至免费的许可将 Unix 源码授权给学术机构做研究或教学之用，许多机构在此源码基础上加以扩充和改进，形成了所谓的 "Unix 变种"。
最著名的变种之一是由加州大学 Berkeley 分校开发的 BSD(Berkeley Software Distribution)。
后来 AT&T 意识到了 Unix 的商业价值，不再将 Unix 源码授权给学术机构，并对之前的 Unix 及其变种声明了版权。BSD 在 Unix 的历史发展中具有相当大的影响力，被很多商业厂家采用，成为很多商用 Unix 的基础。其不断增大的影响力终于引起了 AT&T 的关注，于是开始了一场持久的版权官司。最终允许 Berkeley 分校自由发布自己的 Unix 变种，但是前提是必须将来自于 AT&T 的代码完全删除，于是诞生了 4.4 BSD Lite 版，由于这个版本不存在法律问题，4.4 BSD Lite 成为了现代柏克莱软件套件的基础版本。BSD 在发展中也逐渐衍生出3个主要的分支: 
1. FreeBSD
2. OpenBSD
3. NetBSD

注意: 我们现在使用的 macOS 和 iOS 也都是由 FreeBSD 衍生而来。

## Linux
***  
1983 年，Richard Stallman 创立 GNU 计划。这个计划有一个目标，是为了发展一个完全自由的类 Unix 操作系统。自 1984 年发起这个计划以来，在 1985 年，Richard Stallman 还发起了 FSF(Free Software Foundation)并在 1989 年撰写了 GPL，1990 年代早期，GNU 开始大量地生产系统必备的元件如: GCC、GDB、Emacs 等等。
Linux 就是之前说的类 Unix 系统。该操作系统的内核由 Linus 在 1991 年 10 月 5 日首次发布，Linux 严格来说只指操作系统的内核，因操作系统中包含了其他实用工具。如今 Linux 常用来指基于 Linux 的完整操作系统，内核则改以 "Linux 内核"称之。由于这些支持用户空间的系统工具和库主要由 Richard Stallman 于 1983 年发起的GNU 计划提供，自由软件基金会提议将其组合系统命名为 GNU/Linux，但 Linux 不属于 GNU 计划，这个名称并没有得到认可。
通常情况下，Linux 被打包成供个人计算机和服务器使用的 Linux 发行版，一些流行的主流 Linux 发布版，包括Debian(及其衍生版本 Ubuntu)、RDEL(Red Hat Enterprise Linux)(及其衍生版本 CentOS)等，Linux 发行版包含 Linux 内核和支撑内核的实用程序和库，通常还带有大量可以满足各类需求的应用程序。个人计算机使用的 Linux 发行版通常包含 X Window 和一个相应的桌面环境，如 GNOME 或 KDE。

## Linux 目录结构
***  
从 Unit 系统沿袭下来的: Linux 系统中同样地存在"一些皆文件"的概念。
一个典型的Linux系统具有以下几个目录:
- / : 根目录，是所有目录树开始的地方
- /boot/ : 包括了引导程序的静态文件
- /bin/ : 此目录下包括了单用户方式及系统启动或修复所用到的所有执行程序
- /sbin/ : 类似于 /bin 此目录保存了系统引导所需的命令，但这些命令一般用户不能执行
- /lib/ : 此目录下包含系统引导和在根用户执行命令所必需用到的共享库
- /root/ : 管理员的家目录
- /home/ : 在Linux机器上，用户主目录通常直接或间接地置在此目录下
- /dev/ : 对应物理设备的指定文件或驱动程序
- /etc/ : 用于存放本地机的配置文件
- /usr/ : 此目录通常用于从一个独立的分区上挂载文件
- /var/ : 此目录下文件的大小可能会改变，如缓冲文件可日志文件
- /tmp/ : 此目录用于保存临时文件，临时文件在日常维护或在系统启动时无需通知便可删除
- /usr/local : 安装在本地执行程序的地方
- /usr/local/bin : 在此地放置本地执行程序的二进制文件

## 基本指令
***  
### 关机
``` sh
# 立即关机
shutdown -h now

# 60 分钟后关机
shutdown -h 60
```

### 重启
``` sh
# 立即重启
shutdown -r now

# 30 分钟后重启
shutdown -r 30
```

### 取消关机或重启
``` sh
shutdown -c
```
注意: 不论关机还是重启，只能是管理员用户才可以进行操作。

### file
file 指令可以判断文件类型。
常见文件类型有 7 种:
- 字符特殊设备(c): 所有的输入输出设备
- 块特殊设备(b): 所有的存储设备
- 普通文件(-): 普通文件
- 目录文件(d): 目录文件
- 软链接文件(l): 软链接文件
- 管道文件(p): 程序或进程间通信的方式
- 套接字文件(s): 程序或进程间通信的方式

注意: 特殊设备(字符特殊设备和块特殊设备)一般存储在 /dev/ 下。

格式: 
``` sh
file [目标路径]
```

### ls
ls 是英文 list 的缩写，用于列出文件。
在 Unix 和类 Unix 操作系统中都有当前目录的概念，也即程序目前在目录树中的位置。
当不加参数运行时，ls 列出当前目录下的除隐藏文件外的所有文件和目录名。如果以目录名作为参数，则会列出该目录下的文件。
在某些环境下，使用参数"--color"(GNU 版)或者"-G"(FreeBSD 版)后，ls 会根据文件类型输出不同色彩的格式。GNU 版的 ls 根据文件的类型、扩展名和使用权限来决定颜色，而 FreeBSD 版的 ls 仅仅检查文件类型和使用权限。

常用参数: 
- a: 列出目录下的所有文件，包括以 . 开头的隐含文件
- l: 除了文件名之外，还将文件的权限、所有者、文件大小等信息详细列出来
- r: 反次序排列
- R: 同时列出所有子目录层
- S: 根据文件大小排序
- t: 根据文件修改时间排序
- h: 可读形式列出文件详细信息

### pwd
在类 Unix 系统和其他一些操作系统中，pwd(print working directory)用于输出当前工作目录的绝对路径。

### cd
cd(change directory)，是在 Unix、类 Unix、Windows 和 DOS 操作系统下用于改变工作目录。

快捷操作: 
- cd ~: 切换到当前用户的家目录
- cd -: 切换回上次目录

### mkdir
mkdir(make directory)命令在 Unix、DOS 和  Windows 操作系统中用于创建一个目录。

常用参数: 
- p: 用于构建复杂的目录层次结构，不论父目录是否已经存在

### touch
touch 用于更改文件访问和修改时间的标准 Unix 程序，它也被用于创建新文件。

### 查看文件内容
- cat: 查看小文件，从第一行列到最后一行
- tac: 查看小文件，从最后一行列到第一行
- less: 查看大文件，可以搜索，翻页等功能
- tail: 查看文件后几行，tail /etc/hosts -n 2 表示查看最后 2 行
- head: 查看文件前几行，命令类似 tail

### cp
cp 是 Linux 和 Unix 的 copy 指令。

常用参数: 
- r: 用于递归复制目录到目标目录

格式: 
``` sh
cp [源路径] [目标路径]
```

### mv
mv(move)是类 Unix 操作系统中移动单个或多个文件或目录的命令，也可以用于重命名。

格式: 
``` sh
mv [源路径] [目标路径]
```

### rm
rm(remove)用于删除文件系统中的文件、目录、设备文件、符号链接等对象。

常用参数: 
- r: 用于递归删除目录
- f: 强制删除目录、文件

### 简约查看帮助
我们使用 help 命令简约查看帮助。
对于内部命令，我们使用: 
``` sh
help [命令]
```

对于外部命令，我们使用: 
``` sh
[命令] --help
```

我们可以通过 type 命令判断一个命令是内部命令还是外部命令: 
``` sh
type echo
# echo is a shell builtin

type git
# git is /usr/bin/git

type mkdir
# mkdir is /bin/mkdir
```

### 详细查看帮助
我们使用 man 命令详细查看帮助。
``` sh
man echo
```

### 重定向标准输入输出
1. 名词解释
- 标准输入(stdin): 键盘上的输入，文件描述符为 0
- 标准输出(stdout): 屏幕上的正确输出，文件描述符为 1
- 标准错误(stderror): 屏幕上的错误输出，文件描述符为 2

2. 相关符号
- '<'  : 标准输入重定向
- '>'  : 标准输出重定向
- '2>' : 标准错误重定向
- '>>' : 标准输出追加
- '2>>': 标准错误追加
- '&>' : 标准输出标准错误重定向

### echo
echo 将标准输入字符串送到标准输出。echo 可能是 Linux 中最忧伤的命令，有感兴趣的小伙伴可以自己去了解一下。

常用参数: 
- n: 结尾不追加换行符
- e: 解释转义字符

``` sh
echo "Hello World"
> Hello World

echo -e "Hello\nWorld"
> Hello
> World
```

### lsblk
lsblk(list block)可以列出块设备。

### mount
mount 可以挂载外部块设备。

格式:
``` sh
mount [块设备路径] [挂载地址]
```
注意: 挂载地址通常在 /mnt/ 或者 /media/ 文件夹下。

### 顺序执行多条指令
简单的顺序执行可以使用 ; 来完成: 
``` sh
sudo yum update;sudo yum install some-tools;some-tools
```

但是这样可以造成花费时间但是却得到一个错误结果。

### 有选择的执行指令
可以使用 && 来完成: 
``` sh
which cowsay>/dev/null && cowsay -f head-in ohch~
```

### netstat
netstat 命令在调试网络程序或者定位网络相关问题时非常有用。
``` sh
netstat -tulpn
```

常用参数: 
- t: 查看 TCP 连接
- u: 查看 UDP 连接
- l: 只想查看处于 LISTEN 状态的连接
- p: 显示进程信息
- n: 使用数字代替了名称

## shell
***  
### 查看支持的 shell
``` sh
cat /etc/shells

# /bin/sh
# /bin/bash
```

### 查看当前使用的 shell
``` sh
echo $SHELL

# /bin/bash
```

### zsh
#### 安装
``` sh
# Debian
sudo apt install zsh zsh-completions

# Manjaro
sudo pacman -S zsh zsh-completions
```

#### oh-my-zsh
``` sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 切换 shell
``` sh
which zsh
# /usr/bin/zsh

sudo chsh -s /usr/bin/zsh
```

#### 配置
我们可以修改 Theme 和 Plugins: 
``` sh
vim ~/.zshrc
```

我目前使用的主题是 ys，使用的插件有 zsh-autosuggestions、git 和 zsh-syntax-highlighting。