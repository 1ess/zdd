---
title: HCIP(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog171.jpg
date: 2020/12/18
---

本篇，我们来介绍一下静态路由以及如何在华为设备配置静态路由。

## 静态路由
***  
### 何时使用
- 路由器较少
- 唯一外连出口
- 星型拓扑

### 静态路由配置
我们使用一个例子来进行静态路由配置的讲解。
路由拓扑关系如下: 
<img src="https://cdn-fawn.vercel.app/contentImg/hcip/hcip1.svg" width="400px" alt="">

### 配置命令
``` sh
ip route-static [GATEWAY] [MASK] [NextHop]
```

例如上图拓扑结构，我们希望 R1 可以与 R3 通信，则需要配置静态路由为: 
``` sh
# R1
ip route-static 172.16.23.0 24 172.16.12.2

# R3
ip route-static 172.16.12.1 24 172.16.23.2
```

### 黑洞路由
有时我们为了避免路由环路，会使用黑洞路由来阻断。
``` sh
ip route-static 192.168.0.0 NULL0
```

### 静态浮动路由
静态路由 AD 值小的优先加表，AD 值大的不加表，作为备份。当主用链路出现故障，主用路由下一跳不可达，主路由失效，从路由表中删除，此时备用路由加表。
我们使用一个例子来进行静态浮动路由配置的讲解。
路由拓扑关系如下: 
<img src="https://cdn-fawn.vercel.app/contentImg/hcip/hcip2.svg" width="400px" alt="">

例如上图拓扑结构，我们希望 R1 可以与 R3 的 loopback0 通信，则可以直接配置静态路由为: 
``` sh
# R1
ip route-static 192.168.100.0 24 172.16.13.3
```

也可以经由 R2 跳转: 
``` sh
# R1
ip route-static 192.168.100.0 24 172.16.12.2 preference 61

# R2
ip route-static 192.168.100.0 24 172.16.23.3
```

当两条路由都配置之后，在 R1 的路由表只显示一条路由: 
``` sh
# R1
display ip routing-table

# 192.168.100.0/24  Static  60  0  RD  172.16.13.3  GigabitEthernet0/0/1
```

当我们断开 R1 的 g0/0/1 接口，经 R2 跳转的路由信息才出现在路由表中: 
``` sh
# R1
display ip routing-table

# 192.168.100.0/24  Static  61  0  RD  172.16.12.2  GigabitEthernet0/0/0
```