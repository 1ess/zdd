---
title: Docker Network
featured_image: https://cdn.zhangdd.tech/blogImg/Blog147.jpg
date: 2020/05/25
---

docker 的网络驱动有很多种方式，docker 官网给出的网络解决方案有 6 种，分别是：bridge、host、overlay、macvlan、none、Network plugins。每个网络都有自己的特点，应用场景各不相同，例如当有多台主机上的 docker 容器需要容器间进行跨宿主机通讯时，overlay 和 macvlan 可提供解决方案，而默认 docker 采用的是 bridge 模式，此模式下不能与其他主机上的 docker 容器通讯。本篇主要关注 docker 单机通讯方式的几种通讯模式：bridge、host、none 和 container。

### 默认网络
默认情况下，Docker 包含 3 个网络，我们使用命令: 
``` sh
docker network ls
```

来查看。

| NAME   | DRIVER | SCOPE |
|--------|--------|-------|
| bridge | bridge | local |
| host   | host   | local |
| none   | null   | local |

运行一个容器时，可以使用 –network(可简写为 --net) 参数指定在哪种网络模式下运行该容器。默认如果不加选项使用的是 bridge。

## bridge 网络
***  
### 默认 bridge
宿主机 IP 假设为 10.168.0.2，我们使用命令启动两个容器: 
``` sh
docker run --name box1 busybox
docker run --name box2 busybox
```

box1 容器其 IP 地址为 172.17.0.2，box2 容器其 IP 地址为 172.17.0.3。

#### 容器间通讯
在 box2 中执行 ping 命令测试与 box1 的连通性: 
``` sh
使用 IP
/ # ping 172.17.0.2
PING 172.17.0.2 (172.17.0.2): 56 data bytes
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.107 ms
64 bytes from 172.17.0.2: seq=1 ttl=64 time=0.116 ms
64 bytes from 172.17.0.2: seq=2 ttl=64 time=0.114 ms
64 bytes from 172.17.0.2: seq=3 ttl=64 time=0.126 ms

使用容器名称
/ # ping box1
无响应
```

使用默认网桥 docker0 的桥接模式下，使用 ip 可以互相通信，但是无法使用容器名作为通信的 host。

当我们从 box2 中 ping 172.17.0.2(容器 box1)的时候，在 box2 容器里，根据路由规则，数据包从 eth0 转发到 veth 上，该 veth 桥接在了 docker0 上，此时数据包到达了 docker0，docker0 扮演交换机角色并广播 ARP 请求寻找 172.17.0.2 的 mac 地址，而此时的 box1 的另一个 veth 设备桥接在了 docker0 上并收到该 ARP 请求，发现自己是 172.17.0.2，将其 mac 地址回复给 box2，此时的容器 box2 就可以和 box1 进行通讯了，并且在 box2 上可以查看到缓存的 172.17.0.2 的 mac 地址: 
``` sh
/ # arp -a
? (172.17.0.2) at 02:42:ac:11:00:02 [ether]  on eth0
? (172.17.0.1) at 02:42:df:95:ed:82 [ether]  on eth0
```

<img src="https://cdn.zhangdd.tech/contentImg/docker/container2container.png" width="400px" alt="">

#### 容器与外部网络通讯
了解了容器间的通讯，容器与主机间的通讯就容易理解了，如果在容器 box2 ping 与宿主机同一局域网的另一台主机 10.168.0.3，它发出去的数据包经过 docker0 网桥流向宿主机 eth0，eth0 在将数据包转发给与之相通的 10.168.0.3，于是 box2 就能和该主机节点进行通讯了。如果这个地址是公网地址，只要宿主机 eth0 能到达，容器 box2 都能与之通讯。

<img src="https://cdn.zhangdd.tech/contentImg/docker/container2Internet.png" width="400px" alt="">

#### 宿主机与容器通讯
当宿主机访问容器时，数据包从 docker0 流入到与容器对应的 veth 设备，通过容器的 eth0 到达到容器内。

<img src="https://cdn.zhangdd.tech/contentImg/docker/host2container.png" width="400px" alt="">

#### 外部访问容器
默认情况，其他外部网络(宿主机以外)无法访问到容器内的端口，通常的做法是使用 -p 选项来暴露容器端口到宿主机上，外部网络通过访问宿主机的端口从而访问到容器端口。本质上来说，该方式是使用 iptables 的 DNAT 功能，通过 iptables 规则转发实现的。

<img src="https://cdn.zhangdd.tech/contentImg/docker/internet2container.png" width="400px" alt="">

### 自定义 bridge
除了使用默认 docker0 作网桥以为还可以使用 docker network 相关命令自定义网桥: 
``` sh
docker network create 1ess-net
```

再查看 network 显示如下: 

| NAME     | DRIVER | SCOPE |
|----------|--------|-------|
| bridge   | bridge | local |
| host     | host   | local |
| none     | null   | local |
| 1ess-net | bridge | local |

使用 —network 指定使用的网络模式，再创建两个容器: 
``` sh
docker run --name box3 --network 1ess-net busybox
docker run --name box4 --network 1ess-net busybox
```

box3 容器其 IP 地址为 172.17.0.2，box4 容器其 IP 地址为 172.17.0.3。

在 box4 中执行 ping 命令测试与 box3 的连通性：
``` sh
使用 IP
/ # ping 172.21.0.2
PING 172.21.0.2 (172.21.0.2): 56 data bytes
64 bytes from 172.21.0.2: seq=0 ttl=64 time=0.203 ms
64 bytes from 172.21.0.2: seq=1 ttl=64 time=0.167 ms
64 bytes from 172.21.0.2: seq=2 ttl=64 time=0.169 ms
64 bytes from 172.21.0.2: seq=3 ttl=64 time=0.167 ms

使用容器名称
/ # ping box3
PING box3 (172.21.0.2): 56 data bytes
64 bytes from 172.21.0.2: seq=0 ttl=64 time=0.229 ms
64 bytes from 172.21.0.2: seq=1 ttl=64 time=0.170 ms
64 bytes from 172.21.0.2: seq=2 ttl=64 time=0.165 ms
64 bytes from 172.21.0.2: seq=3 ttl=64 time=0.168 ms
```

### 对比自定义 bridge 与默认 bridge
1. 自定义 bridge 提供更好的隔离性和容器间的互操作性
2. 自定义 bridge 提供容器间的自动 DNS 解析

综上，使用 bridge 网络驱动模式时，最好添加使用 —network 来指定自定义的网络。

## host 网络
***  
host 模式使用是在容器启动时候指明 --network host，此时容器共享宿主机的 Network Namespace，容器内启动的端口直接是宿主机的端口，并且容器不会创建网卡和 IP，直接使用宿主机的网卡和 IP，但是容器内的其他资源是隔离的，如文件系统、用户和用户组。这种模式的好处就是效率高，因为不需要额外的网络开销，直接使用宿主机网络。

## container 网络
***  
host 模式是容器共享宿主机的 Network Namespace，而 container 模式即共享已存在的容器的 Network Namespace，此时这两容器共同使用同一网卡、主机名、IP地址，容器间通讯可直接通过 lo 回环接口通讯，但是其他名称空间是隔离的。

## none 网络
***  
使用 --network none 选项指定其网络模式，在该模式下虽然容器有着自己的 Network Namespace，但是容器内没有网卡、IP、路由信息，只有一个 lo 回环接口。