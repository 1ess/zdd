---
title: Life is short, you need Python
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog100.jpg
date: 2019/04/01
---

![](https://cdn-fawn.vercel.app/contentImg/python/python1.jpg)

之前一直在写 Objective-C 以及 C# 这种强类型、静态类型的语言，也写过 Javascript 这种弱类型、动态类型的语言，今天开始，来学习一门不一样的强类型、动态类型的语言 —— Python。

这里，我先说一下我关于强弱类型以及动态静态类型的理解。
对于强弱类型，区别主要是，强类型偏向于不容忍隐式类型转换。而弱类型则偏向于容忍隐式类型转换。但是这个说法中强弱只是一个相对概念，我个人将 Javascript 语言为弱类型语言标准，反之则为强类型语言。
对于动态静态类型，我们只需记住类型是在编译期确定还是运行期确定。对于 Objective-C 可能有一些异议，我个人认为虽然 Objective-C 有一定动态性，但是这门语言还是静态的，就像 C# 也有 dynamic 类型，甚至 C 还有 void* 指针，我们也不能说他们是动态语言。

## 为什么学
***  
虽然 Python 最初只是被设计用于编写自动化脚本，但是随着版本的不断更新和语言新功能的添加，用武之地也越来越多，运维、web开发、应用开发、大数据、数据挖掘、科学计算、机器学习、人工智能、自然语言处理等各个领域都可以使用 Python 开发，可以说只有想不到，没有做不到。

正好也是过年会有几天假期，可以系统学习一下 Python。本篇只是大概介绍一下 Python 的背景以及一些基础概念。之后几篇再根据列出的资料详细介绍 Python 的各种语法。

## 选择版本
***  
> The use of Python 3 is highly preferred over Python 2. Consider upgrading your applications and infrastructure if you find yourself still using Python 2 in production today. If you are using Python 3, congratulations — you are indeed a person of excellent taste. — Kenneth Reitz

Python 的创始人 Guido van Rossum。在 1989 年圣诞节期间，为了打发圣诞节的无趣，决心开发一个新的脚本解释程序，就这样，Python 在 Guido 手中诞生了。现在主要有两个版本 Python 2.7 以及 Python 3.x，互不兼容。并且 Python 2.7 将于 2020 年终止支持，3.x 版越来越普及，所以如果你是一个有追求的程序员，现在就应该学习 Python 3.x。

## 下载安装
***  
Windows 平台到[官方网站](https://www.python.org/downloads/)下载即可，Mac 平台系统默认已经安装了 Python 2.7。Python 3.x 我们可以通过 [Homebrew](https://brew.sh/) 使用命令 brew install python3 来安装。

我们可以通过在 Terminal 运行 Python(在 Mac 中，使用 Python3) 来验证安装是否成功。
如果有提示符 >>> 就表示我们已经在 Python 交互式环境中了，输入 exit() 并回车，就可以退出 Python 交互式环境。否则安装失败。

## Python 解释器
***  
### CPython
当我们从 Python 官方网站下载并安装好 Python 3.x 后，我们就直接获得了一个官方版本的解释器: CPython。这个解释器是用 C 语言开发的，所以叫 CPython。在命令行下运行 python(python3) 就是启动 CPython 解释器。

### IPython
IPython 是基于 CPython 之上的一个交互式解释器，也就是说，IPython 只是在交互方式上有所增强，但是执行 Python 代码的功能和 CPython 是完全一样的。
注意: CPython 用 >>> 作为提示符，而 IPython 用 In [序号]: 作为提示符。

### PyPy
PyPy 是另一个 Python 解释器，它的目标是执行速度。PyPy 采用 JIT 技术，对 Python 代码进行动态编译(注意不是解释)，所以可以显著提高 Python 代码的执行速度。

### Jython
Jython 是运行在 Java 平台上的 Python 解释器，可以直接把 Python 代码编译成 Java 字节码执行。

### IronPython
IronPython 和 Jython 类似，只不过 IronPython 是运行在微软 .Net 平台上的 Python 解释器，可以直接把 Python 代码编译成 .Net 的字节码。

## Python 发行版
***  
### CPython
一般我们所说的 Python 默认是指这个发行版本。这个版本只提供标准库，第三方库需要自己用 pip 命令安装。

### Anaconda
这个发行版的 Python 是科学计算及研究中经常使用到的发行版，这个发行版 Python 会自动集成很多方便易用和常用的第三方库。

## 后记
***  
本篇也是比较有纪念意义，从 2018 年 6 月 13 日开始到今天总共 230 天，100 篇博客，写博客初期定下的目标早已达到。距离农历新年还有 10 天左右，希望在新的一年学更多技术，写更多文章吧。

## 参考资料
***  
[廖雪峰 Python 教程](https://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000)
[Learn Python the Hard Way](https://learnpythonthehardway.org/book/)
[Python Cookbook 3rd Edition Documentation](https://python3-cookbook.readthedocs.io/zh_CN/latest/)
[深入 Python 3](https://woodpecker.org.cn/diveintopython3/table-of-contents.html)
[The Hitchhiker's Guide to Python! — The Hitchhiker's Guide to Python](https://docs.python-guide.org/)