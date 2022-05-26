---
title: C Sharp(十六)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog62.jpg
date: 2018/12/01
---

这一篇，我们讲讲 C# 中的异常处理 —— try、catch、finially。

### 什么是异常
异常是程序运行时错误，出现正常操作时未预料的情况。当发生时，系统会捕获这个错误并抛出异常。
在编写 iOS 程序时，我们可能很少使用异常，通常我们使用 NSError **error 这样的二级指针来获取错误对象，处理不同的错误。

### try 语句
try 语句是为了避免出现异常而被保护的代码段，在出现异常时提供异常处理。
try 语句由三部分组成: 
- try 包含为避免出现异常而被保护的代码
- catch 是异常处理程序
- finally 是在所有情况都会执行的代码块，不论有没有异常

``` csharp
try {
    //...
}
catch () {
    //...
}
catch () {
    //...
}
finally {
    //...
}
```

### 异常类
有许多不同类型的异常可能在程序中发生。BCL 定义了许多异常类。当一个异常发生时，我们应: 
- 创建该类型的异常对象
- 在适当的 catch 子句处理

所有的异常类都继承自 System.Exception。异常对象含有只读属性: 
- Message: 包含异常原因
- StackTrace: 调用栈

### catch 子句
catch 子句有三种形式: 
``` csharp
catch {
    //没有参数，匹配 try 中发生的任何异常
}

catch (ExceptionType) {
    //异常类型作为参数，匹配该类型的异常
}

catch (ExceptionType Exp) {
    //特定异常对象作为参数，匹配该类型的异常，在代码块中可以使用异常对象
}
```

### finally 子句
如果程序进入了一个带有 finally 块的 try 语句，那么 finally 块总会执行。

### 抛出异常
我们可以使用 throw 语句显式触发一个异常，语法如下: 
``` csharp
throw ExceptionObject;
```

throw 还可以不带异常对象使用，只能用在 catch 块内部。