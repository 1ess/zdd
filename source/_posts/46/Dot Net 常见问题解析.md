---
title: Dot Net 常见问题解析
featured_image: https://cdn.zhangdd.tech/blogImg/Blog46.jpg
date: 2018/09/01
---

这一篇，记录关于 .Net 和 .Net Core 的一些零碎的知识点，随时更新。

## ASP.Net WebAPI 和 WebMVC 问题
***  
### 跨域
- 针对 .NET Framework MVC 跨域，只需要在 web.config 中添加如下的内容即可: 

``` XML
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="Access-Control-Allow-Origin" value="*" />
      <add name="Access-Control-Allow-Headers" value="Content-Type" />
      <add name="Access-Control-Allow-Methods" value="GET, POST, PUT, DELETE, OPTIONS" />
    </customHeaders>
  </httpProtocol> 
</system.webServer>
```
- 针对 .NET Framework Web API，除了上面这样的设置，还需要添加一个特殊的设计，就是为每个 APIController 添加一个 OPTIONS 方法，返回 null 即可: 

``` csharp
public string Options() {
  return null; // HTTP 200 response with empty body
}
```
- 针对 .Net Core 跨域，需要在 Startup.cs 文件的 ConfigureServices 方法中添加以下代码: 

``` csharp
//允许某些源
services.AddCors(options => {
    options.AddPolicy("AllowCors", policy => {
        // 多个可以用 `,` 隔开
        policy.WithOrigins("http://localhost:3000","http://127.0.0.1")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
    });
});
```

如果是所有方法都允许跨域，就在 Configure 方法中还需要添加以下代码: 
``` csharp
app.UseCors("AllowCors");//必须位于 UserMvc 之前 
app.UseMvc();
```

如果是某些方法允许跨域，就在该 Controller 添加如下代码: 
``` csharp
using Microsoft.AspNetCore.Cors;

[EnableCors("AllowCors")] //可实现指定某个 controller 或者 action 跨域
```

### Content-Type
对于 .Net Framework MVC: 
- 对于 Post 请求，不论是简单类型还是复杂类型，调用 API 时，都会在 Body 中提交数据，以 x-www-form-urlencoded 和 application/json 两种形式提交都可以在服务端获取到。简单类型直接作为 key，复杂类型属性作为 key
- 对于 Get 请求，不论是简单类型还是复杂类型，调用 API 时，都会在 Query 中提交数据。简单类型直接拼接，复杂类型属性拼接

对于 .Net Core MVC: 
- 对于 Post 请求，不论基本类型还是复杂类型参数，调用 API 时，既可以在 Query 中提交参数，也可以使用 x-www-form-urlencoded 表单形式提交参数，在服务端都可以接收到。对于复杂类型，我们也可以指定[FromBody] attribute，使得该复杂类型可以以 application/json Json 形式提交
- 对于 Get 请求，参数只能是简单类型，默认只能在 Query 中提交参数。我们也不该在 Get 请求使用复杂类型放在 Body 中提交

对于 .Net Framework API: 
- 对于 Post 请求: 
  1. 如果是简单类型参数，调用 API 时，默认是在 Query 中提交参数的，如果有[FromBody] attribute 修饰参数，则需要以 application/json 形式提交参数
  2. 如果是复杂类型参数，调用 API 时，既可以以 x-www-form-urlencoded 方式，又可以以 application/json 方式提交数据
- 对于 Get 请求，参数只能是简单类型，默认只能在 Query 中提交参数

对于 .Net Core API: 
- 对于 Post 请求: 
  1. 如果是简单类型参数，调用 API 时，默认是在 Query 中提交参数的，如果有[FromBody] attribute 修饰参数，则需要以 application/json 形式提交参数。如果有[FromForm] attribute 修饰参数，则需要以 x-www-form-urlencoded 形式提交参数
  2. 如果是复杂类型，调用 API 时，默认应该以 application/json 形式提交数据，与使用[FromBody] attribute 修饰符一致。可以使用[FromForm] attribute 修饰参数，指定以 x-www-form-urlencoded 形式提交数据
