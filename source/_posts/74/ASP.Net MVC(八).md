---
title: ASP.Net MVC(八)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog74.jpg
date: 2018/11/02
---

这一篇，我们详细讲讲 .Net MVC 中的 Filter。

默认情况，在 ASP.NET MVC 中，用户请求被路由到适当的控制器和 Action 方法。
但是，在某些情况下，您可能希望在执行 Action 方法之前或之后执行某些逻辑。ASP.NET MVC 为此提供了过滤器(filters)。

ASP.NET MVC Filter 是一个自定义类，您可以在其中编写自定义逻辑，以便在执行 Action 方法之前或之后执行。
过滤器(filters)可以以声明或编程方式应用于 Action 方法或控制器。
声明方式是指通过提供一个 Filter attribute 给 Action 方法或控制器。
编程方式是指通过实现对应的接口。

MVC 提供不同类型的过滤器: 

| 过滤器类型            | 描述                                                            | 内建过滤器                  | Interface            |
|-----------------------|---------------------------------------------------------------|-----------------------------|----------------------|
| Authorization filters | 在执行 Action 方法之前执行身份验证和授权。                       | [Authorize], [RequireHttps] | IAuthorizationFilter |
| Action  filters       | 在执行 Action 方法之前执行某些操作。                             |                             | IActionFilter        |
| Result  filters       | 在执行 view result 之前执行身份验证和授权。                      | [OutputCache]               | IResultFilter        |
| Exception  filters    | 如果在执行 ASP.NET MVC 管道期间抛出未处理的异常，则执行某些操作。 | [HandleError]               | IExceptionFilter     |

如: 当发生未处理的异常时，此内置 HandleErrorAttribute 类在默认情况下呈现 Shared 文件夹中包含的 Error.cshtml。
注意: 请确保在 web.config 的 System.web 部分中启用了 CustomError 模式，以便 HandleErrorAttribute 正常工作。
``` xml
<customErrors mode="On" /> 
```

注意，未处理的异常是指 try-catch 块未处理的异常。

## 注册 Filters
***  
Filters 可以被应用于三个等级: 
- Global 等级
- Controller 等级
- Action 方法等级

### Global 等级
在 Global.asax.cs 文件的 Applicaton_Start 方法中，调用 FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters); 来注册一个全局等级的过滤器。
``` csharp
protected void Application_Start()
{
    FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
}
```

默认情况下，在使用 Visual Studio 创建的每个 MVC 应用程序中，[HandleError]过滤器在 MVC 应用程序中全局应用。

### Controller 等级
过滤器也可以应用于控制器类。因此，如果将过滤器应用于控制器类，则过滤器将适用于 Controller 类的所有 Action 方法。

``` csharp
[HandleError]
public class HomeController : Controller
{
    public ActionResult Index()
    {
        return View();
    }

}
```

### Action 方法等级
也可以将过滤器应用于单个 Action 方法。因此，过滤器仅适用于该特定的 Action 方法。
``` csharp
public class HomeController : Controller
{
    [HandleError]
    public ActionResult Index()
    {
        return View();
    }

}
```

## Filter 顺序
***  
如上所述，MVC 包括不同类型的过滤器，并且多个过滤器可以应用于单个控制器类或动作方法。因此，过滤器按以下顺序运行: 
- Authorization filters
- Action filters
- Result filters
- Exception filters

## Action Filters
***  
### OutputCache attribute
OutputCache 是​​一个内置的动作过滤器 attribute，可以应用于我们想要缓存输出的 Action 方法。
``` csharp
[OutputCache(Duration=100)]
public ActionResult Index()
{
    return View();
}
```

### 自定义 Action Filter
您可以通过两种方式创建自定义 Action 过滤器: 
- 实现 IActionFilter 接口，以及使用 FilterAttribute 类
- 继承 ActionFilterAttribute 抽象类


IActionFilter 接口要实现下面方法: 
``` csharp
void OnActionExecuted(ActionExecutedContext filterContext);
void OnActionExecuting(ActionExecutingContext filterContext);
```

ActionFilterAttribute 抽象类则要 override 如下方法: 
``` csharp
void OnActionExecuted(ActionExecutedContext filterContext);
void OnActionExecuting(ActionExecutingContext filterContext);
void OnResultExecuted(ResultExecutedContext filterContext);
void OnResultExecuting(ResultExecutingContext filterContext);
```

Action 过滤器通常用于日志记录，缓存，授权等。

```csharp
public class LogAttribute : ActionFilterAttribute
{
    public override void OnActionExecuted(ActionExecutedContext filterContext)
    {
        Log("OnActionExecuted", filterContext.RouteData); 
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        Log("OnActionExecuting", filterContext.RouteData);      
    }

    public override void OnResultExecuted(ResultExecutedContext filterContext)
    {
        Log("OnResultExecuted", filterContext.RouteData);      
    }

    public override void OnResultExecuting(ResultExecutingContext filterContext)
    {
        Log("OnResultExecuting ", filterContext.RouteData);      
    }

    private void Log(string methodName, RouteData routeData)
    {
        var controllerName = routeData.Values["controller"];
        var actionName = routeData.Values["action"];
        var message = String.Format("{0}- controller:{1} action:{2}", methodName, 
                                                                    controllerName, 
                                                                    actionName);
        Debug.WriteLine(message);
    }
}

[Log]
public class FooController : Controller
{
    public ActionResult Index()
    {
        return View();
    }

    public ActionResult About()
    {
        return View();
    }

    public ActionResult Contact()
    {
        return View();
    }
}
```