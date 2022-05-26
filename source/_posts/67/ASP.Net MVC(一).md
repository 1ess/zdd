---
title: ASP.Net MVC(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog67.jpg
date: 2018/12/23
---

从这篇开始，我们来谈谈 ASP.Net MVC，我们将会介绍 ASP.Net MVC 的方方面面(包括基础以及高级特性)。

## MVC 架构
***  
MVC 架构以及在软件工程出现很长时间了，几乎所有语言都有 MVC 以及变种形式。

### iOS 中的 MVC
![](https://cdn-fawn.vercel.app/contentImg/MVC/1/iOSMVC.jpg)

图中绿色箭头表示直接引用，只有 Controller 直接持有 Model 和 View 的引用，
View 向 Controller 的通信有三种形式: 
- target-action
- delegate
- data source

Model 向 Controller 的通信则通过 Notification & KVO。

在 iOS 的 MVC 严格实现中，Model 和 View 是绝对不能直接通信的，即互相之间不能持有对方。这也是区别于 Android 和 .Net 最大的地方。
虽然耦合度会减少，但是会造成 Controller 巨大，这也是现在 MVVM，MVP 等其他架构出现的原因。

### .Net 中的 MVC
下面我们在具体看看 .Net MVC 是怎样实现的。
MVC 中: 
- M 指的就是 Model: 它是一种数据以及业务逻辑
- V 指的就是 View: 它是用户界面，利用模型展示界面给用户，也允许用户修改数据
- C 指的就是 Controller: 它可以处理用户请求，通常，用户与界面交互，发起一个网络请求，这个请求就被 Controller 处理，利用模型数据渲染恰当的界面作为响应

在 .Net 中的 MVC，Model 会从 Controller 传递给 View。

## ASP.Net MVC 历史版本
***  
### MVC 1.0 特性
- 使用 WebForm 引擎
- 路由
- HTML Helpers
- Ajax Helpers

### MVC 2.0 特性
- Area
- 异步 Controller
- 客户端验证
- 自定义模板

### MVC 3.0 特性
- Razor 视图引擎
- Global filters
- 远程验证
- ViewBag

### MVC 4.0 特性
- Bundling 和 minification

### MVC 5.0 特性
- Authentication filters
- 支持 Bootstrap
- ASP.Net Identity

### MVC 5.2 特性
- Attribute based routing

注意: MVC 5 项目 默认包含 bootstrap 3.0 的 css 和 js 文件. 

## ASP.Net MVC 项目文件夹结构
***  
![](https://cdn-fawn.vercel.app/contentImg/MVC/1/FolderStructure.png)

### App_Data
App_Data 文件夹可以容纳 localDB，XML，日志文件等应用数据文件。

### App_Start
App_Start 文件夹当程序已启动就会被执行的类文件。例如: AuthConfig.cs，BundleConfig.cs，FilterConfig.cs，RouteConfig.cs 等。
在 MVC 5 默认包含 BundleConfig.cs，FilterConfig.cs 以及 RouteConfig.cs 三个配置类文件。

### Content
Content 文件夹容纳静态文件如 css，image 以及 favicon 等。在 MVC 5 默认包含 bootstrap.css，bootstrap.min.css 以及 Site.css 文件。

### Controller
Controller 文件夹容纳 controller 类文件，MVC 要求 controller 文件名以 Controller 结尾

### fonts
fonts 文件夹容纳自定义字体文件。

### Models
Models 文件夹容纳模型类文件。

### Scripts
Scripts 文件夹容纳 JavaScript 文件。MVC 5 默认包含 bootstrap，jquery3.3.1 以及 modernizr2.8.3。

### Views
Views 文件夹容纳应用的 html 文件以 .cshtml 作为后缀。.cshtml 文件允许你同时写 C# 代码和 html 标签。
Views 文件夹包含每个控制器的单独的文件夹，例如 HomeController 对于 Views/Home 文件夹。

Shared 文件夹用来容纳不同控制器共享的视图。如: _Layout.cshtml。

### Global.asax
Global.asax 允许编写应用级事件，如: Application_BeginRequest，Application_Start，Application_Error，Session_Start，Session_End 等。

### Packages.config
NuGet 的包管理文件。

### Web.config
Web.config 包含应用级的配置。