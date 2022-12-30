---
title: JavaScript(十)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog37.jpg
date: 2018/08/10
---

DOM(文档对象模型)是针对 HTML 和 XML 文档的一个 API。DOM 描绘了一个层次化的节点树，允许开发人员添加、移除和修改页面的某一部分。

1998 年 10 月 DOM１级规范成为 W3C 的推荐标准，为基本的文档结构及查询提供了接口。
本篇将讨论 DOM1 的特性和应用，以及 JavaScript 对 DOM1 级的实现。

## 节点层次
***  
DOM 可以将任何 HTML 或 XML 文档描绘成一个由多层节点构成的结构。
节点分为几种不同的类型，每种类型分别表示文档中不同的信息及(或)标记。
文档节点是每个文档的根节点。文档节点只有一个子节点，即 html 元素，我们称之为文档元素。文档元素是文档的最外层元素，文档中的其他所有元素都包含在文档元素中。每个文档只能有一个文档元素。在 HTML 页面中，文档元素始终都是 html 元素。
HTML 元素通过元素节点表示，特性(attribute)通过特性节点表示，文档类型通过文档类型节点表示，而注释则通过注释节点表示。总共有 12 种节点类型，这些类型都继承自一个基类型。

### Node 类型
DOM1 级定义了一个 Node 接口，该接口将由 DOM 中的所有节点类型实现。这个 Node 接口在 JavaScript 中是作为 Node 类型实现的，JavaScript 中的所有节点类型都继承自 Node 类型，因此所有节点类型都共享着相同的基本属性和方法。

每个节点都有一个 nodeType 属性，用于表明节点的类型。为了确保跨浏览器兼容，最好还是将 nodeType 属性与数字值进行比较: 
``` javascript
if (someNode.nodeType == 1) {    //适用于所有浏览器
    alert("Node is an element.");
}
```

### nodeName 和 nodeValue 属性
要了解节点的具体信息，可以使用 nodeName 和 nodeValue 这两个属性。这两个属性的值完全取决于节点的类型。在使用这两个值以前，最好是像下面这样先检测一下节点的类型: 
``` javascript
if (someNode.nodeType == 1) {
    value = someNode.nodeName;    //nodeName的值是元素的标签名
}
```

首先检查节点类型，看它是不是一个元素。如果是，则取得并保存 nodeName 的值。对于元素节点，nodeName 中保存的始终都是元素的标签名，而 nodeValue 的值则始终为 null。

### 节点关系
节点间的各种关系可以用传统的家族关系来描述，相当于把文档树比喻成家谱。
每个节点都有一个 childNodes 属性，其中保存着一个 NodeList 对象。NodeList 是一种类数组对象，用于保存一组有序的节点，可以通过位置来访问这些节点。
请注意，虽然可以通过方括号语法来访问 NodeList 的值，而且这个对象也有 length 属性，但它并不是 Array 的实例。
NodeList 对象的独特之处在于，它实际上是基于 DOM 结构动态执行查询的结果，因此 DOM 结构的变化能够自动反映在 NodeList 对象中。
``` javascript
var firstChild = someNode.childNodes[0];
var secondChild = someNode.childNodes.item(1);
var count = someNode.childNodes.length;
```

要注意 length 属性表示的是访问 NodeList 的那一刻，其中包含的节点数量。

每个节点都有一个 parentNode 属性，该属性指向文档树中的父节点。包含在 childNodes 列表中的所有节点都具有相同的父节点，因此它们的 parentNode 属性都指向同一个节点。
此外，包含在 childNodes 列表中的每个节点相互之间都是同胞节点。通过使用列表中每个节点的 previousSibling 和 nextSibling 属性，可以访问同一列表中的其他节点。列表中第一个节点的 previousSibling 属性值为 null，而列表中最后一个节点的 nextSibling 属性的值同样也为 null。

父节点与其第一个和最后一个子节点之间也存在特殊关系。父节点的 firstChild 和 lastChild 属性分别指向其 childNodes 列表中的第一个和最后一个节点。

hasChildNodes() 也是一个非常有用的方法，这个方法在节点包含一或多个子节点的情况下返回 true。

所有节点都有的最后一个属性是 ownerDocument，该属性指向表示整个文档的文档节点。

### 操作节点
最常用的方法是 appendChild()，用于向 childNodes 列表的末尾添加一个节点。更新完成后，appendChild() 返回新增的节点: 
``` javascript
var returnedNode = someNode.appendChild(newNode);
alert(returnedNode == newNode);         //true
alert(someNode.lastChild == newNode);   //true
```

如果传入到 appendChild() 中的节点已经是文档的一部分了，那结果就是将该节点从原来的位置转移到新位置。
``` javascript
//someNode有多个子节点
var returnedNode = someNode.appendChild(someNode.firstChild);
alert(returnedNode == someNode.firstChild);      //false
alert(returnedNode == someNode.lastChild);       //true
```

