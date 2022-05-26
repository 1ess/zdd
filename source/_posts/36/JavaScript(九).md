---
title: JavaScript(九)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog36.jpg
date: 2018/09/07
---

这一篇，我们讲讲 BOM。ECMAScript 是 JavaScript 的核心，但如果要在 Web 中使用 JavaScript，那么 BOM(浏览器对象模型)则无疑才是真正的核心。
BOM 提供了很多对象，用于访问浏览器的功能，这些功能与任何网页内容无关。

## window 对象
***  
BOM 的核心对象是 window，它表示浏览器的一个实例。在浏览器中，window 对象有双重角色: 
- 既是通过 JavaScript 访问浏览器窗口的一个接口
- 又是 ECMAScript 规定的 Global 对象

### 全局作用域
由于 window 对象同时扮演着 ECMAScript 中 Global 对象的角色，因此所有在全局作用域中声明的变量、函数都会变成 window 对象的属性和方法。
``` javascript
var age = 29;
function sayAge() {
    alert(this.age);
}

alert(window.age);      //29
sayAge();               //29
window.sayAge();        //29
```

本章后面将要讨论的很多全局 JavaScript 对象(如 location 和 navigator)实际上都是 window 对象的属性。

### 窗口位置
用来确定和修改 window 对象位置的属性和方法有很多。
IE、Safari、Opera 和 Chrome 都提供了 screenLeft 和 screenTop 属性，分别用于表示窗口相对于屏幕左边和上边的位置。Firefox 则在 screenX 和 screenY 属性中提供相同的窗口位置信息，Safari 和 Chrome 也同时支持这两个属性。
用下列代码可以跨浏览器取得窗口左边和上边的位置: 
``` javascript
var leftPos = (typeof window.screenLeft == "number") ?
                  window.screenLeft : window.screenX;
var topPos = (typeof window.screenTop == "number") ?
                  window.screenTop : window.screenY;
```

无法在跨浏览器的条件下取得窗口左边和上边的精确坐标值。但是，使用 moveTo() 和 moveBy() 方法倒是有可能将窗口精确地移动到一个新位置。
这两个方法都接收两个参数，其中 moveTo() 接收的是新位置的 x 和 y 坐标值，而 moveBy() 接收的是在水平和垂直方向上移动的像素数。
``` javascript
//将窗口移动到屏幕左上角
window.moveTo(0, 0);

//将窗向下移动100像素
window.moveBy(0, 100);

//将窗口移动到(200, 300)
window.moveTo(200, 300);

//将窗口向左移动50像素
window.moveBy(-50, 0);
```

### 窗口大小
跨浏览器确定一个窗口的大小不是一件简单的事。IE9+、Firefox、Safari、Opera 和 Chrome 均为此提供了 4 个属性: innerWidth、innerHeight、outerWidth 和 outerHeight。
在 IE9+、Safari 和 Firefox 中，outerWidth 和 outerHeight 返回浏览器窗口本身的尺寸，在 Opera 中，这两个属性的值表示页面视图容器的大小。而 innerWidth 和 innerHeight 则表示该容器中页面视图区的大小。在 Chrome 中，outerWidth、outerHeight 与 innerWidth、innerHeight 返回相同的值，即视口(viewport)大小而非浏览器窗口大小。
使用 resizeTo() 和 resizeBy() 方法可以调整浏览器窗口的大小。这两个方法都接收两个参数，其中 resizeTo() 接收浏览器窗口的新宽度和新高度，而 resizeBy() 接收新窗口与原窗口的宽度和高度之差。
``` javascript
//调整到100×100
window.resizeTo(100, 100);

//调整到200×150
window.resizeBy(100, 50);

//调整到 300×300
window.resizeTo(300, 300);
```

### 导航和打开窗口
使用 window.open() 方法既可以导航到一个特定的 URL，也可以打开一个新的浏览器窗口。这个方法可以接收 4 个参数: 要加载的 URL、窗口目标、一个特性字符串以及一个表示新页面是否取代浏览器历史记录中当前加载页面的布尔值。通常只须传递第一个参数，最后一个参数只在不打开新窗口的情况下使用。
如果为 window.open() 传递了第二个参数，而且该参数是已有窗口名称，那么就会在具有该名称的窗口中加载第一个参数指定的 URL。此外，第二个参数也可以是下列任何一个特殊的窗口名称: _self、_parent、_top 或 _blank。

### 间歇调用和超时调用
JavaScript 是单线程语言，但它允许通过设置超时值和间歇时间值来调度代码在特定的时刻执行。前者是在指定的时间过后执行代码，而后者则是每隔指定的时间就执行一次代码。

