---
title: Nginx(六)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog130.jpg
date: 2019/10/09
---

本篇，我们来介绍一下 nginx.conf 中的 rewrite 配置。

## 后端服务器组的配置
***  
Nginx 服务器的反向代理、负载均衡等重要功能都会涉及后端服务器组这一概念，服务器组的设置包括 4 个常用指令，我们分别介绍一下。

### upstream 指令
upstream 指令是设置后端服务器组的重要指令，其他的指令都在该指令中进行配置。
upstream 指令类似之前的 http 块、server 块等，语法结构为: 
``` nginx
upstream {name} { ... }
```

其中，name 是后端服务器组的组名，花括号中列出后端服务器组包含的服务器。
默认情况下，某个服务器组接受请求后，按照轮询策略顺序选择组内服务器处理请求，如果一个服务器在处理请求的过程中出现错误，请求会顺次交给下一个服务器进行处理。
我们也可以根据资源配置的不同，给每个服务器配置不同的权重。配置权重的变量包含在 server 指令中。

### server 指令
该指令用于设置组内的服务器，语法为: 
``` nginx
server {address} [parameters];
```

其中: 
- address 为服务器地址，可以是包含端口号的 IP 地址(IP:Port)或域名
- parameters 可以为当前服务器配置更多属性，包括: 
 - weight={number}，为服务器设置权重，默认为 1，即采用轮询处理请求
 - max_fails={number}，设置请求失败次数，在一定时间内，如请求失败次数超过设置的值，则认为 
 - fail_timeout={time}，有两个作用，一是为 max_fails 提供一定时间，二是如果该服务器无效，则在这个时间内不在检查该服务器状态，一直认为是无效的，默认是 10s
 - backup 可以将某个后端服务器标记为备用服务器，只有当正常服务器处于无效(down)或繁忙(busy)时，该服务器才用来处理请求
 - down 用来将某一服务器标记为永久的无效状态

### ip_hash 指令
该指令用于实现会话保持功能，将某个客户端的多次请求定向到同一台服务器上，保证客户端和服务器之间建立稳定的会话，语法结构为: 
``` nginx
ip_hash;
```

### least_conn 指令
该指令用于配置 Nginx 服务器使用负载均衡策略为网络连接分配服务器，语法结构为: 
``` nginx
least_conn;
```

该指令在功能上实现了最少连接负载均衡算法，在选择组内服务器时，考虑各服务器权重的同时，每次选择的都是当前网络连接最少的那台服务器。

## Rewrite
***  
Rewrite 在 Web 服务器中是必备的功能，用于实现 URL 的重写。Nginx 服务器的 Rewrite 功能的实现依赖于 PCRE，在编译安装 Nginx 服务器之前，需要编译 PCRE 库。

### Rewrite 规则
#### if 指令
该指令用来支持条件判断，根据条件判断结果选择不同的 Nginx 配置，可以在 server 块或 location 块中使用该指令，语法结构为: 
``` nginx
if (condition) { ... }
```

其中，condition 为判断条件，支持以下集中设置方法: 
- 变量名，如果变量的值为空字符串或以 0 开头的任意字符串，if 指令认为条件为 false，其他情况认为条件为 true
- 使用 = 或 != 比较变量和字符串是否相等
- 使用正则表达式对变量进行匹配，可以使用 ~ 和 ~* 连接，~ 表示匹配过程对大小写敏感，~* 表示匹配过程对大小写不敏感

``` nginx
if ($http_user_agent ~ MSIE) {
    #$http_user_agent 的值是否含有 MSIE 字符串
}
```

注意: 正则表达式字符串一般不需要加引号，除非字符串含有 } 或 ; 字符，必须给正则表达式加引号。

#### break 指令
该指令用于中断当前相同作用域中的其他 Nginx 配置。该指令可以在 server 块和 location 块以及 if 块中使用，语法为: 
``` nginx
break;
```

#### return 指令
该指令用于完成对请求的处理，直接向客户端返回响应状态码，该指令可以在 server 块和 location 块以及 if 块中使用，语法为: 
``` nginx
return {text};
return {code} {URL};
return {URL};
```

其中: 
- code 为返回给客户端的 HTTP 状态码
- text 为返回给客户端的响应体内容
- URL 为返回给客户端的 URL 地址

当返回 301、302、303 和 307 代码时，可以使用 code + URL 形式返回给客户端，当 code 为其他代码时，可以使用 text 向客户端发送响应体内容。

例如，我们经常使用的将 http 请求重定向到 https，可以使用如下指令: 
``` nginx
return 301 https://$server_name$request_uri;
```

#### rewrite 指令
该指令使用正则表达式改变 URI，可以同时存在一个或多个指令，按顺序依次对 URL 进行匹配处理。

#### set 指令
该指令用于设置一个新的变量，语法结构为: 
``` nginx
set {variable} {value};
```

其中: 
- variable 为变量名，需要使用 $ 符号作为变量的第一个字符，不能与预设的全局变量同名
- value 为变量值

## 应用
***  
### 防盗链
虽然防盗链有一定作用，但是由于存在缓存、referer 自定义等问题，并不能实现真正的防盗。

#### 根据文件类型
``` nginx
server {
    location ~* ^.+\.(gif|jpg|png|swf|zip|flv|rar)$ {
        #...
        valid_referers server_names *.0xfee1dead.cn;
        if ($invalid_referer) {
            return 403;
        }
    }
}
```

#### 根据请求目录
``` nginx
server {
    location /images/ {
        #...
        valid_referers server_names *.0xfee1dead.cn;
        if ($invalid_referer) {
            rewrite ^/ http://$server_name/forbidden.png;
        }
    }
}
```