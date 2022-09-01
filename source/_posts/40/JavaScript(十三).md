---
title: JavaScript(十三)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog40.jpg
date: 2018/09/19
---

这一篇，我们说说表单。
JavaScript 最初的一个应用，就是分担服务器处理表单的责任。

## 表单的基础知识
***  
在 HTML 中，表单是由 form 元素来表示的，而在 JavaScript 中，表单对应的则是 HTMLFormElement 类型。
独有的属性和方法包括: 
- acceptCharset: 服务器能够处理的字符集，等价于 HTML 中的 accept-charset 特性
- action: 接受请求的 URL，等价于 HTML 中的 action 特性
- elements: 表单中所有控件的集合。
- enctype: 请求的编码类型，等价于 HTML 中的 enctype 特性
- length: 表单中控件的数量
- method: 要发送的 HTTP 请求类型，通常是 "get" 或 "post"，等价于 HTML 的 method 特性
- submit(): 提交表单
- reset(): 将所有表单域重置为默认值

### 提交表单
使用 input 或 button 都可以定义提交按钮，只要将其 type 特性的值设置为 "submit" 即可: 
``` HTML
<!-- 通用提交按钮 -->
<input type="submit" value="Submit Form">

<!-- 自定义提交按钮 -->
<button type="submit">Submit Form</button>
```

只要表单中存在上面列出的任何一种按钮，那么在相应表单控件拥有焦点的情况下，按回车键就可以提交该表单。
提交表单时可能出现的最大问题，就是重复提交表单。解决这一问题的办法有两个: 
1. 在第一次提交表单后就禁用提交按钮
2. 利用 onsubmit 事件处理程序取消后续的表单提交操作。

### 重置表单
在用户单击重置按钮时，表单会被重置。使用 type 特性值为 "reset" 的 input 或 button 都可以创建重置按钮，如下: 
``` HTML
<!-- 通用重置按钮 -->
<input type="reset" value="Reset Form">

<!-- 自定义重置按钮 -->
<button type="reset">Reset Form</button>
```

这两个按钮都可以用来重置表单。在重置表单时，所有表单字段都会恢复到页面刚加载完毕时的初始值。如果某个字段的初始值为空，就会恢复为空; 而带有默认值的字段，也会恢复为默认值。
用户单击重置按钮重置表单时，会触发 reset 事件，利用这个机会，我们可以在必要时取消重置操作。

### 表单字段
可以像访问页面中的其他元素一样，使用原生 DOM 方法访问表单元素。此外，每个表单都有 elements 属性，该属性是表单中所有元素的集合。这个 elements 集合是一个有序列表，其中包含着表单中的所有字段，每个表单字段在 elements 集合中的顺序，与它们出现在标记中的顺序相同，可以按照位置和 name 特性来访问它们。

#### 共有的表单字段属性
表单字段共有的属性和方法如下: 
- disabled: 布尔值，表示当前字段是否被禁用
- form: 指向当前字段所属表单的指针，只读
- name: 当前字段的名称
- readOnly: 布尔值，表示当前字段是否只读
- type: 当前字段的类型，如 "checkbox"、"radio" 等等
- value: 当前字段将被提交给服务器的值

#### 共有的表单字段方法
每个表单字段都有两个方法: 
- focus()
- blur()

HTML5 为表单字段新增了一个 autofocus 属性。在支持这个属性的浏览器中，只要设置这个属性，不用 JavaScript 就能自动把焦点移动到相应字段。

#### 共有的表单字段事件
所有表单字段都支持下列 3 个事件: 
- blur: 当前字段失去焦点时触发
- focus: 当前字段获得焦点时触发
- change: 对于 input 和 textarea 元素，在它们失去焦点且 value 值改变时触发，对于 select 元素，在其选项改变时触发

## 文本框脚本
***  
在 HTML中，有两种方式来表现文本框: 
- 使用 input 元素的单行文本框
- 使用 textarea 元素的多行文本框

要表现文本框，必须将 input 元素的 type 特性设置为 "text"。而通过设置 size 特性，可以指定文本框中能够显示的字符数。通过 value 特性，可以设置文本框的初始值，而 maxlength 特性则用于指定文本框可以接受的最大字符数。
``` HTML
<input type="text" size="25" maxlength="50" value="initial value">
```

相对而言，textarea 元素则始终会呈现为一个多行文本框。要指定文本框的大小，可以使用 rows 和 cols 特性。其中，rows 特性指定的是文本框的字符行数，而 cols 特性指定的是文本框的字符列数。与 input 元素不同，textarea 的初始值必须要放在 textarea 开始和结束标签之间: 
```HTML
<textarea rows="25" cols="5">initial value</textarea>
```

