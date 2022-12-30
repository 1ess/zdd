---
title: Python(十二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog112.jpg
date: 2019/03/23
---

本篇开始，将会学习有关 Python 爬虫的相关知识，通过几篇的介绍，完整学习 Python 爬虫的方方面面。

在学习 Python 爬虫之前，我们首先需要下载安装 MongoDB，Redis 以及 MySQL。在学习爬虫的过程中都会使用到，之后的学习中默认已经完成相关软件的安装。

## MongoDB Redis MySQL 相关问题
***  
本人使用 Mac 开发，所以说一下 Mac 下相关软件的注意事项。

### MongoDB
#### 安装
``` shell
brew install mongodb
```

#### 使用
使用 mongo 命令进入交互模式: 
``` shell
mongo
```

#### exception in initAndListen: NonExistentPath: Data directory /data/db not found., terminating
因为未创建 /data/db 文件夹。我们可以使用: 
``` shell
mongod --dbpath ~/db
```
转换链接的路径。

### Redis
#### 安装
``` shell
brew install redis
```
我们通常会修改 /usr/local/etc/redis.conf 文件，注释 bind 127.0.0.1，解注释 requirepass，设置一个安全密码。
再使用: 
``` shell 
brew service restart redis 
```
重启 redis 服务。

#### 使用
我们可以使用: 
``` shell
redis-cli 
```
启动命令行程序。

在 redis 交互模式下再使用: 
``` shell
auth {password}
```
授权即可使用。

### MySQL
#### 安装
``` shell
brew install mysql
```

#### 使用
启动: 
``` shell
brew services start mysql
```

进入交互模式: 
``` python
mysql -uroot
```

## Python 多版本共存问题
***  
如果都配置到环境变量中，可以将其可执行文件取不同名来区别不同的 Python 和 pip。

## 爬虫
***  
爬虫就是**请求**网站并**提取**数据的**自动化**程序。

## urllib
***  
urllib 是 Python 内置的 HTTP 请求库: 
- urllib.request    请求模块
- urllib.error      异常处理模块
- urllib.parse      url 解析模块
- urllib.robotparse robot.txt 解析模块

### urllib.request 模块
#### urlopen 方法
urllib.request 最重要的方法就是 urlopen 方法: 
``` python
urllib.request.urlopen(url, data=None, [timeout, ]*, 
                        cafile=None, capath=None, 
                        cadefault=None, context=None)
```

``` python
import urllib.request
# get 请求
response = urllib.request.urlopen('http://www.baidu.com')
print(response.read().decode('utf-8'))
```

``` python
import urllib.request
import urllib.parse
# post 请求 参数格式为 application/x-www-form-urlencoded
data = bytes(urllib.parse.urlencode({'foo': 'bar'}), encoding='utf8')
response = urllib.request.urlopen('http://httpbin.org/post', data=data)
print(response.read().decode('utf-8'))
# {
#   "args": {}, 
#   "data": "", 
#   "files": {}, 
#   "form": {
#     "foo": "bar"
#   }, 
#   "headers": {
#     "Accept-Encoding": "identity", 
#     "Content-Length": "7", 
#     "Content-Type": "application/x-www-form-urlencoded", 
#     "Host": "httpbin.org", 
#     "User-Agent": "Python-urllib/3.7"
#   }, 
#   "json": null, 
#   "origin": "42.100.1.169, 42.100.1.169", 
#   "url": "https://httpbin.org/post"
# }


import json
# post 请求 参数格式为 application/json
data = bytes(json.dumps({'foo': 'bar'}), encoding='utf8')
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36',
    'Content-Type': 'application/json'
    }
req = request.Request(url='http://httpbin.org/post', data=data, headers=headers)
response = urllib.request.urlopen(req)
print(response.read().decode('utf-8'))
# {
#   "args": {}, 
#   "data": "{\"foo\": \"bar\"}", 
#   "files": {}, 
#   "form": {}, 
#   "headers": {
#     "Accept-Encoding": "identity", 
#     "Content-Length": "14", 
#     "Content-Type": "application/json", 
#     "Host": "httpbin.org", 
#     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36"
#   }, 
#   "json": {
#     "foo": "bar"
#   }, 
#   "origin": "42.100.1.169, 42.100.1.169", 
#   "url": "https://httpbin.org/post"
# }
```

``` python
import socket
import urllib.request
import urllib.error
# 设置超时时间
response = urllib.request.urlopen('http://httpbin.org/get', timeout=1)
print(response.read().decode('utf-8'))

# 超时处理
try:
    response = urllib.request.urlopen('http://httpbin.org/get', timeout=0.1)
except urllib.error.URLError as e:
    if isinstance(e.reason, socket.timeout):
        print('TIME OUT')
```

#### Request 方法
Request 方法用来处理 requestheader 等信息，构建的 request 对象可以直接传入 urlopen 方法: 
``` python
from urllib import request
from urllib import parse
# 修改 header 信息
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.108 Safari/537.36'}
data = bytes(parse.urlencode({'foo': 'bar'}), encoding='utf8')
url = 'http://httpbin.org/post'

req = request.Request(url=url, data=data, headers=headers)

response = request.urlopen(req)
print(response.read().decode('utf-8'))
```

#### response 对象
``` python
import urllib.request
response = urllib.request.urlopen('http://www.baidu.com')
print(type(response))
# <class 'http.client.HTTPResponse'>

print(response.status)
# 200
print(response.getheaders())
# [('Bdpagetype', '1'), ('Bdqid', '0xf4c906b1000200f2'), ('Cache-Control', 'private'), ('Content-Type', 'text/html'), ('Cxy_all', 'baidu+6591fe8b9beee94e197eff1c03bdb4d3'), ('Date', 'Wed, 08 May 2019 02:29:01 GMT'), ('Expires', 'Wed, 08 May 2019 02:28:50 GMT'), ('P3p', 'CP=" OTI DSP COR IVA OUR IND COM "'), ('Server', 'BWS/1.1'), ('Set-Cookie', 'BAIDUID=2E7B4EB53DFE40735CF45D5D2287D0D5:FG=1; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com'), ('Set-Cookie', 'BIDUPSID=2E7B4EB53DFE40735CF45D5D2287D0D5; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com'), ('Set-Cookie', 'PSTM=1557282541; expires=Thu, 31-Dec-37 23:55:55 GMT; max-age=2147483647; path=/; domain=.baidu.com'), ('Set-Cookie', 'delPer=0; path=/; domain=.baidu.com'), ('Set-Cookie', 'BDSVRTM=0; path=/'), ('Set-Cookie', 'BD_HOME=0; path=/'), ('Set-Cookie', 'H_PS_PSSID=28883_1469_28940_28987_28803_21088_28774_28723_28963_28835_28584_28603_22160; path=/; domain=.baidu.com'), ('Vary', 'Accept-Encoding'), ('X-Ua-Compatible', 'IE=Edge,chrome=1'), ('Connection', 'close'), ('Transfer-Encoding', 'chunked')]
print(response.getheader('Server'))
# BWS/1.1
```

#### ProxyHandler 方法
``` python
import urllib.request
# 通过 ProxyHandler 来设置使用代理服务器
# https://www.xicidaili.com/ 上找的免费代理
# 单 IP 代理
proxy_handler = urllib.request.ProxyHandler(dict(http='http://112.85.129.159:9999', https='https://162.105.89.142:1080'))

opener = urllib.request.build_opener(proxy_handler)
response = opener.open('http://httpbin.org/get')
print(response.read().decode('utf-8'))
# {
#   "args": {}, 
#   "headers": {
#     "Accept-Encoding": "identity", 
#     "Cache-Control": "max-age=259200", 
#     "Host": "httpbin.org", 
#     "User-Agent": "Python-urllib/3.7"
#   }, 
#   "origin": "112.85.129.159, 112.85.129.159", 
#   "url": "https://httpbin.org/get"
# }

# 多 IP 代理
proxy_list = [
    {"http" : "61.135.217.7:80"},
    {"http" : "111.155.116.245:8123"},
    {"http" : "122.114.31.177:808"},
]
proxy = random.choice(proxy_list)
proxy_handler = urllib.request.ProxyHandler(proxy)

opener = urllib.request.build_opener(proxy_handler)
response = opener.open('http://httpbin.org/get')
print(response.read().decode('utf-8'))
```

#### HTTPCookieProcessor 方法
``` python
cookieJar = http.cookiejar.CookieJar()
cookie_handler = urllib.request.HTTPCookieProcessor(cookieJar)
opener = urllib.request.build_opener(cookie_handler)
response = opener.open('http://www.baidu.com')

for cookie in cookieJar:
    print(cookie.name + '=' + cookie.value)

# BAIDUID=B57C5748112C13EE801F3E0DBBC7DBB1:FG=1
# BIDUPSID=B57C5748112C13EE801F3E0DBBC7DBB1
# H_PS_PSSID=1443_28776_21100_28772_28723_28964_28830_28584_28603
# PSTM=1557293120
# delPer=0
# BDSVRTM=0
# BD_HOME=0
```

### urllib.error 模块
``` python
from urllib import request, error
# HTTPError 是 URLError 的子类
# URLError 只有一个 reason 属性
# HTTPError 还有 code 和  headers 熟悉

try:
    response = request.urlopen('https://github.com/1ess/404')
except error.HTTPError as e:
    print(e.reason, e.code, e.headers, sep='\n')
    print(type(e.reason))
except error.URLError as e:
    print(e.reason)
else:
    print('SUCCESS')
# Not Found
# 404
# Content-Type: text/html
# Server: Microsoft-IIS/8.5
# X-Powered-By: ASP.NET
# Date: Wed, 08 May 2019 06:10:44 GMT
# Connection: close
# Content-Length: 1163

# <class 'str'>

try:
    response = request.urlopen('https://github.com/1ess/404', timeout=0.01)
except error.HTTPError as e:
    print(e.reason, e.code, e.headers, sep='\n')
    print(type(e.reason))
except error.URLError as e:
    print(e.reason)
    print(type(e.reason))
else:
    print('SUCCESS')

# timed out
# <class 'socket.timeout'>
```

### urllib.parse 模块
#### urlparse 方法
``` python
urllib.parse.urlparse(urlstring, scheme='', allow_fragments=True)
```

``` python
from urllib import parse

result = parse.urlparse('https://www.baidu.com/index.html?user=1ess#comment')
print(type(result))
print(result)
# <class 'urllib.parse.ParseResult'>
# ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html', params='', query='user=1ess', fragment='comment')

result = parse.urlparse('www.baidu.com/index.html?user=1ess#comment', scheme='https')
print(result)
# ParseResult(scheme='https', netloc='', path='www.baidu.com/index.html', params='', query='user=1ess', fragment='comment')

result = parse.urlparse('http://www.baidu.com/index.html?user=1ess#comment', scheme='https')
print(result)
# ParseResult(scheme='http', netloc='', path='www.baidu.com/index.html', params='', query='user=1ess', fragment='comment')

result = parse.urlparse('http://www.baidu.com/index.html?user=1ess#comment', allow_fragments=False)
print(result)
# ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html', params='', query='user=1ess#comment', fragment='')

result = parse.urlparse('http://www.baidu.com/index.html#comment', allow_fragments=False)
print(result)
# ParseResult(scheme='http', netloc='www.baidu.com', path='/index.html#comment', params='', query='', fragment='')
```

#### urlunparse 方法
``` python
from urllib import parse

data = ['http', 'www.baidu.com', 'index.html', 'user', 'id=1', 'comment']
print(parse.urlunparse(data))
# http://www.baidu.com/index.html;user?id=1#comment
```

#### urljoin 方法
``` python
from urllib import parse

print(parse.urljoin('https://github.com', '/1ess'))
# https://github.com/1ess
```

#### urlencode 方法
``` python
from urllib import parse

params = {'foo': 'bar'}
base_url = 'http://www.baidu.com?'
url = base_url + parse.urlencode(params)
print(url)
# http://www.baidu.com?foo=bar
```