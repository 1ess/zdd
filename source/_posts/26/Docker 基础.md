---
title: Docker 基础
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog26.jpg
date: 2018/07/19
---

之前讲了很多前端基础知识，这一篇换个口味，讲讲 Docker。然后再继续讲 JavaScript。
> Docker 是一个开放源代码软件项目，让应用程序布署在软件容器下的工作可以自动化进行，借此在 Linux 操作系统上，提供一个额外的软件抽象层，以及操作系统层虚拟化的自动管理机制。Docker 利用 Linux 核心中的资源分脱机制，例如 cgroups，以及 Linux 核心名字空间(name space)，来创建独立的软件容器(containers)。这可以在单一 Linux 实体下运作，避免启动一个虚拟机造成的额外负担。Linux 核心对名字空间的支持完全隔离了工作环境中应用程序的视野，包括进程树、网络、用户 ID 与挂载文件系统，而核心的 cgroup 提供资源隔离，包括 CPU、存储器、block I/O 与网络。从 0.9 版本起，Docker 在使用抽象虚拟是经由 libvirt 的 LXC 与 systemd - nspawn 提供界面的基础上，开始包括 libcontainer 库做为以自己的方式开始直接使用由 Linux 核心提供的虚拟化的设施。

软件开发最大的麻烦事之一，就是环境配置。 程序在本地开发后要放到线上，由于各种原因本地开发的机器可能要替换等等。那么开发环境一但改变，就要重新为程序安装各种服务与扩展。很多人想到，能不能从根本上解决问题，软件可以带环境安装？也就是说，安装的时候，把原始环境一模一样地复制过来。有两种解决方案: 
- 虚拟机
- Linux 容器

最早我是 iOS 开发出身，使用 windows 平台安装 vmware 虚拟机进行开发，从中看出很多虚拟机的缺点: 
- 资源占用多
- 启动慢

