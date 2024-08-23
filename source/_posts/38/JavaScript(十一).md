---
title: JavaScript(十一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog38.jpg
date: 2018/08/15
---

这一篇，我们讲讲 DOM 扩展。
对 DOM 的两个主要的扩展是 Selectors API(选择符 API)和 HTML5。此外，还有一个不那么引人瞩目的 Element Traversal(元素遍历)规范，为 DOM 添加了一些属性。

## 选择符 API
***  
Selectors API 是由 W3C 发起制定的一个标准，致力于让浏览器原生支持 CSS 查询。
Selectors API Level 1 的核心是两个方法: querySelector() 和 querySelectorAll()。在兼容的浏览器中，可以通过 Document 及 Element 类型的实例调用它们。

### querySelector() 方法
querySelector() 方法接收一个 CSS 选择符，返回与该模式匹配的第一个元素，如果没有找到匹配的元素，返回 null: 
``` javascript
//取得body元素
var body = document.querySelector("body");

//取得ID为"myDiv"的元素
var myDiv = document.querySelector("#myDiv");

//取得类为"selected"的第一个元素
var selected = document.querySelector(".selected");

//取得类为"button"的第一个图像元素
var img = document.body.querySelector("img.button");
```

通过 Doument 类型调用 querySelector() 方法时，会在文档元素的范围内查找匹配的元素。而通过 Element 类型调用 querySelector() 方法时，只会在该元素后代元素的范围内查找匹配的元素。

### querySelectorAll() 方法
querySelectorAll() 方法接收的参数与 querySelector() 方法一样，都是一个 CSS 选择符，但返回的是所有匹配的元素而不仅仅是一个元素。这个方法返回的是一个 NodeList 的实例。

只要传给 querySelectorAll() 方法的 CSS 选择符有效，该方法都会返回一个 NodeList 对象，而不管找到多少匹配的元素。如果没有找到匹配的元素，NodeList 就是空的。
``` javascript
//取得某<div>中的所有<em>元素(类似于getElementsByTagName("em"))
var ems = document.getElementById("myDiv").querySelectorAll("em");

//取得类为"selected"的所有元素
var selecteds = document.querySelectorAll(".selected");

//取得所有<p>元素中的所有<strong>元素
var strongs = document.querySelectorAll("p strong");
```

### matchesSelector() 方法
规范为 Element 类型新增了一个方法 matchesSelector()。这个方法接收一个参数，即 CSS 选择符，如果调用元素与该选择符匹配，返回 true，否则，返回 false: 
``` javascript
if (document.body.matchesSelector("body.page1")) {
    //true
}
```

## 元素遍历
***  
Element Traversal API 为 DOM 元素添加了以下 5 个属性: 
- childElementCount: 返回子元素(不包括文本节点和注释)的个数
- firstElementChild: 指向第一个子元素，firstChild 的元素版
- lastElementChild: 指向最后一个子元素，lastChild 的元素版
- previousElementSibling: 指向前一个同辈元素，previousSibling 的元素版
- nextElementSibling: 指向后一个同辈元素，nextSibling 的元素版

``` javascript
var child = element.firstElementChild;
while(child != element.lastElementChild) {
    processChild(child);   //已知其是元素
    child = child.nextElementSibling;
}
```

## 与 class 相关的扩充
***  
为了让开发人员适应并增加对 class 属性的新认识，HTML5 新增了很多 API，致力于简化 CSS 类的用法。

### getElementsByClassName() 方法
getElementsByClassName() 方法接收一个参数，即一个包含一或多个类名的字符串，返回带有指定类的所有元素的 NodeList。传入多个类名时，类名的先后顺序不重要。
``` javascript
//取得所有类中包含"username"和"current"的元素，类名的先后顺序无所谓
var allCurrentUsernames = document.getElementsByClassName("username current");
//取得ID为"myDiv"的元素中带有类名"selected"的所有元素
var selected = document.getElementById("myDiv").getElementsByClassName("selected");
```

### classList 属性
在操作类名时，需要通过 className 属性添加、删除和替换类名。因为 className 中是一个字符串，所以即使只修改字符串一部分，也必须每次都设置整个字符串的值。
HTML5 新增了一种操作类名的方式，可以让操作更简单也更安全，那就是为所有元素添加 classList 属性。这个 classList 属性是新集合类型 DOMTokenList 的实例。与其他 DOM 集合类似，DOMTokenList 有一个表示自己包含多少元素的 length 属性，而要取得每个元素可以使用 item() 方法，也可以使用方括号语法。此外，这个新类型还定义如下方法: 
- add(value): 将给定的字符串值添加到列表中，如果值已经存在，就不添加了
- contains(value): 表示列表中是否存在给定的值，如果存在则返回 true，否则返回 false
- remove(value): 从列表中删除给定的字符串
- toggle(value): 如果列表中已经存在给定的值，删除它，如果列表中没有给定的值，添加它

``` javascript
//删除"disabled"类
div.classList.remove("disabled");

//添加"current"类
div.classList.add("current");

//切换"user"类
div.classList.toggle("user");

//确定元素中是否包含既定的类名
if (div.classList.contains("bd") && !div.classList.contains("disabled")) {
    //执行操作
)

//迭代类名
for (var i = 0, len = div.classList.length; i < len; i++) {
   doSomething(div.classList[i]);
}
```

有了 classList 属性，除非你需要全部删除所有类名，或者完全重写元素的 class 属性，否则也就用不到 className 属性了。

### 焦点管理
HTML5 也添加了辅助管理 DOM 焦点的功能。首先就是 document.activeElement 属性，这个属性始终会引用 DOM 中当前获得了焦点的元素。
``` javascript
var button = document.getElementById("myButton");
button.focus();
alert(document.activeElement === button);   //true
```
另外就是新增了 document.hasFocus() 方法，这个方法用于确定文档是否获得了焦点。
``` javascript
var button = document.getElementById("myButton");
button.focus();
alert(document.hasFocus());  //true
```

### HTMLDocument 的变化
作为对 document.body 引用文档的 body 元素的补充，HTML5 新增了 document.head 属性，引用文档的 head 元素。要引用文档的 head 元素，可以结合使用这个属性和另一种后备方法。
``` javascript
var head = document.head || document.getElementsByTagName("head")[0];
```

### 自定义数据属性
HTML5 规定可以为元素添加非标准的属性，但要添加前缀 data-，目的是为元素提供与渲染无关的信息，或者提供语义信息。
``` HTML
<div id="myDiv" data-appId="12345" data-myname="Nicholas"></div>
```

添加了自定义属性之后，可以通过元素的 dataset 属性来访问自定义属性的值。每个 data-name 形式的属性都会有一个对应的属性，只不过属性名没有 data-前缀: 
``` javascript
var div = document.getElementById("myDiv");

//取得自定义属性的值
var appId = div.dataset.appId;
var myName = div.dataset.myname;
//设置值
div.dataset.appId = 23456;
div.dataset.myname = "Michael";

//有没有"myname"值呢？
if (div.dataset.myname) {
    alert("Hello, " + div.dataset.myname);
}
```

### 插入标记
在需要给文档插入大量新 HTML 标记的情况下，通过 DOM 操作仍然非常麻烦，因为不仅要创建一系列 DOM 节点，而且还要小心地按照正确的顺序把它们连接起来。相对而言，使用插入标记的技术，直接插入 HTML 字符串不仅更简单，速度也更快。
- innerHTML 属性返回与调用元素的所有子节点(包括元素、注释和文本节点)对应的 HTML 标记
- outerHTML 属性返回调用它的元素及所有子节点的 HTML 标签

### scrollIntoView() 方法
scrollIntoView() 可以在所有 HTML 元素上调用，通过滚动浏览器窗口或某个容器元素，调用元素就可以出现在视口中。

如果给这个方法传入 true 作为参数，或者不传入任何参数，那么窗口滚动之后会让调用元素的顶部与视口顶部尽可能平齐。如果传入 false 作为参数，调用元素会尽可能全部出现在视口中: 
``` javascript
//让元素可见
document.forms[0].scrollIntoView();
```