如果需要把节点放在 childNodes 列表中某个特定的位置上，而不是放在末尾，那么可以使用 insertBefore() 方法。这个方法接受两个参数: 要插入的节点和作为参照的节点。插入节点后，被插入的节点会变成参照节点的前一个同胞节点(previousSibling)，同时被方法返回。如果参照节点是 null，则 insertBefore() 与 appendChild() 执行相同的操作: 
``` javascript
//插入后成为最后一个子节点
returnedNode = someNode.insertBefore(newNode, null);
alert(newNode == someNode.lastChild);   //true

//插入后成为第一个子节点
var returnedNode = someNode.insertBefore(newNode, someNode.firstChild);
alert(returnedNode == newNode);         //true
alert(newNode == someNode.firstChild);  //true

//插入到最后一个子节点前面
returnedNode = someNode.insertBefore(newNode, someNode.lastChild);
alert(newNode == someNode.childNodes[someNode.childNodes.length-2]); //true
```

replaceChild() 方法接受的两个参数是: 要插入的节点和要替换的节点。要替换的节点将由这个方法返回并从文档树中被移除，同时由要插入的节点占据其位置: 
``` javascript
//替换第一个子节点
var returnedNode = someNode.replaceChild(newNode, someNode.firstChild);

//替换最后一个子节点
returnedNode = someNode.replaceChild(newNode, someNode.lastChild);
```

如果只想移除而非替换节点，可以使用 removeChild() 方法。这个方法接受一个参数，即要移除的节点。被移除的节点将成为方法的返回值: 
``` javascript
//移除第一个子节点
var formerFirstChild = someNode.removeChild(someNode.firstChild);

//移除最后一个子节点
var formerLastChild = someNode.removeChild(someNode.lastChild);
```

前面介绍的四个方法操作的都是某个节点的子节点，也就是说，要使用这几个方法必须先取得父节点。

有两个方法是所有类型的节点都有的。第一个就是 cloneNode()，用于创建调用这个方法的节点的一个完全相同的副本。cloneNode() 方法接受一个布尔值参数，表示是否执行深复制。在参数为 true 的情况下，执行深复制，也就是复制节点及其整个子节点树; 在参数为 false 的情况下，执行浅复制，即只复制节点本身。
最后一个方法是 normalize()，这个方法唯一的作用就是处理文档树中的文本节点。如果找到了空文本节点，则删除它，如果找到相邻的文本节点，则将它们合并为一个文本节点。

## Document 类型
***  
JavaScript 通过 Document 类型表示文档。
Document 节点具有下列特征: 
- nodeType 的值为 9
- nodeName 的值为 "#document"
- nodeValue 的值为 null
- parentNode 的值为 null
- ownerDocument 的值为 null

### 常用属性
document 对象有一个 documentElement 属性，该属性始终指向 HTML 页面中的 html 元素。document 对象还有一个 body 属性，直接指向 body 元素。
document 对象还有一些标准的 Document 对象所没有的属性，其中第一个属性就是 title，包含着 title 元素中的文本——显示在浏览器窗口的标题栏或标签页上。通过这个属性可以取得当前页面的标题，也可以修改当前页面的标题并反映在浏览器的标题栏中。修改 title 属性的值不会改变 title 元素。
``` javascript
//取得文档标题
var originalTitle = document.title;

//设置文档标题
document.title = "New page title";
```

接下来要介绍的 3 个属性都与对网页的请求有关，它们是 URL、domain 和 referrer。
URL 属性中包含页面完整的 URL(即地址栏中显示的 URL)，domain 属性中只包含页面的域名，而 referrer 属性中则保存着链接到当前页面的那个页面的 URL。在没有来源页面的情况下，referrer 属性中可能会包含空字符串。所有这些信息都存在于请求的 HTTP 头部，只不过是通过这些属性让我们能够在 JavaScrip 中访问它们而已: 
``` javascript
//取得完整的URL
var url = document.URL;

//取得域名
var domain = document.domain;

//取得来源页面的URL
var referrer = document.referrer;
```

### 查找元素
取得元素的操作可以使用 document 对象的几个方法来完成。其中，Document 类型为此提供了两个方法: getElementById() 和 getElementsByTagName()。
getElementById() 方法接收一个参数: 要取得的元素的 ID。如果找到相应的元素则返回该元素，如果不存在带有相应 ID 的元素，则返回 null。注意，这里的ID必须与页面中元素的 id 特性(attribute)严格匹配，包括大小写。

