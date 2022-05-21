---
title: CSS(五)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog21.jpg
date: 2018/07/02
---

从这一篇开始，将要介绍 CSS 中最重要的两个知识 - 浮动和定位。
前面几篇关于 CSS 的知识，只是讲解了一个元素作为一个个体时的样式，从这篇布局内容开始，将要介绍多个元素放在一起，从总体角度确定每个元素的位置。
布局分类: 
- 表格布局: 现在已经不用了，现在都是将表格作为一种数据展现元素，而不是布局方式
- 定位布局
- Flexbox 布局
- Grid 布局

## 浮动
***  
我们已经学会了如何操纵盒子的大小及其周围的空间，在默认情况下，页面元素的流方式:  
- 块级元素从上流到下
- 行内元素从左上流到右下

![](https://cdn.0xfee1dead.cn/contentImg/float/vertical-vs-horizontal-stacking-064f76.png)
浮动允许您将块级元素并排放置而不是彼此叠加。它允许我们构建各种布局，包括侧边栏，多列页面，网格和杂志样式的文章，文本在图像周围流动等。
在现代网站中，浮动技术已经被 Flexbox 布局所取代，但并不意味我们不需要清楚这一知识，之前的十多年来，浮动一直是建站的基础，所以很可能会在不经意间遇见它。

### 浮动的特点
浮动会改变默认文档流。也就是说，不会再按照默认文档流来布局元素了。浮动的元素会从正常文档流中取出来(即浮动元素的父容器不再包含该浮动元素)，然后始终与其父容器的左侧或右侧对齐。也会尽可能的在父容器内向上浮动。而浮动元素之后的第一个非浮动元素则会黏在浮动元素之前的最后一个非浮动元素之下。

块级元素可以使用 float: left; 或 float: right; 来左右对齐，使用 auto-margins 中间对齐。而行内元素使用 text-align 属性来对齐。
![](https://cdn.0xfee1dead.cn/contentImg/float/floats-and-auto-margin-for-alignment-536a81.png)

### 多个浮动元素的情况
如果都是左浮动，则按照在文档流中的先后顺序，从左向右水平排列。如果都是右浮动，则按照在文档流中的先后顺序，从右向左水平排列。
![](https://cdn.0xfee1dead.cn/contentImg/float/float-layout-combinations-e52716.png)

## 清除浮动
***  
我们使用 clear 属性来清除浮动，有3个可选值: 
- left: 在左侧不能出现浮动元素，处于左侧所有浮动元素的最下方
- right: 在右侧不能出现浮动元素，处于右侧所有浮动元素的最下方
- both: 在两侧都不能出现浮动元素，处于两侧所有浮动元素的最下方
- none: 不清除浮动

![](https://cdn.0xfee1dead.cn/contentImg/float/methods-for-clearing-floats-1.png)

## 容纳浮动元素
***  
我们知道，浮动元素已经从正常文档流中移除，父容器已经不包含浮动元素了，可能会造成一些布局问题，这时可能需要父容器仍然容纳浮动元素，我们就需要一些技巧。

1. 设置父容器的 overflow: hidden 属性，可以使父容器仍然容纳浮动元素，如下图所示。

![](https://cdn.0xfee1dead.cn/contentImg/float/methods-for-clearing-floats-2.png)
2. 让父元素也浮动。(这种做法需要额外设置父容器宽度)
3. 使用::after 在所有浮动元素之后添加一个空的元素 content: "";，并设置 clear: both; 和 display: block; 常规做法是添加一个名为 clearfix 类，使得需要让父容器仍然容纳浮动元素时，给该元素添加类即可。

``` CSS
.clearfix::after {
    content: "";
    clear: both;
    display: block;
}
```
实际使用过程中，使父容器仍然容纳浮动元素最常用第三种方式，前两种方式的原理是触发 BFC(Block Formatting Context)布局规则。

## BFC
***  
### Block level
让我们看看有哪些盒子: 
- block-level box:
display 属性为 block, list-item, table 的元素，会生成 block-level box。并且参与 block fomatting context;
- inline-level box:
display 属性为 inline, inline-block, inline-table 的元素，会生成 inline-level box。并且参与 inline formatting context;

### BFC 定义
BFC(Block formatting context) 直译为"块级格式化上下文"。它是一个独立的渲染区域，只有 Block-level box 参与， 它规定了内部的 Block-level Box 如何布局，并且与这个区域外部毫不相干。

### BFC 布局规则
- 内部的 Box 会在垂直方向，一个接一个地放置
- Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
- 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
- BFC 的区域不会与 float box 重叠
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
- 计算 BFC 的高度时，浮动元素也参与计算

### 会生成 BFC 的元素
- 根元素
- float 属性不为 none
- position 为 absolute 或 fixed
- display 为 inline-block, table-cell, table-caption, flex, inline-flex
- overflow 不为 visible

## overflow: hidden
***  
overflow: hidden 最常使用的地方有三处: 
- 溢出隐藏: 如父容器设置了 height 属性，而子元素超出父容器高度，使用 overflow: hidden 可以隐藏溢出部分
- 清除浮动: 使用 overflow: hidden 使得父容器仍然包含浮动子元素
- 解除坍塌: 可以使用 overflow:hidden 解除 margin 坍塌。(坍塌只针对于父容器的第一个子元素)

## 定位
***  
虽然之后我们会谈论 Flexbox 和 Grid，但我们仍需要讨论下 position 属性。他是古老布局的基础。
![](https://cdn.0xfee1dead.cn/contentImg/position/css-positioning-schemes-790d5b.png)
position 属性有四个可用值: 
- static
- relative
- absolute
- fixed

我们分别谈论一下他们的用处。

### static
static 是默认值。任意 position: static; 的元素不会被特殊的定位。一个 static 元素表示它不会被 "positioned"，一个 position 属性被设置为其他值的元素表示它会被 "positioned"。
![static](https://cdn.0xfee1dead.cn/contentImg/position/positioned-elements-terminology-861fca.png)

``` CSS
.static {
  position: static;
}
```

### relative
relative 表现的和 static 一样，除非你添加了一些额外的属性。
在一个相对定位(position属性的值为relative)的元素上设置 top 、 right 、 bottom 和 left 属性会使其偏离其正常位置。其他的元素的位置则不会受该元素的影响发生位置改变。
![](https://cdn.0xfee1dead.cn/contentImg/position/relative-positioning-offsets-494268.png)

``` CSS
.relative1 {
  position: relative;
}
.relative2 {
  position: relative;
  top: -20px;
  left: 20px;
  background-color: white;
  width: 500px;
}
```

### fixed
一个固定定位(position 属性的值为 fixed)元素会相对于视窗来定位，这意味着即便页面滚动，它还是会停留在相同的位置。和 relative 一样， top 、 right 、 bottom 和 left 属性都可用。
一个固定定位元素会脱离正常文档流。
![](https://cdn.0xfee1dead.cn/contentImg/position/css-fixed-positioning-342eff.png)

``` CSS
.fixed {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 200px;
  background-color: white;
}
```

### absolute
absolute 与 fixed 的表现类似，但是它不是相对于视窗而是相对于最近的 "positioned" 祖先元素。如果绝对定位(position 属性的值为 absolute)的元素没有 "positioned" 祖先元素，那么它是相对于文档的 body 元素，并且它会随着页面滚动而移动。记住一个 "positioned" 元素是指 position 值不是 static 的元素。
![](https://cdn.0xfee1dead.cn/contentImg/position/css-absolute-positioning-228ce0.png)
![](https://cdn.0xfee1dead.cn/contentImg/position/css-relatively-absolute-positioning-1ba963.png)

``` CSS
.relative {
  position: relative;
  width: 600px;
  height: 400px;
}
.absolute {
  position: absolute;
  top: 120px;
  right: 0;
  width: 300px;
  height: 200px;
}
```

### z-index
z-index 属性允许我们控制页面上元素的深度。
![](https://cdn.0xfee1dead.cn/contentImg/position/css-z-index-c87ef0.png)