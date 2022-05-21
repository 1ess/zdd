---
title: Python(十四)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog114.jpg
date: 2019/04/28
---

正则表达式(Regular Expression)是对字符串操作的一种逻辑公式。之前的章节我们已经提到过正则表达式，本篇我们就对正则表达式做一个详细的介绍。

## re.match
***  
re.match 尝试从字符串的起始位置匹配一个模式，如果匹配不成功，则返回 None。

### 最常规匹配
``` python
import re

content = 'Hello 123 4567 Regex Demo'
result = re.match(r'^Hello\s\d\d\d\s\d{4}\s\w{5}.*Demo$', content)
print(result)
# <re.Match object; span=(0, 25), match='Hello 123 4567 Regex Demo'>

print(result.group())
# 'Hello 123 4567 Regex Demo'

print(result.span())
# (0, 25)
```

### 泛匹配
``` python
import re

content = 'Hello 123 4567 Regex Demo'
result = re.match(r'^Hello.*Demo$', content)
print(result)
# <re.Match object; span=(0, 25), match='Hello 123 4567 Regex Demo'>

print(result.group())
# 'Hello 123 4567 Regex Demo'

print(result.span())
# (0, 25)
```

### 匹配目标
``` python
import re

content = 'BIT 150001'
result = re.match(r'1\d{5}', content)
print(result)
# <re.Match object; span=(4, 10), match='150001'>
 
print(result.group(0)) # group(0) 取到的是第一个匹配字符串
# '150001'

print(result.group(1)) # group(1) 取到的是第一个分组匹配的字符串，如果没有括号分组，group(0) 与 group(1) 相同
# '150001'

print(result.span())
# (4, 10)
```

### 贪婪匹配
``` python
import re

content = 'PYANBNCN'
result = re.match(r'PY.*N', content)
print(result.group()) # 贪婪匹配总是尽可能匹配多
# 'PYANBNCN'
```

### 非贪婪匹配
非贪婪匹配可用于的操作符有: 
- *?
- +?
- ??
- {m,n}?

``` python
import re

content = 'PYANBNCN'
result = re.match(r'PY.*?N', content)
print(result.group()) # 非贪婪匹配总是尽可能匹配少，? 我们可以看作是优先级的意思
# 'PYAN'
```

### 匹配模式
常见的匹配模式有: 
- re.I: 忽略大小写，即 [a-z] 也可以匹配大写字母
- re.M: 当有多行文本，^ 每一行都会进行匹配
- re.S: . 可以忽略换行符进行匹配

``` python
import re

content = """Hello 1234567 
Regex Demo
"""
result = re.match(r'He.*?(\d+).*?Demo$', content)
print(result) # . 匹配除换行之外的任意字符
# None

result = re.match(r'He.*?(\d+).*?Demo$', content, re.S)
# <re.Match object; span=(0, 24), match='Hello 1234567\nRegex Demo'>
```

### 转义
我们在使用正则表达式时，最好使用原生字符串: 
``` python
import re

content = 'price is $5.00'
result = re.match('price is $5.00', content)
print(result)
# None

result = re.match('price is \$5\.00', content)
print(result)
# <re.Match object; span=(0, 14), match='price is $5.00'>

result = re.match(r'price is $5.00', content)
print(result)
# <re.Match object; span=(0, 14), match='price is $5.00'>
```

### 常见示例
``` python
# IP 地址匹配
ip_pattern = r'(([1-9]?[0-9]|1\d{2}|2[0-4]\d|25[0-5]).){3}([1-9]?[0-9]|1\d{2}|2[0-4]\d|25[0-5])'
```

## re.search
***  
re.search 会扫描整个字符串并返回第一个成功的匹配。

``` python
import re

content = 'ABC Hello 1234567 Regex Demo DEF'
result = re.search(r'He.*?(\d+)\s.*Demo', content)
print(result)
# <re.Match object; span=(4, 28), match='Hello 1234567 Regex Demo'>
```

## re.findall
***  
re.findall 扫描整个字符串，以列表的形式返回所有匹配的子串。

``` python
html = r'''<html>
    <li>
        <a href="/1.mp3">偏偏喜欢你</a>
    </li>
    <li><a href="/2.mp3">山丘</a></li>
    <li><a href="/3.mp3">领悟</a></li>
    <li><a href="/4.mp3">BUGs</a></li>
<html>'''

results = re.findall(r'<a\shref="(.*?)">(.*?)</a>', html, re.S)
print(results)
# [('/1.mp3', '偏偏喜欢你'), ('/2.mp3', '山丘'), ('/3.mp3', '领悟'), ('/4.mp3', 'BUGs')]
for result in results:
    print(result[0], result[1])
```

## re.compile
***  
将正则字符串编译成正则表达式对象，便于复用。

``` python
import re

content = 'ABC Hello 1234567 Regex Demo DEF'

pattern = re.compile(r'Hello.*Demo', re.S)
result = re.search(pattern, content)
print(result)
# <re.Match object; span=(4, 28), match='Hello 1234567 Regex Demo'>
```