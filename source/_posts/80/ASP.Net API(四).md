---
title: ASP.Net API(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog80.jpg
date: 2018/11/27
---

本篇，我们讲讲 Web API 如何处理不同格式的请求和响应数据。

Web API 包括对 JSON，XML，BSON 和 form-urlencoded 数据的内置支持，这意味着它会自动将请求/响应数据转换为这些格式(开箱即用)。

## Media-Type Formatters
***  
Web API 包括以下内置媒体类型格式化程序。

| JsonMediaTypeFormatter           | MIME Type                         | 描述                                        |
|----------------------------------|-----------------------------------|-------------------------------------------|
| JsonMediaTypeFormatter           | application/json, text/json       | 处理 JSON 格式                              |
| XmlMediaTypeFormatter            | application/xml, text/xml         | 处理 XML 格式                               |
| FormUrlEncodedMediaTypeFormatter | application/x-www-form-urlencoded | 处理 HTML form URL-encoded 数据             |
| JQueryMvcFormUrlEncodedFormatter | application/x-www-form-urlencoded | 处理 model-bound HTML form URL-encoded 数据 |

GlobalConfiguration.Configuration.Formatters 返回包含所有格式化程序类: 
``` csharp
public class FormattersController : ApiController
{
    public IEnumerable<string> Get()
    {
        IList<string> formatters = new List<string>();

        foreach (var item in GlobalConfiguration.Configuration.Formatters)
        {
            formatters.Add(item.ToString());
        }

        return formatters.AsEnumerable<string>();
    }
}

/*
[
    "System.Net.Http.Formatting.JsonMediaTypeFormatter",
    "System.Net.Http.Formatting.XmlMediaTypeFormatter",
    "System.Net.Http.Formatting.FormUrlEncodedMediaTypeFormatter",
    "System.Web.Http.ModelBinding.JQueryMvcFormUrlEncodedFormatter"
]
*/
```

## 配置 JSON 序列化
***  
在内部，JsonMediaTypeFormatter 使用名为 Json.NET 的第三方开源库来执行序列化。

可以在 WebApiConfig 类中配置 JSON 格式化程序。JsonMediaTypeFormatter 类包括各种属性和方法，您可以使用它们自定义 JSON 序列化。例如，Web API 默认使用 PascalCase 写入 JSON 属性名称。要使用 camelCase 编写 JSON 属性名称，请在序列化程序设置上设置 CamelCasePropertyNamesContractResolver。

``` csharp
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
        config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        //new DefaultContractResolver() 默认 PascalCase 命名属性 
    }
}
```

我们还可以自定义命名策略: 
``` csharp
//WebApiConfig class
DefaultContractResolver defaultContractResolver = new DefaultContractResolver
{
    NamingStrategy = new MyStrategy()
};
config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = defaultContractResolver;

//MyStrategy class
public class MyStrategy: NamingStrategy
{
    protected override string ResolvePropertyName(string name)
    {
        //策略
    }
}
```

## Web API Filters
***  
Filters 可用于提供例如日志记录、异常处理、性能测量、身份验证和授权等功能。
Web API 使用 Filters 在执行 Action 方法前后来添加一些额外的逻辑。
Filters 实际上是可以应用于 Web API Controller 或 Action 方法的 Attribute。