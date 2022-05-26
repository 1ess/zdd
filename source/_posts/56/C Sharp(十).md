---
title: C Sharp(十)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog56.jpg
date: 2018/11/10
---

这一篇，我们再回来说说最后一种类型: 接口(interface)。

### 什么是接口
接口是指定一组函数成员而不实现他们的引用类型。
``` csharp
interface IInfo
{
    string GetName();
    string GetAge();
}
```

我们可以用类或结构来实现接口。
``` csharp
class MyCls: IComparable
{
    public int TheValue;
    public int  CompareTo(object obj)
    {
        MyCls cls = (MyCls)obj;
        if (TheValue > cls.TheValue) return 1;
        if (TheValue < cls.TheValue) return -1;
        return 0;
    }
}
```

### 接口声明
- 接口声明不能包含数据成员和静态成员
- 接口只能包含如下非静态成员: 
  1. 方法
  2. 属性
  3. 事件
  4. 索引器

- 接口应该以大写字母 I 开始

``` csharp
public interface IMyInterface
{
    //注意: 接口函数成员不能有访问修饰符
    int DoStuff(int val);
}
```

### 实现接口
要实现接口: 
- 与继承类似，类或结构后跟冒号，再跟接口名
- 为每一个接口成员提供实现

注意: 如果有继承，并实现接口，基类名必须出现在接口之前: 
``` csharp
class Derived : BaseClass, IIfc1, IIfc2
{
    //...
}
```

### 实现多个接口
- 类或结构可以实现任意数量的接口
- 所有实现的接口，必须列在基类列表以逗号分隔

### 接口可以继承接口
与类的继承不同，接口可以多继承。
``` csharp
interface IData : IDataR, IDataS
{
    //...
}
```