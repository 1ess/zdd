---
title: C Sharp(十一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog57.jpg
date: 2018/11/11
---

这一篇，我们再来看看 C# 中的显式转换以及隐式转换。

### 隐式转换
有些类型的转换不会丢失数据或精度: 
- C# 会自动做这些转换，称为隐式转换
- 从位数少的源转换为位数更多的源，目标多出来的位使用 0 或 1 补充
- 当从小的无符号类型转换为更大的无符号类型，多出来的位以 0 进行填充，称为 0 扩展
- 对于有符号类型，额外的高位使用符号位进行扩展，称为符号扩展

### 显式转换
对于源类型的任意值在被转换为目标类型时会丢失的情况，C# 语言是不提供两种类型的自动转换，如果我们希望这两种类型进行转换，就必须使用显式转换，这叫做强制转换表达式。
``` csharp
ushort var1 = 10;
sbyte var2 = (sbyte)var1;
```

### 装箱转换
C# 所有类型都继承自 object 类型，然而，值类型是高效轻量的类型，但是当我们需要对象组件，可以使用装箱。
装箱是一种隐式转换，接受值类型的值，在堆上创建一个引用类型对象，返回该引用。
``` csharp
int i = 12;
object oi = null;
oi = i;
```

需要注意的是: 装箱操作的时一个副本，装箱之后，原始值和引用副本可以独立操作。
``` csharp
int i = 10;
object oi = i;
Console.WriteLine("i: {0}, oi: {1}", i, oi); // 10, 10

i = 12;
oi = 15;
Console.WriteLine("i: {0}, oi: {1}", i, oi); // 12, 15
```

### 拆箱转换
拆箱是将装箱后的引用返回值类型的操作。
注意: 拆箱是显式转换。
``` csharp
int i = 10;
object oi = i;

int j = (int)oi;
```

拆箱非值类型会抛出异常。

### is 运算符
我们可以使用 is 运算符检测转换是否会成功，避免盲目转换。
``` csharp
class Employee : Person {}
class Person
{
    public string Name = "1ess";
    public int Age = 20;
}

class Program
{
    static void Main()
    {
        Employee emp = new Employee();
        if (emp is Person p) {
            //如果转换失败，返回 false
            //如果转换成功，返回 true，并赋值给 p
            //...
        }
    }
}
```

### as 运算符
as 运算符和强制转换类似，只是他不会抛出异常。如果转换失败，会返回 null。
``` csharp
class Employee : Person {}
class Person
{
    public string Name = "1ess";
    public int Age = 20;
}

class Program
{
    static void Main()
    {
        Employee emp = new Employee();
        Person p = emp as Person;
        if (p != null) {
            //...
        }
    }
}
```