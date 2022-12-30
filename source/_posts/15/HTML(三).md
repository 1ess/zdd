---
title: HTML(三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog15.jpg
date: 2018/07/08
---

本篇我们将介绍图片，超链接，列表表格以及表单等元素。

## img 元素(Image)
***  
img 标记可以定义一个插入到页面的图片。
有两个重要属性: 
1. src 属性用来标识图片资源位置，可以是相对路径，也可以是绝对路径
2. alt 属性用来标识图片加载失败时显示的文本内容

img 还有 width 和 height 属性来表示图片的宽高，但通常我们不使用这两个属性来更改图片尺寸，只是起到页面内占位的作用。
**注意区分下面 4 种写法的异同**
``` HTML
<img src="https://example.com/a.jpg" alt="a">
<img src="img/a.jpg" alt="a">
<img src="/img/a.jpg" alt="a">
<img src="//abc.com/img/a.jpg" alt="a">
```

## a 元素(anchor)
***  
a 标记的作用是设置链接，既可以用于文档外链接，也可以用于文档内导航。
有两个重要属性: 
1. href 属性用于标识链接位置，可以是相对路径，也可以是绝对路径。
2. target 属性用于指定打开帧的状态，有四个值: 
 - _blank，新窗口打开
 - _parent，父窗口打开
 - _self，自窗口打开(default)
 - _top，顶层窗口打开

### 文档外链接
``` HTML
<a href="https://github.com/1ess">github</a>
<a href="/demo/index.html" target="_blank">demo</a>
<a href="mailto://xxx@gmail.com">email me</a>
```

### 文档内导航
``` HTML
<a href="#faq">常见问题</a>
<a href="#">回顶部</a>
<a href="http://abc.com/course/abc#faq">常见问题</a>
```

## 列表元素
***  
列表元素用来表示线性数据结构，如一组数据内容，导航栏的各个子项等。
li 元素(List item)可以嵌套在 ol 或 ul 元素内部。

### 无序列表 ul(Unordered list)
``` HTML
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### 有序列表 ol(Ordered list)
常用属性: 
- start: 制定第一个元素的序号
- reversed: 布尔属性，倒序显示
- type: 列表标记样式(1，a，A，I)

``` HTML
<ol start="3" type="a">
  <li>Item 1</li>
  <li>Item 2</li>
</ol>
```

注意: ol 与 ul 默认上下外边距 1em，左内边距 40px。

### 定义列表 dl(Definition list)
定义列表用于名词解释。
基本标记包括: 
- dl(Definition  list)
- dt(Definition  term)
- dd(Definition  description)

``` HTML
<dl>
  <dt>html</dt>
  <dd>网页文档根要素</dd>
  <dt>head</dt>
  <dd>网页头部信息描述区域</dd>
  <dt>body</dt>
  <dd>网页具体内容部分</dd>
</dl>
```

## table 元素(Table)
***  
table 元素用来表示二维数据结构。
基本标记包括: 
- table
- caption
- tr: table row
- th: table head
- td: table data
- thead
- tbody
- tfoot

``` HTML
<table>
  <caption>成绩</caption>
  <thead>
    <tr>
      <th>姓名</th>
      <th>语文</th>
      <th>数学</th>
      <th>英语</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>张三</td>
      <td>100</td>
      <td>99</td>
      <td>98</td>
    </tr>
    <tr>
      <td>李四</td>
      <td>100</td>
      <td>99</td>
      <td>98</td>
    </tr>
    <tr>
      <td>王五</td>
      <td>100</td>
      <td>99</td>
      <td>98</td>
    </tr>
  </tbody>
</table>
```

## 容器元素
***  
### div 元素(Block container)
``` HTML
<div lang="ja" class="japanese-part">
  無限大な夢のあとの 何もない世の中じゃ
</div>
```

### span 元素(Inline container)
``` HTML
<p>I Love<span class="love-person">U</span></p>
```
Block 和 Inline 的区别我们在 CSS 在具体讲解。

## form 元素(Form)
***  
form 元素为用户输入创建表单，用于向服务器提交数据。
三个重要的属性: 
- action: 对应的服务器脚本
- method: 提交的 HTTP 请求方法
- enctype: 编码方式 content-type

![](https://cdn-fawn.vercel.app/contentImg/html3/form-action-attribute-68258a.png)
``` HTML
<form action="/index.do" method="POST" enctype="multipart/form-data">
  <label for="name">name: <input type="text" id="name" name="user"></label><br>
  <label for="password">password: <input type="password" id="password" name="password"></label><br>

  <label for="bike">Bike <input type="checkbox" id="bike" name="bike"></label>
  <label for="car">Car <input type="checkbox" id="car" name="car"></label><br>

  <label for="male">Male <input type="radio" name="Sex" id="male" checked></label>
  <label for="female">Female <input type="radio" name="Sex" id="female"></label><br>

  <select name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="fiat">Fiat</option>
    <option value="audi">Audi</option>
  </select><br>

  <textarea name="cat" id="cat" cols="30" rows="10">The cat was playing in the garden.</textarea><br>
    
  <input type="button" value="Hello world!"><br>
  <input type="submit" value="Hello world!"><br>

</form>
```

## 语义化元素
***  
![](https://cdn-fawn.vercel.app/contentImg/html3/html-sectioning-elements-00c3fd.png)
语义化的作用，简单说来就是让机器可以读懂内容。
包括: 
- main 元素
- article 元素
- section 元素
- nav 元素
- aside 元素
- header 元素
- footer 元素

### main 元素(Main)
main 标记描述文章的主要内容。
``` HTML
<body>
<main role="main">
  <article>
    <h1>文章标题</h1>
    <p>文章内容</p>
  </article>
</main>
</body>
```

### article 元素(Article)
article 元素表示网页独立内容区域。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-article-element-82490e.png)
``` HTML
<article>
  <h1>First Post</h1>
  <p>Some content</p>
</article>
<article>
  <h1>Second Post</h1>
  <p>Some more content</p>
  <h2>Subsection</h2>
  <p>Some details</p>
</article>
<article>
  <h1>Last Post</h1>
  <p>Final bit of content</p>
</article>
```

### section 元素(Section)
section 元素表示文章段落部分。与 article 元素配合使用。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-section-element-92a4d1.png)
``` HTML
<section>
  <h2>The Document Outline</h2>
  <p>HTML5 includes several "sectioning content" elements that affect the document outline.</p>

  <h3>Headers</h3>
  <p>The
    <code>&lt;header&gt;</code> element is one such sectioning element.
  </p>
  
  <h3>Footers</h3>
  <p>And so is the
    <code>&lt;footer&gt;</code> element.</p>
</section>

<section>
  <h2>Inline Semantic HTML</h2>
  <p>The
    <code>&lt;time&gt;</code> element is semantic, but it's not sectioning content.</p>
</section>
```

### nav 元素(Navigation)
用于页面导航，如页面导航条。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-nav-element-d1e716.png)
``` HTML
<h1>Interneting Is Easy!</h1>
<nav>
  <ul>
    <li><a href='#'>Home</a></li>
    <li><a href='#'>About</a></li>
    <li><a href='#'>Blog</a></li>
    <li><a href='#'>Sign Up</a></li>
  </ul>
</nav>
```

### aside 元素(Aside)
用于页面附加性内容。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-aside-element-ce120b.png)
``` HTML
<aside>
  <h3>解释</h3>
  <p>解释文字</p>
</aside>
```

### header 元素(Header)
header 标记用于文章或区块头部。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-header-element-7b4e01.png)

#### 文章头部
``` HTML
<article>
  <header>
    <h1>Semantic HTML</h1>
    <p>By Troy McClure. Published January 3rd</p>
  </header>
  <p>This is an example web page explaining HTML5 semantic markup.</p>
</article>
```

#### 导航头部
``` HTML
<body>
<header>
  <h1>Interneting Is Easy!</h1>
  <nav>
    <ul>
      <li><a href='#'>Home</a></li>
      <li><a href='#'>About</a></li>
      <li><a href='#'>Blog</a></li>
      <li><a href='#'>Sign Up</a></li>
    </ul>
  </nav>
</header>
</body>
```

### footer 元素(Footer)
footer 标记用于文章或区块脚部。如作者信息，文章出处等。
![](https://cdn-fawn.vercel.app/contentImg/html3/html-footer-element-0c927a.png)

#### 文章脚部
``` HTML
<article>
  <header>
    <h1>Semantic HTML</h1>
    <p>By Troy McClure. Published January 3rd</p>
  </header>
  <p>This is an example web page explaining HTML5 semantic markup.</p>
  <footer>
    <p>This fake article was written by somebody at InternetingIsHard.com, which is a pretty decent place to learn how
            to become a web developer. This footer is only for the containing
    <code>&lt;article&gt;</code> element.</p>
  </footer>

</article>
```

#### 页脚
``` HTML
<footer>
  <p>&copy; 2017 InternetingIsHard.com</p>
</footer>
```