超时调用需要使用 window 对象的 setTimeout() 方法，它接受两个参数: 要执行的代码和以毫秒表示的时间(即在执行代码前需要等待多少毫秒)。其中，第一个参数可以是一个包含 JavaScript 代码的字符串(就和在 eval() 函数中使用的字符串一样)，也可以是一个函数。
``` javascript
//不建议传递字符串！
setTimeout("alert('Hello world!') ", 1000);

//推荐的调用方式
setTimeout(function() { 
    alert("Hello world!"); 
}, 1000);
```

虽然这两种调用方式都没有问题，但由于传递字符串可能导致性能损失，因此不建议以字符串作为第一个参数。
第二个参数是一个表示等待多长时间的毫秒数，但经过该时间后指定的代码不一定会执行。
JavaScript 是一个单线程序的解释器，因此一定时间内只能执行一段代码。为了控制要执行的代码，就有一个 JavaScript 任务队列。这些任务会按照将它们添加到队列的顺序执行。
setTimeout() 的第二个参数告诉 JavaScript 再过多长时间把当前任务添加到队列中。如果队列是空的，那么添加的代码会立即执行; 如果队列不是空的，那么它就要等前面的代码执行完了以后再执行。
调用 setTimeout() 之后，该方法会返回一个数值 ID，表示超时调用。这个超时调用 ID 是计划执行代码的唯一标识符，可以通过它来取消超时调用。要取消尚未执行的超时调用计划，可以调用 clearTimeout() 方法并将相应的超时调用 ID 作为参数传递给它，如下: 
```javascript
//设置超时调用
var timeoutId = setTimeout(function() {
    alert("Hello world!");
}, 1000);

//注意: 把它取消
clearTimeout(timeoutId);
```

只要是在指定的时间尚未过去之前调用 clearTimeout()，就可以完全取消超时调用。

间歇调用与超时调用类似，只不过它会按照指定的时间间隔重复执行代码，直至间歇调用被取消或者页面被卸载。设置间歇调用的方法是 setInterval()，它接受的参数与 setTimeout() 相同: 要执行的代码(字符串或函数)和每次执行之前需要等待的毫秒数。
调用 setInterval() 方法同样也会返回一个间歇调用 ID，该 ID 可用于在将来某个时刻取消间歇调用。要取消尚未执行的间歇调用，可以使用 clearInterval() 方法并传入相应的间歇调用 ID。
取消间歇调用的重要性要远远高于取消超时调用，因为在不加干涉的情况下，间歇调用将会一直执行到页面卸载。

### 系统对话框
浏览器通过 alert()、confirm() 和 prompt() 方法可以调用系统对话框向用户显示消息。
它们的外观由操作系统及(或)浏览器设置决定，而不是由 CSS 决定。此外，通过这几个方法打开的对话框都是同步和模态的。也就是说，显示这些对话框的时候代码会停止执行，而关掉这些对话框后代码又会恢复执行。
- alert() 接受一个字符串并将其显示给用户。具体来说，调用 alert() 方法的结果就是向用户显示一个系统对话框，其中包含指定的文本和一个 OK("确定")按钮
- confirm() 与 alert() 的主要区别在于"确认"对话框除了显示 OK 按钮外，还会显示一个 Cancel("取消")按钮，两个按钮可以让用户决定是否执行给定的操作。为了确定用户是单击了 OK 还是 Cancel，可以检查 confirm() 方法返回的布尔值: true 表示单击了 OK，false 表示单击了 Cancel 或单击了右上角的 X 按钮
- prompt() 方法生成一个"提示"框，用于提示用户输入一些文本。提示框中除了显示 OK 和 Cancel 按钮之外，还会显示一个文本输入域，以供用户在其中输入内容。prompt() 方法接受两个参数: 要显示给用户的文本提示和文本输入域的默认值(可以是一个空字符串)。如果用户单击了 OK 按钮，则 prompt() 返回文本输入域的值，如果用户单击了 Cancel 或没有单击 OK 而是通过其他方式关闭了对话框，则该方法返回 null

这些系统对话框很适合向用户显示消息并请用户作出决定。由于不涉及 HTML、CSS 或 JavaScript，因此它们是增强 Web 应用程序的一种便捷方式。

还有两个可以通过 JavaScript 打开的对话框，即"查找"和"打印"。这两个对话框都是异步显示的，能够将控制权立即交还给脚本。这两个对话框与用户通过浏览器菜单的"查找"和"打印"命令打开的对话框相同。而在 JavaScript 中则可以像下面这样通过 window 对象的 find() 和 print() 方法打开它们。
``` javascript
//显示"打印"对话框
window.print();

//显示"查找"对话框
window.find();
```

