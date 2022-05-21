---
title: ASP.Net MVC(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog68.jpg
date: 2018/12/24
---

这一篇，我们来详细讲讲关于 ASP.Net MVC 中的路由。

## ASP.Net MVC 中的路由
***  
在 Web Form 应用，每个 URL 必须匹配一个 .aspx 物理文件，如: http://domain/bar.aspx 必须有一个用于响应渲染的文件 bar.aspx。
ASP.Net MVC 则通过引入 Routing 来消除必须使用物理文件映射 URL 的弊端。
路由使我们能够定义映射到请求处理程序的 URL 模式。请求处理程序在 WebForm 中是 .aspx 文件，在 MVC 中是 Controller 以及 Action 方法。
例如: http://domain/foo 
- 在 WebForm 中映射为 foo.aspx 文件
- 在 MVC 中映射为 FooController 以及 Index 方法。

## 路由处理过程
***  
Route 定义了 URL 模式，应用所有的配置路由存储在 RouteTable ，然后通过路由引擎确定传入请求的适当处理程序类。

处理过程: 
URL Request 经过 Route Engine，判断 URL 是否匹配 RouteTable 中 URL 模式，如果不匹配，直接返回 404 Error，如果匹配，则经过对应的 Controller 和 Action 处理，返回响应。

## 配置一个路由
***  
每个应用至少配置或者说注册一个路由(MVC 默认为我们注册了一个)，我们可以在 App_Start 文件夹下的 RouteConfig 类中注册路由: 
``` csharp
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        //忽略路由
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            
        routes.MapRoute(
            name: "Default",  //路由名称
            url: "{controller}/{action}/{id}", //URL 模式
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional } //默认路由
        );
    }
}
```

### URL 模式
我们上面一直说 URL 模式，那什么是 URL 模式呢?
URL 模式指域名及端口之后的 URL 部分。
如果域名之后什么都没有，那么默认路由将会处理请求。

### 多路由
我们可以使用 RouteCollection 的扩展方法 MapRoute()，来配置其他路由。
name 和 url 参数是必须的，defaults 参数是可选的。
``` csharp
public class RouteConfig
{
    public static void RegisterRoutes(RouteCollection routes)
    {
        routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

        routes.MapRoute(
            name: "Foo",
            url: "foo/{id}",
            defaults: new { controller = "Foo", action = "Index"}
        );

        routes.MapRoute(
            name: "Default",
            url: "{controller}/{action}/{id}",
            defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
        );
    }
} 
```

上面的代码显示: 以 domain/foo 开头的 url 必须经过 FooController 处理，并且这个模式无须指定 action，因为总要使用 index 方法。
MVC 会评估每个路由，从第一个配置路由开始，如果传入的 URL 不满足 URL 模式，将会开始评估第二个路由，直到找到匹配路由。

注意: 
http://localhost/foo/123 和 http://localhost/foo?Id=123 都将匹配 Foo 路由。

## 路由注册
***  
我们在 RouteConfig 配置路由之后，需要在 Global.asax 文件的 Application_Start 方法注册路由: 
``` csharp
protected void Application_Start()
{
    RouteConfig.RegisterRoutes(RouteTable.Routes);
}
```