---
title: Linux(五)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog121.jpg
date: 2019/06/22
---

本篇，我们在来说一下在 Linux 下，有关网络、服务的相关知识。

## 网络设置
***  
### 网络状态查看工具
#### net-tools
在 CentOS 7 之前，我们通过 net-tools 来查看网络状态。
net-tools 包括: 
- ifconfig
- route
- netstat

#### iproute2
CentOS 7 之后，我们还可以通过 iproute2 来查看网络状态。
iproute2 包括: 
- ip
- ss

### 网卡设置
网卡配置文件位于: /etc/sysconfig/network-scripts/ 下，命名格式: ifcfg-网卡名。
如果不能联网，我们首先检查该网卡的 ONBOOT 值是否为 yes。

### ssh(Secure Shell)
SSH 是一种网络协议，用于计算机之间的加密登录。需要指出的是，SSH 只是一种协议，存在多种实现，既有商业实现，也有开源实现。
协议使用的默认端口是 22，可以通过修改 /etc/ssh/ssh_config 文件修改端口。

基本的用法: 
``` sh
ssh user@host
```

使用 p 参数，可以修改这个端口: 
``` sh
ssh -p 2222 user@host
```

#### 口令登录
如果你是第一次登录对方主机，系统会出现下面的提示: 
> $ ssh user@host
> The authenticity of host 'host (12.18.429.21)' can't be established.
> RSA key fingerprint is 98:2e:d7:e0:de:9f:ac:67:28:c2:42:2d:37:16:58:4d.
> Are you sure you want to continue connecting (yes/no)?

为了防止中间人攻击，用户自行核对远程主机在自己的网站上贴出公钥指纹和提示的公钥指纹是否一致。
当远程主机的公钥被接受以后，它就会被保存在文件 ~/.ssh/known_hosts 之中。下次再连接这台主机，系统就会认出它的公钥已经保存在本地了，从而跳过警告部分，直接提示输入密码。
此外系统也有一个这样的文件，通常是 /etc/ssh/ssh_known_hosts，保存一些对所有用户都可信赖的远程主机的公钥。

#### 公钥登录
使用密码登录，每次都必须输入密码，非常麻烦。好在 SSH 还提供了公钥登录，可以省去输入密码的步骤。
所谓"公钥登录"，原理很简单，就是用户将自己的公钥储存在远程主机上。登录的时候，远程主机会向用户发送一段随机字符串，用户用自己的私钥签名后，再发回来。远程主机用事先储存的公钥进行验签，如果成功，就证明用户是可信的，直接允许登录 shell，不再要求密码。

这种方法要求用户必须提供自己的公钥。如果没有现成的，可以直接用 ssh-keygen 生成一个: 
``` sh
ssh-keygen
```

运行结束以后，在 ~/.ssh/ 目录下，会新生成两个文件: id_rsa.pub 和 id_rsa。前者是你的公钥，后者是你的私钥。
这时再输入下面的命令，将公钥传送到远程主机 host 上面: 
``` sh
ssh-copy-id user@host -p [port]
```

保存在 ~/.ssh/authorized_keys 文件中。

#### ssh 权限
要使用免密登录，一定要注意权限问题: 
1. ~/.ssh 文件夹权限必须为 700
2. ~/.ssh/authorized_keys 文件权限必须为 600

``` shell
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 网络故障排除
常用网络故障排除命令: 
- ping
- traceroute
- mtr
- nslookup
- telnet
- tcpdump
- netstat
- ss

## 内置服务
***  
### 服务管理
要理解服务管理，我们先看一下 Linux 的启动流程: 
1. 首先启动 BIOS，进行 POST(Power on Self Test)
2. 通过自检之后，会通过 MBR(Main Boot Recorder)进行引导
3. 之后再加载内核，进行初始化进程

在 CentOS 7 之前，初始化进程服务是 System V init，在 CentOS 7 之后，则变为 systemd。
systemd 使用 target 来代替了 System V init 中的运行级别的概念，对应关系为: 

| 运行级别 | target            | 作用               |
|----------|-------------------|-------------------|
| 0        | poweroff.target   | 关机               |
| 1        | rescue.target     | 单用户模式         |
| 2        | multi-user.target | 同3                |
| 3        | multi-user.target | 多用户文本界面模式 |
| 4        | multi-user.target | 同3                |
| 5        | graphical.target  | 多用户图形界面模式 |
| 6        | reboot.target     | 重启               |

在 CentOS 7 之前，使用 service 和 chkconfig 命令进行服务的管理，在 CentOS 7 之后，统一使用 systemctl 进行服务管理: 

| System V 命令       | systemctl 命令                           | 作用                        |
|---------------------|------------------------------------------|---------------------------|
| service foo start   | systemctl start foo.service              | 启动 foo 服务               |
| service foo restart | systemctl restart foo.service            | 重启 foo 服务               |
| service foo stop    | systemctl stop foo.service               | 停止 foo 服务               |
| service foo reload  | systemctl reload foo.service             | 重新加载配置文件            |
| service foo status  | systemctl status foo.service             | 查看 foo 服务状态           |
| chkconfig foo on    | systemctl enable foo.service             | 开机启动 foo 服务           |
| chkconfig foo off   | systemctl disable foo.service            | 开机不启动 foo 服务         |
| chkconfig foo       | systemctl is-enabled foo.service         | 查看是否开机自启动 foo 服务 |
| chkconfig --list    | systemctl list-unit-files --type=service | 查看服务的开机启动情况      |

``` sh
# SysV
service network start

