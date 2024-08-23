---
title: JavaScript(十二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog39.jpg
date: 2018/08/17
---

这一篇，我们讲讲 JavaScript 中非常重要的概念 —— 事件。
JavaScript 与 HTML 之间的交互是通过事件实现的。

## 事件流
***  
最早的两大浏览器厂商(IE 及 Netscape)在如何在看待浏览器事件方面还是一致的。比如说，如果你单击了某个按钮，他们都认为单击事件不仅仅发生在按钮上。换句话说，在单击按钮的同时，你也单击了按钮的容器元素，甚至也单击了整个页面。
**事件流描述的是从页面中接收事件的顺序。**
有意思的是，IE 和 Netscape 开发团队居然提出了差不多是完全相反的事件流的概念。
- IE 的事件流是 **事件冒泡流**
- Netscape 的事件流是 **事件捕获流**

### 事件冒泡
IE 的事件流叫做事件冒泡(event bubbling)，即事件开始时由最具体的元素(文档中嵌套层次最深的那个节点)接收，然后逐级向上传播到较为不具体的节点(文档)。

### 事件捕获
Netscape Communicator 团队提出的另一种事件流叫做事件捕获(event capturing)。事件捕获的思想是不太具体的节点应该更早接收到事件，而最具体的节点应该最后接收到事件。事件捕获的用意在于在事件到达预定目标之前捕获它。

**建议使用事件冒泡，在有特殊需要时再使用事件捕获。**

### DOM 事件流
"DOM2 级事件"规定的事件流包括三个阶段: 
- 事件捕获阶段
- 处于目标阶段
- 事件冒泡阶段

首先发生的是事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件。最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应。

## 事件处理程序
***  
事件就是用户或浏览器自身执行的某种动作。如 click、load 和 mouseover，都是事件的名字。而响应某个事件的函数就叫做事件处理程序(或事件监听器)。
事件处理程序的名字以 "on" 开头，因此 click 事件的事件处理程序就是 onclick，load 事件的事件处理程序就是 onload。为事件指定处理程序的方式有好几种。

### HTML 事件处理程序
某个元素支持的每种事件，都可以使用一个与相应事件处理程序同名的 HTML 特性来指定。这个特性的值应该是能够执行的 JavaScript 代码。
如，要在按钮被单击时执行一些 JavaScript，可以像下面这样编写代码: 
``` HTML
<input type="button" value="Click Me" onclick="alert('Clicked')" />
```

在 HTML 中定义的事件处理程序可以包含要执行的具体动作，也可以调用在页面其他地方定义的脚本，如下: 
``` HTML
<input type="button" value="Click Me" onclick="showMessage()" />
```

在 HTML 中指定事件处理程序有三个缺点。
- 首先，存在一个时差问题。因为用户可能会在 HTML 元素一出现在页面上就触发相应的事件，但当时的事件处理程序有可能尚不具备执行条件
- 其次，扩展事件处理程序的作用域链在不同浏览器中会导致不同结果
- 最后，HTML 与 JavaScript 代码紧密耦合。如果要更换事件处理程序，就要改动两个地方: HTML 代码和 JavaScript 代码

### DOM0 级事件处理程序
通过 JavaScript 指定事件处理程序的传统方式，就是将一个函数赋值给一个事件处理程序属性。
每个元素(包括 window 和 document)都有自己的事件处理程序属性，这些属性通常全部小写，例如 onclick。将这种属性的值设置为一个函数，就可以指定事件处理程序，如下所示: 
``` javascript
var btn = document.getElementById("myBtn");
btn.onclick = function() {
    alert("Clicked");
};
```

以这种方式添加的事件处理程序会在事件流的冒泡阶段被处理。

也可以删除通过 DOM0 级方法指定的事件处理程序，只要像下面这样将事件处理程序属性的值设置为 null 即可: 
``` javascript
btn.onclick = null;     //删除事件处理程序
```

### DOM2 级事件处理程序
"DOM2 级事件"定义了两个方法，用于处理指定和删除事件处理程序的操作: 
- addEventListener()
- removeEventListener()

所有 DOM 节点中都包含这两个方法，并且它们都接受 3 个参数: 
- 要处理的事件名
- 作为事件处理程序的函数
- 一个布尔值

最后这个布尔值参数如果是 true，表示在捕获阶段调用事件处理程序，如果是 false，表示在冒泡阶段调用事件处理程序。
``` javascript
var btn = document.getElementById("myBtn");
btn.addEventListener("click", function() {
    alert(this.id);
}, false);
```

使用 DOM2 级方法添加事件处理程序的主要好处是可以添加多个事件处理程序。
通过 addEventListener() 添加的事件处理程序只能使用 removeEventListener() 来移除，移除时传入的参数与添加处理程序时使用的参数相同。这也意味着通过 addEventListener() 添加的匿名函数将无法移除。
大多数情况下，都是将事件处理程序添加到事件流的冒泡阶段，这样可以最大限度地兼容各种浏览器。

## 事件对象
***  
在触发 DOM 上的某个事件时，会产生一个事件对象 event，这个对象中包含着所有与事件有关的信息。

### DOM 中的事件对象
兼容 DOM 的浏览器会将一个 event 对象传入到事件处理程序中，无论指定事件处理程序时使用什么方法: 
``` javascript
var btn = document.getElementById("myBtn");
btn.onclick = function(event) {
    alert(event.type);     //"click"
};
btn.addEventListener("click", function(event) {
    alert(event.type);     //"click"
}, false);
```

在通过 HTML 特性指定事件处理程序时，变量 event 中保存着 event 对象。
``` HTML
<input type="button" value="Click Me" onclick="alert(event.type)"/>
```

## 事件类型
***  
Web 浏览器中可能发生的事件有很多类型。
"DOM3 级事件"规定了以下几类事件。
- UI(User Interface，用户界面)事件，当用户与页面上的元素交互时触发
- 焦点事件，当元素获得或失去焦点时触发
- 鼠标事件，当用户通过鼠标在页面上执行操作时触发
- 滚轮事件，当使用鼠标滚轮(或类似设备)时触发
- 文本事件，当在文档中输入文本时触发
- 键盘事件，当用户通过键盘在页面上执行操作时触发

### UI 事件
UI 事件指的是那些不一定与用户操作有关的事件。现有的 UI 事件如下: 
- load: 当页面完全加载后在 window 上面触发，当图像加载完毕时在 img 元素上面触发
- unload: 当页面完全卸载后在 window 上面触发
- error: 当发生 JavaScript 错误时在 window 上面触发，当无法加载图像时在 img 元素上面触发
- scroll: 当用户滚动带滚动条的元素中的内容时，在该元素上面触发
- resize: 当窗口或框架的大小变化时在 window 上面触发
- select: 当用户选择文本框(input 或 texterea)中的一或多个字符时触发

#### load 事件
JavaScript 中最常用的一个事件就是 load。当页面完全加载后(包括所有图像、JavaScript 文件、CSS 文件等外部资源)，就会触发 window 上面的 load 事件。

#### unload 事件
与 load 事件对应的是 unload 事件，这个事件在文档被完全卸载后触发。只要用户从一个页面切换到另一个页面，就会发生 unload 事件。而利用这个事件最多的情况是清除引用，以避免内存泄漏。

### 焦点事件
焦点事件会在页面获得或失去焦点时触发。利用这些事件并与 document.hasFocus() 方法及 document.activeElement 属性配合，可以知晓用户在页面上的行踪。有以下 4 个焦点事件: 
- blur: 在元素失去焦点时触发
- focus: 在元素获得焦点时触发
- focusin: 在元素获得焦点时触发。这个事件与 HTML 事件 focus 等价，但它冒泡
- focusout: 在元素失去焦点时触发。这个事件是 HTML 事件 blur 的通用版本

### 鼠标事件
DOM3 级事件中定义了 9 个鼠标事件: 
- click: 在用户单击主鼠标按钮(一般是左边的按钮)或者按下回车键时触发
- dblclick: 在用户双击主鼠标按钮(一般是左边的按钮)时触发
- mousedown: 在用户按下了任意鼠标按钮时触发
- mouseup: 在用户释放鼠标按钮时触发
- mouseenter: 在鼠标光标从元素外部首次移动到元素范围之内时触发
- mouseleave: 在位于元素上方的鼠标光标移动到元素范围之外时触发
- mousemove: 当鼠标指针在元素内部移动时重复地触发
- mouseout: 在鼠标指针位于一个元素上方，然后用户将其移入另一个元素时触发
- mouseover: 在鼠标指针位于一个元素外部，然后用户将其首次移入另一个元素边界之内时触发

注意: 只有在同一个元素上相继触发 mousedown 和 mouseup 事件，才会触发 click 事件; 如果 mousedown 或 mouseup 中的一个被取消，就不会触发 click 事件。类似地，只有触发两次 click 事件，才会触发一次 dblclick 事件。如果有代码阻止了连续两次触发 click 事件，那么就不会触发 dblclick 事件了。

### 键盘与文本事件
有 3 个键盘事件: 
- keydown: 当用户按下键盘上的任意键时触发，而且如果按住不放的话，会重复触发此事件
- keypress: 当用户按下键盘上的字符键时触发，而且如果按住不放的话，会重复触发此事件。按下 Esc 键也会触发这个事件
- keyup: 当用户释放键盘上的键时触发

有一个文本事件: 
- textInput，这个事件是对 keypress 的补充，用意是在将文本显示给用户之前更容易拦截文本。在文本插入文本框之前会触发 textInput 事件

## 内存和性能
***  
在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。
导致这一问题的原因是多方面的。首先，每个函数都是对象，都会占用内存，内存中的对象越多，性能就越差。其次，必须事先指定所有事件处理程序而导致的 DOM 访问次数，会延迟整个页面的交互就绪时间。

### 事件委托
对"事件处理程序过多"问题的解决方案就是**事件委托**。
事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。例如，click 事件会一直冒泡到 document 层次。也就是说，我们可以为整个页面指定一个 onclick 事件处理程序，而不必给每个可单击的元素分别添加事件处理程序。
最适合采用事件委托技术的事件包括 click、mousedown、mouseup、keydown、keyup 和 keypress。