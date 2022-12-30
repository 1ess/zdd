---
title: HTTP 基础
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog3.jpg
date: 2018/06/16
---

对于应用开发工程师，我们无时无刻不在接触 HTTP 协议。为了更好的完成我们的应用开发任务，对于 HTTP 的透彻理解就显得必不可少了。
这一篇就对 HTTP 协议做一个完整而透彻的讲解。  
***
HTTP 的发展是由提姆·柏内兹·李于 1989 年在欧洲核子研究组织(CERN)所发起。  
设计 HTTP 最初的目的是为了提供一种发布和接收 HTML 页面的方法。而后发展成为接受各种资源的方法。  
通过 HTTP 或者 HTTPS 协议请求的资源由统一资源标识符(Uniform Resource Identifiers，URI)来标识。  

HTTP 协议用于客户端和服务器之间的通讯。  
请求资源的一端被称为客户端，提供资源响应的一端被称为服务器端。  
应用 HTTP 协议，必定一端是客户端，一端是服务器端。并且必须是由客户端开始建立通讯，服务器端在没有接收到请求之前不会发送响应。  
并且我们要深刻理解 HTTP 协议的无状态(stateless)特性，HTTP 协议自身不对请求和响应之间的通信状态进行保存。也就是说在 HTTP 这个级别，协议对于发送过的请求或响应都不做持久化处理。但我们可以使用 Cookies 和 Session 的方式识别特定用户。

## HTTP 的版本
***  
1. HTTP/0.9: HTTP 于 1990 年问世，那时的 HTTP 并没有作为正式的标准被建立，因此被称为 HTTP/0.9
2. HTTP/1.0: HTTP 正式作为标准被公布是在 1996 年 5 月，被命名为 HTTP/1.0，记载于 RFC1945
3. HTTP/1.1: 1997 年 1 月公布的 HTTP/1.1 是目前主流的 HTTP 版本，初版为 RFC2068，修订版 RFC2616
4. HTTP/2.0: 2015 年 5 月以 RFC7540 正式发布

## URL 和 URI
***  
与 URI(统一资源标识符)相比，我们更熟悉 URL(统一资源定位符)。URL 正是访问 web 时在浏览器输入的网址。  
URI 是 Uniform Resource Identifier 的缩写，RFC2396 分别对三个单词做了定义。  
- Uniform 规定: 统一的格式可以方便处理不同类型的资源
- Resource 的定义是: 可标识的任何东西
- Identifier 表示: 可标识的对象

综上，URI 就是**由某个协议方案表示的资源的定位标识符**。

## 绝对 URI 的格式
***  
eg: http://user:password@www.example.com:80/dir/index.html?uid=1#id
其中: 
- http: 代表协议方案
- user:password: 表示登录信息
- www.example.com: 表示服务器地址，可以是域名，也可以是 ip 地址
- 80: 代表端口号
- dir/index.html: 表示相对文件路径
- ?uid=1: 表示查询字符串
- #id: 表示片段标识符(文档内的位置)

## 请求方法
***  
HTTP/1.1 中共定义 8 种 method 来操作指定的资源: 
1. GET: 向指定的资源发出"显示"请求。使用 GET 方法应该只用在读取资料，而不应当被用于产生"副作用"的操作中
2. POST: 向指定资源提交数据，请求服务器进行处理(例如提交表单或者上传文件)。数据被包含在请求实体中。这个请求可能会建立新的资源或修改现有资源，或二者皆有
3. PUT: 向指定资源位置上传其最新内容
4. DELETE: 请求服务器删除 Request-URI 所标识的资源
5. HEAD: 与 GET 方法一样，都是向服务器发出指定资源的请求。只不过服务器将不传回资源的本文部份。它的好处在于，使用这个方法可以在不必传输全部内容的情况下，就可以获取其中"关于该资源的信息"(元信息或称元资料)
6. TRACE: 回显服务器收到的请求，主要用于测试或诊断
7. OPTIONS: 这个方法可使服务器传回该资源所支持的所有 HTTP 请求方法
8. CONNECT: HTTP/1.1 协议中预留给能够将连接改为管道方式的代理服务器

注意: 方法名称是区分大小写的。
当某个请求所针对的资源不支持对应的请求方法的时候，服务器应当返回状态码 405(Method Not Allowed)，当服务器不认识或者不支持对应的请求方法的时候，应当返回状态码 501(Not Implemented)。

## HTTP报文详解  
***  
### 报文结构
报文的结构大致分为首部字段(header field)、空行(CR+LF)、实体主体(entity body)三个部分。
请求报文首部字段可分为: 
- 请求行
- 请求首部字段
- 实体首部字段
- 通用首部字段

