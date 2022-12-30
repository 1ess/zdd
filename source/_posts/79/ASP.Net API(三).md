---
title: ASP.Net API(三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog79.jpg
date: 2018/11/24
---

了解了 Web API 如何将 HTTP 请求路由到 Controller 和 Action 方法。我们将再看看 Web API 如何将 HTTP 请求数据绑定到操作方法的参数。

## Model Binding
***  
Web API 将操作方法​​参数与 URL 的 Query String 或 Request Body 绑定，具体取决于参数类型。
默认情况下，如果参数类型是 .NET 基本类型，则它从 Query String 设置参数的值，如果参数类型是复杂类型，则 Web API 会尝试默认从 Request Body 中获取值。

### 默认 Binding 规则
| HTTP Method | Query String                | Request Body |
|-------------|-----------------------------|--------------|
| GET         | Primitive Type，Complex Type | NA           |
| POST        | Primitive Type              | Complex Type |
| PUT         | Primitive Type              | Complex Type |
| PATCH       | Primitive Type              | Complex Type |
| DELETE      | Primitive Type，Complex Type | NA           |

### [FromUri] 和 [FromBody]
使用 [FromUri] 特性强制 Web API 从 Query String 获取复杂类型的值，[FromBody] 特性从 Request Body 获取基本类型的值。

注意: FromBody 特性只能应用于 Action 方法的一个基本参数。它不能应用于同一个 Action 方法的多个原始参数。

注意与 Web MVC 的区别: 
Web MVC 中，不论是复杂类型还是简单类型，只要是 Get 请求，都从 Query String 获取值，只要是 Post 请求，都从 Request Body 中获取值。
Web API 中，默认情况，简单类型从 Query String 中获取值，复杂类型根据请求方法: Get请求，从 Query String 获取值，Post 请求从 Request Body 获取值。
我们可以使用 [FromUri] 和 [FromBody] 特性强制 Post 请求中简单类型可以从 Request Body 获取，复杂类型可以从 Query String 获取。

## Action 方法返回类型
***  
Web API Action 方法可以具有以下返回类型: 
- void
- 原始类型或复杂类型
- HttpResponseMessage
- IHttpActionResult

### void
并非所有 Action 方法都必须返回某些内容。它可以有 void 返回类型。

### 原始类型或复杂类型
Action 方法可以返回原始或其他自定义复杂类型。

### HttpResponseMessage
Web API Controller 始终将 HttpResponseMessage 的对象返回到托管基础结构.
从 Action 方法发送 HttpResponseMessage 响应的优点是可以按照自己的方式配置响应。如状态码或错误消息等。
``` csharp
public HttpResponseMessage Get(int id)
{
    var foo = GetFooFromDB(id);
    if (foo == null)
    {
        return Request.CreateResponse(HttpStatusCode.NotFound, id);
    }
    return Request.CreateResponse(HttpStatusCode.OK, foo);
}
```

### IHttpActionResult
IHttpActionResult 是在 Web API 2(.NET 4.5)中引入的。 Web API 2 中的 Action 方法可以返回IHttpActionResult 类的实现，类似于 MVC 中的 ActionResult。

我们可以创建自己的类来实现 IHttpActionResult 或者使用 ApiController 类方法返回 IHttpActionResult 的对象。

下面是 ApiController 类方法，它返回实现 IHttpActionResult 接口的类的对象。

| ApiController Method  | 描述                                                                       |
|-----------------------|--------------------------------------------------------------------------|
| BadRequest()          | 创建一个 BadRequestResult 对象，状态码 400.                                 |
| Conflict()            | 创建一个 ConflictResult 对象，状态码 409.                                   |
| Content()             | 创建一个特殊状态码和内容的 NegotiatedContentResult 对象                    |
| Created()             | 创建一个 CreatedNegotiatedContentResult 对象，状态码 201                    |
| CreatedAtRoute()      | 创建一个 CreatedAtRouteNegotiatedContentResult 对象，状态码 201             |
| InternalServerError() | 创建一个 InternalServerErrorResult  对象，状态码 500 Internal server error. |
| NotFound()            | 创建一个 NotFoundResult 对象，状态码 404                                    |
| Ok()                  | 创建一个 OkResult 对象，状态码 200                                          |
| Redirect()            | 创建一个 RedirectResult 对象，状态码 302                                    |
| RedirectToRoute()     | 创建一个 RedirectToRouteResult 对象，状态码 302                             |
| ResponseMessage()     | 创建一个特殊的 HttpResponseMessage 的 ResponseMessageResult 对象           |
| StatusCode()          | 创建一个特殊状态码的 StatusCodeResult                                      |
| Unauthorized()        | 创建一个 UnauthorizedResult 对象，状态码 401                                |