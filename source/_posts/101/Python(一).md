---
title: Python(一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog101.jpg
date: 2019/02/02
---

从本篇开始，我们将要学习关于 Python 的基础知识以及高阶知识，尽量涉及到有关 Python 的方方面面。

### 格式
与其他语言有很大区别，Python 是使用缩进来组织代码块，我们应遵守约定俗成的习惯，使用四个空格来缩进。这是来自 Python 语言官方的建议。好的编辑器会自动为你完成这一工作。

请确保你在缩进中使用数量一致的空格，否则你的程序将不会运行，或引发不期望的行为。错误的缩进可能会导致错误，我们不能任意开始一个新的语句块。

缩进的好处是强迫你写出缩进较少的代码，你会倾向于把一段很长的代码拆分成若干函数，从而得到缩进较少的代码。

每一行都是一个语句，当语句以冒号 : 结尾时，缩进的语句视为代码块。

与之前我们说过的语言一样，Python 程序是大小写敏感的。

### 注释 
> Code Tells You How, Comments Tell You Why

Python 使用 # 符号作为注释开始符。注释是给人看的，可以是任意内容，解释器会忽略掉注释。

``` python
print('hello world') # 打印 hello world
# 或者
# 打印 hello world
print('hello world')
```

通常我们总会在 py 文件的开头写上如下注释: 
``` python
# !/usr/bin/env python3
# _*_ coding: utf-8 _*_
```
第一行注释是为了告诉 Linux/macOS 系统，这是一个 Python 可执行程序，Windows 系统会忽略这个注释。
第二行注释是为了告诉 Python 解释器，按照 UTF-8 编码读取源代码，否则，你在源代码中写的中文输出可能会有乱码。

### 数字
数字主要分为两种类型 —— 整数(Integers)与浮点数(Floats)。
需要注意的是: Python 中没有单独的 long 类型，int 类型可以指任何大小的整数。

#### 整数
在程序中整数的表示方法和数学上的写法一样，如: 1，-100 等。
也可以使用十六进制或八进制来表示整数: 十六进制使用 0x 作为前缀，如: 0xfee1dead。八进制使用 0o 作为前缀，如: 0o11。二进制使用 0b 作为前缀，如: 0b1010。

我们使用 hex() 函数将整数转为十六进制字符串: 
``` python
hex(10)
# '0xa'
```

使用 oct() 函数将整数转为八进制字符串: 
``` python
oct(10)
# '0o12'
```

使用 bin() 函数将整数转为二进制字符串: 
``` python
bin(10)
# '0b1010'
```

#### 浮点数
浮点数也就是小数。浮点数可以用数学写法，如 1.23，3.14 等。也可以使用科学计数法表示，把 10 用 e 替代，如: 1.23e9。

#### 数字常用函数
##### abs() 函数
abs() 函数取数字绝对值: 
``` python
print(abs(-5.5))
# 5.5
```

##### pow() 函数
pow() 函数取次方操作: 
``` python
print(pow(3, 2))
# 9
```

##### sqrt() 函数
sqrt() 函数取平方根操作: 
``` python
print(sqrt(36))
# 6.0
```

##### round() 函数
round() 函数执行五舍六入操作: 
``` python
print(round(4.5))
# 4

print(round(4.6))
# 5
```

##### floor() 函数
floor() 地板函数执行取小于该数的最大整数: 
``` python
from math import *
print(floor(4.5))
# 4

print(floor(4.9))
# 4
```

##### ceil() 函数
ceil() 天花板函数执行取大于该数的最小整数: 
``` python
from math import *
print(ceil(4.1))
# 5

print(floor(4.9))
# 5
```

### 字符串
一串字符串(String)是字符(Characters)的序列(Sequence)。
要注意: Python 中没有单独的 char 数据类型。
可以使用单引号，双引号或三引号表示字符串。
对于单个字符的编码，Python 提供了 ord() 函数获取字符的整数表示: 
``` python
ord('a')
# 97
```

chr() 函数把编码转换为对应的字符: 
``` python
chr(66)
# B
```

str() 函数将其他类型转为字符串类型: 
``` python
age = 23
message = 'Happy ' + str(age) + 'rd Birthday!'

print(message)
# Happy 23rd Birthday!
```

如果不使用 str() 函数，而直接将字符串与数字进行拼接，则会发生类型错误: TypeError。这也说明 Python 语言是强类型语言。

#### 单引号
可以使用单引号来指定字符串，如: 'hello world'。

#### 双引号
被双引号包括的字符串和被单引号括起的字符串其工作机制完全相同。如: "hello world"。

#### 三引号
你可以通过使用三个引号 —— """ 或 ''' 来指定多行字符串。你可以在三引号之间自由地使用单引号与双引号。如: 
'''这是一段多行文本。
This is the second line.
"What's your name?," I asked.
He said "Bond, James Bond."
'''

大部分时候，三引号字符串只在定义 docstring(文档注释)的时候使用。

#### 字符串是不可变的
这意味着一旦你创造了一串字符串，你就不能再改变它。

#### 格式化方法
有时候我们会想要从其他信息中构建字符串。我们会使用 format() 函数。如: 

``` python
age = 20
name = 'Swaroop'

print('{0} was {1} years old when he wrote this book'.format(name, age))
print('Why is {0} playing with that python?'.format(name))
```

我们也可以使用 + 运算符来连接字符串达到同样效果: 
``` python
name + 'is' +str(age) + 'years old'
```

但这样实现是很丑陋的，而且也容易出错。其次，转换至字符串的工作将由 format 方法自动完成，而不是如这般需要明确转换至字符串。

同时还应注意数字只是一个可选选项，所以你同样可以写成: 
``` python
age = 20
name = 'Swaroop'

print('{} was {} years old when he wrote this book'.format(name, age))
print('Why is {} playing with that python?'.format(name))
```

还有更详细的格式，如下: 
``` python
# 对于浮点数 '0.333' 保留小数点(.)后三位
print('{0:.3f}'.format(1.0/3))

# 使用下划线填充文本，并保持文字处于中间位置
# 使用 (^) 定义 '___hello___'字符串长度为 11
print('{0:_^11}'.format('hello'))

# 基于关键词输出 'Swaroop wrote A Byte of Python'  
print('{name} wrote {book}'.format(name='Swaroop', book='A Byte of Python'))
```

还可以使用格式化字符串直接插入: 
``` python
name = 'Swaroop'
print(f'name is {name}')
# 或者
print(f"name is {name}")
```

#### 转义序列
如果字符串内部既包含 ' 又包含 " 怎么办？可以用转义字符 \ 来标识: 
``` python
str = 'What\'s your name?'
```

在一个字符串中，一个放置在末尾的反斜杠表示字符串将在下一行继续，但不会添加新的一行。

``` python
str1 = "This is the first sentence. \
This is the second sentence."
# 相当于
str2 = "This is the first sentence. This is the second sentence."
```

#### 原始字符串
为了简化，Python 还允许用 r'' 或 R'' 表示 '' 内部的字符串默认不转义: 
``` python
print('\\\t\\')
# \       \
print(r'\\\t\\')
# \\\t\\
```

注意: 在处理正则表达式时应全程使用原始字符串。否则，将会有大量 Backwhacking 需要处理。

### 布尔值
布尔值和布尔代数的表示完全一致，一个布尔值只有 True、False 两种值(请注意大小写)，布尔值可以用 and(与运算)、or(或运算)和 not(非运算)运算: 

``` python
True and True
# True
True or False
# True
not True
# False
```

布尔值经常用在条件判断中，比如: 

``` python
if age >= 18:
    print('adult')
else:
    print('teenager')
```

### bytes
一个字符对应若干个字节。如果要在网络上传输，或者保存到磁盘上，就需要把 str 变为以字节为单位的 bytes。
Python 对 bytes 类型的数据用带 b 前缀的单引号或双引号表示: 
``` python
x = b'ABC'
```

str 的 encode() 方法可以编码为指定的 bytes: 
``` python
'中文'.encode('utf-8')
# b'\xe4\xb8\xad\xe6\x96\x87'
```

反过来，如果我们从网络或磁盘上读取了字节流，那么读到的数据就是 bytes。要把 bytes 变为 str，就需要用 decode() 方法: 
``` python
b'\xe4\xb8\xad\xe6\x96\x87'.decode('utf-8')
# '中文'
```

如果 bytes 中只有一小部分无效的字节，可以传入 errors='ignore' 忽略错误的字节，否则会出现 UnicodeDecodeError: 
``` python
b'\xe4\xb8\xad\xff'.decode('utf-8', errors='ignore')
# '中'
```

len() 函数计算的是 str 的字符数，如果换成 bytes，len() 函数就计算字节数: 
``` python
len('ABC')
# 3
len('中文')
# 2

len(b'ABC')
# 3
len('中文'.encode('utf-8'))
# 6
```

### 空值
与其他语言一样，Python 里也有空值，用 None 表示。

### 枚举
enum 是 Python 3.4 引入的专门用于表示枚举类型的内置模块。
``` python
from enum import Enum 
# 在定义枚举类型时，如果同时继承一些基础类型，比如 int、str
# 枚举类型就能同时充当该基础类型使用。
# 比如在这里，UserType 就可以当作 int 使用 
class UserType(int, Enum): 
    # VIP 用户 
    VIP = 3 
    # 小黑屋用户 
    BANNED = 13
```

### 变量
变量在程序中就是用一个变量名表示了，变量名必须是大小写英文、数字和 _ 的组合，且不能用数字开头。

#### 交换变量
可以在一行语句里同时操作多个变量，比如调换两个变量所指向的值: 
``` python
foo, bar = "foo", "bar"
foo, bar = bar, foo
foo
# bar
```

#### 变量解包
变量解包(unpacking)是 Python 里的一种特殊赋值操作，允许我们把一个可迭代对象的所有成员，一次性赋值给多个变量: 
``` python
username = ["Stephen", "Chang"]
first, last = username
first
# Stephen
```

假如在赋值语句左侧添加小括号(...)，甚至可以一次展开多层嵌套数据: 
``` python
attrs = [1, ["foo", 22]]
user_id, (name, age) = attrs
age
# 22
```

除了上述普通解包外，Python 还支持贪婪解包，只要用星号表达式作为变量名，它便会贪婪地捕获多个值对象，并将捕获到的内容作为列表赋值给: 
``` python
data = ["stephen", "apple", "orange", 20]
name, *fruits, age = data
age
# 20
fruits
# ["apple", "orange"]
```

和常规的切片赋值语句比起来，动态解包语法要直观许多: 
``` python
# 贪婪解包
name, *fruits, age = data

# 切片赋值
name, *fruits, age = data[0], data[1:-1], data[-1]
```

#### 单下划线变量名_
单下划线_是比较特殊的一个。它常作为一个无意义的占位符出现在赋值语句中。
``` python
# 忽略展开的第二个变量
name, _ = data
```

#### 类型注解
在 Python 3.5 版本以后，可以用类型注解功能来直接注明变量类型。
``` python
from typing import List

def remove_invalid(items: List[int]):
    pass
```

#### 命名规范
- 对于普通变量，使用蛇形命名法，比如 max_value
- 对于常量，采用全大写字母，使用下划线连接，比如 MAX_VALUE
- 如果变量标记为“仅内部使用”，为其增加下划线前缀，比如 \_local_var
- 当名字与 Python 关键字冲突时，在变量末尾追加下划线，比如 class_
- 类名应该使用驼峰风格 FooClass
- 函数应该使用蛇形风格 bar_function