- 对于 Get 请求，参数只能是简单类型，只能以 Query 方式提交数据

### Json 输出
在 .Net Core WebAPI 默认是 JSON 输出，而 .Net Framework WebAPI 默认是 XML 输出。如果希望 Framework 以 JSON 格式返回，则需要在 WebApiConfig.cs 的 Register 方法添加如下代码: 
``` csharp
config.Formatters.Remove(config.Formatters.XmlFormatter);
config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new DefaultContractResolver();
```

虽然 .Net Core WebAPI 默认是 JSON 输出，但是返回的对象是驼峰命名，如果希望与实体属性对应，需要在 ConfigureServices 方法添加如下代码: 
``` csharp
services.AddMvc()
.AddJsonOptions(options =>
{
    if (options.SerializerSettings.ContractResolver is DefaultContractResolver resolver)
    {
        resolver.NamingStrategy = null;
    }
});
```

### IIS 部署
虚拟主机(新建一个网站就是一个虚拟主机): 可以为不同网站绑定同一个 IP 和端口，然后根据主机头(IIS8 上面改称为主机名)的不同来访问不同的站点。
IIS 也支持虚拟目录: 一个站点的网页的存储位置目录是固定的，而且结构和物理保存网页的磁盘路径相同。
例如: 默认网页的存储位置是 C:\inetpub\wwwroot，当访问 localhost 即访问 C:\inetpub\wwwroot 目录下的 index.html 文件，如果访问 localhost/dir1/ 则访问的是 C:\inetpub\wwwroot\dir1\index.html，访问 localhost/dir2 一般情况下是访问默认目录中的 dir2 目录下的 index.html 文件，但是此处的 dir2 目录指向的是 D:\web\ 目录(甚至是其他的服务器上)，这就是虚拟目录。

### .Net Core 部署配置
1. 首先安装 .Net Core SDK
2. 然后安装  AspNetCoreModule 托管模块: DotNetCore.x.x.x-WindowsHosting.exe
3. 然后重启服务器或使用管理员命令行，依次执行: 

``` shell
net stop was /y  // Windows Activation Service (WAS)
net start w3svc  // 万维网发布服务(W3SVC)
```

部署出现 502.5 错误，一般是 SDK 版本或者托管模块安装有问题。

### React，Vue 单页面应用刷新 404 问题
原因是单页面应用内容只有一个(一般是 index.html)。这个页面中引入的 js 框架会根据当前访问的 url 去路由到相应的子页面组件(可以理解为页面片段)进行逻辑处理和页面渲染。web 站中并没访问的这个页面资源，所以出现 404。
IIS 中可以使用 URL 重写方案解决该问题: 
``` csharp
<system.webServer>
    <rewrite>
        <rules>
            <rule name="React Router Refresh" patternSyntax="ECMAScript" stopProcessing="true">
                    <match url=".*" />
                    <conditions>
                        <add input="{HTTP_METHOD}" pattern="^GET$" />
                        <add input="{HTTP_ACCEPT}" pattern="^text/html" />
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
        </rules>
    </rewrite>
</system.webServer>
```

Nginx 中使用: 
``` nginx
try_files $uri /index.html;
```

### .Net 的垃圾回收机制
触发时机: 
- 物理内存吃紧
- 分配在托管堆上的内存超出阈值
- 手动调用 GC.Collect() 方法

### HTTPS 重定向
需要 IIS 安装 URL 重写模块。
``` csharp
<system.webServer>
    <rewrite>
        <rules>
            <rule name="REDIRECT TO HTTPS" stopProcessing="true">
                <match url="(.*)" />
                <conditions>
                    <add input="{HTTPS}" pattern="^OFF$" />
                </conditions>
                <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" />
            </rule>
        </rules>
    </rewrite>
</system.webServer>
```

