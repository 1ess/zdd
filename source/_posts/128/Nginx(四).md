---
title: Nginx(四)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog128.jpg
date: 2019/09/22
---

本篇，我们来介绍一下 nginx.conf 的 http 块、server 块以及 location 块中的一些常见基本配置。

### 定义 MIME-Type
MIME-Type 是网络资源的媒体类型，Nginx 服务器作为 Web 服务器，必须能够识别请求的资源类型。在默认的 Nginx 配置文件中，我们可以看到 http 全局块中有以下两行配置: 
``` nginx
include mime.types;
default_type application/octet-stream;
```

第一行引用了 mime.types 文件，它定义了一个 types 结构，包含浏览器可以识别的 MIME 类型。
第二行使用 default_type 指令，配置了处理前端请求的 MIME 类型，语法为: 
``` nginx
default_type {mime-type};
```

如果不加此指令，默认为 text/plain。

### 自定义服务日志
我们在全局块介绍过 error_log 指令，我们还可以使用 access_log 记录 Nginx 服务器提供服务过程应答的请求日志。并且 Nginx 服务器还支持对服务日志的格式、大小、输出等配置，指令为: 
``` nginx
access_log {path} [format];
```

这个指令可以在 http 块、server 块和 location 块中进行设置。默认配置为: 
``` nginx
access_log logs/access.log combined;
```

format 可以通过字符串名称使用 log_format 指令定义好的格式: 
``` nginx
log_format {name} {string};
```

string 为服务日志的格式字符串，可以使用 Nginx 配置预设的一些变量获取相关内容，变量的名称使用双引号包裹，string 整体使用单引号包裹。
log_format 指令只能在 http 块进行配置。

### 配置 sendfile 传输文件
基本语法为: 
``` nginx
sendfile on | off;
```

可以开启或关闭 sendfile 方式传输，默认为 off。可以在 http 块、server 块和 location 块中进行设置。

### 配置连接超时时间
与用户建立会话连接后， Nginx 服务器可以保持这些连接一段时间，我们可以使用 keepalive_timeout 指令设置此时间: 
``` nginx
keepalive_timeout {timeout} [header_timeout];
```

timeout 是指服务器对连接的保持时间，默认为 75s，header_timeout 是在 response header 中的 Keep-Alive 字段设置超时时间: "Keep-Alive: timeout=header_timeout"。

这个指令可以在 http 块、server 块和 location 块中进行设置。

### 单连接请求数上限
指令 keepalive-requests 用于限制用户通过某一连接向 Nginx 服务器发送请求的次数: 
``` nginx
keepalive-requests {number};
```

这个指令可以在 http 块、server 块和 location 块中进行设置。默认值为 100。

### 配置网络监听
配置监听使用 listen 指令，配置方法常用有两种: 
- 监听 IP 地址
- 监听端口

#### 监听 IP 地址
语法为: 
``` nginx
listen {address}[:port] [default_server] [ssl]
```

address 指 IP 地址，如果是 IPv6 地址，需要使用 [] 括起来，如: [fe80::1]。
default_server 可以将此虚拟主机设置为默认主机。

#### 监听端口
语法为: 
``` nginx
listen {port} [default_server] [ssl]
```

### 基于名称的虚拟主机
配置主机名的指令为 server_name，语法为: 
``` nginx
server_name {name} ...;
```

可以只有一个名称，也可以多个名称并列，之间用空格分隔开。每个名称就是一个域名，在 name 中可以使用通配符，但只能用在三段字符串的首段或尾段，或两段字符串的尾段。如: 
``` nginx
server_name *.0xfee1dead.cn www.0xfee1dead.*;
```

在 name 中还可以使用正则表达式，使用 ~ 作为正则字符串的开始标记。

