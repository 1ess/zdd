---
title: C Sharp(五)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog51.jpg
date: 2018/09/10
---

这一篇，我们讲讲 C# 中的表达式和运算符。

## 运算符
***  
运算符(操作符)是一个符号，表示返回单个结果的操作。
一个操作符: 
- 将操作数作为输入
- 执行某个操作
- 基于该操作返回一个值

可以作为操作数的结构有: 
- 字面量
- 常量
- 变量
- 方法调用
- 元素访问器
- 其他表达式

### 字面量
C# 中字面量有: 
- 整数字面量: 1024
- 双精度浮点数字面量: 3.1415
- 单精度浮点数字面量: 3.1415F
- 布尔值字面量: true，false
- 字符字面量: 'x'
- 字符串字面量: "Hi 1ess"
- 空引用字面量: null

根据不同后缀，每个常数能被编译成不同的整数类型: 
- 后缀 L，被编译成长整型
- 后缀 U，被编译成无符号整型

整型字面量还可以写成十六进制形式，以 0x 或 0X 开头。
``` csharp
int KernelPanic = 0x12131992;
```

### 算术运算符
与其它语言一样，C# 有加，减，乘，除，取余5种运算符。

### 关系运算符
与其它语言一样，C# 有大于、大于等于、小于、小于等于、等于、不等于 6 种关系运算符。
需要注意的是: 与 Objective-C 和 JavaScript 中不同，C# 的数字不具有布尔含义。
对于比较相等时，除了 string 和 delegate 类型的比较是深比较，其他引用类型的比较都是浅比较，只要指向堆中的对象是同一个对象就相等。

### 自增自减运算符
与其它语言一样，也分为前自增和后自增，前自增先增加 1，在返回新值，后自增先返回原值，再增加 1。

### 逻辑运算符
分为逻辑与，逻辑或和逻辑非。与其它语言一样，逻辑运算符也有**短路特性**。

### 位运算符
有位与、位或、位异或、位非、左移和右移操作符。

### 赋值运算符
分为简单赋值和复合赋值运算符。

### 条件运算符(三目运算符)
与其它语言一样，三目运算符是基于条件返回两个值中的一个。

### 用户定义类型转换
类型转换我们之后会详细说，这里我们说一下他作为运算符有哪些特点。
我们可以为自己的类或者结构定义隐式转换和显式转换: 
- 对于隐式转换，编译器会自动执行转换
- 对于显式转换，编译器只有在使用显式转换运算符时才会转换

声明隐式转换的语法: 
``` csharp
//一定要有 public static
public static implicit operator TargetType(SourceType Identifier) {
    return ...
}
```

显式转换的语法一样，只是把 implicit 换成 explicit: 
``` csharp
class LimitInt
{
    public int TheValue {get; set;}
    public static implicit operator int(Limit li)
    {
        return li.TheValue;
    }

    public static implicit operator LimitInt(int x)
    {
        LimitInt li = new LimitInt();
        li.TheValue = x;
        return li;
    }
}

class Program
{
    static void Main()
    {
        LimitInt li = 500;
        Int a = li;
    }
}
```

如果我们声明的是显式转换运算符，那么我们就不得不使用强制类型转换: 
``` csharp
class LimitInt
{
    public int TheValue {get; set;}
    public static explicit operator int(Limit li)
    {
        return li.TheValue;
    }

    public static explicit operator LimitInt(int x)
    {
        LimitInt li = new LimitInt();
        li.TheValue = x;
        return li;
    }
}

class Program
{
    static void Main()
    {
        LimitInt li = (LimitInt)500;
        Int a = (Int)li;
    }
}
```

### typeof 运算符
typeof 运算符返回作为其参数的任何类型的 System.Type 对象。
``` csharp
Type t = typeof(SomeClass);
``` 

GetType 方法也会调用 typeof 运算符。

## 语句
***  
我们只介绍一下 C# 中比较特殊的语句。
C# 中 switch 语句比较特殊的地方在于: 每个 case 语句必须有控制跳转语句如 break，return 等，除非两个 case 语句中没有任何可执行语句: 
``` csharp
switch(x)
{
    case 1:
    case 2:
    //...
    break;  //正确
    case 3:
    //...
    case 4:
    //...
    break;  //错误
}
```
我们可以使用 foreach 遍历数组中的元素，就像 Objective-C 中的 forin 一样。

对于某些非托管对象，有数量限制或很耗费系统资源，在使用完成之后，应该尽快释放他们，我们就应使用 using 语句简化该过程确保资源被适当处置(dispose)。
**资源是指实现了 System.IDisposable 接口的类或结构。**
``` csharp
//先分配资源，在使用资源
using (ResourceType Identifier = Expression) Statement
```