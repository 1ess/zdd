---
title: Dockerfile 入门
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog136.jpg
date: 2020/01/12
---

之前我们有一篇文章已经说过 Docker，本篇我们来再详细说说 Dockerfile 的用法。

Dockerfile 相当于构建 Docker 镜像的配置文件，说明了镜像如何构建。比较常见的 5 个参数为: 
- FROM
- WORKDIR
- COPY
- RUN
- CMD

我们分别来解释一下每个参数如何工作的。
## 参数
***  
### FROM
FROM 用于指定我们想要创建镜像的基础镜像。
``` dockerfile
FROM alpine:latest
```

如果版本为 latest，则可以省略基于镜像的版本。

### WORKDIR
WORKDIR 用于指定 COPY、CMD、RUN 等参数的工作目录，如果不存在则会自动创建。
``` dockerfile
WORKDIR [absolute or relative path]
```

### COPY
COPY 参数将宿主机的文件或目录拷贝到镜像的文件系统中。
``` dockerfile
COPY [source] [destination]
```

COPY 命令区别于 ADD 命令的一个用法是在 multistage 场景下。在 multistage 的用法中，可以使用 COPY 命令把前一阶段构建的产物拷贝到另一个镜像中: 
``` dockerfile
COPY --from=0 [source] [destination]
```

通过指定 --from=0 参数，把前一阶段构建的产物拷贝到了当前的镜像中。

### RUN
RUN 参数用于执行 shell 命令。
``` dockerfile
RUN echo 1ess
```

### CMD
CMD 用于镜像启动时执行的脚本。
``` dockerfile
CMD [command]
```

## 构建
***  
当我们完成 Dockerfile 的编写后，我们可以使用: 
``` sh
docker build -t [docker image name] [dockerfile path]
```

来构建镜像。

## 不常见参数
***  
### LABEL
LABEL 用于指定镜像的元数据，如维护者等信息: 
``` dockerfile
LABEL version="1.0"
LABEL description="This text illustrates \
that label-values can span multiple lines."
```

要查看镜像的标签，请使用 docker inspect 命令。

### EXPOSRE
EXPOSE 参数用于端口映射。

### VOLUMN
VOLUMN 参数用于数据卷。