在包含多个虚拟主机的配置文件中，可能出现一个名称被多个虚拟主机的 server_name 匹配成功，Nginx 做出如下规定: 
- 对于匹配方式的不同，按照以下优先级选择虚拟主机
 1. 精准匹配
 2. 通配符在起始位置匹配 server_name 成功
 3. 通配符在结束位置匹配 server_name 成功
 4. 正则匹配 server_name 成功
- 以上四种匹配，如果被同一级多次匹配成功，则被首次匹配成功的虚拟主机处理

### 基于 IP 的虚拟主机
为 Nginx 服务器提供的每台虚拟主机配置不同 IP，需要将网卡设置为同时监听多个 IP 地址。在 Linux 系统中可以使用 ifconfig 为同一网卡添加多个 IP 别名。

### 配置 location 块
在 Nginx 官方文档中定义的 location 语法结构为: 
``` nginx
location [ = | ~ | ~* | ^~ ] uri 
{
    ...
}
```

其中 uri 是待匹配的请求字符串，可以是不含有正则的字符串，如: /myserver.php，也可以含有正则字符串，如: \.php$。为了描述方便，不含正则称为标准 uri，含有正则称为正则 uri。

如果 uri 前没有可选符号，那么匹配规则为: 
- 首先在 server 块的多个 location 块中搜索是否有标准 uri 和请求字符串匹配，如果有多个可以匹配，就记录匹配度最高的一个
- 然后，再用 location 块中的正则 uri 和请求字符串匹配，当第一个正则 uri 匹配成功，结束搜索，使用该 location 块进行处理
- 如果所有的正则匹配全部失败，就使用刚才记录的匹配度最高的 location 块进行处理

知道了如上的匹配规则，我们在说一下可选符号的含义: 
- = 用于标准 uri 之前，要求请求字符串与 uri 严格匹配。如果匹配成功，就停止搜索，使用该 location 块进行处理
- ~ 用于正则 uri，区分大小写
- ~* 用于正则 uri，不区分大小写
- ^~ 用于标准 uri，要求 Nginx 服务器找到标识和请求字符串匹配度最高的 location 后，立即使用此 location 处理请求，而不再使用 location 块中的正则 uri 做匹配

### 配置请求的根目录
指令 root 用来配置服务端指定目录寻找请求资源，语法为: 
``` nginx
root {path};
```

此指令通常配置在 location 块中。

### 设置网站的默认首页
指令 index 可以设置网站的默认首页，他一般有两个作用: 
- 用户发出请求访问网站时，请求地址可以不写首页名
- 可以对一个请求，根据请求内容设置不同的首页

语法为: 
``` nginx
index {file} ...;
```

### 基于 IP 配置 Nginx 的访问权限
Nginx 配置通过两种途径支持基本访问权限的控制，一种由 HTTP 标准模块 ngx_http_access_module 提供，通过 IP 来判断客户端是否拥有对 Nginx 的访问权限，有两个指令: 
- allow
- deny

#### allow
allow 指令用于设置可访问 Nginx 的客户端 IP。语法为: 
``` nginx
allow {address} | {CIDR} | all;
```

address 表示客户端 IP，不能同时设置多个，我们需要重复使用 allow 指令来设置多个 IP 允许访问。

#### deny
deny 的作用与 allow 正好相反，用于设置禁止访问 Nginx 的客户端 IP。语法为: 
``` nginx
deny {address} | {CIDR} | all;
```

### 基于密码配置 Nginx 的访问权限
Nginx 还支持基于 HTTP Basic Authentication 的认证。由 HTTP 标准模块 ngx_http_auth_basic_module 提供，有两个指令: 
- auth_basic
- auth_basic_user_file

#### auth_basic
auth_basic 指令用于开启或关闭认证功能，语法为: 
``` nginx
auth_basic {string} | off;
```

string 代表开启认证功能，值为验证信息。

#### auth_basic_user_file
auth_basic_user_file 指令用于设置包含用户名和密码信息的文件路径，语法为: 
``` nginx
auth_basic_user_file {file};
```

file 文件格式如下: 
``` nginx
name1:password1
name2:password2:comment
...
```