---
title: Docker Compose
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog148.jpg
date: 2020/05/27
---

之前几篇，我们讲过关于 Docker 的一些基础知识，包括如何运行一个容器、如何使用 Dockerfile 构建容器以及 Docker 网络相关内容。但是之前的内容都是如何操作一个容器，本篇要讲的 Docker Compose 则是如何管理一组容器使之配合使用。

## 介绍
***  
<img src="https://cdn-fawn.vercel.app/contentImg/docker/compose.png" width="300px" alt="">

之前，我们必须使用大量 docker cli 命令才能在本地运行我们的应用程序。如果要运行一个包含十几个服务的微服务应用程序工作量已经是不可想象。为了使我们对本地容器基础结构的管理更轻松、可靠，我们需要一个可以让我们描述所需的环境，然后根据我们的描述进行创建容器的工具。

Docker Compose 正是我们需要的工具，下面我们详细介绍一下如何使用他来管理我们的容器。

## 安装 Docker Compose
***  
我们按照[官方文档](https://docs.docker.com/compose/install/)进行安装。确认我们安装的 Docker Compose 的版本 => 1.18.0: 
``` sh
docker-compose -v
```

目前 Compose 文件格式有 3 个版本，分别为 1、2.x 和 3.x。目前官方推荐版本为 3.x，其支持 docker 1.13.0 及其以上的版本。

## 描述文件内容
***  
docker compose 描述文件为 yml 文件，通常命名为 docker-compose.yml，文件包含以下内容: 
``` yaml
version: '3.3'

# define services (containers) that should be running
services:
  mongo-database:
    image: mongo:3.2
    # what volumes to attach to this container
    volumes:
      - mongo-data:/data/db
    # what networks to attach this container
    networks:
     - 1ess-network

  1ess-app:
    # path to Dockerfile to build an image and start a container
    build: .
    environment:
      - DATABASE_HOST=mongo-database
    ports:
      - 9292:9292
    networks:
     - 1ess-network
    # start 1ess-app only after mongo-database service was started
    depends_on:
      - mongo-database

# define volumes to be created
volumes:
  mongo-data:
# define networks to be created
networks:
  1ess-network:
```

在上述文件中，我们定义 3 个部分来配置容器基础结构的不同组件。

docker compose 文件最重要的是 service 部分，在这一部分我们定义要运行的容器，我们要为每个服务赋予一个名字，并使用一个选项来启动该服务，通常使用 image 选项。并可以指定附加的 volumes 和 networks。

1ess-app 的服务则有一些不同，我们使用 build 选项通过 Dockerfile 自己构建容器而不是通过现有的 image。并且该服务还指定 depends_on 选项来通知 docker compose 该服务在 mongo-database 服务启动之后再启动。

该文件中的其他两个顶级部分是 volumes 和 networks。它们用于定义应创建的卷和网络，他与我们直接使用 docker cli 来创建 volume 和 network 相对应。

## 运行
***  
我们使用命令: 
``` sh
docker-compose up -d
```

来使我们声明的容器再后台启动运行。

我们还使用: 
``` sh
docker-compose down
```

来销毁所声明的全部容器。

如果不是以 docker-compose.yml 命名的声明文件，则我们需要使用 -f 参数指定我们所使用的声明文件。