---
title: C Sharp(七)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog53.jpg
date: 2018/09/13
---

这一篇，我们讲讲 C# 中的数组对象及其协变概念。

## 概述
***  
数组是由变量名表示的一组同类型的数据元素，每个元素可以通过索引来访问。

C# 数组的特点: 
- C# 不支持动态数组，也就是数组一旦创建，就不可以更改大小
- 索引从 0 开始

### 数组类型
C# 支持一维数组和多维数组，多维数组又分为矩形数组和交错数组。

### 数组是对象
数组实例是从 System.Array 继承来的对象，继承了很多属性和方法: 
- Rank 属性，返回数组的维数
- Length 属性，返回数组的长度

注意: 数组是引用类型，数组元素可以是值类型也可以是引用类型，这一点与 Ocjective-C 不同，Ocjective-C 中的数组元素不能是基本类型。

### 一维数组
我们可以在类型和变量名之间加中括号来声明一维数组: 
``` csharp
long[] array;
```

要实例化一维数组，我们使用数组创建表达式，使用 new 操作符，后跟基类名称和中括号，中括号里要有数组长度: 
``` csharp
int[] array = new int[5];
```

要访问数组元素，要使用索引: 
``` csharp
int[] array = new int[5];
array[2] = 10;
int intVal = array[2];
```

### 初始化数组
当数组创建后，每个元素会自动初始化默认值: 
- 整型: 0
- 浮点数: 0.0
- 布尔型: false
- 对象: null

我们还可以使用初始化列表显式初始化数组元素: 
``` csharp
int[] array = new int[] { 2, 3, 4, 5};
```

当在一条语句声明并初始化数组时，可以使用快捷语法: 
``` csharp
int[] array = {1, 2, 3, 4};
```

我们可以使用 foreach 语句遍历数组元素: 
``` csharp
int[] array = {1, 2, 3, 4};
foreach (var item in array) 
{
    //...item
}
```

### 数组的协变
协变和逆变我们之后说泛型的时候会细讲，这里我们只是提一下数组中的协变。
协变是指: 即使某个对象不是数组的基类型，我们也可以把他赋值给数组元素。以下情况可以使用数组协变: 
- 数组是引用类型数组
- 赋值类型和数组基类类型存在显式或隐式转换

由于基类和派生类总存在隐式转换，因此我们可以把派生类对象赋值给基类型数组元素: 
``` csharp
class A {}
class B : A {}

class Program
{
    static void Main()
    {
        A[] array = new A[3];
        A[0] = new B();
    }
}
```