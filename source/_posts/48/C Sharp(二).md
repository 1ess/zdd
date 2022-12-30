---
title: C Sharp(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog48.jpg
date: 2018/09/05
---

这一篇，我们看看 C# 中的类有哪些特殊的概念。

## 概述
***  
上一篇，我们说过用户定义类型有 6 种，其中最重要的就是类类型，类是面向对象的基础。
程序的数据和功能被组织为逻辑上相关的数据项和函数的封装集合就称为类(class)。
类是一种能存储数据并执行代码的数据结构，包含数据成员和函数成员。
数据成员包括: 
- 字段
- 常量

函数成员包括: 
- 方法
- 属性
- 构造函数
- 析构函数
- 运算符
- 索引器
- 事件

## 声明类(类定义)
***  
类的声明提供以下内容: 
- 类的名称
- 类的成员
- 类的特征

``` csharp
class MyClass
{
    //成员声明
}
```

### 字段
字段是属于类的变量，可以被写入和读取。与 Objective-C 和 JavaScript 不同，所有字段都属于类型，必须在内部声明，也就是说没有全局变量的概念。

``` csharp
class MyClass
{
    int MyField;
}
```

之前也说过字段是可以被自动初始化的，每种类型的默认值都是 0，bool 类型为 false，引用类型为 null。

### 方法
方法是可执行的代码块。方法声明包括以下组成部分: 
- 返回值类型，如果没有返回值，则指定为 void
- 方法名
- 参数列表，至少是一个空圆括号
- 方法体，包裹在一对大括号之间

``` csharp
class MyClass
{
    void MyFunc()
    {
        Console.WriteLine("Hello World!");
    }
}
```

### 类的实例
与 JavaScript 类似，使用 new 操作符实例化一个对象。
``` csharp
MyClass mc = new MyClass();
```

类中的成员可分为: 
- 实例成员
- 静态成员

### 访问修饰符
访问修饰符是可选部分，放在简单声明之前。
5 种成员访问控制如下: 
- private
- public
- protected
- internal
- protected internal

私有访问只能从声明他的类内访问，**私有访问是默认的访问级别**。

### 类内类外访问成员
在类内可以直接使用成员名来访问成员，而要从类外访问实例成员，必须使用点运算符访问。

## 方法
***  
C# 方法体是一个块，包含以下项目: 
- 本地变量
- 控制流结构
- 方法调用
- 内嵌块

``` csharp
static void Main()
{
    int a = 3;
    if (a > 3) {
        Console.WriteLine("a");
    }
}
```
### 本地变量
字段保存的是与类或对象有关的数据，本地变量保存临时信息。
本地变量的生命周期从声明的那一刻开始存在，在块完成执行时结束存在。
并且本地变量是没有隐式初始化的，所以在使用之前没有显示初始化的话，编译器会产生错误信息。

在声明本地变量时可以使用 var 关键字，条件是: 
- 只能用于本地变量，不能用于字段
- 只能用于声明时包含初始化的语句
- 一旦编译器推断出类型，他就是固定且不能更改的

注意: C# 中的 var 与 JavaScript 中的不同。

### 本地常量
本地常量和本地变量类似，只是本地常量一旦初始化，他的值就不能更改: 
- 本地常量在声明时必须初始化
- 常量在声明之后不能更改
- 声明时，在类型之前加 const 关键字

``` csharp
void DisplayRadii() 
{
    const double PI = 3.1416;
    //...
}
```

## 参数
***  
### 形参
形参是本地变量，它声明在方法的参数列表中，而不是函数体中。

### 实参
用于初始化形参的表达式或变量称为实参(argument)。
实参的数量必须与形参的数量一致，并且每个实参的类型也必须与对应的形参类型一致。这种形式的参数称为**位置参数**。

### 值参数
通过将实参的值复制到形参的方式，将数据传递给方法，就称为值参数。
使用值参数方法被调用时，系统做如下操作: 
- 在栈中为形参分配空间
- 将实参的值复制给形参

``` csharp
class MyClass
{
    public int Val = 20;
}

class Program
{
    static void MyMethod(MyClass f1, int f2)
    {
        f1.Val = f1.Val + 5;
        f2 = f2 + 5;
        Console.iteLine("f1: {0}, f2: {1}", f1.Val, f2);
    }

    static void Main()
    {
        var cls = new MyClass();
        int a = 10;
        MyMethod(cls, a); // 25, 15
        Console.WriteLine("f1: {0}, f2: {1}", cls.Val, a);  // 25, 10
    }
}
```

### 引用参数
- 在使用引用参数时，在方法声明以及调用时，都要在参数前使用 ref 关键字
- 实参必须是变量

引用参数有如下特征: 
- 不会为形参在栈上分配空间
- 实际情况是，形参的参数名将作为实参的别名，指向相同的内存位置

``` csharp
class MyClass
{
    public int Val = 20;
}

class Program
{
    static void MyMethod(ref MyClass f1, ref int f2)
    {
        f1.Val = f1.Val + 5;
        f2 = f2 + 5;
        Console.iteLine("f1: {0}, f2: {1}", f1.Val, f2);
    }

    static void Main()
    {
        var cls = new MyClass();
        int a = 10;
        MyMethod(ref cls, ref a); // 25, 15
        Console.WriteLine("f1: {0}, f2: {1}", cls.Val, a);  // 25, 15
    }
}
```

我们要注意引用类型作为值参数和引用参数的不同，他们都可以改变成员的值，但是当在方法内给这个引用重新赋值就不同了: 
- 当是值参数时，会切断与实参的联系
- 当是引用参数时，会改变实参的指向

### 输出参数
输出参数用于从方法体内把数据传递到调用的代码，如同引用参数，输出参数有如下要求: 
- 必须在声明和调用时同时使用 out 关键字
- 实参必须是变量
- 在方法内部，输出参数在能被读取之前必须被赋值，这意味着，参数初始值是无用的，没必要在调用输出参数方法时给输出参数初始化
- 在方法返回之前，所有路径都必须已经给输出参数进行过一次赋值

``` csharp
class MyClass
{
    public int Val = 20;
}

class Program
{
    static void MyMethod(out MyClass f1, out int f2)
    {
        f1 = new MyClass();
        f2 = 10;
        Console.iteLine("f1: {0}, f2: {1}", f1.Val, f2);
    }

    static void Main()
    {
        MyClass cls;
        int a;
        MyMethod(out cls, out a); // 20, 10
        Console.WriteLine("f1: {0}, f2: {1}", cls.Val, a);  // 20, 10
    }
}
```

### 参数数组
参数数组允许零个或多个实参对应一个特殊的形参。参数数组的特征如下: 
- 在一个参数列表中只能有一个参数数组
- 如果有，必须位于参数列表的最后一个
- 参数数组中的所有参数必须具有相同类型
- 在声明时使用 param 修饰符，并在类型后加 []

``` csharp
void ListInts(param int[] intVals)
{
    //...
}
```

有两种方式为参数数组提供实参: 
- 用逗号分隔的该类型元素的列表(延展式)

``` csharp
ListInts(1, 2, 3, 4);
```
- 一个该数据类型的一维数组

``` csharp
int[] intArray = [1, 2, 3, 4];
ListInts(intArray);
```

注意: 与之前三种参数不同，参数数组不用在调用时使用 params 修饰符。

当使用延展式调用参数数组函数时，编译器会接受实参列表，并在堆中初始化一个数组，将数组的引用保存到栈中的形参里。

``` csharp
class MyClass
{
    public void ListInts(params int[] intVals)
    {
        if (intVals != null && intVals.Length != 0) {
            for (int i = 0; i < intVals.Length; i++) {
                intVals[i] = intVals[i] * 10;
                Console.WriteLine("{0}", intVals[i]);
            }
        }
    }
}

class Program
{
    static void Main()
    {
        int first = 5, second = 6, third = 7;
        var cls = new MyClass();
        cls.ListInts(first, second, third);  //50, 60, 70
        Console.WriteLine("{0}, {1}, {2}", first, second, third);  //5, 6, 7
    }
}
```

当使用数组作为实参时，编译器直接使用你的数组而不重新创建。

``` csharp
class MyClass
{
    public void ListInts(params int[] intVals)
    {
        if (intVals != null && intVals.Length != 0) {
            for (int i = 0; i < intVals.Length; i++) {
                intVals[i] = intVals[i] * 10;
                Console.WriteLine("{0}", intVals[i]);
            }
        }
    }
}

class Program
{
    static void Main()
    {
        int[] intArray = [5, 6, 7];
        var cls = new MyClass();
        cls.ListInts(intArray);  //50, 60, 70
        Console.WriteLine("{0}, {1}, {2}", intArray[0], intArray[1], intArray[2]);  //50, 60, 70
    }
}
```

### 方法重载(method overload)
一个类中可以有一个以上的方法具有相同的名称，这就叫做方法重载。
但是每个同名的方法必须有不同的方法签名。
方法签名由如下信息组成: 
- 方法名
- 参数数目
- 参数类型和顺序
- 参数的修饰符

注意: 返回值类型和参数名不是方法签名的一部分。
也要注意与继承概念中的方法重写(method override)的区别

### 命名参数
之前我们讲的都是位置参数，此外 C# 还允许使用命名参数。
在调用方法时，形参名后跟冒号和实参: 
``` csharp
c.Calc(a: 1, b: 2, c: 3);
```

方法在调用时，可以既有位置参数又有命名参数，如果这么做，所有的位置参数必须先列出。
与 Swift 中的函数调用很相似。

### 可选参数
C# 还允许可选参数，我们需要在函数声明时在可选参数中指定默认值: 
``` csharp
public int Calc(int a, int b = 3) 
{
    return a + b;
}

Calc(5);  // 8
```

方法声明中参数的语法顺序: 必填参数 - 可选参数 - 参数数组