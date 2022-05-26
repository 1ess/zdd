---
title: C Sharp(十三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog59.jpg
date: 2018/11/19
---

这一篇，我们看看 C# 中的枚举器和迭代器的基本概念。
之前我们说过可以使用 foreach 来遍历数组元素，本篇来讨论为什么数组可以使用 foreach 语句处理，我们可以还使用迭代器来使得自定义类型也可以使用 foreach。

## 枚举器和可枚举类型
***  
为什么数组可以使用 foreach 呢？因为数组可以提供一个枚举器(enumerator)对象。枚举器对象可以依次返回数组元素。
获取一个对象的枚举器可以调用对象的 GetEnumerator 方法。实现了 GetEnumerator 方法的对象称为可枚举(enumerable)对象。

foreach 语句就是用来配合可枚举类型一起使用的，他会执行下列行为: 
- 调用 GetEnumerator 方法获取对象的枚举器
- 从枚举器请求每一项作为迭代变量(iteration variable)，我们可以读取该变量但不能改变

``` csharp
foreach (Type ValName in EnumerableObject) {
    //...
}
```

### IEnumerator 
实现 IEnumerator 接口的枚举器包含三个函数成员: 
- Current: 返回当前位置项的属性，只读
- MoveNext: 把枚举器位置前进到集合下一项的方法，返回布尔值，位置有效返回 true，无效(到达尾部)返回 false。枚举器原始位置在第一项之前，因此在使用 Current 之前必须先调用 MoveNext
- Reset: 位置重置为原始状态

下面代码与直接使用 foreach 产生的结果是一样的: 
``` csharp
using System.Collections;

class Program
{
    static void Main(string[] args)
    {
        int[] MyArr = { 1, 2, 3, 5, 6, 7 };
        IEnumerator ie = MyArr.GetEnumerator();
        while (ie.MoveNext())
        {
            int current = (int)ie.Current;
            Console.WriteLine(current);
        }
    }
}
```

### IEnumerable
可枚举类型是指实现了 IEnumerable 接口的类。IEnumerable 只有一个函数成员: 
- GetEnumerator: 获取可枚举类型的枚举器

``` csharp
using System.Collections;

class MyClass : IEnumerable
{
    public IEnumerator GetEnumerator()
    {
        //...
    }
}
```

### 使用 IEnumerator 和 IEnumerable 示例
``` csharp
using System.Collections;

class ColorEnumerator : IEnumerator
{
    private string[] _colors;
    private int _position = -1;
    public ColorEnumerator(string[] colors)
    {
        _colors = new string[colors.Length];
        for (int i = 0; i < colors.Length; i++) {
            _colors[i] = colors[i];
        }
    }

    public object Current {
        get {
            if (_position <= -1 || _position >= _colors.Length) {
                throw new InvalidOperationException();
            }
            return _colors[_position];
        }
    }

    public bool MoveNext(()
    {
        if (_position < _colors.Length - 1) {
            _position++;
            return true;
        }
        return false;
    }

    public void Reset() 
    {
        _position = -1;
    }
}

class Colors : IEnumerable
{
    private string[] _colors;
    public Colors(string[] colors)
    {
        _colors = new string[colors.Length];
        for (int i = 0; i < colors.Length; i++) {
            _colors[i] = colors[i];
        }
    }

    public IEnumerator GetEnumerator()
    {
        return new ColorEnumerator(_colors);
    }
}

class Progeam
{
    static void Main()
    {
        Colors colors = new Colors(new string[] {"red", "green", "blue", "yellow"});
        foreach (string color in colors) {
            Console.WriteLine(color);
        }
    }
}
```

### 泛型枚举接口
之前我们写的都是非泛型版本，实际工作中，我们基本都使用泛型版本的 IEnumerator<T> 和 IEnumerable<T> 。非泛型版本只是兼任 2.0 版本之前无泛型的遗留代码。

泛型与非泛型版本的主要区别是: 
- IEnumerable<T> 接口的 GetEnumerator 方法要返回实现 IEnumerator<T> 接口的枚举器实例
- 泛型版本的 Current 属性返回的不是 object 类型，而是实际类型的对象

### 迭代器
C# 2.0 之后，提供了更简单的创建枚举器和可枚举类型的方式。这种结构称为迭代器(iterator)。
- 迭代器返回一个泛型的枚举器
- yield return 语句声明这是枚举的下一项

``` csharp
public IEnumerator<string> BlackAndWhite()
{
    yield return "black";
    yield return "gray";
    yield return "white";
}
```