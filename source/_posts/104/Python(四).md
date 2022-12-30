---
title: Python(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog104.jpg
date: 2019/02/17
---

本篇，我们说说 Python 中的函数以及模块的基本概念。

## 函数
***  
函数(Functions)是指可重复使用的程序片段。它们允许你为某个代码块赋予名字，允许你通过这一特殊的名字在你的程序任何地方来运行代码块，并可重复任何次数。这就是所谓的调用(Calling)函数。我们已经使用过了许多内置的函数，例如 len 和 range。

### 定义函数
函数可以通过关键字 def 来定义。这一关键字后跟一个函数的标识符名称，再跟一对圆括号，其中可以包括一些变量的名称，再以冒号结尾，结束这一行。随后而来的语句块是函数的一部分。
``` python
def say_hello():
    # 该块属于这一函数
    print('hello world')
# 函数结束

say_hello()  # 调用函数
# hello world
say_hello()  # 再次调用函数
# hello world
```

### 函数参数
函数可以获取参数，这个参数的值由你所提供，借此，函数便可以利用这些值来做一些事情。
函数中的参数通过将其放置在用以定义函数的一对圆括号中指定，并通过逗号予以分隔。当我们调用函数时，我们以同样的形式提供需要的值。要注意在此使用的术语 —— 在定义函数时给定的名称称作"形参"(Parameters)，在调用函数时你所提供给函数的值称作"实参"(Arguments)。
``` python
def print_max(a, b):
    if a > b:
        print(a, 'is maximum')
    elif a == b:
        print(a, 'is equal to', b)
    else:
        print(b, 'is maximum')

# 直接传递字面值
print_max(3, 4)

x = 5
y = 7

# 以参数的形式传递变量
print_max(x, y)
```

### 局部变量
``` python
x = 50

def func(x):
    print('x is', x)
    x = 2
    print('Changed local x to', x)

func(x)
print('x is still', x)
```

### global 语句
``` python
x = 50

def func():
    global x

    print('x is', x)
    x = 2
    print('Changed global x to', x)

func()
print('Value of x is', x)
```

### 默认参数值
对于一些函数来说，你可能为希望使一些参数可选并使用默认的值，以避免用户不想为他们提供值的情况。默认参数值可以有效帮助解决这一情况。你可以通过在函数定义时附加一个赋值运算符(=)来为参数指定默认参数值。
要注意到，默认参数值应该是常数。更确切地说，默认参数值应该是不可变的。
``` python
def say(message, times=1):
    print(message * times)

say('Hello')
say('World', 5)
```

注意: 只有那些位于参数列表末尾的参数才能被赋予默认参数值，意即在函数的参数列表中拥有默认参数值的参数不能位于没有默认参数值的参数之前。

默认参数有个最大的坑，如下: 
``` python
def add_end(L=[]):
    L.append('END')
    return L

add_end()
# ['END']

add_end()
# ['END', 'END']
```

原因解释如下: 
Python 中的函数在定义的时候，默认参数 L 的值就被计算出来了，即 []，因为默认参数 L 也是一个变量，它指向对象 []，每次调用该函数，如果改变了 L 的内容，则下次调用时，默认参数的内容就变了，不再是函数定义时的 [] 了。
所以，定义默认参数要牢记一点: 默认参数必须指向不变对象！
我们可以用None这个不变对象来实现: 
``` python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L
```

为什么要设计 str、None 这样的不变对象呢？因为不变对象一旦创建，对象内部的数据就不能修改，这样就减少了由于修改数据导致的错误。此外，由于对象不变，多任务环境下同时读取对象不需要加锁，同时读一点问题都没有。我们在编写程序时，如果可以设计一个不变对象，那就尽量设计成不变对象。

### 命名参数
如果你有一些具有许多参数的函数，而你又希望只对其中的一些进行指定，那么你可以通过命名它们来给这些参数赋值，我们使用命名(关键字)而非位置(一直以来我们所使用的方式)来指定函数中的参数。

这样做有两大优点 —— 其一，我们不再需要考虑参数的顺序，函数的使用将更加容易。其二，我们可以只对那些我们希望赋予的参数以赋值，只要其它的参数都具有默认参数值。
``` python
def func(a, b=5, c=10):
    print('a is', a, 'and b is', b, 'and c is', c)

func(3, 7)
func(25, c=24)
func(c=50, a=100)
```

### 可变参数
有时你可能想定义的函数里面能够有任意数量的变量，也就是参数数量是可变的，这可以通过使用星号来实现。
``` python
def total(a=5, *numbers, **phonebook):
    print('a', a)

    #遍历元组中的所有项目
    for single_item in numbers:
        print('single_item', single_item)

    #遍历字典中的所有项目
    for first_part, second_part in phonebook.items():
        print(first_part,second_part)

print(total(10, 1, 2, 3, Jack=1123, John=2231, Inge=1560))
```

当我们声明一个诸如 \*args 的星号参数时，从此处开始直到结束的所有位置参数(Positional Arguments)都将被收集并汇集成一个称为 args 的元组(Tuple)。
当我们声明一个诸如 \*\*kwargs 的双星号参数时，从此处开始直至结束的所有命名参数都将被收集并汇集成一个名为 kwargs 的字典(Dictionary)。

如果已经有一个 list 或者 tuple，要调用一个可变参数，可以使用如下方法: 
``` python
nums = [1, 2, 3]
# 在传递可变参数时，在 list 或 tuple 前添加 *
calc(*nums)
```

### 参数组合
在 Python 中定义函数，可以用必选参数、默认参数、可变参数可以组合使用。但是请注意，参数定义的顺序必须是: 必选参数、默认参数、可变参数。
不要同时使用太多的组合，否则函数接口的可理解性很差。

### return 语句
return 语句用于从函数中返回，也就是中断函数。我们也可以选择在中断函数时从函数中返回一个值。
``` python
def maximum(x, y):
    if x > y:
        return x
    elif x == y:
        return 'The numbers are equal'
    else:
        return y

print(maximum(2, 3))
```

## 模块
***  
如果你想在你所编写的别的程序中重用一些函数的话，应该怎么办？答案是模块(Modules)。

编写模块有很多种方法，其中最简单的一种便是创建一个包含函数与变量、以 .py 为后缀的文件。
另一种方法是使用撰写 Python 解释器本身的本地语言来编写模块。举例来说，你可以使用 C 语言来撰写 Python 模块，并且在编译后，你可以通过标准 Python 解释器在你的 Python 代码中使用它们。

一个模块可以被其它程序导入并运用其功能。我们在使用 Python 标准库的功能时也同样如此。
``` python
import sys

print('The command line arguments are:')
for i in sys.argv:
    print(i)

print('\n\nThe PYTHONPATH is', sys.path, '\n')
```

我们通过 import 语句导入 sys 模块。
sys 模块包含了与 Python 解释器及其环境相关的功能，也就是所谓的系统功能(system)。
当 Python 运行 import sys 这一语句时，它会开始寻找 sys 模块。由于其是一个内置模块，因此 Python 知道应该在哪里找到它。

如果它不是一个已编译好的模块，即用 Python 编写的模块，那么 Python 解释器将从它的 sys.path 变量所提供的目录中进行搜索。如果找到了对应模块，则该模块中的语句将在开始运行，并能够为你所使用。

### from..import 语句
如果你希望直接将 argv 变量导入你的程序(为了避免每次都要输入 sys.)，那么你可以通过使用 from sys import argv 语句来实现这一点。
注意: 一般来说，你应该尽量避免使用 from...import 语句，而去使用 import 语句。这是为了避免在你的程序中出现名称冲突，同时也为了使程序更加易读。
``` python
from math import sqrt
print("Square root of 16 is", sqrt(16))
```

### 作用域
在一个模块中，我们可能会定义很多函数和变量，但有的函数和变量我们希望给别人使用，有的函数和变量我们希望仅仅在模块内部使用。在 Python 中，是通过 _ 前缀来实现的。
正常的函数和变量名是公开的(public)，可以被直接引用。
类似 \_\_xxx\_\_ 这样的变量是特殊变量，可以被直接引用，但是有特殊用途，比如 \_\_author\_\_，\_\_name\_\_ 就是特殊变量，文档注释也可以用特殊变量 \_\_doc\_\_ 访问，我们自己的变量一般不要用这种变量名。
类似 \_xxx 和 \_\_xxx 这样的函数或变量就是非公开的(private)，不应该被直接引用。之所以我们说，private 函数和变量"不应该"被直接引用，而不是"不能"被直接引用，是因为 Python 并没有一种方法可以完全限制访问 private 函数或变量，但是，从编程习惯上不应该引用 private 函数或变量。

注意: 以一个下划线开头的实例变量名，这样的实例变量外部是可以访问的，但是，按照约定俗成的规定，当你看到这样的变量时，意思就是，"虽然我可以被访问，但是，请把我视为私有变量，不要随意访问"。双下划线开头的实例变量则不能直接访问，因为 Python 解释器对外把 \_\_xxx 变量改成了 \_[类名]\_\_xxx，所以，仍然可以通过 \_[类名]\_\_xxx 来访问 \_\_xxx 变量。
但是强烈建议你不要这么干，因为不同版本的 Python 解释器可能会把 \_\_xxx 改成不同的变量名。
``` python
def _private_1(name):
    return 'Hello, %s' % name

def _private_2(name):
    return 'Hi, %s' % name

def greeting(name):
    if len(name) > 3:
        return _private_1(name)
    else:
        return _private_2(name)
```

### 编写你自己的模块
每一个 Python 程序同时也是一个模块。你只需要保证它以 .py 为扩展名即可。
``` python
def say_hi():
    print('Hi, this is mymodule speaking.')

__version__ = '0.1'
```

上方所呈现的就是一个简单的模块。与我们一般所使用的 Python 的程序相比其实并没有什么特殊的区别。
``` python
import mymodule

mymodule.say_hi()
print('Version', mymodule.__version__)
```

### dir 函数
内置的 dir() 函数能够返回由对象所定义的名称列表。 如果这一对象是一个模块，则该列表会包括函数内所定义的函数、类与变量。
该函数接受参数。 如果参数是模块名称，函数将返回这一指定模块的名称列表。 如果没有提供参数，函数将返回当前模块的名称列表。

### 包
变量通常位于函数内部，函数与全局变量通常位于模块内部。如果你希望组织起这些模块的话，应该怎么办？这便是包(Packages)的应用。
包是指一个包含模块与一个特殊的 \_\_init\_\_.py 文件的文件夹，后者向 Python 表明这一文件夹是特别的，因为其包含了 Python 模块。

包是一种能够方便地分层组织模块的方式。