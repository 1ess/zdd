---
title: Nginx(一)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog125.jpg
date: 2019/09/10
---

Nginx 现在已经是在 Web 开发中必不可少的技能了，我们通过几篇文章，来总结一下有关 Nginx 的知识。

## 简介
***  
Nginx 是异步框架的 Web 服务器，内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。也可以用作反向代理、负载平衡器和 HTTP 缓存。
Nginx 使用异步事件驱动的方法来处理请求。Nginx 的模块化事件驱动架构可以在高负载下提供更可预测的性能。
在 Nginx 官方测试的结果中，能够支持五万个并行连接，在实际的运行中，可以支持二万至四万个并行连接。
整体采用模块化设计是 Nginx 的一个重大特点，甚至 http 服务器核心功能也是一个模块。旧版本的 Nginx 的模块是静态的，添加和删除模块都要对 Nginx 进行重新编译，1.9.11 以及更新的版本已经支持动态模块加载。

### 应用场景
1. 静态资源服务
2. 反向代理服务
3. API 服务

### 安装  
Nginx 安装与其他软件相同: 
``` sh
# 我们可以使用 --help 查看帮助
./configure --help | less

# 配置
./configure --prefix=/usr/local/nginx

# 编译
make

# 安装
make install
```

### 组成
1. 二进制可执行文件: 由各模块源码编译出的一个文件
2. nginx.conf: nginx 的配置文件
3. access.log: 记录每一条 http 请求信息
4. error.log: 错误日志

## Nginx 命令
### 启动
执行命令: 
``` sh
# -c 制定配置文件
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf 
```

启动之后可以使用 ps 命令查看进程，我们会发现有两个进程: master 和 worker 进程。

### 热更新
``` sh
/usr/local/nginx/sbin/nginx -s reload
# 或者
kill HUP [master 进程 id]
```

使用该命令可以在不停止服务的情况重新加载 nginx.conf 配置。

### 热部署
``` sh
# 将更新版本 nginx 编译好的二进制文件复制到 /usr/local/nginx/sbin/ 下，覆盖原版本，我们可以先重名了之前版本的 nginx
mv nginx nginx.old

cp /nginx-1.xx.xx/objs/nginx /usr/local/nginx/sbin/nginx

# 重新启动 nginx 的 master 进程，旧 master 进程不再监听原端口，新的连接只会进入新的 worker 进程
kill USR2 [旧 master 进程 id]

# 优雅关闭所有旧的 worker 进程
kill WINCH [旧 master 进程 id]

# 旧的 master 进程现在仍没有关闭，使得我们可以回退
```

### 日志切割
我们可以将日志备份，然后重新生成日志: 
``` sh
# 备份日志
cp access1.log bak.log

# 重新生成日志
/usr/local/nginx/sbin/nginx -s reopen

# 或者使用 kill USR1 重新生成日志
kill USR1 [master 进程 id]
```

一般的，我们可以写一个定时任务，定时备份我们的日志文件。

### 关闭
``` sh
kill QUIT [master 进程 id]
# 或者
kill INT [master 进程 id]
# 或者
kill -9 [master 进程 id]
```

我们一般使用 QUIT 和 INT 信号来平缓停止和快速停止 Nginx 服务，而不是用 -9 来停止服务。

进程 id 可以使用 ps 查看，也可以查看 /usr/local/nginx/log/nginx.pid 文件，文件内容就是 master 进程的 pid。

### 配置检查
``` sh
# -t 进行配置检查
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf -t

# nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
# nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

### 显示 Nginx 版本
``` sh
# -v: 显示 nginx 版本
# -V: 显示 nginx 版本，编译器版本和配置文件以及插件信息
usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf -v 
```

### Nginx 服务可接收信号
| 信号  | 作用                                                             |
|-------|----------------------------------------------------------------|
| INT   | 快速停止 Nginx 服务                                              |
| QUIT  | 平缓停止 Nginx 服务                                              |
| USR1  | 重新打开日志文件                                                 |
| USR2  | 使用新版本的 Nginx 文件启动服务，之后停止原有 Nginx 进程，平滑升级 |
| WINCH | 平缓停止原有工作进程，与 USR2 配合使用                            |
| HUP   | 使用新的配置文件启动服务，之后平缓停止原有进程，平滑重启           |