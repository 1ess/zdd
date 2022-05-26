---
title: Python(十五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog115.jpg
date: 2019/05/12
---

本篇，我们来介绍一下 BeautifulSoup，使用它可以灵活又方便的进行网页解析，支持多种解析器，即使不编写正则表达式也可以进行网页信息的提取。

### 安装
``` python
pip install beautifulsoup4
```

### 解析器
#### Python 标准库
``` python
BeautifulSoup(markup, 'html.parser')
```

#### lxml HTML 解析器(推荐)
``` python
BeautifulSoup(markup, 'lxml')
```

#### lxml XML 解析器
``` python
BeautifulSoup(markup, 'xml')
```

#### html5lib
``` python
BeautifulSoup(markup, 'html5lib')
```

### 基本使用
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.prettify())
print(soup.title.string)

# <html>
#  <head>
#   <title>
#    1ess's title
#   </title>
#  </head>
#  <body>
#   <p class="title" name="1ess">
#    <b>
#     1ess's title
#    </b>
#   </p>
#   <p class="story">
#    no content
#   </p>
#   <a class="sister" href="https://github.com/1ess" id="link1">
#    A
#   </a>
#   <a class="sister" href="https://0xfee1dead.cn" id="link2">
#    B
#   </a>
#  </body>
# </html>

# 1ess's title
```

### 标签选择器
#### 选择元素
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.title)
# <title>1ess's title</title>

print(type(soup.title))
# <class 'bs4.element.Tag'>

print(soup.head)
# <head> <title>1ess's title</title> </head>

print(soup.p)
# <p class="title" name="1ess"><b>1ess's title</b></p>
```

#### 获取名称
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.title.name)
# title
```

#### 获取属性
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.p['name'])
# 1ess

print(soup.p.attrs['name'])
# 1ess
```

#### 获取内容
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.p.string)
# 1ess's title
```

#### 嵌套选择
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.head.title.string)
# 1ess's title
```

#### 子节点和父节点
``` python
html = """
<html>
    <head>
        <title>1ess's title</title>
    </head>
    <body>
        <p class="title" name="1ess"><b>1ess's title</b></p>
        <p class="story">no content</p>
        <a href="https://github.com/1ess" class="sister" id="link1">A</a>
        <a href="https://0xfee1dead.cn" class="sister" id="link2">B</a>
    </body>
</html>
"""
import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.body.contents)
# [' ', <p class="title" name="1ess"><b>1ess's title</b></p>, ' ', <p class="story">no content</p>, ' ', <a class="sister" href="https://github.com/1ess" id="link1">A</a>, ' ', <a class="sister" href="https://0xfee1dead.cn" id="link2">B</a>, ' ']

print(soup.a.parent)
# <body> <p class="title" name="1ess"><b>1ess's title</b></p> <p class="story">no content</p> <a class="sister" href="https://github.com/1ess" id="link1">A</a> <a class="sister" href="https://0xfee1dead.cn" id="link2">B</a> </body>
```

### 标准选择器
#### find_all
find_all(name, attrs, recursive, text, **kwargs) 可根据标签名，属性，内容查找文档。

##### name
``` python
html = """
<div class="panel">
    <div class="panel-heading">
        <h4>Hello</h4>
    </div>
    <div class="panel-body">
        <ul class="list" id="list-1">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
            <li class="element">Jay</li>
        </ul>
        <ul class="list list-small" id="list-2">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
        </ul>
    </div>
</div>
"""

import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.find_all('ul'))
# [<ul class="list" id="list-1"> <li class="element">Foo</li> <li class="element">Bar</li> <li class="element">Jay</li> </ul>, <ul class="list list-small" id="list-2"> <li class="element">Foo</li> <li class="element">Bar</li> </ul>]

print(type(soup.find_all('ul')[0]))
# <class 'bs4.element.Tag'>

for ul in soup.find_all('ul'):
    for li in ul.find_all('li'):
        print(li)

# <li class="element">Foo</li>
# <li class="element">Bar</li>
# <li class="element">Jay</li>
# <li class="element">Foo</li>
# <li class="element">Bar</li>
```

##### attrs
``` python
html = """
<div class="panel">
    <div class="panel-heading">
        <h4>Hello</h4>
    </div>
    <div class="panel-body">
        <ul class="list" id="list-1">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
            <li class="element">Jay</li>
        </ul>
        <ul class="list list-small" id="list-2">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
        </ul>
    </div>
</div>
"""

import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.find_all(attrs={'id': 'list-1'}))
# [<ul class="list" id="list-1"> <li class="element">Foo</li> <li class="element">Bar</li> <li class="element">Jay</li> </ul>]

print(soup.find_all(attrs={'class': 'element'}))
# [<li class="element">Foo</li>, <li class="element">Bar</li>, <li class="element">Jay</li>, <li class="element">Foo</li>, <li class="element">Bar</li>]

print(soup.find_all(id='list-1'))
# [<ul class="list" id="list-1"> <li class="element">Foo</li> <li class="element">Bar</li> <li class="element">Jay</li> </ul>]

print(soup.find_all(class_='element'))
# [<li class="element">Foo</li>, <li class="element">Bar</li>, <li class="element">Jay</li>, <li class="element">Foo</li>, <li class="element">Bar</li>]
```

##### text
``` python
html = """
<div class="panel">
    <div class="panel-heading">
        <h4>Hello</h4>
    </div>
    <div class="panel-body">
        <ul class="list" id="list-1">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
            <li class="element">Jay</li>
        </ul>
        <ul class="list list-small" id="list-2">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
        </ul>
    </div>
</div>
"""

import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.find_all(text='Foo'))
# ['Foo', 'Foo']
```

### CSS 选择器
通过 select() 直接传入 CSS 选择器即可完成选择。

``` python
html = """
<div class="panel">
    <div class="panel-heading">
        <h4>Hello</h4>
    </div>
    <div class="panel-body">
        <ul class="list" id="list-1">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
            <li class="element">Jay</li>
        </ul>
        <ul class="list list-small" id="list-2">
            <li class="element">Foo</li>
            <li class="element">Bar</li>
        </ul>
    </div>
</div>
"""

import lxml
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'lxml')
print(soup.select('.panel .panel-heading'))
# [<div class="panel-heading"> <h4>Hello</h4> </div>]

print(soup.select('ul li'))
# [<li class="element">Foo</li>, <li class="element">Bar</li>, <li class="element">Jay</li>, <li class="element">Foo</li>, <li class="element">Bar</li>]

print(soup.select('#list-2 .element'))
# [<li class="element">Foo</li>, <li class="element">Bar</li>]

for li in soup.select('ul li'):
    print(li.get_text())
# Foo
# Bar
# Jay
# Foo
# Bar
```