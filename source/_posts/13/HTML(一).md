---
title: HTML(一)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog13.jpg
date: 2018/06/14
---

从这篇开始，通过几篇的介绍，了解常用的 HTML 标记，熟悉每个标签在浏览器中的默认样式。

## HTML 基本结构
***  
![](https://cdn.0xfee1dead.cn/contentImg/html1/basic-web-pages-f786d5.png)

## HTML 元素
***  
普通元素
![](https://cdn.0xfee1dead.cn/contentImg/html1/Basic-Anatomy-of-HTML-Elements1.png)

自闭合元素
![](https://cdn.0xfee1dead.cn/contentImg/html1/Basic-Anatomy-of-HTML-Elements2.png)

**注意: 在 HTML5 中，自闭合元素 opening tag 末尾的 '/' 可以省略。**

## HTML 属性
***  
HTML 文档中包含了各种各样的元素，同时元素还可以用属性(attribute)进行配置，一个元素可以配置一个或者多个属性，如上图。

### 布尔属性
布尔属性只需要将属性名称添加到元素 opening tag 中即可: 
``` HTML
<input disabled>
```

也可以为布尔属性指定一个空字符串("")或属性名称字符串作为其值也有同样的效果: 
``` HTML
<input disabled="">
<input disabled="disabled">
```

### 自定义属性
用户也可以自定义属性(或者扩展属性)，自定义属性必须以 data- 开头。
``` HTML
<input  data-creator="1ess" data-purpose="collection">
```

HTML 通常会忽略这些自定义属性，在属性名称之前添加前缀 data- 是为了避免与 HTML 的未来版本中可能增加的属性名冲突。自定义属性通常与 CSS 和 JavaScript 结合使用。

### 局部属性
局部属性通常和每个元素对应，每个局部属性都可以用来控制元素都有都有行为的某个方面。在介绍每个元素时再做介绍。

### 全局属性
全局属性用来配置所有元素的共有的行为，可以用在任何一个元素身上。

#### class 属性
class 属性用来将元素归类，方便找出文档中某一类元素或为某一类元素应用 CSS 样式。
``` HTML
<a class="class1 class2" href="https://github.com/1ess">Github</a>
```

一个元素可以被归入多个类别，类名间用空格分隔。

#### contenteditable 布尔属性
``` HTML
<p contenteditable>content is editable</p>
```

#### dir 属性
该属性用来规定元素中文字的方向，有效值有: ltr(用于从左到右的文字)和 rtl(用于从右到左的文字)。
``` HTML
<p dir="rtl">This is right-to-left</p>
<p dir="ltr">This is left-to-right</p>
```

#### draggable 属性
是 HTML5 支持拖放操作的方式之一，用来表示元素是否可被拖放。

#### dropzone 属性
也是 HTML5 支持拖放操作的方式之一，与 draggable 属性搭配使用。

#### hidden 布尔属性
表示相关元素当前毋需关注，浏览器通常是隐藏相关元素。
``` HTML
<p hidden>hidden</p>
```

#### id 属性
用来给元素分配一个唯一的标识符，标识符通常被用于应用样式或者 JavaScript 逻辑到该元素。
``` HTML
<a id="github" href="https://github.com/1ess">Github</a>
```

#### lang 属性
说明元素使用的语言。

#### title 属性
title 属性提供了元素的额外信息，浏览器通常用它显示工具提示。悬停时会显示。

#### style 属性
用于直接在元素身上定义 CSS 样式。

## HTML 文档类型、文档模式、注释
***  
### 文档类型
!doctype 声明必须是 HTML 文档的**第一行**，位于 &lt;html&gt; 标记之前。在所有 HTML 文档中规定 DOCTYPE 是非常重要的，这样浏览器就能了解预期的文档类型，告诉浏览器要通过哪一种规范解析文档。  
**注意: !doctype 声明不属于 HTML 标签，它是一条指令，告诉浏览器编写页面所用的标记的版本。**  

HTML 4.01 中的 doctype 需要对 DTD 进行引用，因为 HTML 4.01 基于 SGML。而 HTML 5 不基于 
 SGML，因此不需要对 DTD 进行引用，并且 HTML5 中的 !doctype 是不区分大小写的。
**所以在现代 HTML5 规范规定: 仅需要在最前面声明 !doctype html 即可。**

### 文档模式
现代的浏览器需要不同模式，既要呈现久远的 HTML 界面，不至于界面结构混乱不堪，也需要呈现 W3C 标准的界面: 
1. 标准的显示方式就是 -- -标准模式(strict)
2. 不标准的显示方式 --- 怪异模式(没定义 doctype 或者 doctype 错误等情况，都会让界面进入 quirk 模式)

### 注释
HTML 的注释: 
``` HTML
<!– comments -->
```

## HTML head 相关 tag
***  
head 内部元素通常包括指定页面标题，为搜索引擎提供关于页面本身的信息，加载样式表，以及加载 JavaScript 文件(出于性能考虑，多数时候放在页面底部 body 标签结束前加载 JavaScript 或使用 async)。除了 title，head 里的内容对页面访问者来说都是不可见的。

### title 元素
head 元素中必须包含一个 title 元素，该元素内容会出现在浏览器的标签页中或者出现在浏览器窗口的顶部，作为网页标题，和浏览器相关。
``` HTML
<title>Your page title</title>
```

### meta 元素
meta 元素用来定义文档的各种元数据，meta 元素可以有多种用途，但每个 meta 元素只能用于一种用途，如果需要使用不止一种，就需要在 head 元素中添加多个 meta 元素。

#### 作者信息
``` HTML
<meta name="author" content="1ess">
```

#### SEO
``` HTML
<meta name="description" content="页面描述信息">
<meta name="keywords" content="页面关键字">
```

#### Robots 元数据
``` HTML
<meta name="robots" content="noindex">
```

该属性有三个大多数搜索引擎都认识的值: 
1. noindex: 不要索引本页；
2. noarchive: 不要将本页存档或缓存；
3. nofollow: 不要顺着本页中的链接继续搜索下去。

#### 响应式布局
``` HTML
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 字符编码
``` HTML
<meta charset="utf-8">
```

#### 模拟 HTTP 标头字段
``` HTML
<meta http-equiv="refresh" content="5;https://github.com/1ess">
```

http-equiv 属性的可选值如下: 
1. refresh: 以秒为单位指定一个时间间隔，在此时间过去之后将从服务器重新载入当前页面。
2. default-style: 指定页面优先使用的样式表，content属性的值必须是同一文档中某个style元素或link元素的title属性值。
3. content-type: 另一种声明HTML页面所用字符编码的方法，如: 

``` HTML
<meta http-equiv="content-type" content="text/html charset=UTF-8">
```

4. X-UA-Compatible: 声明渲染方式，content 取值为 IE=edge, chrome=1。表示当有 webkit 内核浏览器，使用 webkit 内核渲染，否则使用 IE 最高版本渲染。

``` HTML
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1">
```

### base 元素
定义页面上相对 URL 的基准 URL。
``` HTML
<base target="_blank" href="http://www.example.com/">
```

### style 元素
``` HTML
<style type="text/css">
	a{
	    background-color: grey;
		color: white;
		padding: 0.5em;
	}
</style>
```

### link 元素
用来在 HTML 文档和外部资源(如 CSS 样式表)之间建立联系。

#### 载入外部样式表
``` HTML
<link rel="stylesheet" type="text/css" href="styles.css">
```

#### 为页面定义网站标志
``` HTML
<link rel="shortcut icon" type="image/x-icon"  href="favicon.ico">
```

如果网站标志文件位于/favicon.ico(即 Web 服务器的根目录)，那就不必用到 link 元素，大多数浏览器在载入页面时都会自动请求这个文件，就算没有 link 元素也是如此。

#### 预先获取资源
``` HTML
<link rel="prefetch" href="/index.html">
```

### script 元素
用于在页面中加入脚本，可以直接在文档中定义脚本和引用外部文件中的脚本。

#### 定义文档内嵌脚本
``` HTML
<script>
	document.write("This is from the script");
</script>
```

#### 推迟脚本的执行
使用 async 和 defer 属性可以对脚本的执行方式加以控制。  
- defer 属性告诉浏览器要等页面载入和解析完成后才能执行脚本: 

``` HTML
<script defer src="index.js"></script>
```

- async 属性可以在浏览器解析 HTML 文档时异步加载和执行脚本: 

``` HTML
<script async src="index.js"></script>
```

### noscript 元素
noscript 元素用来向禁用了 JavaScript 或浏览器不支持 JavaScript 的用户显示一些内容。
``` HTML
<noscript>
	<h1>JavaScript is required!</h1>
	<p>You cannot use this page without JavaScript</p>
</noscript>
```

## 符合规范
***  
注意: 许多人通过查看源代码，然后复制粘贴来学习 HTML、CSS 及 JavaScript。然而他们并没有考虑到原本的网站，是否符合规范。如: 
``` HTML
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
```

相当于 meta 元素的
``` HTML
<meta charset="utf-8">
```

我们一定要注意编写符合当前规范的 HTML。之后的所有讲解都是基于规范，当出现不在建议使用的元素时会提示。