---
title: C Sharp(十八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog64.jpg
date: 2018/12/10
---

这一篇，我们讲讲 C# 中非常重要的概念 —— 反射和特性。

### 元数据
很多程序语言中有元数据(matedata)的概念，其实元数据就是描述数据的数据。
一个运行的程序查看本身元数据或其他程序元数据的行为就叫做反射(reflection)。
要使用反射，我们必须引入 System.Reflection 命名空间。

### Type 类
BCL 声明了一个 Type 的抽象类，他被设计用来包含类型的特性。使用这个类的对象可以让我们获得程序使用的类型信息。
我们需要了解的是: 
- 对于程序中的每一个类型，CLR 都会创建一个包含这个类型信息的 Type 类型的对象
- 程序中用到的每一个类型都会关联到独立的 Type 类型的实例
- 不管创建的类型有多少个实例，只有一个 Type 对象会关联到多有的这些实例

我们可以从 Type 类型的实例获取几乎所有关于类型的信息，Type 类有很多有用的成员，如: 
- Name 属性，返回类型名
- NameSapce 属性，返回类型声明的命名空间
- Assembly 属性，返回程序集
- GetFields 方法，返回字段列表
- GetProperties 方法，返回属性列表
- GetMethods 方法，返回方法列表

### 获取 Type 对象的实例
我们可以使用 GetType 方法和 typeof 运算符获取 Type 对象。
``` csharp
using System.Reflection;

Type t1 = myInstance.GetType();
Type t2 = typeof (DerivedClass);
```

### 特性
特性(attribute)是一种允许我们向程序集添加元数据的语言结构。
按照惯例，特性以 Pascal 命名法，并以 Attribute 为后缀命名。当应用特性时，可以不加 Attribute 后缀。
应用特性要被方括号包裹，其中是特性名和参数列表。
``` csharp
[Serializable]
public class MyClass
{

}

[MyAttribute("Simple String")]
public class MyOtherClas
}
```

### 预定义特性
#### Obsolete 特性
我们可以使用 Obsolete 特性标注方法过期: 
``` csharp
[Obsolete("Use Method SuperPrint")]
public void Print()
{

}
```

我们依旧可以使用过期方法，可以成功编译并执行，但是编译器会报警告。我们可以使用第二个布尔参数，使得编译错误。
``` csharp
[Obsolete("Use Method SuperPrint", true)] //调用会发生编译错误
public void Print()
{

}
```

#### Conditional 特性
Conditional 特性允许我们包含或排斥特定方法的所有调用。
如果定义了编译符号参数，则标记为 Conditional 特性的方法与普通方法一样，如果未定义编译符号，则所有的 Conditional 方法都不会调用: 
``` csharp
[Conditional("DoTrace")]
public void TraceMessage(string str)
{
    Console.WriteLine(str);
}
```
ASP.Net MVC 有很多重要的特性，我们会在学习 MVC 时再具体学习。

### 其他特性相关
我们可以为单个结构应用多个特性，可以使用多层结构，也可以使用逗号分隔: 
``` csharp
[Serializable]
[MyAttribute("Simple String")]

[Serializable, MyAttribute("Simple String")]
```

除了类，特性还可以应用于字段，属性和方法等。

### 自定义特性
所有的特性要派生自 System.Attribute。
要声明一个自定义特性: 
- 声明一个派生自 System.Attribute 的类
- 给他起一个 Attribute 后缀的名字
- 通常将该类声明为密封 sealed

``` csharp
public sealed class MyAttribute : System.Attribute
{

}
```

注意: 特性类的成员只能是: 
- 字段
- 属性
- 构造函数

每个特性至少有一个公共构造函数。我们在应用特性传入参数列表时，其实是在使用不同的构造函数。
关于特性构造函数: 
- 应用特性时，构造函数的实参必须是在编译期可以确定的常量表达式
- 如果构造函数没有参数，可以省略圆括号