---
title: C Sharp(四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog50.jpg
date: 2018/09/08
---

这一篇，我们讲讲 C# 中关于继承的相关知识。

## 继承
***  
通过继承我们可以定义新的派生类(derived class)，来对基类(base class)进行扩展。
派生类的成员包括: 
- 本身声明的成员
- 基类的成员

注意: 派生类不能删除它所继承的任何成员。

要声明一个派生类，需要在类名后跟一个冒号，然后跟基类名。与 Objective-C 的继承声明相同。
``` csharp
class DerivedClass : BaseClass
{
     //...
}
```

继承的成员可以被访问，就像他们是派生类本身声明的一样: 
``` csharp
class SomeClass
{
    public string Field1 = "base class field";
    public void Method1(string value)
    {
        Console.WriteLine("Base class -- Method1:    {0}", value);
    }
}

class OtherClass : SomeClass
{
    public string Field2 = "derived class";
    public void Method2(string value)
    {
        Console.WriteLine("Derived class -- Method2:    {0}", value);
    }
}

class Program
{
    static void Main()
    {
        OtherClass oc = new OtherClass();

        oc.Method1(oc.Field1);
        oc.Method1(oc.Field2);        
        oc.Method2(oc.Field1);
        oc.Method2(oc.Field2);        
    }
}
```

除了 object，所有的类都是派生类，object 是唯一的非派生类，他是继承层次结构的基础。
没有基类声明的类隐式直接派生自 object 类。
C# 中的继承是单继承，与 Objective-C、JavaScript 一样。
通常我们称一个类为派生类时，我们是说他直接派生自某个类而不是 object。

### 屏蔽基类成员
我们虽然不能删除基类的任何成员，但是我们可以使用与基类名相同名称的成员来屏蔽基类成员。
在派生类屏蔽基类成员的要点如下: 
- 要屏蔽一个数据成员，需要声明一个新的相同类型的同名成员
- 要屏蔽一个函数成员，需要在派生类中声明带有相同签名的函数成员
- 要然编译器知道我们故意屏蔽基类成员，需要使用 new 修饰符。否则屏蔽成员会报警告

``` csharp
class SomeClass
{
    public string Field1 = "SomeClass Field1";
    public void Method1(string value)
    {
        Console.WriteLine("SomeClass.Method1: {0}", value);
    }
}

class OtherClass : SomeClass
{
    new public string Field1 = "OtherClass Field1";
    new public void Method1(string value)
    {
        Console.WriteLine("OtherClass.Method1: {0}", value);
    }
}

class Program
{
    static void Main()
    {
        OtherClass oc = new OtherClass();
        oc.Method1(oc.Field1);  //OtherClass.Method1: OtherClass Field1
    }
}
```

###  基类访问
如果要在派生类中需要访问被屏蔽的成员，可以使用基类访问表达式来访问隐藏的成员。
基类访问表达式由关键字 base 后跟点操作符加要访问的成员: 
``` csharp
Console.WriteLine("{0}", base.Field1);
```

如果程序需要经常使用这个特性，可能需要重新设计了。

### 使用基类的引用
派生类的引用指向整个类结构，包括基类部分。
如果有一个派生类引用，我们就可以获取对象基类部分的引用(使用类型转换): 
``` csharp
class BaseClass
{
    public void Print()
    {
        Console.WriteLine("This is base class method");
    }
}

class DerivedClass : BaseClass
{
    new public void Print()
    {
        Console.WriteLine("This is derived class method");
    }
}

class Program
{
    public static Main()
    {
        DerivedClass dc = new DerivedClass();
        BaseClass bc = (BaseClass)dc;
        dc.Print();  // derived class print
        bc.Print();  // base class print
    }
}
```

通过类型转换而来的"基类"，不能"看"到派生类的部分。

### 虚方法和覆写方法
虚方法可以使基类的引用访问"提升"至派生类，只需满足如下条件: 
- 派生类的方法和基类的方法的签名和返回值都一致
- 基类方法使用 virtual 标注
- 派生类方法使用 override 标注

``` csharp
class BaseClass
{
    virtual public void Print()
    {
        Console.WriteLine("This is base class method");
    }
}

class DerivedClass : BaseClass
{
    override public void Print()
    {
        Console.WriteLine("This is derived class method");
    }
}

class Program
{
    public static Main()
    {
        DerivedClass dc = new DerivedClass();
        BaseClass bc = (BaseClass)dc;
        dc.Print();  // derived class print
        bc.Print();  // derived class print
    }
}
```
关于 virtual 和 override 修饰符的重要信息如下: 
- 覆写和被覆写的方法必须具有相同的访问性
- 不能覆写 static 方法和非虚方法
- 方法、属性、索引器和事件可以被声明为 virtual 和 override

覆写方法可以在继承的任何层次出现，方法的调用会沿着派生层次一直追溯到标记为 override 的最高派生类。

注意: Objective-C 没有虚方法的概念，Objective-C 中所有的方法都是虚方法: 
``` objectivec
@interface Animal: NSObject
- (void)sing;

@implementation Animal
- (void)sing {
    NSLog(@"animal sing");
}

@interface Dog: Animal

@implementation Dog
- (void)sing {
    NSLog(@"dog sing");
}

- (void)main {
    Dog *dog = [[Dog alloc] init];
    Animal *animal = dog;
    [dog sing];  //"dog sing"
    [animal sing]; //"dog sing"
}
```

**虚方法是面向对象中多态的基础，多态性又叫动态绑定、推迟绑定或运行期绑定。是允许你将父对象设置成为一个或更多的它的子对象相等的技术，赋值之后，父对象就可以根据当前赋值给它的子对象的特性以不同的方式运作。**

### 构造函数的执行
派生类对象有一部分就是基类对象: 
- 要创建对象的基类部分，需要隐式的调用基类的某个构造函数作为实例创建的一部分
- 每个类在执行自己的构造函数之前要执行基类的构造函数

**默认情况，构造对象时，将调用基类的无参构造函数**，如果希望派生类调用的是有参构造的话，就需要构造函数初始化语句。
有两种形式的构造函数初始化语句: 
- 使用 base 并指明使用哪一个基类的构造函数
- 使用 this 并指明使用哪一个当前类的构造函数

``` csharp
public MyDerivedClass
{
    public MyDerivedClass(int x, string s) 
    : base(x, s) 
    {
        //...
    }
}
```

另外，我们可以需要在构造函数中使用当前类的其他构造: 
``` csharp
class MyClass
{
    readonly int a;
    readonly int b;
    public string FirstName;
    public string LastName;
    public MyClass()
    {
        a = 10;
        b = 20;
    }
    public MyClass(string firstName) 
    : this()
    {
        FirstName = firstName;
        //...
    }
    public MyClass(string lastName) 
    : this()
    {
        LastName = lastName;
        //...
    }
}
```

### 类的访问修饰符
类的可访问修饰符有两种: public 和 internal: 
- 标记为 public 的类可以被系统内任何程序集访问
- 标记为 internal 的类只能被该类所在的程序集访问

注意: internal 是类的默认访问级别。

### 成员的访问修饰符
成员的默认的访问级别是 private，并且成员不能比他的类有更高的可访问性。
- private 成员只能被他自己的类访问，不能被其他类访问，包括继承的类。但能被嵌套在他的类中的类访问
- protected 成员访问级别与 private 一样，只是它允许派生自他的类访问该成员
- internal 成员只对程序集内部可见
- protected internal 成员对所有继承自他的类可以访问，也可以对他所在的程序集可访问(注意是并集而不是交集)

### 抽象成员和抽象类
抽象成员是指被设计为被覆写的函数成员，有以下特征: 
- 必须是函数成员
- 必须是由 abstract 修饰符修饰
- 没有方法实现代码块

``` csharp
abstract public void Print();
```

抽象成员只能在抽象类中声明，一共有 4 中类型的成员可以声明为抽象: 
- 方法
- 属性
- 事件
- 索引

派生类重写抽象成员要是有 override 标记: 
``` csharp
override public void Print()
{
    Console.WriteLine("override abstract method");
}
```

抽象类就是被设计为被继承的类，抽象类只能作为其他类的基类: 
- 我们不能创建抽象类的实例
- 抽象类也使用 abstract 修饰符修饰

``` csharp
abstract class MyAbstractClass
{

}
```

注意: 
- 抽象类中可以有非抽象成员
- 抽象类可以派生自其他抽象类
- 任何派生自抽象类的类必须实现所有抽象成员，除非她本身也是派生类

``` csharp
abstract class ClassA
{
    //...
}

abstract class ClassB : ClassA
{
    //...
}
```

### 密封类
密封类与抽象类相反，他不能被继承，使用 sealed 修饰。
``` csharp
sealed class MySealedClass
{
    //...
}
```

### 静态类
- 静态类中所有成员都是静态的
- 静态类被标记为 static
- 静态类是隐式密封的，也就是说，他不能被继承
- 它可以有一个静态构造函数，但不能有实例构造函数

### 扩展方法
如果我们不能修改某个类的源文件，而希望给该类添加方法，可以使用扩展方法: 
``` csharp
//必须是静态类
static class ExtendMyClass
{
    //必须声明为 public 和 static 方法，参数传入要扩展的类的实例，并且前面加 this 关键字
    public static double Avg(this MyBaseClass bc)
    {
    }
}
```

### C# 命名约定
- 帕斯卡命名: 命名空间、类名、方法、属性和公共字段
- 驼峰命名: 私有变量和形参
- 下划线加驼峰: 私有和受保护字段