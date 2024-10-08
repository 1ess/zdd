---
title: C Sharp(十五)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog61.jpg
date: 2018/09/30
---

这一篇，我们讲讲 C# 网络编程中比较重要的概念 —— 异步。

### 什么是异步
当程序启动时，系统就会在内存创建一个新进程。进程是构成程序的资源的集合，资源包括虚拟地址、文件句柄等。

在进程内部，系统还创建了称为线程的内核对象。也就是说一旦进程创建，系统就会在 Main 方法的第一行语句开始线程执行。

关于线程: 
- 默认情况下，一个进程只包含一个线程，从程序的开始一直执行到结束
- 线程可以派生其他线程
- 如果一个进程包含多个线程，他们将共享进程资源
- 系统为处理器执行所规划的基本单元是线程而不是进程

在 C# 5.0 引入了一个非常好的特性 —— async/await。在 JavaScript 和即将到来的 Swift 5.0 中都存在引入了此特性，虽然实现的底层原理并不相同。
这个特性是 .Net 框架的一部分，但是没有嵌入 C# 中。

### async/await
如果程序调用某个方法，等待其执行所有处理之后才继续执行，我们称这样的方法为同步方法。
相反的，异步方法就是在处理完成之前就返回到调用方法。我们使用 async/await 特性可以很方便的创建异步方法。
该特性有三部分组成: 
- 调用方法: 调用异步方法的方法，在异步方法执行任务时继续执行
- 异步方法: 该方法异步执行其工作，然后立即返回到调用方法
- await 表达式: 用于异步方法内，指明需要异步执行的任务，一个异步方法可以包含多个 await 表达式，如果一个都不包含，则该方法将同步执行，编译器会报警告

async 关键字是一个专门给编译器的提示，意思是该函数的实现可能会出现 await 表达式。
- 在 Debug 模式下，对于 async 方法，生成一个 class 状态机
- 在 Release 模式下，对于 async 方法，生成一个 struct 状态机

### 什么是异步方法
异步方法的特点: 
- 方法头包含 async 方法修饰符
- 包含一个或多个 await 表达式表示异步完成的任务
- 返回值只能是 void，Task 或 Task&lt;T&gt;
- 异步方法参数不能有 out 或 ref 修饰
- 按照约定，异步方法以 Async 结尾
- Lambda 表达式也可以作为异步对象
- 调用方法读取 Task 的 Result 属性获取 T 类型的值
- 任何返回 Task&lt;T&gt; 的异步方法必须返回 T 类型的值

需要注意: 
- 不要使用 void 作为 async 方法的返回值类型，async 方法可以返回 void，仅限于编写事件处理程序，如果是普通方法没有返回值，需要返回 Task
- 避免使用 Task.Wait 和 Task.Result 方法，可能会导致死锁
- 当第一次遇到 await 表达式所返回的类型就是方法头的返回值类型，与 await 表达式的返回值类型没关系
- 异步方法的 return 语句并没有真正返回值，而只是退出了

### 在调用方法同步等待任务
我们可能需要在调用方法中同步等待某个任务完成，Task&lt;T&gt; 实例提供了 Wait 方法，来等待某个特殊的 Task 完成。
还可以使用 Task 的静态方法 WaitAll 和 WaitAny 方法同步等待多个任务完成。参数为 Task[]。

### 在异步方法异步等待任务
我们可以使用 await 和 Task 的静态方法 WhenAll 和 WhenAny 方法异步等待多个任务完成。参数为 List<Task&lt;T&gt;>。

注意: async 和 await 都没有新开线程，新开线程是 Task.Run() 做的事情。如果自己编写异步方法，注意要自己编写 Task.Run()。