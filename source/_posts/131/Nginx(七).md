---
title: Nginx(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog131.jpg
date: 2019/10/11
---

本篇，我们来介绍一下 nginx.conf 中的与反向代理以及负载均衡相关的配置。

Nginx 服务器的反向代理功能是其最常用的功能之一，在实际工作中应用广泛，涉及的指令也比较多，本篇我们对常用指令进行一下详细的说明。
如果指令没有特殊说明，原则上可以出现在 http 块、server 块或者 location 块中。我们通常是单独配置一个 server 块用来设置反向代理服务。
            
## 反向代理基本设置的基本指令
***  
### proxy_pass 指令
该指令用来设置被代理服务器的地址，可以使主机名，也可以是 IP 地址加端口号。语法结构为: 
``` nginx
proxy_pass {URL};
```

例如: 
``` nginx
proxy_pass https://0xfee1dead.cn;

proxy_pass http://localhost:8964/;
```

如果被代理的服务器是一组服务器，可以使用上一篇说过的 upstream 指令配置后端服务器组。如: 
``` nginx
upstream proxy_servers {
    server http://192.168.1.1:8081/uri/;
    server http://192.168.1.1:8082/uri/;
    server http://192.168.1.1:8083/uri/;
}

server {
    listen 80;
    server_name 0xfee1dead.cn;
    location / {
        proxy_pass proxy_servers;
    }
}
```

在这里要注意一个细节，<del>就是如果在服务器组内的服务器都指明了传输协议(http、https)，那么在 proxy_pass 中就不需要指定传输协议，如上面的示例。如果在组内的服务器没有指明传输协议，那么在 proxy_pass 中就需要指定</del>(我只在 location 的 proxy_pass 指定协议，upstream 不指定协议配置才好使!): 
``` nginx
upstream proxy_servers {
    server 192.168.1.1:8081/uri/;
    server 192.168.1.1:8082/uri/;
    server 192.168.1.1:8083/uri/;
}

server {
    listen 80;
    server_name 0xfee1dead.cn;
    location / {
        proxy_pass http://proxy_servers;
    }
}
```

并且，在使用该指令的过程中还需要特别注意，根据 proxy_pass 指令中的 URL 中是否包含 URI，Nginx 服务器的处理是不同的: 
- 如果不包含 URI，Nginx 服务器不会改变原地址的 URL
- 如果包含 URI，Nginx 服务器会使用新的 URI 替代原来的 URI

下面我们看一个示例: 
``` nginx
server {
    listen 80;
    server_name 0xfee1dead.cn;
    location /server/ {
        proxy_pass http://192.168.1.1
    }
}
```

由于 proxy_pass 中的 URL 没有 URI，所以当客户端访问 0xfee1dead.cn/server 时，代理地址为 http://192.168.1.1/server。
``` nginx
server {
    listen 80;
    server_name 0xfee1dead.cn;
    location /server/ {
        proxy_pass http://192.168.1.1/proxy_server
    }
}
```

由于 proxy_pass 中的 URL 有 URI，所以当客户端访问 0xfee1dead.cn/server 时，代理地址为 http://192.168.1.1/proxy_server。

也就是说，使用 proxy_pass 时，如果不想改变原地址的 URL，就不要在 proxy_pass 的 URL 中配置 URI。

### proxy_hide_header 指令
该指令用于设置 Nginx 服务器在返回 HTTP 响应时，隐藏一些头信息，语法结构为: 
``` nginx
proxy_hide_header {field};
```

该指令可以在 http 块、server 块或 location 块中配置。

### proxy_pass_header 指令
默认情况下，Nginx 服务器在返回响应报文时，头部不包含 Date、Server、X-Accel 等来自被代理服务器的头信息，该指令可以设置这些头信息被发送，语法结构为: 
``` nginx
proxy_pass_header {field};
```

该指令可以在 http 块、server 块或 location 块中配置。

### proxy_pass_request_body 指令
该指令用于配置是否将客户端请求的请求体发送给代理服务器，语法结构为: 
``` nginx
proxy_pass_reqeust_body on | off;
```

默认设置为 on，该指令可以在 http 块、server 块或 location 块中配置。

### proxy_pass_request_headers 指令
该指令用于配置是否将客户端请求的请求头发送给代理服务器，语法结构为: 
``` nginx
proxy_pass_reqeust_headers on | off;
```

默认设置为 on，该指令可以在 http 块、server 块或 location 块中配置。

### proxy_set_header 指令
该指令可以更改 Nginx 服务器接收到的客户端请求的请求头信息，然后将新的请求头发送给被代理服务器，语法结构为: 
``` nginx
proxy_set_header {field} {value};
```

通常用于保留客户端的真实信息的配置如下: 
``` nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

### proxy_set_body 指令
该指令可以更改 Nginx 服务器接收到的客户端请求的请求体信息，然后将新的请求体发送给被代理服务器，语法结构为: 
``` nginx
proxy_set_body {value};
```

value 值可以使用文本、变量或变量的组合。