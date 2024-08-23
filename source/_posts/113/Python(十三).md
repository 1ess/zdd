---
title: Python(十三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog113.jpg
date: 2019/04/03
---

上篇，我们介绍了 Python 基础 HTTP 库 urllib 的基本使用，在使用上还是比较麻烦的，本篇，我们来看一下第三方 HTTP 库 Requests 是如何简化我们的操作的。

## Requests
***  
Requests 是基于 urllib，采用 Apache2 Licensed 开源协议的 HTTP 库，他比 urllib 更加方便，节约我们大量的工作。

### 安装
``` python
pip3 install requests
```

### 请求
#### 基本 GET 请求
``` python
import requests
response = requests.get('http://httpbin.org/get')
print(response.status_code)
print(response.text)
print(type(response.text))

# 200

# {
#   "args": {}, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.21.0"
#   }, 
#   "origin": "42.100.1.169, 42.100.1.169", 
#   "url": "https://httpbin.org/get"
# }

# <class 'str'>
```

#### 带有参数 GET 请求
``` python
import requests
response = requests.get('http://httpbin.org/get?foo=bar')
print(response.text)

# {
#   "args": {
#     "foo": "bar"
#   }, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.21.0"
#   }, 
#   "origin": "42.100.1.169, 42.100.1.169", 
#   "url": "https://httpbin.org/get?foo=bar"
# }

params = {'foo': 'bar'}
response = requests.get('http://httpbin.org/get', params=params)
print(response.text)

# {
#   "args": {
#     "foo": "bar"
#   }, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.21.0"
#   }, 
#   "origin": "42.100.1.169, 42.100.1.169", 
#   "url": "https://httpbin.org/get?foo=bar"
# }
```

#### json 解析
``` python
import requests
params = {'foo': 'bar'}
response = requests.get('http://httpbin.org/get', params=params)
print(response.json())
print(type(response.json()))

# {'args': {'foo': 'bar'}, 'headers': {'Accept': '*/*', 'Accept-Encoding': 'gzip, deflate', 'Host': 'httpbin.org', 'User-Agent': 'python-requests/2.21.0'}, 'origin': '42.100.1.169, 42.100.1.169', 'url': 'https://httpbin.org/get?foo=bar'}
# <class 'dict'>
```

#### 二进制数据
``` python
import requests
response = requests.get('http://github.com/favicon.ico')
print(response.content)
print(type(response.content))

# b'\x00\x00\x01\x00\x02\x00\x10\x10\x00\x00\x01\x00 \x00(\x05\x00\x00&\x00\x00\x00...'
# <class 'bytes'>

with open('favicon.ico', 'wb') as f:
    f.write(response.content)
```

#### 添加 headers
``` python
import requests

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
    'Cookie': 'thw=cn; v=0; t=f49d7a120cef747be295966efd96e846; cookie2=53b3047ac2325fbeb90d604ab16d4e58;...'
}
response = requests.get('http://zhihu.com/explore', headers=headers)
print(response.text)
```

#### 带有参数 POST 请求
``` python
import requests

# form-data 提交数据
response = requests.post('http://httpbin.org/post', data={'foo': 'bar'})
print(response.text)

# {
#   "args": {},
#   "data": "",
#   "files": {},
#   "form": {
#     "foo": "bar"
#   },
#   "headers": {
#     "Accept": "*/*",
#     "Accept-Encoding": "gzip, deflate",
#     "Content-Length": "7",
#     "Content-Type": "application/x-www-form-urlencoded",
#     "Host": "httpbin.org",
#     "User-Agent": "python-requests/2.21.0"
#   },
#   "json": null,
#   "origin": "42.100.1.20, 42.100.1.20",
#   "url": "https://httpbin.org/post"
# }

response = requests.post('http://httpbin.org/post', data='foo')
print(response.text)

# {
#   "args": {}, 
#   "data": "foo", 
#   "files": {}, 
#   "form": {}, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Content-Length": "3", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.21.0"
#   }, 
#   "json": null, 
#   "origin": "42.100.2.79, 42.100.2.79", 
#   "url": "https://httpbin.org/post"
# }

# json 提交数据
response = requests.post('http://httpbin.org/post', json={'foo': 'bar'})
print(response.text)

# {
#   "args": {}, 
#   "data": "{\"foo\": \"bar\"}", 
#   "files": {}, 
#   "form": {}, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Content-Length": "14", 
#     "Content-Type": "application/json", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.21.0"
#   }, 
#   "json": {
#     "foo": "bar"
#   }, 
#   "origin": "42.100.3.225, 42.100.3.225", 
#   "url": "https://httpbin.org/post"
# }
```

### 响应
``` python
import requests

response = requests.get('http://www.baidu.com')
print(type(response))
# <class 'requests.models.Response'>

print(response.status_code)
# 200

print(response.text)
# <!--STATUS OK--><html> <head><me ...

print(response.content)
# b'<!DOCTYPE html>\r\n<!--STATUS OK--><html> <head><me ...

print(response.cookies)
# <RequestsCookieJar[<Cookie BDORZ=27315 for .baidu.com/>]>

print(response.headers)
# {'Cache-Control': 'private, no-cache, no-store, proxy-revalidate, no-transform', 'Connection': 'Keep-Alive', 'Content-Encoding': 'gzip', 'Content-Type': 'text/html', 'Date': 'Thu, 06 Jun 2019 02:01:14 GMT', 'Last-Modified': 'Mon, 23 Jan 2017 13:27:36 GMT', 'Pragma': 'no-cache', 'Server': 'bfe/1.0.8.18', 'Set-Cookie': 'BDORZ=27315; max-age=86400; domain=.baidu.com; path=/', 'Transfer-Encoding': 'chunked'}

print(response.encoding)
# ISO-8859-1
# 如果响应 header 中没有 charset 字段，则默认 encoding 总是 ISO-8859-1

print(response.apparent_encoding)
# utf-8
# apparent_encoding 是从内容中分析出的编码方式
```

### 状态码
``` python
import requests

response = requests.get('http://www.baidu.com')
# if not response.status_code == 200:
if not response.status_code == requests.codes.ok:
    pass
else:
    print('Successfuly')

try:
    response = requests.get('http://httpbin.org/post', timeout=10)
    response.raise_for_status() # 如果状态码不是 200，则产生异常
    response.encoding = reqponse.apparent_encoding
    print(response.text)
except:
    print('出现异常')
```

### 高级操作
#### 文件上传
``` python
import requests

url = 'http://httpbin.org/post'
files = {'icon_file': open('github.ico', 'rb')}
response = requests.post(upload_url, files=files)

print(response.text)

# {
#   "args": {}, 
#   "data": "", 
#   "files": {
#     "icon_file": "data:application/octet-stream;base64,AAABAAIAEBAAAAEAIAAoBQAAJgAAACAgAAABACAAKBQAAE4FAAAoAA....="
#   }, 
#   "form": {}, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Content-Length": "6669", 
#     "Content-Type": "multipart/form-data; boundary=fc1bc945d7c8d8b01c9fd6714bba8fe8", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.22.0"
#   }, 
#   "json": null, 
#   "origin": "198.23.188.136, 198.23.188.136", 
#   "url": "https://httpbin.org/post"
# }
```

#### 会话维持
``` python
import requests

requests.get('http://httpbin.org/cookies/set/foo/bar')
response = requests.get('http://httpbin.org/cookies')

print(response.text)

# {
#   "cookies": {}
# }

session = requests.session()
session.get('http://httpbin.org/cookies/set/foo/bar')
response = session.get('http://httpbin.org/cookies')

print(response.text)

# {
#   "cookies": {
#     "foo": "bar"
#   }
# }
```

#### 证书验证
``` python
import requests

resresponsep = requests.get('https://www.12306.cn', verify=False)
print(response.status_code)
```

#### 代理设置
``` python
import requests

proxies = {
    'http': 'http://112.85.173.34:9999'
    # 'https': 'https://222.128.9.235:59593'
}

response = requests.get('http://httpbin.org/get', proxies=proxies)
print(response.text)

# {
#   "args": {}, 
#   "headers": {
#     "Accept": "*/*", 
#     "Accept-Encoding": "gzip, deflate", 
#     "Cache-Control": "max-age=259200", 
#     "Host": "httpbin.org", 
#     "User-Agent": "python-requests/2.22.0"
#   }, 
#   "origin": "112.85.173.34, 112.85.173.34", 
#   "url": "https://httpbin.org/get"
# }
```

#### 超时设置
``` python
import requests
from requests.exceptions import ReadTimeout

try:
    response = requests.get('http://httpbin.org/get', timeout=0.1)
    print(response.status_code)
except ReadTimeout:
    print('TIME OUT')
```

#### 认证设置
``` python
import requests
from requests.auth import HTTPBasicAuth

response = requests.get('http://auth_demo.com', auth=HTTPBasicAuth('user', 123456))
# response = requests.get('http://auth_demo.com', auth=('user', 123456))
```

#### 异常处理
requests 库总共有 6 种异常: 
- requests.ConnectionError: 网络连接错误异常，如 DNS 查询失败，拒绝连接等
- requests.HTTPError: HTTP 错误异常
- requests.URLRequired: URL 缺失异常
- requests.TooManyRedirects: 超过最大重定向次数
- requests.ConnectTimeout: 连接远程服务器超时异常
- requests.Timeout: 请求 URL 超时异常

``` python
import requests
from requests.exceptions import ReadTimeout, HTTPError, RequestException

try:
    response = requests.get('http://httpbin.org/get', timeout=0.1)
    print(response.status_code)
except ReadTimeout:
    print('TIME OUT')
except HTTPError:
    print('HTTP Error')
except RequestException:
    print('Error')
```

## Robots 协议
***  
Robots 协议告知所有爬虫网站的爬取策略，要求爬虫遵守。
Robots 协议放置在网站根目录下的 robots.txt 中，如: www.zhihu.com/robots.txt，告知网站的爬取规则。

``` txt
User-agent: Googlebot
Disallow: /login
Disallow: /logout
Disallow: /resetpassword
Disallow: /terms
Disallow: /search
Disallow: /notifications
Disallow: /settings
Disallow: /inbox
Disallow: /admin_inbox
Disallow: /*?guide*

...

User-Agent: *
Disallow: /
```

**特别注意: 不遵守 Robots 协议可能存在法律风险。**