Nginx 中使用: 
``` nginx
return 301 https://$server_name$request_uri;
```

### API 版本控制
#### Media Type 进行版本控制
1. 引入官方 Microsoft.AspNet.WebApi.Versioning package
2. 在 WebApiConfig 的 Register 方法中添加如下代码: 

``` csharp
config.AddApiVersioning(options =>
{
    options.ApiVersionReader = new MediaTypeApiVersionReader();
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionSelector = new CurrentImplementationApiVersionSelector(options);
});
```
3. 在类上使用 [ApiVersion("1.0")] Attribute

调用 API 时，我们就在 Content-Type 或 Accept 中用 application/xxx;v=1.0 使用 1.0 版本的 API。

#### URL 路径进行版本控制
API 版本控制的另一种常见方法是使用 URL 路径。
1. 引入官方 Microsoft.AspNet.WebApi.Versioning package
2. 在 WebApiConfig 的 Register 方法中添加如下代码: 

``` csharp
var constraintResolver = new DefaultInlineConstraintResolver()
{
    ConstraintMap =
    {
        ["apiVersion"] = typeof(ApiVersionRouteConstraint)
    }
};
configuration.MapHttpAttributeRoutes(constraintResolver);
configuration.AddApiVersioning();
```
3. 在类上使用如下特性: 

``` csharp
[ApiVersion( "2.0" )]
[Route( "api/v{version:apiVersion}/foo" )]
```

调用 API 时，请求 https://localhost/api/v2/foo 即可。

### AutoMapper 的使用
1. NuGet 安装 AutoMapper.Extensions.Microsoft.DependencyInjection 依赖
2. 在 ConfigureServices 方法中 services.AddMvc() 之后添加 services.AddAutoMapper();
3. 自定义类并继承自 Profile

``` csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        //直接映射
        CreateMap<Simple, SimpleDTO>().ReverseMap();

        //自定义对应属性映射
        CreateMap<Simple, SimpleDTO>().ForMember(dest => dest.属性,
            opts => opts.MapFrom(
                src => src.属性操作
            )).ReverseMap();
    }
}
```
4. 在控制器类依赖注入 IMapper 对象
5. 在适当位置调用 var dest = mapper.Map<DestType>(srcObject); 即可

### .Net Core 依赖注入 Context 对象
``` csharp
services.AddDbContext<CustomContext>(options =>
{
    options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"));
});
```

### .Net Core 依赖注入配置文件
``` csharp
services.Configure<CustomSetting>(Configuration.GetSection(nameof(CustomSetting)));
```

## 数据库
***  
### SQLServer 连接字符串写法
``` json
"ConnectionStrings": {
    "ConnectionString": "Persist Security Info=False;User ID=xxxxxx;Password=xxxxxx;Initial Catalog=[db name];Server=[ip or domain]"
  }
```

其中: 
1. Persist Security Info=False 表示使用账户密码连接数据库
2. User ID 表示用户名
3. Password 表示密码
4. Initial Catalog 表示所连接的数据库
5. Server 表示数据库所在服务器，可以使用 IP 或域名

## Visual Studio 技巧
***  
### 注释
``` csharp
//TODO: (未实现)……

//UNDONE:(没有做完)……

//HACK：(修改)……
```

之后，我们可以在 "视图-任务列表" 使其显示所有带有特殊注释的代码位置。

### 选中代码块
我们使用 Alt + Shift + ] 可以直接选中光标所在代码的代码块。

### 多行编辑
1. Alt + 鼠标拖选
2. Ctrl + Alt + 鼠标点选

### 使用的 C# 语言版本
我们可以通过编辑 *.csproj 文件，在 PropertyGroup 内添加 LangVersion 元素，值为 latest 即可: 
``` csharp
<PropertyGroup>
    ...
    <LangVersion>latest</LangVersion>
</PropertyGroup>
```