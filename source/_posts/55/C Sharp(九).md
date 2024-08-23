---
title: C Sharp(九)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog55.jpg
date: 2018/09/16
---

前几篇，我们都在讲类型，这一篇，我们来说说事件成员。

## 发布者和订阅者
***  
很多程序都会有一个需求: 当一个特定事件发生时，程序的其他部分可以得到这个事件发生的通知。
发布者/订阅者模式可以满足这个需求: 
发布者定义了一系列事件，其他类可以注册某些事件，以便在事件发生时，订阅者可以收到通知响应事件。订阅者注册事件时提供的方法称为回调函数或者事件处理程序。

在 Objective-C 中，我们可以在某些类 addObserver 注册一些事件处理程序，当事件发生时，pushNotifacitation。在 JavaScript 中，我们同样可以 addEventListener 注册一些事件处理程序。

发布者: 发布某个事件的类或结构
订阅者: 注册并在事件发生时得到通知执行事件处理程序的类或结构
事件处理程序: 当事件发生时执行的回调函数

**事件包含了一个私有委托**。
关于事件的私有委托: 
- 事件提供了对他的私有委托的结构化访问，我们无法直接访问私有委托
- 对于事件，我们只可以添加，删除和调用事件处理程序
- 事件触发时，会依次调用调用列表的方法

## 声明事件
***  
发布者类必须提供事件对象。声明事件需要委托类型和事件名: 
``` csharp
class MyCls
{
    //声明事件: event 关键字，EventHandler 委托类型，CountedADozen 事件名
    public event EventHandler CountedADozen;
}
```
注意: 事件是成员而不是类型，由于他是成员: 
- 我们不能在可执行代码中声明事件
- 必须声明在类或结构中
- 声明事件需要委托类型，我们可以声明一个委托或使用已存在的。

BCL 声明了一个 EventHandler 的委托，专门处理系统事件。

## 订阅事件
***  
订阅者向事件添加处理程序: 
- 使用 += 运算符为事件添加事件处理程序
- 事件处理程序可以是: 
  1. 实例方法名称
  2. 静态方法名称
  3. 匿名方法
  4. Lambda 表达式

``` csharp
cls.CountedADozen += IncreatmentCountedADozen;
cls.CountedADozen += ClassB.CountedHandlerB;
cls.CountedADozen += () => DozensCount ++;
```

## 触发事件
***  
触发事件时要注意: 
- 触发前要与 null 比较，如果是 null，则不能执行
- 触发事件的语法与调用方法一样