# systemd
systemctl start network.service
```

### Systemd 单元
单元就是 Systemd 的最小功能单位，是单个进程的描述。
单元有很多不同的种类，大概一共有 12 种。例如，Service 单元负责后台服务，Timer 单元负责定时器。
每个单元都有一个单元描述文件，它们分散在三个目录。
- /lib/systemd/system: 系统默认的单元文件
- /etc/systemd/system: 用户安装的软件的单元文件
- /usr/lib/systemd/system: 用户自己定义的单元文件

### 设置主机名
#### 临时设置
``` sh
hostname [主机名]
```

#### 持久化设置
修改 /etc/sysconfig/network 文件的 HOSTNAME 字段。

#### 修改本地 DNS 解析
修改 /etc/hosts 文件。
注意: 如果指修改主机名而没有修改本地 hosts 文件，则可能出现软件无法使用，如: Apache。

### ntp
ntp 用于对计算机时间进行同步。
#### 一次性同步
``` sh
ntpdate [域名或IP]
```

#### 自动同步
我们可以设置开机自启动 ntpd 服务，根据版本选择 service 或 systemctl 命令设置。

### 防火墙
防火墙指的是一个由软件和硬件设备组合而成、在内部网和外部网之间、专用网与公共网之间的界面上构造的保护屏障。
在 CentOS 7 之前，使用 iptables，7 之后使用 firewalld。

#### 安装 iptables
``` sh
yum install iptables-services
```

#### 关闭防火墙
``` sh
systemctl stop firewalld
systemctl disable firewalld

systemctl stop iptables
systemctl disable iptables
```

#### 设置白名单
##### 暴露端口
``` sh
firewall-cmd --permanent --add-port=8080/tcp

# 重新加载配置文件，使新规则生效
firewall-cmd --reload  
```

##### 设置可访问地址
例如: 使 mysql 服务的 3306 端口只允许 192.168.1.1/24 网段的服务器能访问: 
``` sh
# 添加规则
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.1.1/24" port protocol="tcp" port="3306" accept"

# reload 使生效
firewall-cmd --reload
```

禁止某 ip 访问: 
``` sh
# 添加规则
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="106.54.43.50" port protocol="tcp" port="443" reject"

# reload 使生效
firewall-cmd --reload
```

##### 查看已设置的规则
``` sh
firewall-cmd --zone=public --list-rich-rules

# rule family="ipv4" source address="61.241.50.63" reject
# rule family="ipv4" source address="113.0.206.101" accept
```

还可以直接编辑防火墙规则文件: 
``` sh
vim /etc/firewalld/zones/public.xml
```

### cron 计划任务
crontab 命令常见于 Unix 和类 Unix 的操作系统之中，用于设置周期性被执行的指令。

格式: 
``` sh
crontab [选项]
```

常见选项: 
- l: 列出用户的计划任务列表
- e: 编辑用户的计划任务列表
- u: 指定用户名，如果不指定，则表示当前用户
- d: 删除用户的计划任务列表

计划任务的格式: 
1. 以行为单位，一行为一个计划
2. 书写格式: 分 时 日 月 周 命令

例如: 
``` sh
# /tmp/crontab.****
0 0 * * * reboot
```

其中: 
- *: 表示取值范围内的每一个数字
- -: 表示连续区间，如 1-7 表示 1 到 7
- /: 表示每多少个，如 */10 表示每 10 单位做某任务
- ,: 表示取多个值，如 1,3,5 表示 1 单位 3 单位 5 单位

### ifup 和 ifdown
ifup 命令用来打开指定的网络接口，ifdown 命令用来关闭指定的网络接口。
例如: 
``` sh
sudo ifup eth0
sudo ifdown eth0
```