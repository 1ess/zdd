---
title: CSS(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog19.jpg
date: 2018/07/12
---

本篇将讲解盒模型以及外边距折叠的相关知识。
"CSS 盒模型"是一组规则，用于定义如何呈现 Internet 上的每个网页。 CSS 将 HTML 文档中的每个元素视为一个"框"或"盒"，其中包含一系列不同的属性，用于确定它在页面上的显示位置。
本章介绍了 CSS 框模型的核心组件: 填充，边框，边距，Block boxes 和 Inline boxes。可以将此视为 CSS 布局的"微观"视图，因为它定义了框的个别行为。在以后的章节中，我们将更多地了解 HTML 结构和 CSS 框模型如何组合以形成各种复杂的页面布局。

## Block 元素和 Inline 元素
***  
![](https://cdn.zhangdd.tech/contentImg/box-model/inline-vs-block-boxes-f3e662.png)
屏幕上呈现的每个 HTML 元素都是一个框，它们有两种形式: Block boxes 和 Inline boxes。
 
### Block boxes 和 Inline boxes 的行为
- Block boxes 总是在前一个 Block 元素之后
- Block boxes 的宽度基于其父容器的宽度
- Block boxes 的高度基于其所容纳的内容
- Inline boxes 不会影响垂直间距，它们不是用于确定布局，只是用于构建块内的样式
- Inline boxes 的宽度基于其所容纳的内容，而与父容器的宽度无关

### 改变 Box 的行为
我们可以使用 CSS display 属性覆盖 HTML 元素的默认 box 类型。
``` CSS
em, strong {
  display: block;
}
```
这时，em 和 strong 元素的行为就跟 Block 元素一样了。

## Content、Padding、Border and Margin
***  
![](https://cdn.zhangdd.tech/contentImg/box-model/css-box-model-73a525.png)
盒模型是一组规则，用于确定网页中每个元素的尺寸。它为每个 Box 提供了四个属性: 
- Content: 一个元素的文本，图片或其他媒体内容
- Padding: box 的内容和边框之间的距离
- Border: box 的填充和边距之间的线
- Margin: box 和周围 box 之间的距离

### Padding
``` CSS
h1 {
  background: #eee;
  padding: 50px;
}
```
注意背景颜色如何扩展以填充此空间。填充总是如此，因为它在边框内部，边框内的所有内容都有背景。

#### 速记格式
两值速记
![](https://cdn.zhangdd.tech/contentImg/box-model/padding-shortform-two-values-a7ed4c.png)
四值速记
![](https://cdn.zhangdd.tech/contentImg/box-model/padding-shortform-four-values-93c021.png)
注意: 是否想要使用速记表格主要取决于个人偏好和团队惯例。一些开发人员喜欢速记形式更加浓缩的事实，而另一些开发人员认为长形式一目了然(因此更容易维护)。

### Border
Border 就是围绕内容和填充绘制的线，注意边框如何在填充旁边碰撞，两者之间没有空隙。
![](https://cdn.zhangdd.tech/contentImg/box-model/css-border-syntax-d8ba17.png)
``` CSS
h1 {
  border: 1px solid #5D6063;
}
```

### Margin
边距定义元素边框外的空间。或者更确切地说，一个盒子和它周围的盒子之间的空间。
``` CSS
p {
  margin-bottom: 50px; 
}
```
margin 和 padding 有一样的速记形式。
边距和填充可以在很多情况下完成同样的事情，因此很难确定哪一个是"正确的"选择。
您选择其中一个的最常见原因是: 
- 填充具有背景，而边距始终是透明的 
- 填充包含在元素的单击区域中，而边距则不包括在内
- 边距会发生垂直折叠，而填充则不会

块级元素和内联元素之间最明显的对比之一是它们对边距的处理。Inline box 完全忽略元素的顶部和底部边距。
水平边距显示会像我们期望的那样，而元素周围的垂直空间没有变化。
``` CSS
strong {
  margin: 50px;
}
```
![](https://cdn.zhangdd.tech/contentImg/box-model/margins-on-inline-elements-4c569c.png)

如果我们将边距更改为填充，它会显示背景。但是，它不会影响周围盒子的垂直布局。
![](https://cdn.zhangdd.tech/contentImg/box-model/paddings-on-inline-elements-fb52d0.png)

## 垂直边距折叠
***  
盒子模型的另一个怪癖是"垂直边距折叠"。当你有两个垂直边距彼此相邻的盒子时，它们会折叠。不是将边距加到一起，而是仅显示最大的边距。
![](https://cdn.zhangdd.tech/contentImg/box-model/vertical-margin-collapse-bba78e.png)
垂直外边距折叠最可能发生的两种简单情况: 
- 两个紧邻的兄弟元素的外边距发生折叠
- 父子元素的外边距发生折叠
 1. 首子元素与父元素的上外边距发生折叠
 2. 尾子元素与父元素的下外边距发生折叠

### 预防边距折叠
有时我们确实希望防止边距折叠。做法就是在它们之间放置另一个不可见的元素。
![](https://cdn.zhangdd.tech/contentImg/box-model/preventing-margin-collapse-4b96ca.png)
一定要记住，填充不会折叠。

## Content Boxes and Border Boxes
***  
### Content Boxes
我们定义的 width 属性仅表示内容的宽度。
![](https://cdn.zhangdd.tech/contentImg/box-model/box-sizing-content-box-09f48a.png)
我们可以通过修改 box-sizing 属性，使其变为不同的 Boxes。
``` CSS
box-sizing: border-box;
```

### Border Boxes
Border Boxes 的 width 属性表示包括内容 + 填充 + 边框的总宽度。
![](https://cdn.zhangdd.tech/contentImg/box-model/box-sizing-border-box-ace2be.png)

注意: 只有 Block 元素修改 width 属性才生效，Inline 元素修改 width 属性无效。height 属性同理。