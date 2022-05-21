---
title: Synchronous and Asynchronous Blocking and Non-Blocking
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog205.jpg
date: 2022-02-12
---

## 概念解释
***  
在软件开发中，这两对概念是非常容易搞混的。我们再此给其做一个明确的解释，用以区分: 
1. Synchronous and Asynchronous: **同步和异步是指请求方是主动地发起消息获取结果还是被动地等待通知**
2. Blocking and Non-Blocking: **阻塞和非阻塞是指系统调用之后是立即返回，还是处于等待状态**

## IO 模型
***  
下面是五种 Linux 中 Socket IO 模型:
![](https://cdn.0xfee1dead.cn/contentImg/io/fig1-1.gif)

其中: 
1. Blocking IO 全阶段是同步阻塞 IO
2. Non-Blocking IO 第一阶段是同步非阻塞 IO，第二阶段是同步阻塞 IO
3. IO 多路复用第一阶段是异步阻塞 IO，第二阶段是同步阻塞 IO
4. 信号驱动 IO 第一阶段是异步非阻塞 IO，第二阶段为同步阻塞 IO
5. 异步 IO 全阶段为异步非阻塞 IO