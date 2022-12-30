---
title: ASP.Net MVC(五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog71.jpg
date: 2018/10/28
---

本篇，我们再来详细说说 ASP.Net MVC 中的 Razor 语法。

### 什么是 Razor
Razor 是 ASP.Net MVC 中支持的视图引擎，它允许我们混写服务端代码如 C#、VB 等和 HTML 标签，如果使用 C#，那么文件以 .cshtml 作为后缀。

下面我们具体来讲解 C# Razor 语法。
### 单行表达式
以 @ 符号开始，在 .cshtml 文件中开始写服务端代码。如下: 
``` csharp
<h2>Razor Syntax</h2>
<h2>@DateTime.Now.ToShortDateString()</h2>
```
注意: 在单行表达式在表达式的末尾不需要分号。

### 多行语句代码块
如果要写多行服务端代码，必须写在 @{...} 中，服务端代码每行的末尾以分号结束。在代码块中声明的变量，之后可以用 @variable 来使用。
``` csharp
@{
    var date = DateTime.Now.ToShortDateString();
    var msg = "Hello Razor!";
}

<h1>@msg</h1>
<h2>@date</h2>
```

### 代码块中展示文本
如果想在 @{...} 中展示文本，需要使用 @: 或者 &lt;text&gt;&lt;/text&gt; 标记: 
``` csharp
@{
    var date = DateTime.Now.ToShortDateString();
    var msg = "Hello Razor!";
    @: Today is @date. <br>
    @msg
}

@{
    var date = DateTime.Now.ToShortDateString();
    var msg = "Hello Razor!";
    <text>Today is</text> @date.<br>
    @msg
}
```

### 条件语句
在 Razor 中可以使用条件语句 if-else，但是必须以 @ 开头，语句内容必须包裹在代码块{...}中: 
``` csharp
@if(DateTime.IsLeapYear(DateTime.Now.Year)) {
    @DateTime.Now.Year @: is leap year.
}
else {
    @DateTime.Now.Year @: is not leap year.
}
```

### for 循环语句
``` csharp
@for (int i = 0; i < 5; i++) {
    @i.ToString() <br>
}
```

### Model
我们可以使用 @model 在视图中使用模型对象。
``` csharp
@model Student
<h2>@Model.Age</h2>
```