---
title: ASP.Net MVC(六)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog72.jpg
date: 2018/10/29
---

这一篇，我们详细讲讲 .Net MVC 中的 HTML Helper。

HtmlHelper 类使用模型类对象生成 html 元素。它将模型对象绑定到 html 元素，以将模型属性的值显示为 html 元素，并在提交 Web 表单时将 html 元素的值分配给模型属性。 
我们最好在 Razor 视图中使用 HtmlHelper 类而不是手动编写 html 标签。

我们使用 @Html 来表示一个 HtmlHelper 对象。

HtmlHelper 类生成 html 元素。如: 
``` csharp
@Html.ActionLink("Create New", "Create")
```
将生成标记: 
``` html
<a href="/Foo/Create">Create New</a>
```

## HtmlHelper 扩展方法
***  
调用 HtmlHelper 扩展方法和使用 html 标记之间的区别在于: HtmlHelper 扩展方法可以使绑定模型数据变得容易。

### TextBox
我们有两个生成 textbox(&lt;input type="text" /&gt;)的方法: 
- TextBox()，松散类型
- TextBoxFor()，强类型

#### TextBox()
方法签名: 
``` csharp
MvcHtmlString Html.TextBox(string name, string value, object htmlAttributes)
```

注意: TextBox() 方法有很多重载，并且 TextBox() 方法是松散类型，因为 name 属性是字符串类型。
使用: 
``` csharp
@model Student
@Html.TextBox("StudentName", null, new { @class = "form-control" })
```

生成的 html 元素如下: 
``` html
<input class="form-control" 
        id="StudentName" 
        name="StudentName" 
        type="text" 
        value="" />
```
注意: 第一个参数是字符串，它将被设置为 input 元素的 name 和 id 属性，第二个参数是要在文本框中显示的值，第三个参数是 HtmlAttributes 参数，属性名称将是以 @ 符号开头的属性。

#### TextBoxFor()
方法签名: 
``` csharp
MvcHtmlString TextBoxFor(Expression<Func<TModel, TValue>> expression, object htmlAttributes)
```

使用: 
``` csharp
@model Student
@Html.TextBoxFor(m => m.StudentName, new { @class = "form-control" }) 
```

生成的 html 元素如下: 
``` html
<input class="form-control" 
        id="StudentName" 
        name="StudentName" 
        type="text" 
        value="1ess" />
```

### TextArea
TextArea() 方法和 TextAreaFor() 方法与 TextBox() 方法以及 TextBoxFor() 方法类似，我们就不多说了。

### CheckBox
我们有两个生成 checkbox(&lt;input type="checkbox" /&gt;)的方法: 
- CheckBox()，松散类型
- CheckBoxFor()，强类型

#### CheckBox()
方法签名: 
``` csharp
MvcHtmlString CheckBox(string name, bool isChecked, object htmlAttributes)
```

使用: 
``` csharp
@Html.CheckBox("isNewlyEnrolled", true)
```

生成的 html 元素如下: 
``` html
<input checked="checked" 
        id="isNewlyEnrolled" 
        name="isNewlyEnrolled" 
        type="checkbox" 
        value="true" />
```

#### CheckBoxFor()
方法签名: 
``` csharp
MvcHtmlString CheckBoxFor(<Expression<Func<TModel,TValue>> expression, object htmlAttributes)
```

使用: 
``` csharp
@model Student
@Html.CheckBoxFor(m => m.isNewlyEnrolled)
```

生成的 html 元素如下: 
``` html
<input data-val="true" 
        data-val-required="The isNewlyEnrolled field is required." 
        id="isNewlyEnrolled" 
        name="isNewlyEnrolled" 
        type="checkbox" 
        value="true" />

<input name="isNewlyEnrolled" type="hidden" value="false" />
```

### RadioButton
我们有两个生成 radio(&lt;input type="radio" /&gt;)的方法: 
- RadioButton()，松散类型
- RadioButtonFor()，强类型

#### RadioButton()
方法签名: 
``` csharp
MvcHtmlString RadioButton(string name, object value, bool isChecked, object htmlAttributes) 
```

使用: 
``` csharp
Male:   @Html.RadioButton("Gender", "Male")  
Female: @Html.RadioButton("Gender", "Female")  
```

生成的 html 元素如下: 
``` html
Male: <input checked="checked" 
        id="Gender" 
        name="Gender" 
        type="radio" 
        value="Male" />

Female: <input id="Gender" 
        name="Gender" 
        type="radio" 
        value="Female" />
```

#### RadioButtonFor()
方法签名: 
``` csharp
MvcHtmlString RadioButtonFor(<Expression<Func<TModel, TValue>> expression, object value, object htmlAttributes) 
```

使用: 
``` csharp
@model Student
@Html.RadioButtonFor(m => m.Gender, "Male")
@Html.RadioButtonFor(m => m.Gender, "Female")
```

生成的 html 元素如下: 
``` html
Male: <input checked="checked" 
        id="Gender" 
        name="Gender" 
        type="radio" 
        value="Male" />

Female: <input id="Gender" 
        name="Gender" 
        type="radio" 
        value="Female" />
```

### DropDownList
我们有两个生成 select 元素的方法: 
- DropDownList()，松散类型
- DropDownListFor()，强类型

#### DropDownList()
方法签名: 
``` csharp
MvcHtmlString Html.DropDownList(string name, IEnumerable<SelectLestItem> selectList, string optionLabel, object htmlAttributes)
```

使用: 
``` csharp
@using MyMVCApp.Models
@model Student
@Html.DropDownList("StudentGender", 
                    new SelectList(Enum.GetValues(typeof(Gender))),
                    "Select Gender",
                    new { @class = "form-control" })
```

生成的 html 元素如下: 
``` html
<select class="form-control" id="StudentGender" name="StudentGender">
    <option>Select Gender</option> 
    <option>Male</option> 
    <option>Female</option> 
</select>
```

#### DropDownListFor()
方法签名: 
``` csharp
MvcHtmlString Html.DropDownListFor(Expression<Func<dynamic, TProperty>> expression, IEnumerable<SelectLestItem> selectList, string optionLabel, object htmlAttributes)
```

使用: 
``` csharp
@using MyMVCApp.Models
@model Student
@Html.DropDownListFor(m => m.StudentGender, 
                    new SelectList(Enum.GetValues(typeof(Gender))), 
                    "Select Gender")
```

生成的 html 元素如下: 
``` html
<select class="form-control" id="StudentGender" name="StudentGender">
    <option>Select Gender</option> 
    <option>Male</option> 
    <option>Female</option> 
</select>
```

### 其他
还有一些扩展方法如: 
- Password
- Display
- Label
- Editor
- Hidden

等，我们就先不介绍了，等用到的时候再查文档即可。