---
title: ASP.Net MVC(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog70.jpg
date: 2018/12/27
---

这一篇，我们来详细说说 ASP.Net MVC 中特别重要的 Model Binding。

传统的 ASP.Net MVC 中，如果我们想在 Action 方法中获取请求参数，我们使用 Request.QueryString 和 Request 对象。非常笨重!
``` csharp
//Get /Foo/Bar?id=1
public ActionResult Bar()
{
    var id = Request.QueryString["id"];
    //...
    return View();
}

// Post /Foo/Bar
[HttpPost]
public ActionResult Bar()
{
    var id = Request["id"];
    //...
    return View();
}
```

通过模型绑定，MVC 将 http 请求值(从查询字符串或表单集合)转换为 Action 方法的参数。这些参数可以是原始类型或复杂类型。

### 基本类型的绑定
Get 请求的将数据嵌入 QueryString，MVC 自动将 QueryString 转换为 Action 方法参数。
``` csharp
// 以下 Get 请求中的 QueryString  id 将自动映射到 Bar 方法的 id 参数
// /Foo/Bar?id=1
// /Foo/Bar/1
public ActionResult Bar(int id)
{
    //...
}
```

我们还可以在 Action 方法中使用不同数据类型的多个参数。QueryString 的值将根据匹配名称转换为参数。
注意: 绑定是不区分大小写的。
``` csharp
// /Foo/Bar?id=1&name=1ess 或者(/Foo/Bar?Id=1&Name=1ess)
public ActionResult Bar(int id, string name)
{
    //...
}
```

### 复杂类型的绑定
MVC 中的模型绑定自动将 Post 请求的表单字段数据转换为 Action 方法的复杂类型参数的属性。
``` csharp
public class Person
{
    public Guid id {get; set;}
    public string name {get; set;}
    public int age {get; set;}
}
[HttpPost]
public ActionResult Bar(Person person)
{
    //...
}
```

我们还可以使用 Bind attribute 指定模型在绑定中应包含或排除的确切属性。
``` csharp
[HttpPost]
public ActionResult Bar([Bind(Include = "id, name")] Person person)
{
    //...
}

[HttpPost]
public ActionResult Foo([Bind(Exclude= "id")] Person person)
{
    //...
}
```

Bind attribute 可以提高性能。
.Net Framework MVC 的模型绑定只要记住如下原则: 
- Get 请求总在 Query 绑定
- Post 请求总在 Body 绑定