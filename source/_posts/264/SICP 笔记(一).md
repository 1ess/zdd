---
title: SICP 笔记(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog264.jpg
date: 2023/10/09
---
> SICP 的核心内容是什么呢？众说纷云，有人说是一本有关 Lisp／Scheme 的书主要讲函数式编程的思想，有的说是一本有关解释器构造的入门书籍，和我们学过的龙书挂钩。但就我个人而言，SICP 作为一本入门书更多的不是担负起介绍某一方面具体的知识的重任，而是从多个角度去教一个初学者从程序抽象、理解工程架构、学习 DSL 的构建方法等等，不单纯介绍一方面的知识而是完备的形成一个闭环的去像你介绍什么是 Computer Science。

## 构造过程抽象
程序设计中，我们需要处理两类要素:
1. 过程(procedures)
2. 数据(data)

**数据就是我们要操作的"东西"，而过程是对操作数据规则的描述。实际上两个要素的区分并不严格**

### 表达式
数值就是一种基本表达式，表达式表示的数值会和算数运算符组合，来形成复合表达式。
``` python
>>> 42
42

>>> -1 - -1
0
```

这些算术表达式使用了中缀符号，其中运算符(例如 +、-)出现在操作数(数值)中间。

### 调用表达式
最重要的复合表达式就是调用表达式，它在一些参数上调用函数。
``` python
>>> max(7.5, 9.5)
9.5
```

运算符在圆括号之前，圆括号包含逗号分隔的操作数。运算符必须是个函数，操作数可以是任何值。
### 命名和环境
使用名称来引用计算对象，在 Python 中，我们可以使用赋值语句来建立新的绑定，它包含 = 左边的名称和右边的值: 
``` python
>>> radius = 10
>>> radius
10
>>> 2 * radius
20
```

名称也可以通过 import 语句绑定: 
``` python
>>> from math import pi
>>> pi
3.141592653589793
```

将名称绑定到值上，以及随后通过名称来检索这些值的可能，意味着解释器必须维护某种内存来跟踪这些名称和值的绑定。这些内存叫做环境。

名称也可以绑定到函数。例如，名称 max 绑定到了我们曾经用过的 max 函数上。函数不像数值，不易于渲染成文本，所以 Python 使用识别描述来代替，当我们打印函数时: 
``` python
>>> max
<built-in function max>
```

我们可以使用赋值运算符来给现有函数起新的名字: 
``` python
>>> f = max
>>> f
<built-in function max>
>>> f(3, 4)
4
```

### 纯函数和非纯函数
纯函数: 具有一些输入(参数)以及返回一些输出(调用结果)的函数。纯函数具有一个特性，调用它们时除了返回一个值之外没有其它效果。
``` python
>>> abs(-2)
2
```

非纯函数: 除了返回一个值之外，调用非纯函数会产生副作用，这会改变解释器或计算机的一些状态。
``` python
>>> print(-2)
-2
>>> print(1, 2, 3)
1 2 3
```

虽然这些例子中的 print 和 abs 看起来很像，但它们本质上以不同方式工作。 print 的返回值永远是 None 。Python 交互式解释器并不会自动打印 None 值。这里，print 自己打印了输出，作为调用中的副作用。调用 print 的嵌套表达式会凸显出它的非纯特性: 
``` python
>>> print(print(1), print(2))
1
2
None None
```

### 作为抽象的函数
``` python
>>> def square(x):
        return mul(x, x)
>>> square(21)
441
>>> def sum_squares(x, y):
        return add(square(x), square(y))
>>> sum_squares(3, 4)
25
```

虽然 sum_squares 十分简单，但是它演示了用户定义函数的最强大的特性。sum_squares 函数使用 square 函数定义，但是仅仅依赖于 square 定义在输入参数和输出值之间的关系。
在编写 sum_squares 时，不用考虑如何计算一个数值的平方。平方计算的细节被隐藏了，并可以在之后考虑。在 sum_squares 看来，square 并不是一个特定的函数体，而是某个函数的抽象，也就是所谓的函数式抽象。在这个层级的抽象中，任何能计算平方的函数都是等价的。

### 语句
我们已经看到了三种语句：赋值、def 和 return 语句。这些 Python 代码并不是表达式。
表达式也可以作为语句执行，其中它们会被求值，但是它们的值会舍弃。执行纯函数没有什么副作用，但是执行非纯函数会产生效果作为函数调用的结果。
``` python
>>> def square(x):
        mul(x, x)
```

语句的效果是，mul 函数被调用了，然后结果被舍弃了。有时编写一个函数体是表达式的函数是有意义的，例如调用类似 print 的非纯函数。

### 条件语句
Python 中的条件语句包含一系列的头部和语句组：一个必要的 if 子句，可选的 elif 子句序列，和最后可选的 else 子句: 
``` python
if <expression>:
    <suite>
elif <expression>:
    <suite>
else:
    <suite>
```

### 迭代
while 子句包含一个头部表达式，之后是语句组: 
``` python
while <expression>:
    <suite>
```

### 作为参数的函数
考虑下面三个函数，它们都计算总和。
``` python
>>> def sum_naturals(n):
        total, k = 0, 1
        while k <= n:
            total, k = total + k, k + 1
        return total
>>> sum_naturals(100)
5050

>>> def sum_cubes(n):
        total, k = 0, 1
        while k <= n:
            total, k = total + pow(k, 3), k + 1
        return total
>>> sum_cubes(100)
25502500

>>> def pi_sum(n):
        total, k = 0, 1
        while k <= n:
            total, k = total + 8 / (k * (k + 2)), k + 4
        return total
>>> pi_sum(100)
3.121594652591009
```

这三个函数在背后都具有相同模式。它们大部分相同，只是名字、用于计算被加项的 k 的函数，以及提供 k 的下一个值的函数不同。我们可以定义一个函数，其中参数为函数，即可: 
``` python
>>> def summation(n, term, next):
        total, k = 0, 1
        while k <= n:
            total, k = total + term(k), next(k)
        return total
```

例如，上例中的 sum_cubes 函数可以写为: 
``` python
>>> def cube(k):
        return pow(k, 3)
>>> def successor(k):
        return k + 1
>>> def sum_cubes(n):
        return summation(n, cube, successor)
>>> sum_cubes(3)
36
```

### 作为返回值的函数
提供两个函数 f(x) 和 g(x)，我们可能希望定义 h(x) = f(g(x))。我们可以使用现有工具来定义复合函数： 
``` python
>>> def compose1(f, g):
        def h(x):
            return f(g(x))
        return h
>>> add_one_and_square = compose1(square, successor)
>>> add_one_and_square(12)
169
```

### Lambda 表达式
目前为止，每次我们打算定义新的函数时，我们都会给它一个名称。但是对于其它类型的表达式，我们不需要将一个间接产物关联到名称上。Python 中，我们可以使用 Lambda 表达式凭空创建函数，它会求值为匿名函数。Lambda 表达式是函数体具有单个返回表达式的函数，不允许出现赋值和控制语句。
``` python
>>> def compose1(f,g):
        return lambda x: f(g(x))
```

面的定义也是正确的: 
``` python
>>> compose1 = lambda f,g: lambda x: f(g(x))
```

通常，Python 的代码风格倾向于显式的 def 语句而不是 Lambda 表达式，但是允许它们在简单函数作为参数或返回值的情况下使用。

### 抽象和一等函数
带有最少限制的元素被称为具有一等地位。一些一等元素的**权利和特权**是: 
1. 它们可以绑定到名称
2. 它们可以作为参数向函数传递
3. 它们可以作为函数的返回值返回
4. 它们可以包含在数据结构中

Python 总是给予函数一等地位。