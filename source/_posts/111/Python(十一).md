---
title: Python(十一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog111.jpg
date: 2019/03/21
---

字符串是编程时涉及到的最多的一种数据结构，对字符串进行操作的需求几乎无处不在。正则表达式是一种用来匹配字符串的强有力的武器。

## 基本
***  
在正则表达式中，如果直接给出字符，就是精确匹配。用 \d 可以匹配一个数字，\w 可以匹配一个字母或数字。例如: 
- '00\d' 可以匹配 '001'，但是不能匹配 '00A'
- '\d\d\d' 可以匹配 '123'
- '\w\w\d' 可以匹配 'py3'

. 可以匹配任意字符: 
- 'py.' 可以匹配 'py3'，也可以匹配 'py2' 或者 'pyx' 等等

要匹配变长的字符，在正则表达式中，用 * 表示任意个字符(包括 0 个)，用 + 表示至少一个字符，用 ? 表示 0 个或 1 个字符，用 {n} 表示 n 个字符，用 {n,m} 表示 n-m 个字符，来看一个复杂例子: '\d{3}\s+\d{3,8}'
- '\d{3}' 表示匹配三个数字，如: '001'
- '\s+' \s 表示匹配空格，那么 '\s+' 就表示至少匹配一个空格，如: ' '
- '\d{3,8}' 表示匹配 3 到 8 个数字，如: '123456'

一些特殊字符如: - _ 等需要转义使用。

## 进阶
***  
要做更精确地匹配，可以用 [] 表示范围。
- [0-9a-zA-Z\_] 可以匹配一个数字或字母或下划线
- [0-9a-zA-Z\_]+ 可以匹配至少由一个数字字母或下划线组成的字符串
- [a-zA-Z\_][0-9a-zA-Z\_]* 可以匹配由字母或下划线开头，后跟任意个数字字母或下划线组成的字符串
- [a-zA-Z\_][0-9a-zA-Z\_]{0,19} 可以匹配 1 到 20 个由字母或下划线开头，后跟数字字母或下划线组成的字符串

A|a 表示匹配字母 A 或 a
^ 表示开头，如: '^\d' 表示必须由数字开头
$ 表示结尾，如: '\d$' 表示必须由数字结尾

## re 模块
Python 提供 re 模块，包含所有正则表达式的功能。需要注意: 我们应使用 r'' 或者 r"" 来使用正则而不考虑转义的问题。

``` python
import re
re.match(r'^\d{3}\-\d{3,8}', '010-12345678')
```
match() 方法判断是否匹配，如果匹配成功，返回一个 Match 对象，否则返回 None。

### 切分字符串
用正则表达式切分字符串比用固定的字符更灵活: 
``` python
'a b   c'.split(' ')
# ['a', 'b', '', '', 'c']
```

无法识别出连续的空格，还可以使用正则进行切割: 
``` python
re.split(r'\s+', 'a b  c')
# ['a, 'b', 'c']

re.split(r'[\s\,]+', 'a, b  c')
# ['a', 'b', 'c']
```

### 分组
正则表达式还有提取子串的强大功能。用 () 表示的就是要提取的分组: 
``` python
m = re.match(r'(\d{3})\-(\d{3,8})', '010-1234')
m.group(0)
# group(0) 永远是原始字符串
# 010-1234

m.group(1)
# 010

m.group(2)
# 1234
```