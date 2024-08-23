---
title: C Sharp(十四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog60.jpg
date: 2018/09/27
---

这一篇，讲讲 LINQ。
LINQ(发音同 link，不要读成 lin-q)代表语言集成查询(Language Integrated Query)，他是 .Net 的扩展，允许我们很轻松的操作对象集合。
LINQ 的出现也就意味着允许我们在 C# 中使用函数式编程的思想。

### 匿名对象
创建匿名对象与创建具名对象类似，只是没有类名和构造函数: 
``` csharp
new { FieldProp = InitExpr; FieldProp = InitExpr, ... };
```

注意: 
- 匿名对象只能用于局部变量，不能用于成员
- 必须是由 var 作为类型
- 不能设置属性，匿名对象的属性是只读的

### 方法语法和查询语法
我们再写 LINQ 可以使用两种语法: 
- 方法语法
- 查询语法

微软推荐使用查询语法，但是我更习惯方法语法。  
**更新: 查询语法真香！**

### 查询变量
LINQ 查询返回两种类型的结果: 
- 可枚举的类型
- 单一标量

### 标准查询运算符
标准查询运算符由一系列 API 方法组成，标准查询运算符特性如下: 
- 被查询的集合对象称为序列，必须实现 IEnumerable<T> 接口
- 标准查询运算符使用方法语法
- 一些运算符返回 IEnumerable<T> 对象，一些则返回标量
- 很多操作都以谓词作为参数，谓词是一个方法，以对象作为参数，根据是否满足条件返回 true 或 false

``` csharp
class Program
{
    static int[] numbers = new int[] { 1, 2, 3 };
    static void Main()
    {
        int total = numbers.Sum();  // 6
        int howMany = numbers.Count(); // 3
    }
}
```

C# 中的序列包括 Array、List<T>、Dictionary<T1, T2> 等。LINQ 可以以非常强大的方式来操纵这些对象。

共有 47 个标准查询运算符，常用的如: Where(类似于 filter)、Select(类似于 map)、toList<T>、First、FirstOrDefault、Last、LastOrDefault、Take、Skip 等，当我们需要使用高级用法时，我们可以在查询文档。