另一个与 input 的区别在于，不能在 HTML 中给 textarea 指定最大字符数。

不要使用 setAttribute() 设置 input 元素的 value 特性，也不要去修改 textarea 元素的第一个子节点。
``` javascript
var textbox = document.forms[0].elements["textbox1"];
alert(textbox.value);

textbox.value = "Some new value";
```

## HTML5 约束验证 API
***  
为了在将表单提交到服务器之前验证数据，HTML5 新增了一些功能。浏览器自己会根据标记中的规则执行验证，然后自己显示适当的错误消息(完全不用 JavaScript 插手)。
只有在某些情况下表单字段才能进行自动验证。具体来说，就是要在 HTML 标记中为特定的字段指定一些约束，然后浏览器才会自动执行表单验证。

### 必填字段
第一种情况是在表单字段中指定了 required 属性，如下面的例子所示: 
``` HTML
<input type="text" name="username" required>
```

任何标注有 required 的字段，在提交表单时都不能空着。

### 其他输入类型
HTML5 为 input 元素的 type 属性又增加了几个值。这些新的类型不仅能反映数据类型的信息，而且还能提供一些默认的验证功能。例如: 
``` HTML
<input type="email" name ="email">
<input type="url" name="homepage">
```

"email" 类型要求输入的文本必须符合电子邮件地址的模式，而 "url" 类型要求输入的文本必须符合 URL 的模式。

### 数值范围
HTML5 还定义了另外几个输入元素。这几个元素都要求填写某种基于数字的值: "number"、"range"、"datetime"、"datetime-local"、"date"、"month"、"week"，还有 "time"。
对所有这些数值类型的输入元素，可以指定 min 属性(最小的可能值)、max 属性(最大的可能值)和 step 属性(从 min 到 max 的两个刻度间的差值)。
``` HTML
<input type="number" min="0" max="100" step="5" name="count">
```

### 输入模式
HTML5 为文本字段新增了 pattern 属性。这个属性的值是一个正则表达式，用于匹配文本框中的值。
``` HTML
<input type="text" pattern="\d+" name="count">
```

### 检测有效性
使用 checkValidity() 方法可以检测表单中的某个字段是否有效。所有表单字段都有个方法，如果字段的值有效，这个方法返回 true，否则返回 false。
``` javascript
if (document.forms[0].elements[0].checkValidity()) {
    //字段有效，继续 
} else {
    //字段无效
}
```

要检测整个表单是否有效，可以在表单自身调用 checkValidity() 方法。如果所有表单字段都有效，这个方法返回 true，即使有一个字段无效，这个方法也会返回 false。
``` javascript
if(document.forms[0].checkValidity()) {
    //表单有效，继续
} else {
    //表单无效
}
```

### 禁用验证
通过设置 novalidate 属性，可以告诉表单不进行验证。
``` HTML
<form method="post" action="signup.php" novalidate>
    <!--这里插入表单元素--> 
</form>
```

为了指定点击某个提交按钮不必验证表单，可以在相应的按钮上添加 formnovalidate 属性: 
``` HTML
<form method="post" action="foo.php">
  <!--这里插入表单元素--> 
  <input type="submit" value="Regular Submit">
  <input type="submit" formnovalidate name="btnNoValidate"
      value="Non-validating Submit">
</form>
```

## 选择框脚本
***  
选择框是通过 select 元素和 option 元素创建的。
HTMLSelectElement 类型提供了下列属性和方法: 
- add(newOption, relOption): 向控件中插入新 option 元素，其位置在相关项(relOption)之前
- multiple: 布尔值，表示是否允许多项选择，等价于 HTML 中的 multiple 特性
- options: 控件中所有 option 元素的 HTMLCollection
- remove(index): 移除给定位置的选项
- selectedIndex: 基于 0 的选中项的索引，如果没有选中项，则值为 -1
- size: 选择框中可见的行数，等价于 HTML 中的 size 特性

选择框的 value 属性由当前选中项决定，相应规则如下: 
- 如果没有选中的项，则选择框的 value 属性保存空字符串
- 如果有一个选中项，而且该项的 value 特性已经在 HTML 中指定，则选择框的 value 属性等于选中项的 value 特性。即使 value 特性的值是空字符串，也同样遵循此条规则
- 如果有一个选中项，但该项的 value 特性在 HTML 中未指定，则选择框的 value 属性等于该项的文本
- 如果有多个选中项，则选择框的 value 属性将依据前两条规则取得第一个选中项的值