响应报文首部字段可分为: 
- 状态行
- 响应首部字段
- 实体首部字段
- 通用首部字段

### 请求行格式
格式为: 
请求方法  资源相对路径  HTTP 版本
eg: GET  /  HTTP/1.1

### 状态行格式
格式为: 
HTTP 版本  状态码  结果短语
eg: HTTP/1.1  200  OK 

### 常见的请求首部字段
- Accept: 可处理的媒体类型(MIME)  
- Accept-Charset: 优先字符集  
- Accept-Encoding: 优先内容压缩方式  
- Accept-Language: 优先的自然语言  
- If-Match: 比较实体标记  
- If-None-Match: 比较实体标记(与 If-Match 相反)  
- If-Modified-Since: 比较资源的更新时间  
- If-Unmodified-Since: 比较资源的更新时间(与 If-Modified-Since 相反)  
- User-Agent: 客户端程序信息  
- Host: 请求资源所在的服务器  

### 常见的响应首部字段
- ETag: 资源匹配信息  
- Location: 重定向 URI  
- Server: 服务器安装信息  

### 常见通用首部字段
- Cache-Control: 缓存行为  
- Connection: 连接管理
- Date: 报文创建日期
- Upgrade: 升级的其他协议

### 常见的实体首部字段
- Content-Encoding: 实体压缩方式
- Content-Language: 实体的自然语言
- Content-Length: 实体的大小(字节)
- Content-Type: 实体的媒体类型(MIME)
- Expires: 实体的过期时间
- Last-Modified: 资源最后修改日期

非 HTTP 首部字段如 Cookies、Set-Cookies 等也很常用。

## GET 请求和 POST 请求的区别
***  
### 对于 GET 请求
1. 参数直接放到请求 URL 中，以 key=value 的形式以 & 符号连接(即 URL 中的 query 部分)
2. 对于空格，中文等问题会被 URL 编码(如空格会被编码成 %20)  
**注意: RFC1738规定，只有字母和数字[0-9a-zA-Z]、一些特殊符号 $-_.+!*'(),[不包括双引号]、以及某些保留字，才可以不经过编码直接用于 URL。**  

### 对于 POST 请求
1. 参数会放到 entity body 中
2. 根据 content-type 决定其格式
 - 如果 content-type 为 x-www-form-urlencoded，参数格式为 key=value 的形式以 & 符号连接置于 entity body 中
 - 如果 content-type 为 application/json，参数为 json 格式置于 entity body 中
 - 如果 content-type 为 multipart/form-data，entity body 分为多个部分，每个部分以 --boundary 开始，紧接着是内容描述信息，然后是回车，最后是字段具体内容(文本或二进制)。如果传输的是文件，还要包含文件名和文件类型信息。消息主体最后以 --boundary-- 标示结束

## 具有代表性的 HTTP 状态码
***  
### 2XX(Success 成功状态码)
2XX 响应的结果标明请求被正常处理了。  
- 200 OK: 表示从客户端发来的请求在服务器端被正常处理了

### 3XX(Redirection 重定向状态码)  
3XX 响应结果表明浏览器需要执行某些特殊的处理以正确处理请求。  
- 301 Moved Permanently: 表示请求的资源已被分配了新的 URI，以后应使用资源现在所指的 URI。也就是说，如果已经把资源对应的 URI 保存为书签了，这时应该按 Location 首部字段提示的 URI 重新保存
- 302 Found: 表示请求的资源已被分配了新的 URI，希望用户**本次**能使用新的 URI 访问。 和 301 Moved Permanently 状态码相似，但 302 状态码代表的资源不是被永久移动，只是临时性质的
- 304 Not Modified: 表示客户端发送附带条件的请求时，服务器端允许请求访问资源，但未满足条件的情况。304 状态码返回时，不包含任何响应的主体部分。304 虽然被划分在 3XX 类别中，但是和重定向没有关系。(附带条件的请求是指采用 GET 方法的请求报文中包含 If-Match、If-Modified-Since、If-None-Match、If-Range、If-Unmodified-Since 中任一首部)  

### 4XX(Client Error 客户端错误状态码)
4XX 的响应结果表明客户端是发生错误的原因所在。  
- 401 Unauthorized: 表示发送的请求需要有通过 HTTP 认证(Basic 认证、Digest 认证、Bearer 认证)的认证信息。另外若之前已进行过 1 次请求，则表示用户认证失败
- 403 Forbidden: 表明对请求资源的访问被服务器拒绝了
- 404 Not Found: 表明服务器上无法找到请求的资源
- 405 Method Not Allowed: 表明客户端请求的方法虽然能被服务器识别，但是服务器禁止使用该方法
- 413 Payload Too Large: 请求实体的大小超过了服务器处理限度
- 451 Unavailable For Legal Reasons: 墙

