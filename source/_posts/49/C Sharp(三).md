---
title: C Sharp(三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog49.jpg
date: 2018/10/19
---

这一篇，我们深入理解一下 C# 中的类。

## 类的成员
***  
上篇我们说过了 2 个类成员: 字段和方法。这一篇我们介绍除了事件和运算符之外的成员。

### 成员修饰符的顺序
成员声明语句有下列部分组成: 核心声明，可选的修饰符和可选的特性(attribute)。
[特性] [修饰符] 核心声明;
我们之前说过的 public 和 private 都是修饰符，还有 static 和 const 也都是修饰符。

### 实例成员
成员可以关联到一个类的实例，也可以关联到类的整体，默认情况下，成员被关联到一个实例，这些成员称为实例成员。

``` csharp
class MyClass
{
    public int a;
}

class Program
{
    static void Main()
    {
         var cls1 = new MyClass();
         var cls2 = new MyClass();
         cls1.a = 10;
         cls2.a = 20;
         Console.WriteLine("{0}  --  {1}", cls1.a, cls2.a);  // 10 -- 20
    }
}
```

### 静态成员
除了实例成员，类还可以拥有静态成员。静态成员被所有实例共享，访问内存同一位置，使用 static 修饰符将成员声明为静态。

``` csharp
class MyClass
{
    int Mem1;
    static int Mem2;
}
class Program
{
    static void Main()
    {
         var cls1 = new MyClass();
         var cls2 = new MyClass();
         cls1.Mem1 = 10;
         MyClass.Mem2 = 1;
         cls2.Mem1 = 20;
         MyClass.Mem2 = 2;
         Console.WriteLine("{0}  --  {1}", cls1.Mem1 , cls2.Mem1 );  // 10 -- 20
         Console.WriteLine(MyClass.Mem2);  // 2
    }
}
```

### 类外访问静态成员
与实例成员一样在类外使用点运算符来访问静态成员，只不过是使用类名来访问。
静态函数成员不能访问实例成员，他们可以访问其他静态成员。
``` csharp
class X
{
    public static int A;
    public static void PrintA()
    {
        Console.WriteLine(A);  //可以在静态方法访问静态字段
    }
}
```

除了**常量**和**索引器**，其他成员都可以是静态成员。

### 成员常量
如同本地常量一样，只是成员常量被声明在类中: 
``` csharp
class MyClass
{
    const int IntVal = 5;
}
```

成员常量表现得很像静态值，他们对每个实例都是可见的，但是他们没有自己的存储位置，只是在编译期被替换。类似于 C 语言的 #define。

``` csharp
class MyClass
{
    public const double PI = 3.14156;
}

class Program
{
    static void Main()
    {
        Console.WriteLine(MyClass.PI);  // 3.14156
    }
}
```

注意: 虽然成员常量表现得像静态量，但是不能使用 static 修饰符修饰。

### 属性
C# 中的属性非常像 Swift 中的计算属性。他们在使用时非常像字段，但是和字段不同的是，他们是函数成员，可以执行代码。

``` csharp
int MyVal 
{
    get
    {
        //get
    }

    set
    {
        //set
    }

}
```

set 访问器拥有一个隐式的名为 value 的值参数，与属性类型相同，返回值为 void。
get 访问器没有参数，有一个与属性相同类型的返回值。
我们要注意: 属性本身没有任何存储，通常要有一个关联字段作为存储。
``` csharp
private int _intVal;
public int IntVal
{
    set
    {
        _intVal = value;
    }

    get
    {
        return _intVal;
    }
}
```

我们还可以设置只读属性(只有 get 方法)或者只写属性(只有 set 方法)，但是两个访问器至少要定义一个，否则编译器会报错。
C# 还提供了自动属性实现，不需要提供关联字段，也不需要提供访问器的方法体，get 和 set 后直接跟分号。
``` csharp
class MyClass
{
    public int IntVal {get; set;}
}
```

属性也可以被声明为静态，与静态字段一样，使用类名访问静态属性。

### 实例构造函数
构造函数是一个特殊的方法，他在创建类实例时执行，用于初始化实例状态。通常声明为 public。
它的特点是: 
- 构造函数没有返回值
- 构造函数名称与类名相同

``` csharp
class MyClass
{
    public MyClass()
    {
        //...
    }
}
```

构造函数也可以被重载，带有不同的参数: 
``` csharp
class Class1
{
    int Id;
    string Name;
    public Class1() { Id = 1; Name="1ess"; }
    public Class1(int Id) { this.Id = Id; Name="1ess"; }
    public Class1(string Name) { Id = 1; this.Name=Name; }
}
```

如果我们没有为类提供构造函数，那么编译器会隐式提供一个无参构造函数，方法体为空。
如果我们显示提供了一个构造函数，那么就不会为我们创建一个隐式的无参构造函数。
``` csharp
class Class2
{    
    int Id;
    string Name;
    public Class2(int Id) { this.Id = Id; Name="1ess"; }
    public Class2(string Name) { Id = 1; this.Name=Name; }
}

class Program
{
    static void Main()
    {
        Class2 cls2 = new Class2();  // 错误，编译器不会再隐式提供无参构造函数
    }
}
```

### 静态构造函数
这一点与很多语言不同，构造函数也可以是静态的，用来初始化静态成员。调用时机是: 
- 在引用任何静态成员之前
- 在创建类的任何实例之前

静态构造函数的特点是: 
- 名称必须与类名相同
- 不能有返回值
- 只能有一个静态构造函数
- 不能有参数
- 不能有访问修饰符

``` csharp
class Class1
{
    static Class1()
    {
        //执行静态成员初始化
    }
}
```

在静态构造函数不能访问实例成员，我们也不能显示的调用静态构造函数。

### 对象初始化语句
对象初始化语句扩展创建语法，在表达式的尾部放置一组成员初始化语句，允许我们在创建实例时，设置字段和属性值。
该语法有两种形式: 
- 包括构造函数的参数列表
- 不包括构造函数的参数列表

``` csharp
new TypeName(ArgList) { FieldOrProp = InitVal, FieldOrProp = InitVal, ...};
new TypeName { FieldOrProp = InitVal, FieldOrProp = InitVal, ...};
```

要注意: 初始化列表中的字段和属性都是可访问的(public)，并且**初始化语句执行于构造方法之后**。

### this 关键字
this 是对当前实例的引用，只能被用于: 
- 实例构造方法
- 实例方法
- 属性和索引器的实例访问器

this 的目的用于区分成员和本地变量: 
``` csharp
class Class1
{
    int a;
    public void Say(int a) 
    {
        this.a = a;
        //....
    }
}
```

不推荐参数和字段同名。

### 分部类和分部类型
类的声明可以分割成几个分部类声明: 
- 每个分部类都含有一些类成员声明
- 每个局部声明必须标记为 partial class

``` csharp
partial class MyClass
{
   int a;
}

partial class MyClass
{
    int b;
}
```

除了分部类，还有分部结构和分部接口，我们之后说。

### 分部方法
分部方法是声明在分部类的不同部分的方法。
分部方法两部分如下: 
- 分部方法的声明
- 分部方法的实现

分部方法的特征: 
- 声明部分和实现部分的返回值和方法签名必须一致，并且，返回值必须是 void
- 不能有访问修饰符修饰，也就是分部方法隐式私有
- 不能有输出参数
- 方法声明和方法实现之前要有 partial 修饰

``` csharp
partial class MyClass1
{
    partial void Add(int a, int b);
    public void PrintSum(int a, int b)
    {
        Add(a, b);
    }
}

partial class MyClass1
{
    partial void Add(int a, int b)
    {
        Console.WriteLine($"a + b = {a + b}");
    }
}

class Program
{
    static void Main()
    {
        var cls = new MyClass1();
        cls.PrintSum(5, 6);  // 11
    }
}
```