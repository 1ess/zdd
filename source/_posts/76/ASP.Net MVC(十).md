---
title: ASP.Net MVC(十)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog76.jpg
date: 2019/01/09
---

这一篇，我们详细讲讲 ASP.Net MVC 中的 Area。

我们知道在大型应用程序可以包含大量控制器、视图和模型类，因此，使用默认的 ASP.NET MVC 项目结构维护大量视图、模型和控制器可能变得难以管理。

ASP.NET MVC 2 引入了 Area。Area 允许我们将大型应用程序划分为更小的单元，其中每个单元包含单独的 MVC 文件夹结构，与默认的 MVC 文件夹结构相同。
每个 Area 都包含 {area name}AreaRegistration.cs 文件中的 {area name}AreaRegistration 类。

{area name}AreaRegistration 类重写 RegisterArea 方法以映射该区域的路由: 
``` csharp
public class AdminAreaRegistration : AreaRegistration 
{
    public override string AreaName 
    {
        get 
        {
            return "Admin";
        }
    }

    public override void RegisterArea(AreaRegistrationContext context) 
    {
        context.MapRoute(
            "Admin_default",
            "Admin/{controller}/{action}/{id}",
            new { action = "Index", id = UrlParameter.Optional }
        );
    }
}
```

在上面的示例中，任何以 admin 开头的 URL 都将由 Area 文件夹下的管理文件夹结构中包含的控制器处理。如: http://localhost/admin/profile 将由 Areas/admin/controller/ProfileController 处理。

注意，所有 area 必须在 Global.asax.cs 中的 Application_Start 事件中注册: 
``` csharp
protected void Application_Start()
{
        AreaRegistration.RegisterAllAreas();
}
```

通过这种方式，您可以为大型应用程序创建和维护多个 Area。