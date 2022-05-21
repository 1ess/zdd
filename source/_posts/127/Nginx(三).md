---
title: Nginx(三)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog127.jpg
date: 2019/09/19
---

本篇，我们来介绍一下 nginx.conf 的全局块以及 events 块中的一些常见基本配置。

### 配置运行 Nginx 的用户和组
用于配置运行 Nginx 服务器的用户和组的指令为: 
``` nginx
user {user} [group];
```

只有被设置的用户或用户组才有权限启动 Nginx 进程。如果想所有用户都可以运行 Nginx 进程，有两种办法: 
- 将本行命令注释

``` nginx
# user {user} [group];
```
- 将用户和用户组设置为 nobody，这也是默认情况

``` nginx
user nobody nobody
```

user 指令只能用于全局块。

### 配置允许生成的 worker process 数
配置语法为: 
``` nginx
worker_process {number} | auto;
```

- number 为指定 Nginx 进程最大产生的 worker process 数目
- 设置为 auto，则 Nginx 进程会自动检测

在默认的配置文件中，number = 1。此指令也只能用于全局块。

### 配置 Nginx 进程 PID 存放路径
配置语法为: 
``` nginx
pid {file};
```

我们在 file 中指定存放的路径和文件名称。Nginx 默认配置文件将此文件存放在 Nginx 安装目录的 logs 文件夹下，文件名为 nginx.pid。
此指令也只能用于全局块。

### 配置错误日志存放路径
在全局块、http 块、server 块以及 location 块中都可以对 Nginx 服务器的日志进行相关配置。使用的指令都是 error_log，其语法结构为: 
``` nginx
error_log {file} [debug | info | notice | warn | error | crit | alert | emerg];
```

如果日志级别为 debug，我们需要在编译时使用 --with-debug 开启 debug 开关。并且设置某一级别，比这一级别高的日志也会被记录。
注意: 指定的文件对于运行 Nginx 进程的用户需要有读写权限。

### 配置文件的引入
在一些情况，我们可能需要将其他的 Nginx 配置引用到当前的主配置文件中。Nginx 提供了 include 指令完成配置文件的引入。
``` nginx
include {file};
```

注意: 新引入的文件要求运行 Nginx 进程的用户需要有读写权限，并且符合 Nginx 配置文件的要求。
此指令允许放在任何地方。

### 设置网络连接的序列化
惊群是指某一时刻只有一个网络连接到来，多个休眠的进程同时被唤醒，但只有一个进程可获得连接。如果每次唤醒的进程数目过多，会影响系统性能。
在 Nginx 服务器多进程模型下，会出现这样的问题。

为了解决这一问题，Nginx 服务器包含 accept_mutex 指令，当设置为开启时，会对多个 Nginx 进程接收连接进行序列化，防止进程对于连接的争抢。
``` nginx
accept_mutex on | off;
```

此指令默认为开启状态，只能在 events 块中配置。

### 设置是否允许同时接收多个网络连接
每个 Nginx 服务器的 worker process 都有能力接收多个新到达的网络连接，需要使用 multi_accept: 
``` nginx
multi_accept on | off;
```

此指令默认为关闭状态，只能在 events 块中配置。

### 事件驱动模型的选择
Nginx 提供了多种事件驱动模型来处理网络消息。我们可以使用 use 指令来指定选择哪种事件驱动模型: 
``` nginx
use {method};
```

其中，method 可以为: 
- select
- poll
- kqueue
- epoll
- rtsig
- /dev/poll
- eventport

我们可以在编译时使用 --with-select-module 和 --without-select-module 设置是否强制编译 select 模块到 Nginx 内核中。此指令只能在 events 块中配置。

### 配置最大连接数
worker_connections 主要用来设置允许每个 worker process 同时开启的最大连接数: 
``` nginx
worker_connections {number};
```

此指令默认设置为 512，只能在 events 块中配置。