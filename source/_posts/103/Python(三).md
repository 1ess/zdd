---
title: Python(三)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog103.jpg
date: 2019/04/05
---

> The Zen of Python, by Tim Peters

> Beautiful is better than ugly.
> Explicit is better than implicit.
> Simple is better than complex.
> Complex is better than complicated.
> Flat is better than nested.
> Sparse is better than dense.
> Readability counts.
> Special cases aren't special enough to break the rules.
> Although practicality beats purity.
> Errors should never pass silently.
> Unless explicitly silenced.
> In the face of ambiguity, refuse the temptation to guess.
> There should be one-- and preferably only one --obvious way to do it.
> Although that way may not be obvious at first unless you're Dutch.
> Now is better than never.
> Although never is often better than *right* now.
> If the implementation is hard to explain, it's a bad idea.
> If the implementation is easy to explain, it may be a good idea.
> Namespaces are one honking great idea -- let's do more of those!

本篇，我们说说 Python 中常见的运算符和控制流。

## 运算符(Operators)
***  
### 算数运算符
Python 中的算符运算符包括: 
- +(加)
- -(减)
- *(乘)
- /(除)
- **(乘方)
- //(整除)
- %(取模)

### 位运算符
- &lt;&lt;(左移)
- &gt;&gt;(右移)
- &(按位与)
- |(按位或)
- ^(按位异或)
- ~(按位取反)

### 逻辑运算符
- &lt;(小于)
- &gt;(大于)
- &lt;=(小于等于)
- &gt;=(大于等于)
- ==(等于)
- !=(不等于)
- not(逻辑非)
- and(逻辑与)
- or(逻辑或)

### 赋值运算符
- =(赋值)
- *=，/=，+=，-=，...，(复合赋值运算符)

## 控制流
***  
在 Python 中有三种控制流语句 —— if，for 和 while。
### if 语句
if 语句用以检查条件: 如果 条件为真(True)，我们将运行一块语句(称作 if-block 或 if 块)，否则 我们将运行另一块语句(称作 else-block 或 else 块)。其中 else 从句是可选的。
``` python
number = 23
guess = int(input('Enter an integer : '))

if guess == number:
    # 新块从这里开始
    print('Congratulations, you guessed it.')
    print('(but you do not win any prizes!)')
    # 新块在这里结束
elif guess < number:
    # 另一代码块
    print('No, it is a little higher than that')
    # 你可以在此做任何你希望在该代码块内进行的事情
else:
    print('No, it is a little lower than that')
    # 你必须通过猜测一个大于(>)设置数的数字来到达这里。

print('Done')
```

需要注意的是 if 语句在结尾处包含一个冒号 —— 我们借此向 Python 指定接下来会有一块语句在后头。
elif 和 else 同样都必须有一个冒号在其逻辑行的末尾，后面跟着与它们相应的语句块。

Python 中不存在 switch 语句。你可以通过使用 if..elif..else 语句来实现同样的事情。

注意: 只要条件是非零数值、非空字符串、非空 list 等，就判断为 True，否则为 False。

### while 语句
while 语句能够让你在条件为真的前提下重复执行某块语句。 while 语句是 循环(Looping) 语句的一种。while 语句同样可以拥有 else 子句作为可选选项。
``` python
number = 23
running = True

while running:
    guess = int(input('Enter an integer : '))

    if guess == number:
        print('Congratulations, you guessed it.')
        # 这将导致 while 循环中止
        running = False
    elif guess < number:
        print('No, it is a little higher than that.')
    else:
        print('No, it is a little lower than that.')
else:
    print('The while loop is over.')
    # 在这里你可以做你想做的任何事

print('Done')
```

### for 循环
for...in 语句是另一种循环语句，其特点是会在一系列对象上进行迭代(Iterates)，意即它会遍历序列中的每一个项目。
``` python
for i in range(1, 5):
    print(i)
else:
    print('The for loop is over')
```
注意: range 函数将会返回一个数字序列，从第一个数字开始，至第二个数字结束。如: range(1,5) 将输出序列 [1, 2, 3, 4]。在默认情况下，range 将会以 1 逐步递增。如果我们向 range 提供第三个数字，则这个数字将成为逐步递增的加数。range(1,5,2) 将会输出 [1, 3]。要记住这一序列扩展直到第二个数字，也就是说，它不会包括第二个数字在内。

另外需要注意的是，range() 每次只会生成一个数字，如果你希望获得完整的数字列表，要在使用 range() 时调用 list()。例如下面这样: list(range(5)) ，它将会返回 [0, 1, 2, 3, 4]。

**需要注意: 只有在正常结束循环时，else 子句才会执行，如果是由于 break 或 return 导致循环退出，则不会执行 else 子句。**

### break 语句
break 语句用以中断(Break)循环语句，也就是中止循环语句的执行，即使循环条件没有变更为 False，或队列中的项目尚未完全迭代依旧如此。
有一点需要尤其注意，如果你 中断 了一个 for 或 while 循环，任何相应循环中的 else 块都将不会被执行。
``` python
while True:
    s = input('Enter something : ')
    if s == 'quit':
        break
    print('Length of the string is', len(s))
print('Done')
```

### continue 语句
continue 语句用以告诉 Python 跳过当前循环块中的剩余语句，并继续该循环的下一次迭代。
``` python
while True:
    s = input('Enter something : ')
    if s == 'quit':
        break
    if len(s) < 3:
        print('Too small')
        continue
    print('Input is of sufficient length')
    # 自此处起继续进行其它任何处理
```