getElementsByTagName() 方法接受一个参数，即要取得元素的标签名，而返回的是包含零或多个元素的 NodeList 称为 HTMLCollection。
HTMLCollection 对象还有一个方法，叫做 namedItem()，使用这个方法可以通过元素的 name 特性取得集合中的项。
而且，对命名的项也可以使用方括号语法来访问，对 HTMLCollection 而言，我们可以向方括号中传入数值或字符串形式的索引值。在后台，对数值索引就会调用 item()，而对字符串索引就会调用 namedItem()。

getElementsByName() 方法会返回带有给定 name 特性的所有元素。最常使用 getElementsByName() 方法的情况是取得单选按钮。

### 文档写入
有下列4个方法: 
- write()
- writeln()
- open()
- close()

write() 和 writeln() 方法都接受一个字符串参数，即要写入到输出流中的文本。write() 会原样写入，而 writeln() 则会在字符串的末尾添加一个换行符(\n)。open() 和 close() 分别用于打开和关闭网页的输出流。

## Element 类型
***  
Element 类型用于表现 XML 或 HTML 元素，提供了对元素标签名、子节点及特性的访问。Element 节点具有以下特征: 
- nodeType 的值为 1
- nodeName 的值为元素的标签名
- nodeValue 的值为 null
- parentNode 可能是 Document 或 Element

要访问元素的标签名，可以使用 nodeName 属性，也可以使用 tagName 属性，这两个属性会返回相同的值: 
``` javascript
var div = document.getElementById("myDiv");
alert(div.tagName);     //"DIV"
alert(div.tagName == div.nodeName); //true
```

在 HTML 中，标签名始终都以全部大写表示，在比较之前将标签名转换为相同的大小写形式: 
``` javascript
if (element.tagName.toLowerCase() == "div"){ //这样最好(适用于任何文档)
    //在此执行某些操作
}
```

### HTML 元素
所有 HTML 元素都由 HTMLElement 类型表示，HTMLElement 类型直接继承自 Element 并添加了一些属性。添加的这些属性分别对应于每个 HTML 元素中都存在的下列标准特性: 
- id，元素在文档中的唯一标识符
- title，有关元素的附加说明信息，一般通过工具提示条显示出来
- lang，元素内容的语言代码，很少使用
- className，与元素的 class 特性对应，即为元素指定的 CSS 类

``` javascript
var div = document.getElementById("myDiv");
alert(div.id);             //"myDiv""
alert(div.className);      //"bd"
alert(div.title);          //"Body text"
alert(div.lang);           //"en"
alert(div.dir);            //"ltr"
```

### 取得特性
操作特性的 DOM 方法主要有三个，分别是 getAttribute()、setAttribute() 和 removeAttribute()。
注意，传递给 getAttribute() 的特性名与实际的特性名相同。如果给定名称的特性不存在，getAttribute() 返回 null。

有两类特殊的特性，它们虽然有对应的属性名，但属性的值与通过 getAttribute() 返回的值并不相同。第一类特性就是 style，用于通过 CSS 为元素指定样式。在通过 getAttribute() 访问时，返回的 style 特性值中包含的是 CSS 文本，而通过属性来访问它则会返回一个对象。
第二类与众不同的特性是 onclick 这样的事件处理程序。当在元素上使用时，onclick 特性中包含的是 JavaScript 代码，如果通过 getAttribute() 访问，则会返回相应代码的字符串。而在访问 onclick 属性时，则会返回一个 JavaScript 函数(如果未在元素中指定相应特性，则返回 null)。

由于存在这些差别，在通过 JavaScript 以编程方式操作 DOM 时，开发人员经常不使用 getAttribute()，而是只使用对象的属性。只有在取得自定义特性值的情况下，才会使用 getAttribute() 方法。

### 设置特性
setAttribute() 方法接受两个参数: 要设置的特性名和值。如果特性已经存在，setAttribute() 会以指定的值替换现有的值，如果特性不存在，setAttribute() 则创建该属性并设置相应的值。

removeAttribute() 方法用于彻底删除元素的特性。调用这个方法不仅会清除特性的值，而且也会从元素中完全删除特性。

使用 document.createElement() 方法可以创建新元素。这个方法只接受一个参数，即要创建元素的标签名。

## Text 类型
***  
文本节点由 Text 类型表示，包含的是可以照字面解释的纯文本内容。Text 节点具有以下特征: 
- nodeType 的值为 3
- nodeName 的值为 "#text"
- nodeValue 的值为节点所包含的文本
- parentNode 是一个 Element
- 不支持(没有)子节点

可以通过 nodeValue 属性或 data 属性访问 Text 节点中包含的文本，这两个属性中包含的值相同。

一般来说，应该尽量减少访问 NodeList 的次数。因为每次访问 NodeList，都会运行一次基于文档的查询。所以，可以考虑将从 NodeList 中取得的值缓存起来。