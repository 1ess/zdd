---
title: Python(八)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog108.jpg
date: 2019/02/25
---

本篇，我们说说 Python 中的错误处理机制(Error Handler)。

## 错误处理
***  
与其他语言一样，Python 也提供了 try...except...finally... 的错误处理机制。

### try
``` python
try:
    print('try...')
    r = 10 / 0
    print('result:', r)
except ZeroDivisionError as e:
    print('except:', e)
finally:
    print('finally...')
print('END')
```

当我们认为某些代码可能会出错时，就可以用 try 来运行这段代码，如果执行出错，则后续代码不会继续执行，而是直接跳转至错误处理代码，即 except 语句块，执行完 except 后，如果有 finally 语句块，则执行 finally 语句块，至此，执行完毕。另外，还可以有多个 except 来捕获不同类型的错误: 
``` python
try:
    print('try...')
    r = 10 / int('a')
    print('result:', r)
except ValueError as e:
    print('ValueError:', e)
except ZeroDivisionError as e:
    print('ZeroDivisionError:', e)
finally:
    print('finally...')
print('END')
```

此外，如果没有错误发生，可以在 except 语句块后面加一个 else，当没有错误发生时，会自动执行 else 语句: 
``` python
try:
    print('try...')
    r = 10 / int('2')
    print('result:', r)
except ValueError as e:
    print('ValueError:', e)
except ZeroDivisionError as e:
    print('ZeroDivisionError:', e)
else:
    print('no error!')
finally:
    print('finally...')
print('END')
```

Python 的错误其实也是 class，所有的错误类型都继承自 BaseException，所以在使用except时需要注意的是，它不但捕获该类型的错误，还会捕获子类错误: 
``` python
try:
    foo()
except ValueError as e:
    print('ValueError')
except UnicodeError as e:
    print('UnicodeError')
```

第二个 except 永远也捕获不到 UnicodeError，因为 UnicodeError 是 ValueError 的子类，如果有，也被第一个 except 给捕获了。

### 抛出错误
因为错误是 class，捕获一个错误就是捕获到该 class 的一个实例。Python 的内置函数会抛出很多类型的错误，我们自己编写的函数也可以抛出错误。
``` python
class FooError(ValueError):
    pass

def foo(s):
    n = int(s)
    if n==0:
        raise FooError('invalid value: %s' % s)
    return 10 / n

foo('0')
```

只有在必要的时候才定义我们自己的错误类型。如果可以选择 Python 已有的内置的错误类型(比如 ValueError，TypeError)，尽量使用 Python 内置的错误类型。

最后，我们来看另一种错误处理的方式: 
``` python
def foo(s):
    n = int(s)
    if n==0:
        raise ValueError('invalid value: %s' % s)
    return 10 / n

def bar():
    try:
        foo('0')
    except ValueError as e:
        print('ValueError!')
        raise

bar()
```

在 bar() 函数中，我们明明已经捕获了错误，但是，打印一个 ValueError! 后，又把错误通过 raise 语句抛出去了，捕获错误目的只是记录一下，便于后续追踪。但是，由于当前函数不知道应该怎么处理该错误，所以，最恰当的方式是继续往上抛，让顶层调用者去处理。

raise 语句如果不带参数，就会把当前错误原样抛出。此外，在 except 中 raise 一个 Error，还可以把一种类型的错误转化成另一种类型。