---
title: Python(六)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog106.jpg
date: 2019/02/22
---

本篇，我们说说 Python 中的面向对象高级编程的基本概念。

数据封装、继承和多态只是面向对象程序设计中最基础的 3 个概念。在 Python 中，面向对象还有很多高级特性，允许我们写出非常强大的功能。本篇，我们会说说多重继承、定制类等概念。

## \_\_slots\_\_
***  
正常情况下，当我们定义了一个 class，创建了一个 class 的实例后，我们可以给该实例绑定任何属性和方法: 
``` python
# 给实例绑定一个属性
p = Person()
p.name = 'Michael'
print(p.name)
# Michael

# 给实例绑定一个方法
def set_age(self, age): # 定义一个函数作为实例方法
    self.age = age
from types import MethodType
p.set_age = MethodType(set_age, p)
p.set_age(20)
print(p.age)
# 20
```

但是，给一个实例绑定的方法，对另一个实例是不起作用的，为了给所有实例都绑定方法，可以给 class 绑定方法: 
``` python
def set_score(self, score):
    self.score = score
Person.set_score = set_score
# 所有实例均可调用
p1.set_score(100)
print(p1.score)
# 100

p2.set_score(90)
print(p2.score)
# 90
```

为了达到限制的目的，Python 允许在定义 class 的时候，定义一个特殊的 \_\_slots\_\_ 变量，来限制该 class 实例能添加的属性: 
``` python
class Person:
    __slots__ = ('name', 'age')

p = Person()
p.name = 'Michael'
p.age = 20
p.score = 100 # AttributeError
```

试图绑定 \_\_slots\_\_ 元组中不存在的字段名，将得到 AttributeError 的错误。

注意: \_\_slots\_\_ 定义的属性仅对当前类实例起作用，对继承的子类是不起作用的。

## @property
***  
Python 内置的 @property 装饰器就是负责把一个方法变成属性调用: 
``` python
class Person:
    @property
    def score(self):
        return self._score

    @score.setter
    def score(self, value):
        if not type(value) == int:
            raise ValueError('score must be an integer!')
        elif value < 0 or value > 100:
            raise ValueError('score must between 0 ~ 100!')
        else:
            self._score = value

p = Person()
p.score = 200 # score must between 0 ~ 100!
p.score = '200' # score must be an integer!
p.score = 90
print(p.score)
# 90
```

把一个 getter 方法变成属性，只需要加上 @property 就可以了，此时，@property 本身又创建了另一个装饰器 @score.setter，负责把一个 setter 方法变成属性赋值，还可以定义只读属性，只定义 getter 方法，不定义 setter 方法就是一个只读属性。

## 多重继承
***  
通过多重继承，一个子类就可以同时获得多个父类的所有功能。
在设计类的继承关系时，通常，主线都是单一继承下来的，但是，如果需要"混入"额外的功能，通过多重继承就可以实现，这种设计通常称之为 MixIn。

Python 自带的很多库也使用了 MixIn。举个例子，Python 自带了 TCPServer 和 UDPServer 这两类网络服务，而要同时服务多个用户就必须使用多进程或多线程模型，这两种模型由 ForkingMixIn 和 ThreadingMixIn 提供。通过组合，我们就可以创造出合适的服务来。

## 定制类
***  
看到类似 \_\_slots\_\_ 这种形如 \_\_xxx\_\_ 的变量或者函数名就要注意，这些在 Python 中是有特殊用途的。
\_\_slots\_\_ 我们已经知道怎么用了，\_\_len\_\_() 方法我们也知道是为了能让 class 作用于 len() 函数。
除此之外，Python 的 class 中还有许多这样有特殊用途的函数，可以帮助我们定制类。

### \_\_str\_\_
\_\_str\_\_ 就相当于 Objective-C 中的 Description 方法或 C# 中的 toString() 方法。
``` python
class Person:
    def __init__(self, name):
        self._name = name

print(Person('Michael'))
# <__main__.Person object at 0x000001644DFB28D0>

class Person:
    def __init__(self, name):
        self._name = name

    def __str__(self):
        return 'Person object name is {}'.format(self._name)

    __repr__ = __str__

print(Person('Michael'))
# Person object name is Michael

Person('Michael')
# Person object name is Michael
```

### \_\_iter\_\_ 和 \_\_next\_\_
果一个类想被用于 for ... in 循环，类似 list 或 tuple，就必须实现一个 \_\_iter\_\_() 方法，该方法返回一个迭代对象，然后，Python 的 for 循环就会不断调用该迭代对象的 \_\_next\_\_() 方法拿到循环的下一个值，直到遇到 StopIteration 错误时退出循环。
``` python
class Fib:
    def __init__(self):
            self.a = 0
            self.b = 1
    def __iter__(self):
            return self
    def __next__(self):
            self.a, self.b = self.b, self.a + self.b # Pythonic
            if self.a > 10000:
                    raise StopIteration()
            return self.a
for n in Fib():
    print(n)
    # 1
    # 2
    # 3
    # 5
    # 8
    # 13
    # 21
    # 34
    # 55
    # 89
    # 144
    # 233
    # 377
    # 610
    # 987
    # 1597
    # 2584
    # 4181
    # 6765
```

### \_\_getitem\_\_
Fib 实例虽然能作用于 for 循环，看起来和 list 有点像，但是，把它当成 list 来使用还是不行，比如，取第 5 个元素: 
``` python
Fib()[5]
# TypeError: 'Fib' object does not support indexing
```

要表现得像 list 那样按照下标取出元素，需要实现 \_\_getitem\_\_() 方法: 
``` python
class Fib(object):
    def __getitem__(self, n):
        if isinstance(n, int): # n是索引
            a, b = 1, 1
            for x in range(n):
                a, b = b, a + b
            return a
        if isinstance(n, slice): # n是切片
            start = n.start
            stop = n.stop
            if start is None:
                start = 0
            a, b = 1, 1
            L = []
            for x in range(stop):
                if x >= start:
                    L.append(a)
                a, b = b, a + b
            return L
```

### \_\_getattr\_\_
之前说过，当我们调用类的方法或属性时，如果不存在，就会报错。
Python 有一个机制，那就是写一个 \_\_getattr\_\_() 方法，动态返回一个属性: 
``` python
class Person:

    def __init__(self):
        self.name = 'Michael'

    def __getattr__(self, attr):
        if attr=='score':
            return 99
```

当调用不存在的属性时，比如 score，Python 解释器会试图调用 \_\_getattr\_\_(self, 'score') 来尝试获得属性，这样，我们就有机会返回 score 的值。

注意，只有在没有找到属性的情况下，才调用 \_\_getattr\_\_，已有的属性，比如 name，不会在 \_\_getattr\_\_ 中查找。
