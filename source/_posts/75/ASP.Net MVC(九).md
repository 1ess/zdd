---
title: ASP.Net MVC(九)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog75.jpg
date: 2018/11/05
---

这一篇，我们详细讲讲 .Net MVC 中的 Bundling 和 Minification。

## Bundling
***  
在 MVC 4 中引入了 Bundling 和 Minification 技术以改善请求加载时间。Bundling 允许我们将来自服务器的一堆静态文件加载到一个 http 请求中。会通过最小化文件大小和请求数量来加快页面加载速度。

## Minification
***  
Minification 技术通过删除不必要的空格和注释以及将变量名缩短为一个字符来优化脚本或 css 文件大小。如: 
源文件如下: 
``` javascript
sayHello = function(name){
    //this is comment
    var msg = "Hello" + name;
    alert(msg);
}
```

以上 JavaScript 将被优化并最小化到以下脚本中: 
```javascript
sayHello=function(n){var t="Hello"+n;alert(t)}
```

## Bundle Types
***  
MVC 5 在 System.web.Optimization 命名空间中包含以下 bundle 类: 
- ScriptBundle: ScriptBundle 负责单个或多个脚本文件的 JavaScript 缩小
- StyleBundle: StyleBundle 负责单个或多个样式表文件的 CSS 缩小。
- DynamicFolderBundle: 表示 ASP.NET 从包含相同类型文件的文件夹创建的 Bundle 对象。

所有上述 bundle 类都包含在 System.Web.Optimization.Bundle 命名空间中，并从 Bundle 类派生。

## ScriptBundle in ASP.NET MVC
***  
我们将学习如何在一个 http 请求中创建多个 JavaScript 文件的包。

在 MVC 文件夹中打开 App_Start/BundleConfig.cs 文件。BundleConfig.cs 文件默认由 MVC 框架创建。应该在 BundleConfig.RegisterBundles 方法中编写所有 Bundle 代码。

``` csharp
public class BundleConfig
{
    // 有关捆绑的详细信息，请访问 https://go.microsoft.com/fwlink/?LinkId=301862
    public static void RegisterBundles(BundleCollection bundles)
    {
        bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));
        bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // 使用要用于开发和学习的 Modernizr 的开发版本。然后，当你做好
            // 生产准备就绪，请使用 https://modernizr.com 上的生成工具仅选择所需的测试。
        bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
        bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));
        bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));
        BundleTable.EnableOptimizations = true;
    }
}
```

### 步骤
1. 通过将包名称指定为构造函数参数来创建 ScriptBundle 类的实例，此捆绑包名称是以 ~/ 开头的虚拟路径。建议提供一个易于识别的 bundle 路径
2. 使用 Include 方法将一个或多个JS文件的相对路径的作为参数，添加到 bundle 中
3. 将 bundle 添加到 BundleCollection 实例中，该实例在 RegisterBundle 方法中指定为参数。
4. BundleTable.EnableOptimizations = true 在 Debug 下启用优化，还可以使用 bundle 类的 IncludeDirectory 方法添加特定目录下的所有文件: 
 
``` csharp
public static void RegisterBundles(BundleCollection bundles)
{            
    bundles.Add(new ScriptBundle("~/bundles/scripts").IncludeDirectory("~/Scripts/", "*.js", true));
}
```
5. 我们在 Global.asax.cs 文件的 Application_Start 事件调用方法: 

``` csharp
protected void Application_Start()
{
    BundleConfig.RegisterBundles(BundleTable.Bundles);
}
```

### 使用通配符
有时第三方脚本文件包含脚本文件名称中的版本。我们就可以使用通配符: 
``` csharp
public class BundleConfig
{
    public static void RegisterBundles(BundleCollection bundles)
    {            
        bundles.Add(new ScriptBundle("~/bundles/jquery")
               .Include( "~/Scripts/jquery-{version}.js"));
    }
}
```

## 在 Razor View 中包含 ScriptBundle
***  
使用 @Scripts.Render() 方法在运行时包含指定的脚本包。

## StyleBundle
***  
与 ScriptBundle 使用基本类似，只是创建的是 StyleBundle 实例，并且在 Razor 中使用 @Styles.Render() 方法在运行时包含该 CSS bundle。