注意区分401和403状态码: 
- 401 表示我不知道你是谁，请认证身份
- 403 表示我知道你是谁，但是你无权获取请求内容

![](https://cdn-fawn.vercel.app/contentImg/http/4xx.jpg)

### 5XX(Server Error 服务器错误状态码) 
5XX 的响应结果表明服务器本身发生错误。  
- 500 Internal Server Error: 该状态码表明服务器端在执行请求时发生了错误。也有可能是 Web 应用存在的 bug 或某些临时的故障
- 501 Not Implemented: 服务器该方法未被实现
- 502 Bad Gateway: 表明扮演网关或代理角色的服务器，从上游服务器中接收到的响应是无效的
- 503 Service Unavailable: 表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求
- 504 Gateway Timeout: 作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器(URI 标识出的服务器，例如 HTTP、FTP、LDAP)或者辅助服务器(例如 DNS)收到响应

## [CORS](http://www.ruanyifeng.com/blog/2016/04/cors.html)(Cross-Origin Resource Sharing)
***  
CORS 全称是"跨域资源共享"(Cross-origin resource sharing)。它允许浏览器向跨源服务器，发出 XMLHttpRequest 请求，从而克服了 AJAX 只能同源使用的限制。实现 CORS 通信的关键是服务器。只要服务器实现了 CORS 接口，就可以跨源通信。
**注意: 同源必须是协议，域名以及端口同时相同。**

浏览器将 CORS 请求分成两类: 简单请求(simple request)和非简单请求(not-so-simple request)。  
只要同时满足以下两大条件，就属于简单请求。
1. 请求方法是以下三种方法之一: 
 - HEAD
 - GET
 - POST

2. HTTP 的头信息不超出以下几种字段: 
 - Accept
 - Accept-Language
 - Content-Language
 - Last-Event-ID
 - Content-Type: 只能是
  1. application/x-www-form-urlencoded
  2. multipart/form-data
  3. text/plain

凡是不同时满足上面两个条件，就属于非简单请求。浏览器对这两种请求的处理，是不一样的。  

### 简单请求
对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，增加一个 Origin 字段。 Origin 字段用来说明，本次请求来自哪个源(协议 + 域名 + 端口)。服务器根据这个值，决定是否同意这次请求。
如果 Origin 指定的源，不在许可范围内，服务器会返回一个正常的 HTTP 回应。浏览器发现，这个回应的头信息没有包含 Access-Control-Allow-Origin 字段，就知道出错了，从而抛出一个错误，被 XMLHttpRequest 的 onerror 回调函数捕获。注意，这种错误无法通过状态码识别，因为 HTTP 回应的状态码有可能是 200。
如果 Origin 指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。
- Access-Control-Allow-Origin  
- Access-Control-Allow-Credentials  
- Access-Control-Expose-Headers

### 非简单请求
#### 预检请求
非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 PUT 或 DELETE，或者 Content-Type 字段的类型是 application/json。  
**非简单请求的 CORS 请求，会在正式通信之前，增加一次 HTTP 查询请求，称为"预检"请求(preflight)。**  
"预检"请求用的请求方法是 **OPTIONS**，表示这个请求是用来询问的。头信息里面，关键字段是 Origin，表示请求来自哪个源。
除了 Origin 字段，"预检"请求的头信息包括两个特殊字段。
- Access-Control-Request-Method  
- Access-Control-Request-Headers  

#### 预检请求的回应
服务器收到"预检"请求以后，检查了 Origin、Access-Control-Request-Method 和 Access-Control-Request-Headers 字段以后，确认允许跨源请求，就可以做出回应。
服务器回应的 CORS 相关字段如下: 
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers
- Access-Control-Allow-Credentials
- Access-Control-Max-Age  

#### 浏览器的正常请求和回应
一旦服务器通过了"预检"请求，以后每次浏览器正常的 CORS 请求，就都跟简单请求一样，会有一个 Origin 头信息字段。服务器的回应，也都会有一个 Access-Control-Allow-Origin 头信息字段。

## JSONP
***  
JSONP 是另一种解决跨域问题的方式。
我们知道页面上的 script 标记是不受跨域问题限制的。(不仅如此，我们还发现凡是拥有 src 这个属性的标签都拥有跨域的能力，比如 script、img、iframe)
使用 JSONP 的要点就是允许用户传递一个 callback 参数给服务端，然后服务端返回数据时会将这个 callback 参数作为函数名来包裹住 JSON 数据，这样客户端就可以随意定制自己的函数来自动处理返回数据了。