---
title: ASP.Net MVC(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog69.jpg
date: 2018/10/25
---

这一篇，我们具体说说 Controller、Model 和 View。

## Controller
***  
在 MVC 中，Controller 是用来处理用户请求的。Controller 是一个类，继承自 System.Web.Mvc.Controller。
控制器类中访问修饰符为 public 的方法称为 Action 方法。
Controller 和 Action 方法一起，用来处理来自客户端的请求，检索必要的模型数据并返回适当的响应。
在 ASP.Net MVC 中，每个控制器类名称必须以 Controller 结尾，此外，每个控制器类必须位于 MVC 文件夹结构的 Controllers 文件夹中。

### Action 方法
Action 方法的特征: 
- Action 方法必须是 public，不能是 private 或 protected
- Action 方法不能 overloaded
- Action 方法不能是 static 方法

### 默认 Action 方法
每个 Controller 都有默认的 Action 方法定义在 RouteConfig 类中。

### ActionResult 类型
Action 方法一般需要返回 ActionResult 类型的返回值。
View() 方法就是定义在基类中 Controller 中，返回 ActionResult 类型。
MVC 框架包括各种可以被 Action 方法返回的 result 类型。result 类型表示不同类型的响应，如: HTML，file，string，Json，JavaScript 等。

| Result 类型            | 描述                 | Base Controller 方法 |
|------------------------|--------------------|----------------------|
| ViewResult             | 返回 HTML            | View()               |
| EmptyResult            | 什么都不返回         |                      |
| ContentResult          | 返回字符串           | Content()            |
| FileContentResult      | 返回文件内容         | File()               |
| JavaScriptResult       | 返回 JS              | JavaScript()         |
| JsonResult             | 返回 JSON            | Json()               |
| RedirectResult         | 重定向新的 url       | Redirect()           |
| RedirectToRouteResult  | 重定向其他的 Action  | RedirectToAction()   |
| HttpUnauthorizedResult | 返回 HTTP 403 status |                      |

ActionResult 类是所有上述结果类的基类。

### Action Selectors
Action Selectors 是应用于 Action 方法的 attribute。
Action Selectors 有助于路由引擎选择正确的操作方法来处理特定请求。
MVC 5 包括如下 action selector attributes:
- ActionName
- NonAction
- ActionVerbs

#### ActionName
ActionName 允许我们指定与 Action 的名称不同的操作名称。
``` csharp
public class FooController : Controller
{
    [ActionName("bar")]
    public ActionResult foo(int id)
    {
        return View();
    }
}
```
上面的例子，我们应发送 http://localhost/foo/bar/1 而不是 http://localhost/foo/foo/1。

#### NonAction
NonAction selector attribute 指示 Controller 的公共方法不是 Action 方法。
如果需要控制器中的公共方法但不希望将其视为 Action 方法，就需要使用 NonAction attribute。

``` csharp
public class FooController : Controller
{  
    [NonAction]
    public Bar GetBar(int id)
    { 
        return barList.FirstOrDefault(s => s.Id == id);
    }
}
```

#### ActionVerbs(行为动词)
控制 Action 方法所使用的 HTTP 方法，需要使用 ActionVerbs。
如: 我们可以使用相同的 ActionName 定义两个不同的操作方法，一个操作方法响应 HTTP Get 请求，另一个操作方法响应 HTTP Post 请求。

ActionVerbs 包括: 
HttpGet，HttpPost，HttpPut，HttpDelete，HttpPatch，HttpOptions，HttpHead
我们也可以使用 AcceptVerbs attribute 接受多个 HttpVerbs，如: 
``` csharp
[AcceptVerbs(HttpVerbs.Post | HttpVerbs.Get)]
public ActionResult GetAndPostMethod()
{
    return RedirectToAction("Index");
}
```

## Model
***  
Model 表示 MVC 架构中的域特定数据和业务逻辑。
模型类在公共属性中保存数据。所有 Model 类都保存在 Models 文件夹中。

## View
***  
View 是一个用户界面。 View 将模型中的数据显示给用户，并使他们能够修改数据。
视图存储在 Views文件夹中。

单个控制器类的不同 Action 方法可以呈现不同的视图，因此 Views 文件夹包含每个控制器的单独文件夹，其名称与控制器相同。View 文件名与 Action 方法同名。

### Razor View Engine
Microsoft 在 MVC 3 中推出了 Razor 视图引擎，我们可以在 Razor 视图混合写服务端代码和 html 标签 。
Razor 使用 @ 字符来编写服务端代码， Razor 视图以 .cshtml 作为后缀。

之后我们会详细介绍 Razor 语法，这里我们先看看其他重要的概念。

### 创建视图
最佳实践是使得视图名与 Action 方法同名，使得当我们返回 View 时无需传递路径作为参数。
ASP.NET MVC 中的每个视图都派生自 System.Web.Mvc 命名空间中的 WebViewPage 类。