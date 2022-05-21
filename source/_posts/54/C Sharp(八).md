---
title: C Sharp(八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog54.jpg
date: 2018/10/31
---

这一篇，我们讲讲 C# 中特殊的委托(delegate)。

## 概述
***  
委托和类一样，都是用户定义类型。类表示数据和方法的集和，而委托则是持有一个或多个方法，以及一系列预定义操作。

我们通过以下步骤来使用委托: 
- 声明一个委托，委托的声明看上去和方法声明类似，只是没有实现块
- 使用委托类型声明一个委托变量
- 创建委托类型的变量，赋值为委托变量，这个委托类型变量指向方法的引用，这个方法和委托定义的签名和返回值类型一样
- 可以为委托对象增加其他方法
- 可以像调用方法一样调用委托，调用委托时，其包含的每一个方法都会被执行

### 声明委托
``` csharp
delegate void MyDel(int x);
```

### 创建委托对象
有两种方式创建委托对象: 
- 第一种是使用 new 操作符的创建表达式，参数是调用列表第一个方法的名字

``` csharp
delVal = new MyDel(instance.MyM1);  //实例方法
dVal = new MyDel(SClass.OtherM2);  //静态方法
```
- 我们还可以使用快捷语法，直接赋值为方法名即可

``` csharp
delVal = instance.MyM1;
dVal = SClass.OtherM2;
```

### 为委托增加方法
我们使用 += 操作符为委托增加方法。
``` csharp
MyDel  del = inst.M1;
del += SCl.M3;
del += X.Act;
```

同样使用 -= 从委托移除方法。

### 调用委托
我们可以像调用方法一样调用委托: 
``` csharp
MyDel  del = inst.M1;
del += SCl.M3;
del += X.Act;
//...
del(444);
```

### 调用带有返回值的委托
- 调用列表最后一个方法返回的值就是委托返回值
- 调用列表的其他方法返回值将被忽略

``` csharp
delegate int MyDel();
class MyCls
{
    public int IntVal = 5;
    public int Add2() { IntVal += 2; return IntVal; }
    public int Add3() { IntVal += 3; return IntVal; }
}

class Program
{
    static void Main()
    {
        MyCls cls = new MyCls();
        MyDel del = new MyDel(cls.Add2);
        del += cls.Add3;
        del += cls.Add2;

        Console.WriteLine(del());  //12
    {
}
```

### 调用带引用参数的委托
再调用方法列表的下一个方法时，参数的新值会传给下一个方法。
``` csharp
delegate void MyDel(ref int x);
class MyCls
{
    public void Add2(ref int x) { x += 2; }
    public void Add3(ref int x) { x += 3; }
}

class Program
{
    static void Main()
    {
        MyCls cls = new MyCls();
        MyDel del = new MyDel(cls.Add2);
        del += cls.Add3;
        del += cls.Add2;

        int x = 5;
        del(ref x);
        Console.WriteLine(x);  //12
    }
}
```

### Lambda 表达式
我们可以使用 Lambda 表达式创建委托对象。
C# 中的 Lambda 表达式与 JavaScript 中的很像。如果只有一个参数，可以省略括号，如果只有一个返回值语句，可以省略大括号和 reuturn 关键字。
``` csharp
MyDel del = (int x) => { return x + 1; };
//简写形式
MyDel del = x => x + 1;
```