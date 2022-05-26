---
title: C Sharp(六)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog52.jpg
date: 2018/10/25
---

这一篇，讲讲 C# 中的结构体类型和枚举类型。

## 结构
***  
结构与类类似，都是用户定义类型，都有数据成员和函数成员，但有两个最大的区别: 
- 类是引用类型而结构是值类型
- 结构是隐式密封的

``` csharp
strcut StructName
{
    MemberDeclarations;
}
```

### 结构是值类型
因此: 
- 结构类型的变量不能为 null
- 两个结构不能引用同一对象

把一个结构赋值给另一个结构，就是将这个结构的值复制给另一个结构。需要注意与类的赋值的不同。

结构允许有实例构造函数和静态构造函数，但不允许有析构函数。

与类一样，编译器隐式的为结构提供一个无参构造，这个构造将每个成员设置为该类型的默认值。与类不同的是，这个无参构造函数不能被重定义，我们只能创建另外的有参构造，而不能重写无参构造，并且我们提供了有参构造，编译器提供给我们的无参构造依然存在。

我们也用 new 操作符调用构造函数，即使不从堆中分配内存。
``` csharp
struct Point
{
    public int X;
    public int Y;
}

class Program
{
    static void Main()
    {
        Point p = new Point();
        //...
    }
}
```

我们也可以不使用构造来创建结构的实例，但有一些限制: 
- 显式设置数据成员之后，才可以使用这些成员的值
- 对所有的数据成员赋值之后，才能调用任何函数成员

结构的字段是不允许有初始化语句的。

之前说了，结构是隐式密封的，因此 protected，internal，abstruct，virtual 修饰符不可使用。

与 Swift 类似，C# 中的简单预定义类型在实现方式上是使用结构类型。所以可以调用一些方法，如: 所有类型都有的 GetType 方法。
另外说一句: JavaScript 中的简单类型如 string 也可以调用方法，他们是在使用值时被临时包装成一个对象。

## 枚举
***  
枚举只有一个类型的成员: 命名的整数值常量。
``` csharp
enum TrafficLight
{
    Yellow,
    Green,
    Red
}
```

枚举的底层都是一个整数类型，默认是 int。
默认情况编译器把第一个值赋值为 0，之后的成员加 1。
我们把枚举值赋值成枚举对象: 
``` csharp
static void Main()
{
    TrafficLight yellow = TrafficLight.Yellow;
    Console.WriteLine(yellow);  //Yellow 打印成员名
}
```

我们也可以显式的设置每个枚举成员的值和类型: 
``` csharp
enum TrafficLight: uint
{
    Yellow = 15,
    Green =  20,
    Red = 20
}
```

### 位标记
我们使用 Flags 特性实现位标记: 
``` csharp
[Flags]
enum Setting : uint
{
    A = 0x0001,
    B = 0x0010,
    C = 0x0100,
    D = 0x1000
}

Setting opts = Setting.A | Setting.B | Setting.C;
opts.HasFlags(Setting.D);  //false
```

C# 中的枚举与 Objective-C 的实现 NS_ENUM 和 NS_OPTIONS 类似。

注意: 枚举是一个独特的类型，比较不同类型的枚举对象会导致编译错误，即使他们的底层都是整数。