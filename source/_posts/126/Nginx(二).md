---
title: Nginx(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog126.jpg
date: 2019/09/17
---

本篇，我们来介绍一下 Nginx 中最重要的一个配置文件 —— nginx.conf 的基本配置。

## nginx.conf
***  
### Nginx 配置语法
1. 配置文件由指令和指令块构成
2. 每条指令以 ; 结尾，指令与参数之间以空格符分割
3. 指令块以 {} 将多条指令组织在一起
4. include 语句允许组合多个配置文件，便于维护
5. 使用 # 添加注释
6. 使用 $ 使用变量
7. 部分指令的参数支持正则表达式

注意: 我们可以拷贝 contrib/vim/* 到 ~/.vim 文件夹下，可以使 nginx.conf 文件有语法高亮。

### 时间和空间单位
#### 时间
1. ms: 毫秒
2. s: 秒
3. m: 分
4. h: 小时
5. d: 天
7. w: 周
8. M: 月
9. y: 年

#### 空间
1. 空: bytes
2. k/K: kilobytes
3. m/M: megabytes
4. g/G: gigabytes

### nginx.conf 文件结构
nginx.conf 文件的基本结构为: 
``` nginx
# 全局块
# ...

# event 块
events {

}

# http 块
http {
    # http 全局块
    # ...

    # server 块
    server {
        # server 全局块
        # ...

        # location 块
        location [PATTERN] {

        }
    }
}
```

nginx.conf 由三部分组成: 
- 全局块
- events 块
- http 块

http 块由两部分组成:
- http 全局块
- 多个 server 块

server 块由两部分组成: 
- server 全局块
- 多个 location 块

注意: 如果某个指令在两个不同层级的块中同时出现，则采用就近原则，以较低层次块中的配置为准。

## 模块
***  
### 全局块
全局块主要设置一些影响 Nginx 服务器整体运行的配置指令，通常包括: 
- 配置运行 Nginx 服务器的用户(组)
- 允许的 worker process 数
- Nginx 进程 pid 文件 nginx.pid 存放位置
- 日志文件的存放位置
- 其他配置文件的引入

### events 块
events 块主要影响 Nginx 服务器与用户之间的网络连接。通常用到的设置为: 
- 是否开启对多 worker process 下的网络连接进行序列化
- 是否允许同时接收多个网络连接
- 选取哪种事件驱动模型处理连接请求
- 每个 worker process 可以同时支持的最大连接数

### http 块
http 块是 Nginx 服务器配置中的重要部分，代理、缓存和日志定义等大多数功能和第三方模块的配置都放在这个模块中。
可以在 http 全局块中配置的指令包括: 
- 文件引入
- MIME-Type 定义
- 日志自定义
- 是否使用 sendfile 传输文件
- 连接超时时间
- 单连接请求数上限

### server 块
server 块和虚拟主机的概念有密切联系。利用虚拟主机的技术可以避免为每一个要运行的网站提供单独的 Nginx 服务器，虚拟主机技术使得 Nginx 服务器可以在同一台服务器上只运行一组 Nginx 进程，就可以运行多个网站，server 块就是完成这一功能的。

上面说过，每个 http 块可以有多个 server 块，每个 server 块就相当于一台虚拟主机。

在 server 全局块中，最常见的两个配置项是: 
- 本虚拟主机的监听配置
- 本虚拟主机的名称或 ip

### location 块
每个 server 块中允许有多个 location 块，这些 location 块主要作用是，基于 Nginx 服务器接收到的请求字符串，对除虚拟主机名或 ip 之外的字符串进行匹配，对特定的请求进行处理。许多第三方模块的配置也是在 location 块中提供功能。