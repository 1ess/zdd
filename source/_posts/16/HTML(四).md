---
title: HTML(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog16.jpg
date: 2018/07/09
---

前三篇已经讲解完大部分常用的标记，这一篇准备讲解其余的标记。

## figure 元素(Figure)
***  
figure 标记用来表示图片，图表，插图等内容。

``` HTML
<figure>
  <img src="a.jpg" alt="a">
</figure>
```

## figcaption 元素(Figure caption)
***  
figcaption 标记是为图片增加标题或者说明，是 figure 标记的子标记。
``` HTML
<figure>
  <img src="a.jpg" alt="a">
  <figcaption>a</figcaption>
</figure>
```

## address 元素(Address)
***  
address 标记一般用于联系方式的描述，如住址，邮件信息等。
``` HTML
<address>
  如果你有问题，请跟我联系(<a href="mailto:abc@abc.com">给我发邮件</a>)。
</address>
```

## time 元素(Time)
***  
time 标记用于定义时间。
![](https://cdn-fawn.vercel.app/contentImg/html4/datetime-format-d0c825.png)
``` HTML
The game starts at <time datetime="2018-07-12T10:00">10:00</time>.
```

## audio 元素(Audio)
***  
audio 标记允许在网页内嵌入音频。
重要的属性: 
- src: 定义资源文件的位置
- volume: 范围从0 - 1的声音大小
- autoplay: 布尔属性，自动播放
- controls: 布尔属性，是否展示内建的控件
- loop: 布尔属性，循环播放
- muted: 布尔属性，是否初始静音
- preload: 三个属性值可供设置: 
 1. "none": 不缓冲文件
 2. "auto": 缓冲音频文件
 3. "metadata": 仅仅缓冲文件的元数据

``` HTML
<audio src="foo.mp3" controls loop autoplay preload="auto"></audio>
```

## video 元素(Audio)
***  
video 标记允许在网页内嵌入视频。
重要的属性: 
- src: 定义资源文件的位置
- autoplay: 布尔属性，自动播放
- controls: 布尔属性，是否展示内建的控件
- loop: 布尔属性，循环播放
- muted: 布尔属性，是否初始静音
- poster: 封面海报
- preload: 三个属性值可供设置: 
 1. "none": 不缓冲文件
 2. "auto": 缓冲视频文件
 3. "metadata": 仅仅缓冲文件的元数据

``` HTML
<video src="foo.mp3" controls loop autoplay preload="auto" poster="foo.jpg"></video>
```

## picture 元素(Picture)
***  
picture 标记为网页嵌入图片资源，内部有0到多个 source 子元素以及一个 img 元素。
浏览器选择 source 元素中最佳匹配来展示，如果都无法展示，则最终显示 img 元素。
``` HTML
<picture>
  <source srcset="foo.png" media="(min-width: 1000px)">
  <img src="bar.png">
</picture>
```

## source 元素(Source)
***  
为 audio 元素，video 元素，picture 元素定义资源。
重要的属性: 
- src: 定义资源位置
- srcset: 定义同一个媒体的不同资源，浏览器将选择最佳的来使用
- sizes: 定义一组不同的资源尺寸
- type: MIME 类型

``` HTML
<video controls>
  <source src="foo.webm" type="video/webm">
  <source src="foo.ogg" type="video/ogg"> 
  <source src="foo.mov" type="video/quicktime">
  I'm sorry; your browser doesn't support HTML5 video.
</video>
```

## details 元素(Detail)
***  
使用下摘要和详情定义一个下拉块。与 summary 元素配合使用。
重要属性: 
- open: 布尔属性，确定初始状态

``` HTML
<details open>
  <summary>Read more</summary>
  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra nec nulla vitae mollis.</p>
</details>
```

## sub 元素(Subscripted text)
***  
sub 标记定义下标。
``` HTML
The formula of carbon dioxide is CO<sub>2</sub>.
```
## sup 元素(Superscripted text)
***  
sup 标记定义上标。
``` HTML
The "power of two" is 2<sup>n</sup> where n is an integer.
```

## var 元素(Variable)
***  
var 标记定义数学或程序中的变量。
``` HTML
The value of <var>x</var> is 12.
```

## button 元素(Button)
***  
定义可点击的按钮。
重要属性: 
- name: 定义表单内唯一标识符
- value: 当提交时，发送给服务器的值
- disabled: 布尔属性，是否禁用
- type: 有四个值可选择: 
 1. submit: 提交表单
 2. reset: 刷新表单
 3. button: default
 4. menu: 菜单

``` HTML
<button>submit</button>
``` 

## datalist 元素(Data list)
***  
当时有 input 元素时，定义了一组可自动补全的可选项。与 option 元素配合使用。
input 元素的 list 属性要与 datalist 的 id 属性相同。

``` HTML
<label>South American countries</label><br>
<input list="countries" placeholder="Type a country">

<datalist id="countries">
  <option value="Argentina">
  <option value="Bolivia">
  <option value="Brazil">
  <option value="Chile">
  <option value="Colombia">
  <option value="Ecuador">
  <option value="Guyana">
  <option value="Paraguay">
  <option value="Peru">
  <option value="Suriname">
  <option value="Uruguay">
  <option value="Venezuela">
</datalist>
```

## label 元素(Label)
***  
定义表单控件的标签。
重要属性: 
- for: 要与关联的表单子控件的 id 属性值相同，点击 label，则关联控件获取焦点

![](https://cdn-fawn.vercel.app/contentImg/html4/label-element-for-attribute-313489.png)
``` HTML
<label for="first_name">First name</label>
<br>
<input type="text" name="first_name" id="first_name">
```

## input 元素(Input)
***  
定义一组与表单可交互的控件。
![](https://cdn-fawn.vercel.app/contentImg/html4/html-form-elements-939709.png)
重要属性: 
- required: 布尔属性，是否必须填写
- name: 定义input唯一标识符
- placeholder: 占位符
- type: 定义控件类型，有以下可选值: 
 1. text: 普通文本
 2. password: 密码
 3. number: 数字
 4. checkbox: 多选框
 5. radio: 单选框
 6. submit: 提交按钮
 7. search: 搜索框
 8. email: 邮件
 9. tel: 电话号码
 10. url: 网址
 11. file: 文件

``` HTML
<input type="text" name="first_name" placeholder="e.g. Alex">
```
![](https://cdn-fawn.vercel.app/contentImg/html4/sending-input-variable-to-server-653369.png)  

## option 元素(Option)
***  
option 标记定义下拉框的一个选项。
重要属性: 
- value: 提交到服务器的值
- selected: 默认选中的选项

![](https://cdn-fawn.vercel.app/contentImg/html4/select-dropdown-in-iphone-a9968d.png)
``` HTML
<select name="country">
  <option value="Argentina">Argentina</option>
  <option value="Bolivia">Bolivia</option>
  <option value="Brazil">Brazil</option>
  <option value="Chile">Chile</option>
  <option value="Colombia">Colombia</option>
  <option value="Ecuador">Ecuador</option>
  <option value="Guyana">Guyana</option>
  <option value="Paraguay">Paraguay</option>
  <option value="Peru">Peru</option>
  <option value="Suriname">Suriname</option>
  <option value="Uruguay">Uruguay</option>
  <option value="Venezuela">Venezuela</option>
</select>
```

## optgroup 元素(Option group)
***  
optgroup 标记定义选项分组。
重要属性: 
- label: 定义选项所在分组名

``` HTML
<select>
  <optgroup label="South America">
    <option>Uruguay</option>
    <option>Brazil</option>
    <option>Argentina</option>
  </optgroup>
  <optgroup label="Europe">
    <option>Italy</option>
    <option>Germany</option>
    <option>England</option>
    <option>France</option>
    <option>Spain</option>
  </optgroup>
</select>
```

## 所有 HTML 元素集合
***  
![](https://cdn-fawn.vercel.app/contentImg/html4/HTML-CHEAT-SHEET-768x8555.png)