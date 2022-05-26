---
title: ASP.Net API(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog77.jpg
date: 2019/01/15
---

ASP.Net Web MVC 的知识我们也复习了大概，基础内容已经覆盖了大部分，从本篇开始，我们来认识一下 ASP.Net Web API。

## Web API 是什么
***  
简单来说，API 是某种接口，它具有一组允许程序员访问应用程序，操作系统或其他服务的特定功能或数据的功能。
Web API 顾名思义，是一个可以使用 HTTP 协议访问的 Web 上的 API。这是一个概念，而不是一种技术。我们可以使用不同的技术(如 Java，.NET 等)构建 Web API。

## ASP.NET Web API
***  
ASP.NET Web API 是一个可扩展的框架，用于构建基于 HTTP 的服务。它的工作方式与 ASP.NET MVC Web 应用程序的工作方式大致相同，只是它将数据作为响应而不是 HTML 视图。

### 创建 Web API 项目
可以通过两种方式创建 Web API 项目。
- 带有 MVC 项目的 Web API
- 独立 Web API 项目

注意: 通常我们直接创建带有 MVC 项目的 Web API。

### 带有 MVC 项目的 Web API
此项目与默认 MVC 项目相同，其中包含 Web API 的两个特定文件，App_Start 文件夹中的 WebApiConfig.cs 和 Controllers 文件夹中的 ValuesController.cs

WebApiConfig.cs 是 Web API 的配置文件。您可以为 Web API 配置路由和其他内容，类似于 RouteConfig.cs 用于配置 MVC 路由。它还默认创建 Web API 控制器 ValuesController.cs。

## Web API Controller
***  
Web API Controller 类似于 ASP.NET MVC Controller。它处理传入的 HTTP 请求并将响应发送回调用者。

Web API Controller 是一个类，可以在 Controllers 文件夹下或项目根文件夹下的任何其他文件夹下创建。控制器类的名称必须以 Controller 结尾，并且必须继承自 System.Web.Http.ApiController。同 MVC 一样，控制器的所有 public 方法都称为 Action 方法。

基于传入的请求 URL 和 HTTP 动词(GET / POST / PUT / PATCH / DELETE)，Web API 决定执行哪个 Web API Controller 和 Action 方法，例如 Get() 方法和 GetFoos() 方法都将处理 HTTP GET 请求，Post() 方法将处理 HTTP POST 请求，Put() 方法将处理 HTTP PUT 请求，Delete() 方法将处理上述 Web API 的 HTTP DELETE 请求。

如果你想编写不以 HTTP 动词开头的方法，那么你可以在方法上应用适当的 HttpVerbs Attribute，如 HttpGet、HttpPost、HttpPut 等，与 MVC 控制器相同。

### Action 方法命名约定
Action 方法名称可以与 HTTP 动词相同，如 Get、Post、Put、Patch 或 Delete。也可以使用 HTTP 谓词附加任何后缀以提高可读性，如 GetFoos()、PostBar() 等。

## 配置 Web API
***  
Web API 只支持基于代码的配置，它无法在 Web.config 文件中配置。
我们可以配置 Web API 来自定义 Web API 托管和组件的行为，例如 Route、Formatter、Filters、DependencyResolver、MessageHandler、ParamterBindingRules 等。
``` csharp
//WebApiConfig.cs
public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Web API 配置和服务

        // Web API 路由
        config.MapHttpAttributeRoutes();

        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}

//Global.asax
protected void Application_Start()
{
    GlobalConfiguration.Configure(WebApiConfig.Register);
}
```

HttpConfiguration 主类包含以下属性，可以使用这些属性覆盖 Web API 的默认行为: 

| 属性                     | 描述                                                   |
|--------------------------|------------------------------------------------------|
| DependencyResolver       | 获取或设置依赖项注入的依赖项解析程序                   |
| Filters                  | 获取或设置 filters                                     |
| Formatters               | 获取或设置 media-type 格式化                           |
| IncludeErrorDetailPolicy | 获取或设置一个指示错误消息中是否应包含错误详细信息的值 |
| MessageHandlers          | 获取或设置 message handlers                            |
| ParameterBindingRules    | 获取有关如何绑定参数的规则集合。                        |
| Routes                   | 获取为 Web API 配置的路由集合                          |
| Services                 | 获取 Web API 服务                                      |

接下来，我们会详细讲解每个属性。