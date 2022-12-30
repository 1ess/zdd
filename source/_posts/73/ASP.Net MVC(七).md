---
title: ASP.Net MVC(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog73.jpg
date: 2018/11/01
---

这一篇，我们讲讲数据验证、布局试图以及 Controller 向 View 传递少量数据的方式。

## 数据注释(DataAnnotations)
***  
ASP.Net MVC 使用 DataAnnotations attribute 实现数据验证。
DataAnnotations 为不同的验证规则内建了许多验证特性，可以应用于模型类的属性。ASP.NET MVC 将自动强制执行这些验证规则并在视图中显示验证消息。

DataAnnotations attribute 位于 System.ComponentModel.DataAnnotations 命名空间。
下面列出 DataAnnotations attribute: 

| Attribute         | 描述                                           |
|-------------------|----------------------------------------------|
| Required          | 表示该属性是必填字段                           |
| StringLength      | 定义字符串字段的最大长度                       |
| Range             | 定义数字字段的最大值和最小值                   |
| RegularExpression | 指定字段值必须与指定的正则表达式匹配           |
| CustomValidation  | 指定的自定义验证方法以验证字段                 |
| EmailAddress      | 使用电子邮件地址格式验证                       |
| FileExtension     | 使用文件扩展名进行验证                         |
| MaxLength         | 指定字符串字段的最大长度                       |
| MinLength         | 指定字符串字段的最小长度                       |
| Phone             | 指定该字段是使用电话号码的正则表达式的电话号码 |

我们在 Controller 的 Action 方法中使用 ModelState.IsValid 属性，来判断模型是否通过验证。

它为每个字段调用 HtmlHelper 的扩展方法 ValidationMessageFor，并在顶部调用 ValidationSummary 方法。
ValidationMessageFor 负责显示指定字段的错误消息。ValidationSummary 一次显示所有错误消息的列表。

## Layout View
***  
一个应用程序可能会有一些公共 UI 部分，如 logo、导航部分、footer 部分等。ASP.NET MVC 引入了一个 Layout 视图，使得我们不必在每个页面中编写相同的代码。

Razor 的布局视图和普通视图一样，以 .cshtml 作为后缀，存储在 View/Shared 文件夹中。脚手架会自动创建一个 _Layout.cshtml 文件。
布局视图中会调用 RenderBody 方法和 RenderSection 方法。RenderBody 就像其他视图的占位符一样，将使用该布局文件的视图注入。

### 使用布局视图
默认情况下，Views 文件夹中有一个 _ViewStart.cshtml。它使用 Layout 属性为文件夹及其子文件夹中的所有视图设置默认布局页面。您可以将任何布局页面的有效路径分配给布局属性。
我们也可以在单个视图中设置 Layout 属性，覆盖 _ViewStart.cshtml 中的布局视图。可以设置为 null，不使用布局视图。

### 渲染方法
ASP.NET MVC 布局视图使用以下方法呈现子视图: 
- RenderBody，呈现子视图中不在命名部分内的部分。布局视图必须包含 RenderBody 方法。
- RenderSection，呈现命名部分的内容并指定该部分是否是必需的。RenderSection 方法在布局视图中是可选的。

RenderSection 方法指定一个部分的名称，在子视图中使用 @section 定义命名部分，在运行时，子视图将在调用 RenderSection 方法的适当位置呈现。
索引视图的其余部分(不在任何已命名的部分中)将呈现调用 RenderBody 方法的位置。

## 数据传输
***  
模型对象用于在 Razor 视图中发送数据。但是，在某些情况下，您可能希望向视图发送少量临时数据。有三种方法: 
- ViewBag
- ViewData
- TempData

### ViewBag
viewBag 是 ControllerBase 类的动态类型属性，ControllerBase 是之前我们说的 Controller 类型的基类。

使用点语法将属性附加到 ViewBag，并在控制器中为其指定其值，可以在视图中使用 @ViewBag. 方法获取该属性。
注意: ViewBag 仅将数据从控制器传输到视图，反之不行。如果发生重定向，ViewBag 值将为 null。
ViewBag 是 ViewData 的包装器。

### ViewData
ViewData 类似于 ViewBag。它在将数据从 Controller 传输到 View 时非常有用。
ViewData 是一个字典，可以包含键值对，其中每个键必须是字符串。

ViewData 仅将数据从控制器传输到视图。它仅在当前请求期间有效。

注意: 我们必须将 ViewData 值强制转换为适当的数据类型。
ViewData 和 ViewBag 都在内部使用相同的字典。因此，您不能将 ViewData Key 与 ViewBag 的属性名称匹配，否则会抛出运行时异常。

### TempData
TempData 可用于存储可在后续请求中使用的临时数据。在完成后续请求后，TempData 将被清除。

当您想要将非敏感数据从一个 Action 方法传输到相同或不同控制器的另一个 Action 方法以及重定向时，TempData 非常有用。

假如我们在第一个请求中的 TempData 中添加了测试数据，在第二个后续请求中，我们从 TempData 访问了我们存储在第一个请求中的测试数据。但是，您无法在第三个请求中获取相同的数据，因为 TempData 将在第二个请求后被清除。

调用 TempData.Keep() 可以在第三个连续请求中保留 TempData 值。