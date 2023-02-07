---
title: Python(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog107.jpg
date: 2019/02/23
---

本篇，我们说说 Python 中的函数式编程的基本概念。

## 高阶函数(Higher-order function)
***  
### map()
Python 内建了 map() 函数。
map() 函数接收两个参数，一个是函数，一个是 Iterable，map 将传入的函数依次作用到序列的每个元素，并把结果作为新的 Iterator 返回。由于结果是一个 Iterator，Iterator 是惰性序列，因此我们还可以通过 list() 函数让它把整个序列都计算出来并返回一个 list。
``` python
def f(x):
    return x * x

r = map(f, [1, 2, 3, 4, 5, 6, 7, 8, 9])
list(r)
# [1, 4, 9, 16, 25, 36, 49, 64, 81]

list(map(str, [1, 2, 3, 4, 5, 6, 7, 8, 9]))
# ['1', '2', '3', '4', '5', '6', '7', '8', '9']
```

### reduce()
reduce 把一个函数作用在一个序列 [x1, x2, x3, ...] 上，这个函数必须接收两个参数，reduce 把结果继续和序列的下一个元素做累积计算，效果就是: 
``` python
reduce(f, [x1, x2, x3, x4]) = f(f(f(x1, x2), x3), x4)
```

``` python
from functools import reduce
def fn(x, y):
    return x * 10 + y

def char2num(s):
    digits = {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9}
    return digits[s]

reduce(fn, map(char2num, '13579'))
# 13579
```

### filter()
和 map() 类似，filter() 也接收一个函数和一个序列。和 map() 不同的是，filter() 把传入的函数依次作用于每个元素，然后根据返回值是 True 还是 False 决定保留还是丢弃该元素。
``` python
def not_empty(s):
    return s and s.strip()

list(filter(not_empty, ['A', '', 'B', None, 'C', '  ']))
# ['A', 'B', 'C']
```

与 map() 一样，filter() 函数返回的也是一个 Iterator，也就是一个惰性序列，所以要强迫 filter() 完成计算结果，需要用 list() 函数获得所有结果并返回 list。

### sorted()
之前我们说过，Python 内置的 sorted() 函数可以对 list 进行排序: 
``` python
sorted([36, 5, -12, 9, -21])
# [-21, -12, 5, 9, 36]
```

此外，sorted() 函数也是一个高阶函数，它还可以接收一个 key 函数来实现自定义的排序: 
``` python
sorted([36, 5, -12, 9, -21], key=abs)
# [5, 9, -12, -21, 36]
```

key 指定的函数将作用于 list 的每一个元素上，并根据 key 函数返回的结果进行排序。

## 返回函数
***  
高阶函数除了可以接受函数作为参数外，还可以把函数作为结果值返回。
``` python
def lazy_sum(*args):
    def sum():
        ax = 0
        for n in args:
            ax = ax + n
        return ax
    return sum

f = lazy_sum(1, 3, 5, 7, 9)
f()
# 25
```

在这个例子中，我们在函数 lazy_sum 中又定义了函数 sum，并且，内部函数 sum 可以引用外部函数 lazy_sum 的参数和局部变量，当 lazy_sum 返回函数 sum 时，相关参数和变量都保存在返回的函数中，这种结构被称为"闭包(Closure)"。

### 闭包
闭包需要注意的问题是，返回的函数并没有立刻执行，而是直到调用了才执行。
``` python
def count():
    fs = []
    for i in range(1, 4):
        def f():
             return i*i
        fs.append(f)
    return fs

f1, f2, f3 = count()
```

你可能认为调用 f1()，f2() 和 f3() 结果应该是 1，4，9，但实际结果是 9，9，9。
原因就在于返回的函数引用了变量 i，但它并非立刻执行。等到 3 个函数都返回时，它们所引用的变量 i 已经变成了 3，因此最终结果为 9。返回闭包时牢记一点: 返回函数不要引用任何循环变量，或者后续会发生变化的变量。
如果一定要引用循环变量怎么办？方法是再创建一个函数，用该函数的参数绑定循环变量当前的值，无论该循环变量后续如何更改，已绑定到函数参数的值不变: 
``` python
def count():
    def f(j):
        def g():
            return j*j
        return g
    fs = []
    for i in range(1, 4):
        fs.append(f(i)) # f(i)立刻被执行，因此i的当前值被传入f()
    return fs

f1, f2, f3 = count()
f1()
# 1
f2()
# 4
f3()
# 9
```

## 匿名函数
***  
当我们在传入函数时，有些时候，不需要显式地定义函数，直接传入匿名函数更方便。
以 map() 函数为例，计算 f(x)=x<sup>2</sup> 时，除了定义一个 f(x) 的函数外，还可以直接传入匿名函数: 
``` python
list(map(lambda x: x * x, [1, 2, 3, 4, 5, 6, 7, 8, 9]))
# [1, 4, 9, 16, 25, 36, 49, 64, 81]
```

关键字 lambda 表示匿名函数，冒号前面的 x 表示函数参数。

匿名函数有个限制，就是只能有一个表达式，不用写 return，返回值就是该表达式的结果。

用匿名函数有个好处，因为函数没有名字，不必担心函数名冲突。此外，匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数: 
``` python
f = lambda x : x * x
f(3)
# 9
```

同样，也可以把匿名函数作为返回值返回: 
``` python
def build(x, y):
    return lambda: x * x + y * y
```

## 装饰器
***  
在代码运行期间动态增加功能的方式，称之为"装饰器"(Decorator)。
本质上，decorator 就是一个返回函数的高阶函数。
``` python
def log(func):
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper

# 借助 Python 的 @ 语法，把 decorator 置于函数的定义处
@log
def now():
    print('2019-2-12')

# 相当于执行了语句
now = log(now)
```

如果 decorator 本身需要传入参数，那就需要编写一个返回 decorator 的高阶函数: 
``` python
def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator

@log('execute')
def now():
    print('2019-2-12')
```

和两层嵌套的 decorator 相比，3 层嵌套的效果是这样的: 
``` python
now = log('execute')(now)
```

Python 内置的 functools.wraps 用于还原函数的 \_\_name\_\_: 
``` python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper

import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator   
```

## 偏函数
***  
Python 的 functools 模块提供了很多有用的功能，其中一个就是偏函数(Partial function)。
functools.partial 就是帮助我们创建一个偏函数的，简单总结 functools.partial 的作用就是，把一个函数的某些参数给固定住(也就是设置默认值)，返回一个新的函数，调用这个新函数会更简单。
``` python
import functools
int2 = functools.partial(int, base=2)
int2('1000000')
# 64
```