由于虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术: Linux 容器(Linux Containers，缩写为 LXC)。Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。对于容器里面的进程来说，它接触到的各种资源都是虚拟的，从而实现与底层系统的隔离。由于容器是进程级别的，就没有虚拟机的那些缺点了。
![](https://cdn-fawn.vercel.app/contentImg/docker/virtualization.png)
![](https://cdn-fawn.vercel.app/contentImg/docker/docker.png)

## Docker 概述
***  
Docker 就是 Linux 容器的一种封装，提供简易的使用接口。最初是 dotCloud 公司创始人 Solomon Hykes 在法国期间发起的一个公司内部项目，于 2013 年 3 月以 Apache2.0 授权协议开源，主要项目代码在 GitHub 上进行维护。在 2013 年底，dotCloud 公司决定改名为 Docker。Docker 最初是在 Ubuntu 12.04 上开发实现的，Red Hat 则从 RHEL 6.5 开始对 Docker 进行支持，Google 也在其 PaaS 产品中广泛应用 Docker。Docker 现已成为目前最流行的 Linux 容器解决方案。

### Docker 架构
Docker 使用客户端-服务器架构。Docker 客户端与守护进程交互，是操作容器的主要部件。Docker 客户端与守护进程可以运行在同一台机器上，你也可以通过客户端连接到远程的 Docker 守护进程。
![](https://cdn-fawn.vercel.app/contentImg/docker/arc.png)
Docker 守护进程管理 Docker 的对象，包括: 
- images(镜像)
- containers(容器)
- networks(网络)
- volumes(数据卷)

### Docker 的安装
Docker 是一个开源的商业产品，有两个版本: 社区版(Community Edition，缩写为 CE)和企业版(Enterprise Edition，缩写为 EE)。个人开发者使用 CE 版即可。
Docker CE 的安装请[参考](https://docs.docker.com/install/)。
安装完成后，运行下面的命令，验证是否安装成功。
``` sh
$ docker version
# 或者
$ docker info
```

Docker 需要用户具有 sudo 权限，为了避免每次命令都输入 sudo，可以把用户加入 docker 用户组。
``` sh
$ sudo usermod -aG docker $USER
```

### Docker 镜像
Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数(如匿名卷、环境变量、用户等)。镜像不包含任何动态数据，其内容在构建之后也不会被改变。

因为镜像包含操作系统完整的 root 文件系统，其体积往往是庞大的，因此在 Docker 设计时，就充分利用 Union FS 的技术，将其设计为分层存储的架构。

镜像构建时，会一层层构建，前一层是后一层的基础。每一层构建完就不会再发生改变，后一层上的任何改变只发生在自己这一层。

### Docker 容器
镜像(Image)和容器(Container)的关系，就像是面向对象程序设计中的"类"和"实例"一样，镜像是静态的定义，容器是镜像运行时的实体。容器可以被创建、启动、停止、删除、暂停等。

前面讲过镜像使用的是分层存储，容器也是如此。每一个容器运行时，是以镜像为基础层，在其上创建一个当前容器的存储层，我们可以称这个为容器运行时读写而准备的存储层为容器存储层。

容器存储层的生存周期和容器一样，容器消亡时，容器存储层也随之消亡。因此，任何保存于容器存储层的信息都会随容器删除而丢失。

按照 Docker 最佳实践的要求，容器不应该向其存储层内写入任何数据，容器存储层要保持无状态化。所有的文件写入操作，都应该使用数据卷(Volume)或者绑定宿主目录，在这些位置的读写会跳过容器存储层，直接对宿主(或网络存储)发生读写，其性能和稳定性更高。

数据卷的生存周期独立于容器，容器消亡，数据卷不会消亡。因此，使用数据卷，容器删除或者重新运行之后，数据都不会丢失。 

### Docker Registry
镜像构建完成后，可以很容易的在当前宿主机上运行，但是，如果需要在其它服务器上使用这个镜像，我们就需要一个集中的存储、分发镜像的服务，Docker Registry 就是这样的服务。

一个 Docker Registry 中可以包含多个仓库(Repository)，每个仓库可以包含多个标签(Tag)，每个标签对应一个镜像。

通常，一个仓库会包含同一个软件不同版本的镜像，而标签就常用于对应该软件的各个版本。我们可以通过 <仓库名>:<标签> 的格式来指定具体是这个软件哪个版本的镜像。如果不给出标签，将以 latest 作为默认标签。

最常使用的 Registry 公开服务是官方的 Docker Hub，这也是默认的 Registry，并拥有大量的高质量的官方镜像。国内从 Docker Hub 拉取镜像有时会遇到困难，此时可以配置镜像加速器。镜像加速器对于各个系统配置方式都不同，个人请参考不同系统进行配置。

国内也有一些云服务商提供类似于 Docker Hub 的公开服务。比如腾讯云镜像仓库、网易云镜像服务、DaoCloud 镜像市场、阿里云镜像库等。

除了使用公开服务外，用户还可以在本地搭建私有 Docker Registry。

## Docker 基本操作
***  
### 镜像
#### 搜索镜像
``` sh
docker search [imagename]:[tag]
```

#### 获取镜像
``` sh
docker pull [imagename]:[tag]
```

如果不指定 tag，则默认拉取 latest。

#### 查看本地镜像
``` sh
docker image ls
# 或者
docker images
```

#### 创建本地镜像
使用 Dockerfile 文件，使用 docker build 命令进行构建: 

``` sh
docker build -t [imagename]:[tag] [Dockerfile 路径]
```
- -t <imagename> 为新镜像设置名称
- 通常在 Dockerfile 文件所在路径执行 docker build，这时可以使用 . 表示在当前目录

#### 删除镜像
``` sh
docker image rm [imagename]
```

#### 清理未使用镜像
``` sh
docker image prune -a
```

#### 迁移
``` sh
# 打包
docker save -o [镜像打包文件.tar] [imagename]

# 加载
docker load -i [镜像打包文件.tar]
```

### 容器
#### 创建并运行本地容器
``` sh
docker run -it --name ubuntu ubuntu /bin/bash
```
上面命令的说明: 
- -t: 分配一个 pseudo-TTY
- -i: --interactive 参数缩写，表示交互模式，如果没有 attach 保持 STDIN 打开状态
- ubuntu: 运行的镜像名称，如果不指定 tag，默认为 latest 标签
- /bin/bash: 容器中运行的应用

对于 web 服务，我们还经常使用 -p 参数，指定宿主端口与容器端口的映射。

如何退出这个 bash？有两种方法，两种方法的效果完全不同: 
- 直接 exit，这时候 bash 程序终止，容器进入到停止状态
- 使用组合键退出，仍然保持容器运行，我们可以随时回来到这个 bash 中来，组合键是 Ctrl-p + Ctrl-q，就可以退出到我们的宿主机了

#### 查看本地容器
``` sh
docker container ls -a
```

-a 参数指明查看所有容器，不论是否正在运行，如果没有 -a 参数，则只列出正在运行的容器。

#### 停止容器
``` sh
docker container stop [containerid]
# 或者
docker container stop [containername]
```

#### 重新启动容器
``` sh
docker container start [containerid]
# 或者
docker container start [containername]
```

#### 删除容器
``` sh
docker container rm [containerid]
# 或者
docker container rm [containername]
```

#### 查看 Docker 容器或镜像的一些内部信息
``` sh
docker inspect [name] 或者 [id]
```

### exec
我们可以使用 exec 对容器执行一些操作: 
``` sh
docker exec -it --link mynginx:mynginx centos sh
```

--link 选项使得我们可以更好的进行容器间通信。上述操作是将 mynginx 映射为一个域名记录在 centos 的 /etc/hosts 文件中，在 centos 内部使用 mynginx 就可以找到 mynginx 容器对应的 ip，使得我们不必知道 mynginx 的具体 ip 就可以与之通信。

### 查看日志
``` sh
docker logs [name] 或者 [id] -f
```

-f 选型用来跟踪日志输出。

## 通过 Volumn 共享文件
***  
Volumn 是独立于容器之外的持久化存储。
之前我们启动的一个容器，使用的是容器内默认的文件系统。那么，我们该如何让这个容器使用 Host 上我们指定目录中的内容呢？
具体怎么做呢？比如容器中的 Nginx 默认的 web 根目录是 /var/www/html，最简单的，我们把这个目录映射出来就好了。
1. 在 host 中，创建一个 /tmp/web 目录，并在其中添加一个 demo.html 文件
2. 执行下面的命令启动 docker: 

``` sh
$ docker run -it -p 8080:80 -v /tmp/web:/var/www/html ubuntu:latest bash
```
3. 我们打开浏览器，访问 http://localhost:8080/demo.html 就可以看到刚才的文件了

注意: 这里，我们使用了 -v host_dir:container_dir 进行了目录映射。映射之后，在容器中，之前 /var/www/html 目录指定的内容就无法访问了。现在 /var/www/html 访问的，是 host 上的 /tmp/web 目录。

我们还可以使用 docker volume 命令，让 docker 管理我们的数据卷: 
``` sh
# 创建数据卷
$ docker volume create [volumename]

# 查看数据卷
$ docker volume list

# 使用数据卷
$ docker run -p 3306:3306 --mount source=mysql,destination=/root/mysql --restart=always -d -e MYSQL_ROOT_PASSWORD=123456 mysql
```

-d 参数表示后台运行容器，-e 参数表示传递环境变量。

## 构建你自己的 Docker 镜像
***  
按照之前的做法，如果想使用一个 Nginx 容器，每次我们都是启动一个 bash 容器，然后再手工安装 Nginx。现在，是时候做些改变了。这一节我们来看如何基于修改过的容器，定制新的 Docker 镜像。

我们首先执行 docker diff 命令: 
``` sh
$ docker diff [containerid]
```

Docker 用类似 git 的形式记录了容器中的每一个文件变化。并且，我们还可以像 git 中提交代码一样，去提交这些变化。
``` sh 
$ docker commit -a "1ess" -m "Install Nginx" 123d26dbe5df 1ess/nginx:0.1.0
```
其中: 
- -a 表示 Author，即提交者的姓名
- -m 表示 Message，即本次提交的注释
- 123d26dbe5df，这是容器 ID，它表示了我们要制作的镜像最终的状态
- 1ess/nginx:0.1.0，这是新镜像的名称以及版本号

重新执行 docker images，就能看到我们新创建的 nginx 镜像了。

### 问题
``` sh
$ docker run -it -p 8080:80 1ess/nginx:0.1.0 nginx
```

执行上面的命令，你就会发现，并不会和我们想象的一样启动 Nginx，然后进入容器内部的 sh。而是容器执行一下就退出了。这是因为当我们执行 nginx 命令的时候，会启动两类进程: 首先启动的是作为管理调度的 master process，它继续生成实际处理 HTTP 请求的 worker process。默认情况下，master process 是一个守护进程，它启动之后，就会断掉和自己的父进程之间的关联，于是 Docker 就跟踪不到了，进而容器也就会退出了。因此，解决的办法，就是让 Nginx 的 master process 不要以守护进程的方式启动，而是以普通模式启动就好了。为此，我们得修改下 Nginx 的配置文件。
- 用我们新创建的镜像，启动一个执行 Bash 的容器: 

``` sh
$ docker run -it 1ess/nginx:0.1.0 bash
```
- 修改这个容器中 Nginx 的配置文件，关掉守护进程模式: 

``` sh
$ echo "daemon off;" >> /etc/nginx/nginx.conf
```
- 执行 exit 从容器中退出

再次提交 docker 差异，生成新镜像。

## 使用 Dockerfile 自动化镜像构建
***  
除了像之前一样手工打造一个新镜像，Docker 还提供了脚本的功能，允许我们把打造镜像的过程"记录"在一个脚本里，并且自动"回放"出来。这样，无论是我们要部署一个新的环境，还是把自己的镜像分享给其他开发者，都很方便。
创建一个叫做 Dockerfile 的文件，这里要注意文件的名称和大小写。Dockerfile 是 docker 默认会使用的文件名。
在 Dockerfile 中，添加下面内容: 
``` dockerfile
FROM ubuntu:16.04 
LABEL maintainer="1ess <pipeliningzzz@gmail.com>" 
RUN apt-get update 
        && apt-get install nginx -y \ 
        && apt-get clean \ 
        && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \ 
        && echo "daemon off;" >> /etc/nginx/nginx.conf 
CMD ["nginx"]
```

在上面的文件，所有大写字母，都是 Dockerfile 中的命令。其中: 
- FROM 指的是构建新镜像的基础，也就是说，我们要基于 ubuntu:16.04 这个镜像定制自己的镜像
- LABEL 用于定义一些容器的 metadata，我们可能会在一些地方看到使用 MAINTAINER 命令设置维护者信息。不过 MAINTAINER 已经被 Docker 标记为过期了，因此，我们应该统一使用 LABEL 的这种形式
- RUN 用于设置构建新镜像的各种动作。实际上，我们一共执行了 4 个动作，分别是: 安装 Nginx、清理下载安装包、清除临时文件、关闭 Nginx 守护进程模式。但是，我们却使用了 && 把这 4 个动作写成了一个 RUN 命令，而没有使用不同的 RUN 命令分别执行这些动作。作为一个最佳实践，在构建一个新镜像时，我们应该尽可能减少 RUN 命令的使用次数，这样可以减少镜像的大小
- CMD 用于设置容器启动时默认执行的命令，显然，我们就是要启动 nginx

这样，这个简单的镜像构建脚本就完成了。
我们执行下面的命令构建镜像，并启动容器: 
``` sh
$ docker build -t 1ess/nginx:0.1.2 .
```

这里: 
- 当我们执行 docker build 的时候，docker 就会默认在当前目录中，查找一个叫做 Dockerfile 的文件名作为构建脚本。或者我们也可以通过 -f filename 的形式指定成其他文件
- -t 用于设置新镜像的名称和 tag
- . 用于设置构建镜像时的上下文环境，这个环境不一定是当前目录。在 Dockerfile 中，所有的相对路径都会基于这个上下文环境指定的目录

这样新版本的 Nginx 镜像就构建完成了。

## 发布镜像文件
首先，去 hub.docker.com 注册一个账户。然后，用下面的命令登录: 
``` sh
docker login
```

接着，就可以使用如下命令发布镜像: 
``` sh
docker push [username]/[repository]:[tag]
```

## 参考
***  
[Docker 动手实战](https://www.zybuluo.com/Yano/note/761438#docker-%E5%8A%A8%E6%89%8B%E5%AE%9E%E6%88%98)
[Docker 入门教程](http://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)