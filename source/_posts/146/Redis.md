---
title: Redis
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog146.jpg
date: 2020/05/23
---

公司内部准备搭建缓存系统，经过调研，决定使用 Redis 来构建这一系统，本篇，我们就说说 Redis 的那些事。

## Redis 是什么
***  
> Redis is an open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries and streams. Redis has built-in replication, Lua scripting, LRU eviction, transactions and different levels of on-disk persistence, and provides high availability via Redis Sentinel and automatic partitioning with Redis Cluster.

即使从未接触过 Redis，我们通过 Redis 官网上的描述也能比较清晰的得知它能为我们做什么？简单来说，Redis 是一个开源的、基于内存的数据结构存储器，可以用作数据库、缓存和消息中间件。

Redis 支持五种数据类型: 
1. String
2. Hash
3. List
4. Set
5. Sorted Set

在 Redis 中，集群解决方案有三种: 
1. 主从复制
2. 哨兵机制
3. Cluster
Redis Cluster 是 Redis 的分布式解决方案，在 3.0 版本正式推出，支持自动分片，复制和高可用性。

本篇不着眼于细节，主要关注 Redis Cluster 这一集群解决方案。

根据 Redis 群集文档，按预期工作的**最小群集**要求至少包含 3 个主节点。但是，最适合高可用性的设置应该至少有 6 个节点，其中包括三个主节点和三个从节点，每个主节点都有一个从节点。

## Docker 构建 Redis-Cluster
***  

### 网络规划
使用 3 台虚拟机，假定 ip 分别为 192.168.221.131、192.168.221.132 和 192.168.221.133。

| ip              | port |
|-----------------|------|
| 192.168.221.131 | 7001 |
| 192.168.221.131 | 7002 |
| 192.168.221.132 | 7003 |
| 192.168.221.132 | 7004 |
| 192.168.221.133 | 7005 |
| 192.168.221.133 | 7006 |

### Redis 配置文件
由于配置文件类似，可以通过脚本 redis-cluster-config.sh 批量生成配置文件。
redis-cluster.tmpl 文件如下: 
``` apache
bind 192.168.221.131 127.0.0.1
# redis 端口
port ${PORT}
# 关闭保护模式
protected-mode no
# 开启集群
cluster-enabled yes
# 集群节点配置
cluster-config-file nodes.conf
# 超时
cluster-node-timeout 5000
# 集群节点 IP host 模式为宿主机 IP
cluster-announce-ip 192.168.221.131
# 集群节点端口 7001 - 7006
cluster-announce-port ${PORT}
cluster-announce-bus-port 1${PORT}
# 开启 appendonly 备份模式
appendonly yes
# 每秒钟备份
appendfsync everysec
# 对 aof 文件进行压缩时，是否执行同步操作
no-appendfsync-on-rewrite no
# 当目前 aof 文件大小超过上一次重写时的 aof 文件大小的 100% 时会再次进行重写
auto-aof-rewrite-percentage 100
# 重写前 aof 文件的大小最小值 默认 64mb
auto-aof-rewrite-min-size 64mb
```

redis-cluster-config.sh 文件如下: 
``` sh
for port in `seq 7001 7002`; do \
  mkdir -p ./redis-cluster/${port}/conf \
  && PORT=${port} envsubst < ./redis-cluster.tmpl > ./redis-cluster/${port}/conf/redis.conf \
  && mkdir -p ./redis-cluster/${port}/data; \
done
```

### docker-compose 编排
每台机器 docker-compose.yml 文件如下: 
``` yml
version: '3.7'

services:
  redis7001:
    image: 'redis'
    container_name: redis7001
    command:
      ["redis-server", "/usr/local/etc/redis/redis.conf"]
    volumes:
      - ./redis-cluster/7001/conf/redis.conf:/usr/local/etc/redis/redis.conf
      - ./redis-cluster/7001/data:/data
    ports:
      - "7001:7001"
      - "17001:17001"
    restart: always
    network_mode: "host"
    environment:
      - TZ=Asia/Shanghai

  redis7002:
    image: 'redis'
    container_name: redis7002
    command:
      ["redis-server", "/usr/local/etc/redis/redis.conf"]
    volumes:
      - ./redis-cluster/7002/conf/redis.conf:/usr/local/etc/redis/redis.conf
      - ./redis-cluster/7002/data:/data
    ports:
      - "7002:7002"
      - "17002:17002"
    restart: always
    network_mode: "host"
    environment:
      - TZ=Asia/Shanghai
```

每台机器执行命令: 
``` sh
docker compose up -d
```

启动 docker。

### 集群配置
使用命令: 
``` sh
docker exec -it redis7001 redis-cli -p 7001 --cluster create \
 192.168.221.131:7001 192.168.221.131:7002 \
 192.168.221.132:7003 192.168.221.132:7004 \
 192.168.221.133:7005 192.168.221.133:7006 \
 --cluster-replicas 1
```

进行 redis 集群配置。

## 名词解释
***  
### 缓存雪崩
缓存在同一时间大面积失效，例如定时刷新缓存导致的同时失效，大量请求直接打到数据库，导致数据库宕机。这一现象称为缓存雪崩。
处理缓存雪崩简单，在 Redis 批量存数据的时候，把每个 Key 的失效时间都加个随机值，来保证数据不会再同一时间大面积失效。

### 缓存穿透
缓存穿透是指缓存和数据库中都没有的数据，而用户不断发起请求，导致数据库压力过大。
解决方法是接口层增加校验，或者将 null 值写入缓存，设置较短的有效期，防止暴力攻击。

### 缓存击穿
跟缓存雪崩类似，缓存雪崩是因为大面积的缓存失效，打崩数据库。而缓存击穿是指一个 Key 非常热点，在不停地扛着大量的请求，大量并发集中对这一个点进行访问，当这个 Key 在失效的瞬间，持续大量并发直接落到了数据库上，就在这个 Key 上击穿了缓存。
我们可以使用互斥锁解决缓存击穿。