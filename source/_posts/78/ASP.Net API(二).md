---
title: ASP.Net API(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog78.jpg
date: 2018/11/22
---

之前我们说过 Web MVC 中的路由，本篇，我们看看如何配置 Web API 路由。

Web API 路由类似于 ASP.NET MVC 路由。它将传入的 HTTP 请求路由到 Web API Controller 上的特定 Action 方法。

Web API 支持两种方式的路由: 
- 基于约定的路由(Convention-Based Routing)
- 特性路由(Attribute Routing)

## 基于约定的路由
***  
在基于约定的路由中，Web API 使用路由模板来确定要执行的 Controller 和 Action 方法。必须至少将一个路由模板添加到路由表中才能处理各种 HTTP 请求。
``` csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Enable attribute routing
        config.MapHttpAttributeRoutes();
        
        // Add default route using convention-based routing
        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
```

上面的 config.MapHttpAttributeRoutes() 方法作用是启用特性路由。
config.Routes 是 HttpRouteCollection 类型的路由表或路由集合，使用 MapHttpRoute() 扩展方法在路由表中添加 DefaultApi 路由。

可以创建 IHttpRoute 实例并手动将其添加到集合中，如下: 
``` csharp
// define route
IHttpRoute defaultRoute = config.Routes.CreateRoute("api/{controller}/{id}", 
                                            new { id = RouteParameter.Optional }, null);
// Add route
config.Routes.Add("DefaultApi", defaultRoute);
```

如果 Web API 框架找不到传入请求的匹配路由，同 Web MVC 一样，将发送 404 错误响应。
注意: Web API 还支持与 ASP.NET MVC 相同的路由，在 URL 中包含 Action 方法名称。

### 多路由
可以使用 HttpConfiguration 对象在 Web API 中配置多个路由: 
``` csharp
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        config.MapHttpAttributeRoutes();
    
        // foo route
        config.Routes.MapHttpRoute(
            name: "Foo",
            routeTemplate: "api/foo/{id}",
            defaults: new { controller="foo", id = RouteParameter.Optional }
            constraints: new { id ="/d+" }
        );

                // default route
        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
```

我们在 DefaultApi 路由之前配置了 Foo 路由。因此，任何传入的请求将首先与 Foo 路由匹配，如果不匹配，则再与 DefaultApi 路由进行匹配。

注意: 在路由模板中使用 api 的原因只是为了避免 MVC 控制器和 Web API 控制器混淆。

### 特性路由
Web API 2 支持特性路由。顾名思义，属性路由使用[Route()]特性来定义路由。该特性可以应用于任何 Controller 或 Action 方法。

要使用 Web API 进行特性路由，必须通过调用 config.MapHttpAttributeRoutes() 方法在 WebApiConfig 中启用它。
``` csharp
public class FooController : ApiController
{
    [Route("api/foo/bars")]
    public IEnumerable<string> Get()
    {
        return new string[] { "bar1", "bar2" };
    }
}
```

则我们通过 http://localhost:1234/api/foo/bars 访问上面的 Get 方法。