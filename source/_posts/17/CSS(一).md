---
title: CSS(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog17.jpg
date: 2018/06/22
---

前面四篇主要讲解了关于 HTML 的基础知识，从这篇开始，将要介绍关于 CSS 的知识。CSS(Cascading Style Sheets)，它是一种可以完全独立于 HTML 的语言，来确定字体大小，边距和颜色等内容。
为什么要引入另一种语言呢？处于不同的目的，HTML 设置网页内容，而 CSS 则定义如何向用户显示内容。
在具体讲解 CSS 常用样式属性之前，我们将先讲解 CSS 基本语法规则以及级联规则。

## 引入 CSS 的三种方式
***  
- 内联方式  
内联方式指的是直接在 HTML 标签中的 **style 属性**中添加 CSS 代码。(代码复用性低)

``` HTML
<div style="background: red"></div>
```

- 嵌入方式  
嵌入方式指的是在 HTML 头部中的 **style 标签**内书写 CSS 代码。(代码复用性稍高)

``` HTML
<head>
    <style>
    .content {
        background: red;
    }
    </style>
</head>
```

- 链接方式
链接方式指的是使用 HTML 头部的 **link 标签**引入外部的 CSS 文件。扩展名为 .css 的文件。(代码复用性高)

``` HTML
<head>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
```
**我们应尽量使用 link 标签导入外部 CSS 文件，避免或者少用使用其他方式。**

## CSS 注释
***  
对比 HTML 注释
``` HTML
<!-- comments -->
```
CSS 忽略字符使用下面方式
``` HTML
/* comments */
```

## CSS 规则基本语法
***  
![](https://cdn-fawn.vercel.app/contentImg/css1/css-rule-terminology-1a7961.png)
一个 选择器加上声明块 组合在一起称为一个**规则(Rule)**。一个 属性名:属性值; 组合在一起称为一个**声明(declaration)**。

需要注意: 
- 当是一个单一选择器，一条声明出错(如单词拼写错误)，其余规则以及该规则的其余声明都有效。只有该声明无效。
- 当是一个单一选择器，选择器书写出错，其余规则都有效，只有该规则无效。
- 当是一个组合选择器，只要其中一个选择器书写出错，其余规则都有效，该规则无效。

## CSS 选择器
***  
选择器是学习 CSS 的比较重要的知识，熟练掌握各种选择器，就可以很轻松的对 HTML 元素声明样式。并且对于之后的JS学习很有帮助。

### 简单选择器(Type，Class，ID)
#### Type 选择器(元素选择器)
``` CSS
body {
    color: red;
}
```

#### Class 选择器
``` CSS
.container {
    color: red;
}
```

#### ID 选择器
``` CSS
#info {
    color: red;
}
```

### 属性选择器
#### E[foo]
选取有 foo 属性的所有 E 元素。
``` CSS
input[disabled] {
    cursor: not-allowed;
}
```

#### E[foo="bar"]
选取 foo 属性为 bar 的所有 E 元素。
``` CSS
p[class="info"] {
    cursor: not-allowed;
}
```

#### E[foo~="bar"]
选取 foo 属性含有 bar 的所有 E 元素。
``` CSS
p[class~="info"] {
    cursor: not-allowed;
}
```

#### E[foo^="bar"]
选取 foo 属性以 bar 字符串子串开头的所有 E 元素。
``` CSS
p[class^="inf"] {
    cursor: not-allowed;
}
```

#### E[foo$="bar"]
选取 foo 属性以 bar 字符串子串结尾的所有 E 元素。
``` CSS
p[class$="nfo"] {
    cursor: not-allowed;
}
```

#### E[foo*="bar"]
选取 foo 属性含有 bar 字符串子串的所有 E 元素。
``` CSS
p[class*="nf"] {
    cursor: not-allowed;
}
```

#### E[foo|="bar"]
选取 foo 属性为 bar 或以 bar- 字符串子串开头的所有 E 元素。
``` CSS
a[hreflang|="en"] {
    cursor: not-allowed;
}
```

### 上下文选择器
#### E1 E2
选取所有 E1 元素的所有后代元素为 E2 的全部元素。
``` CSS
body p {
    color: red;
}
```

#### E1>E2
选取所有 E1 元素的所有直接后代元素为 E2 的全部 E2 元素。
``` CSS
body>p {
    color: red;
}
```

#### E1~E2
选取所有 E1 元素的所有后续兄弟元素为 E2 的所有 E2 元素。
``` CSS
p~a {
    color: red;
}
```

#### E1+E2
选取所有 E1 元素的紧邻兄弟元素为 E2 的所有 E2 元素。
``` CSS
p+a {
    color: red;
}
```

#### *
选取所有元素
``` CSS
* {
    color: red;
}
```

### 伪类选择器
#### E:first-child
选取 E 元素集合中第一个 E 元素。
``` CSS
li:first-child {
    background-color: red;
}
```

#### E:last-child
选取 E 元素集合中最后一个 E 元素。
``` CSS
ul:last-child {
    background-color: red;
}
```

#### E:nth-child(n)
选取 E 元素集合中第 n 个 E 元素。**注意这个n是从1开始**。
奇数行: 2n+1 或者 odd
偶数行: 2n 或者 even
``` CSS
li:nth-child(2) {
    background-color: red;
}
```

#### E:visited
E 元素是已经访问过目标的超链接的源锚点。
``` CSS
a:visited {
    background-color: red;
}
```

#### E:link
E 元素是尚未访问目标的超链接的源锚点。
``` CSS
a:link {
    background-color: yellow;
}
```

#### E:hover
选取处于悬停状态的 E 元素。
``` CSS
a:hover {
    background-color: green;
}
```

#### E:focus
选取处于焦点状态的 E 元素。
``` CSS
a:focus {
    border-color: blue;
}
```

#### E:checked
选取处于选中状态的 E 元素。
``` CSS
input:checked {
    background-color: red;
}
```

#### E:active
选取处于激活状态的 E 元素。(按钮按下未抬起时的状态)
``` CSS
a:active {
    background-color: red;
}
```

#### E:target
当 E 元素是通过文档内导航跳转过来时选取该元素。
``` CSS
h2:target {
    background-color: red;
}
```
### 伪元素选择器
#### E::first-letter
选取 E 元素中的首字符。
``` CSS
p::first-letter {
    background-color: red;
}
```

#### E::first-line
选取 E 元素中的首行文本。
``` CSS
p::first-line {
    background-color: red;
}
```

#### E::before
选取所有 E 元素，并在之前添加内容。
``` CSS
p::before {
    content: " ";
}
```

#### E::after
选取所有 E 元素，并在之后添加内容。
``` CSS
p::after {
    content: " ";
}
```

## CSS 的级联算法
***  
根据特指度: I - C - T 分量(ID > Class > Type)。
其中
- I 分量表示 ID 选择器个数
- C 分量表示 Class 选择器个数 + 属性选择器个数 + 伪类选择器个数
- T 分量表示 Type 选择器个数 + 伪元素选择器个数

如果特指度相同，后加在到浏览器的规则生效。
我们还可以使用 !important 强制某一规则生效。