## location 对象
location 提供了与当前窗口中加载的文档有关的信息，还提供了一些导航功能。
location 对象也很特别，它既是 window 对象的属性，也是 document 对象的属性。即 window.location 和 document.location 引用的是同一个对象。
``` javascript
location.hash //URL 中 hash 部分，没有则返回空字符串
location.href  //完整的 URL
location.host  //返回服务器名和端口(如果有)
location.hostname  //返回服务器名
location.port  //返回端口，没有则返回空字符串
location.pathname  //返回路径部分
location.protocal  //返回协议
location.search  //返回查询字符串，以?开头
```

### 查询字符串参数
尽管 location.search 返回从问号到 URL 末尾的所有内容，但却没有办法逐个访问其中的每个查询字符串参数。为此，可以像下面这样创建一个函数，用以解析查询字符串，然后返回包含所有参数的一个对象: 
``` javascript
function getQueryStringArgs() {
    //取得查询字符串并去掉开头的问号
    var qs = (location.search.length > 0 ? location.search.substring(1) : "");

    //保存数据的对象
    var args = {};

    //取得每一项
    var items = qs.length ? qs.split("&") : [];
    var item = null;
    var name = null;
    var value = null;

    //在for循环中使用
    var i = 0;
    var len = items.length;
    //逐个将每一项添加到args对象中
    for (i=0; i < len; i++){
        item = items[i].split("=");
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}
```

### 位置操作
使用 location 对象可以通过很多方式来改变浏览器的位置。首先，也是最常用的方式，就是使用 assign() 方法并为其传递一个 URL: 
``` javascript
location.assign("https://github.com/1ess");
```

这样，就可以立即打开新 URL 并在浏览器的历史记录中生成一条记录。
如果是将 location.href 或 window.location 设置为一个 URL 值，也会以该值调用 assign() 方法: 
``` javascript
window.location = "https://github.com/1ess";
location.href = "https://github.com/1ess";
```

在这些改变浏览器位置的方法中，最常用的是设置 location.href 属性。

另外，修改 location 对象的其他属性也可以改变当前加载的页面。每次修改 location 的属性(hash 除外)，页面都会以新 URL 重新加载。
当通过上述任何一种方式修改 URL 之后，浏览器的历史记录中就会生成一条新记录，因此用户通过单击"后退"按钮都会导航到前一个页面。

要禁用这种行为，可以使用 replace() 方法。这个方法只接受一个参数，即要导航到的 URL，结果虽然会导致浏览器位置改变，但不会在历史记录中生成新记录。在调用 replace() 方法之后，用户不能回到前一个页面。

与位置有关的最后一个方法是 reload()，作用是重新加载当前显示的页面。如果调用 reload() 时不传递任何参数，页面就会以最有效的方式重新加载。如果要强制从服务器重新加载，则需要像下面这样为该方法传递参数 true。
``` javascript
location.reload();        //重新加载(有可能从缓存中加载)
location.reload(true);    //重新加载(从服务器重新加载)
```

位于 reload() 调用之后的代码可能会也可能不会执行，这要取决于网络延迟或系统资源等因素。为此，最好将 reload() 放在代码的最后一行。

## history 对象
history 对象保存着用户上网的历史记录，从窗口被打开的那一刻算起。出于安全方面的考虑，开发人员无法得知用户浏览过的 URL。不过，借由用户访问过的页面列表，同样可以在不知道实际 URL 的情况下实现后退和前进。

使用 go() 方法可以在用户的历史记录中任意跳转，可以向后也可以向前。这个方法接受一个参数，表示向后或向前跳转的页面数的一个整数值。负数表示向后跳转(类似于单击浏览器的"后退"按钮)，正数表示向前跳转(类似于单击浏览器的"前进"按钮)。
``` javascript
//后退一页
history.go(-1);

//前进一页
history.go(1);

//前进两页
history.go(2);
```

也可以给 go() 方法传递一个字符串参数，此时浏览器会跳转到历史记录中包含该字符串的第一个位置 —— 可能后退，也可能前进，具体要看哪个位置最近。如果历史记录中不包含该字符串，那么这个方法什么也不做: 
``` javascript
//跳转到最近的 github.com/1ess 页面
history.go("github.com/1ess");
```

另外，还可以使用两个简写方法 back() 和 forward() 来代替 go()。顾名思义，这两个方法可以模仿浏览器的"后退"和"前进"按钮。

除了上述几个方法外，history 对象还有一个 length 属性，保存着历史记录的数量。

## navigator 对象
navigator 对象已经成为识别客户端浏览器的事实标准。它最重要的属性就是 userAgent，表示客户端代理信息: 
``` javascript
console.log(navigator.userAgent);  
//FireFox
//Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0

//Chrome
//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36

//Edge
//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134

//IE11
//Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; Tablet PC 2.0; rv:11.0) like Gecko
```