---
title: C Sharp(十二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog58.jpg
date: 2018/11/14
---

> 理想有两种: 一种，我实现了我的理想；另一种: 理想通过我而实现。

这一篇，讲讲泛型。

## 概述
***  
没有泛型的时候，我们封装的行为都是作用在特定类型上的，但是，很多时候如果我们把行为提取或重构出来，使其可以应用到很多类型上去的话，那么就会更有意义。这也是泛型出现的原因。

我们可以额外增加一层抽象，这样类型就不用再硬编码了，这样就可以使得多段代码在不同类型执行相同的指令成为可能。

之前写 Objective-C 的时候，感觉他的泛型太弱了，现在写 C#，感觉他的泛型系统太好用了！

### 无泛型栈示例
``` csharp
class MyIntStack
{
    int StackPoint = 0;
    int[] StackArray;

    public void push(int x)
    {
        //...
    }

    public int pop()
    {
        //...
    }
}
```

如果希望将相同的功能应用于 float 类型，我们就必须复制粘贴上面的代码再改成 float。
这样做可行，但是缺点明显: 
- 我们要仔细检查类型的修改
- 每当新增类型，就要复制粘贴修改
- 调试维护这些类似的代码易出错

### C# 中的泛型
泛型(generic)提供了更优雅的解决方案，让多个类型共享一组代码。我们可以使用类型占位符书写代码，在创建实例时指明实际类型即可。

C# 提供了 5 种泛型可用在的地方: 类、结构、接口、委托、方法。前四种是类型，最后一种是成员。

### 泛型栈示例
``` csharp
class MyStack<T>
{
    int StackPointer = 0;
    T[] StackArray;
    public void push(T x)
    {
        //...
    }

    public T pop()
    {
        //...
    }
}
```

### 声明泛型类
上面我们已经展示了一个示例来演示泛型类，这里我们具体介绍一下，看看如何创建并使用泛型类。
创建使用非泛型类有两步: 声明类和创建类的实例。
但是泛型类不是实际类，而是类的模板，所以我们必须先从模板构建出实际类型，然后创建这个构建后的类型的实例。

声明步骤: 
- 在类名后放置一对尖括号<>
- 在尖括号中用逗号分隔占位字符串来表示希望提供的类型，这叫做类型参数(type parameters)
- 在泛型类的主体使用类型参数代替实际类型

``` csharp
class SomeClass <T1, T2>
{
    public T1 SomeVal = new T1();
    public T2 OtherVal = new T2();
}
```

### 创建构造类型
列出类名并在尖括号中提供真实类型代替类型参数，我们将替代类型参数的真实类型称为类型实参(type argument)。
``` csharp
SomeClass<short, int>
```

### 创建实例
非泛型类创建实例: 
``` csharp
MyNonGenClass myNGC = new MyNonGenClass();
```

泛型类创建实例: 
``` csharp
SomeClass<short, int> mySc1 = new SomeClass<short, int>();

```

### 类型参数约束
为了让泛型变得更有用，我们需要提供额外信息让编译器知道 type parameter 可以接受哪些类型。
这些额外信息称为约束(constraint)。

#### Where 子句
- 每个 type parameter 都有自己的 where 子句
- 如果有多个约束，在约束列表用逗号分隔

where 子句使用要点: 
- 在关闭尖括号后列出
- where 子句之间不用逗号分隔
- 子句之间可以以任何顺序列出

``` csharp
class MyClass<T1, T2, T3>
                      where T2: Customer
                      where T3: IComparable
{
    //...
}
```

#### 约束类型和次序
共有 5 种类型的约束: 
- 类名: 某种类或类的子类才能做 type argument
- class: 任何引用类型才能做 type argument
- struct: 任何值类型才能做 type argument
- 接口名: 只有这个接口或实现这个接口的类型才能做 type argument
- new(): 任何带有无参构造的类型才能做 type argument

顺序: 
- 主约束必须放在第一位且只有一个: 主约束只能是类名、class 或者 struct
- 接口名约束可以有任意多个
- 如果存在构造约束，必须放在最后

``` csharp
class SortedList<S>
                         where S: IComparable<S> { ... }

class LinkedList<M, N>
                         where M: IComparable<M>
                         where N: ICloneable { ... }

class MyDictionary<KeyType, ValueType>
                              where KeyType: IEnumerable, new() { ... }
```

### 泛型方法
与其他的泛型不同，泛型方法是成员而不是类型，它可以用于泛型、非泛型类、结构或接口。

#### 声明泛型方法
泛型方法具有类型参数和可选的约束。
泛型方法有两个参数列表: 
- 封闭在圆括号内的方法参数列表
- 封闭在尖括号内的类型参数列表

要声明泛型方法: 
- 在方法名之后，方法参数之前放置类型参数列表
- 在方法参数之后放置可选的约束子句

``` csharp
public void PrintData<S, T> (S s, T t) where S: Person
{
    //...
}
```

#### 调用泛型方法
要调用泛型方法，需要在调用时提供类型实参: 
``` csharp
MyMethod<short, int>();
```

如果我们在调用泛型方法时，可以从方法参数推断出类型实参，则可以省略类型实参: 
``` csharp
public void MyMethod<T> (T t)
{
    //...
}

int IntVal = 10;
MyMethod(IntVal);
```

### 泛型结构
与泛型类一样，泛型结构也有类型参数和约束子句。
``` csharp
struct PieceOfData <T>
{
    private T _Data;
    public PieceOfData(T data)
    {
        _data = data;
    }
    public T Data 
    {
        set { _data = value; }
        get { return _data; }
    }
}

class Program
{
    static void Main()
    {
        var intData = new PieceOfData<int>(10);
        Console.WriteLine($"{intData.Data}");
    }
}
```

### 泛型委托
泛型委托与非泛型委托类似，要声明泛型委托，需要在委托名称之后，委托参数列表之前放置类型参数列表: 
``` csharp
delegate R MyDelegate <T, R>(T t);
```
C# 中有两个常用的预定义的泛型委托: Func 和 Action: 
- Action 是无返回值的泛型委托，有 16 个重载(即最多 16 个参数)
- Func 是有返回值的泛型委托，有 17 个重载(即最多 16 个参数和 1 个返回值)

``` csharp
public delegate TR Func <T1, T2, TR>(T1 p1, T2 p2);
class Simple
{
    static string PrintString(int a, int b)
    {
        var total = a + b;
        return total.toString();
    }
}

class Program
{
    static void Main()
    {
        var myDel = new Func <int, int, string>(Simple.PrintString);
        Console.WriteLine($"{myDel(2, 3)}");  // 5
    }
}
```

### 泛型接口
泛型接口允许我们编写参数和返回值是泛型类型参数的接口。我们需要在接口名之后用尖括号放置类型参数列表。
``` csharp
interface IMyIfc<T>
{
    T ReturnIt(T val);
}

class Simple<S>: IMyIfc<S>
{
    public S ReturnIt(S s)
    {
        return s;
    }
}

class Program
{
    static void Main()
    {
        var simple = new Simple<int>();
        Console.WriteLine($"{simple.ReturnIt(3)}");  // 3
    }
}
```