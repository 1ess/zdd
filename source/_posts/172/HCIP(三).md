---
title: HCIP(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog172.jpg
date: 2020/12/21
---

上篇，我们介绍了一下如何在华为路由器配置静态路由。本篇，我们介绍一下现实生活中最常用的动态路由 —— OSPF。

## 动态路由
***  
### 介绍
动态路由协议可分为两类: 
1. 距离矢量路由协议
 - RIP
 - EIGRP
 - BGP
2. 链路状态路由协议
 - OSPF
 - ISIS

### OSPF
OSPF(Open Shortest Path First，开放最短路径优先)是一种链路状态路由协议，无路由循环(全局拓扑)。是现实环境中使用最广泛的动态路由协议，基本现在所有厂家的路由器都实现了该协议。

#### AD 值
在华为设备中 OSPF 的 AD 值为 10，STATIC 的 AD 值为 60，也就是说华为设备中 OSPF 优先于 STATIC。CISCO 设备中 OSPF 的  AD 值为 110，STATIC 的 AD 值为 1，也就是说 CISCO 设备中 STATIC 优于 OSPF。

#### Metric 值
在华为设备中也称为 COST 值，计算公式为 COST = bandwidth-reference/带宽(m)，并且最小为 1。
需要注意，默认情况下的 bandwidth-reference 为 100，也就是说 100m 以上的接口，COST 值都为 1。
为了使得更高的接口具有更小的 COST 值，我们可以修改 bandwidth-reference: 
``` sh
bandwidth-reference 10000
```