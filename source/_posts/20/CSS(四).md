---
title: CSS(四)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog20.jpg
date: 2018/06/30
---

上一篇我们介绍了，使用 display: block; 和 display: inline; 来改变默认的盒模型。这一篇，我们详细介绍 4 种常用的 display 属性值，以及与背景相关的属性。

## Block，Inline，Inline-block，None
***  
### Block
之前说过，块级元素的特点: 
- 独占一行
- 宽度基于父容器
- 高度基于内容

### Inline
之前说过，行内元素的特点: 
- 宽度基于内容
- 无法修改垂直外边距

我们有时可能需要修改行内元素的宽高或垂直外边距，但又不想其独占一行。可以通过修改 display: inline-block; 实现。

### Inline-block
行内块元素的特点: 
- 可以通过 width，height 属性修改宽高
- 可以通过 margin 属性修改垂直外边距
- 与其他行内元素或行内块元素处于一行

### None
可以通过 display: none; 使得元素隐藏。
注意通过 display: none; 隐藏的元素不占空间。

## 与 background 有关的属性
***  
- background-color
- background-image
- background-repeat
- background-attachment
- background-position
- background-size
- background-origin
- background-clip
- background 简写

### background-color
与前景色 color 一样，可以有 7 种取值。
这里就不详细介绍。

### background-image
background-image 属性定义了元素的背景图片。
常用的 3 种取值: 
- none(默认)

``` CSS
background-image: none;
```
- url()

``` CSS
background-image: url(/images/demo-.png);
```
- linear-gradient

默认从上到下渐变: 
``` CSS
background-image: linear-gradient(red, blue);
```
还可以根据参数角度渐变
``` CSS
background-image: linear-gradient(45deg, red, blue);
```

### background-repeat
background-repeat 属性定义了沿什么方向重复图片。
4 种可能取值: 
- repeat(默认): 沿 x 和 y 方向重复

``` CSS
background-repeat: repeat;
```
- repeat-x: 沿 x 方向重复

``` CSS
background-repeat: repeat-x;
```

- repeat-y: 沿 y 方向重复

``` CSS
background-repeat: repeat-y;
```

- no-repeat: 不重复

``` CSS
background-repeat: no-repeat;
```

### background-attachment
background-attachment 属性定义了背景在可滑动页面中的行为。
2 种可选取值: 
- scroll(默认): 跟随滑动

``` CSS
background-attachment: scroll;
```

- fixed: 背景图像不会随页面滚动，并根据视口保持定位。 它还将根据视口定位和调整自身大小。 因此，背景图像可能只是部分可见。

``` CSS
background-attachment: fixed;
```

### background-position
background-position 元素定义背景出现的位置。
3 种可能的取值: 
- percentage(默认: 0% 0%)

``` CSS
background-position: 0% 0%;
```

- 位置关键字(left，right，top，bottom，center)

``` CSS
background-position: bottom right;
```
第一个分量可以取 left，right，center，第二个分量可以取  top，bottom，center。

- pixel

``` CSS
background-position: 50px 50px;
```

### background-size
background-size 属性定义了背景图片尺寸。
5 种可能取值: 
- auto auto(默认): 将保持原图片大小

``` CSS
background-size: auto auto;
```
- pixel

``` CSS
background-size: 120px 80px;
```

- percentage: 占据当前元素的百分比

``` CSS
background-size: 100% 50%;
```
注意: 百分数和像素会改变纵横比。

- contain: 重置图片大小使其全部可见

``` CSS
background-size: contain;
```

- cover: 重置图片大小使其全部覆盖

``` CSS
background-size: cover;
```
contain 和 cover 会等比缩放。

### background-origin
background-origin 属性定义图片的 origin。
3 种可能取值: 
- padding-box(默认): 沿着 border

``` CSS
background-origin: padding-box;
```

- border-box: border 之下

``` CSS
background-origin: border-box;
```

- content-box: content 之内

``` CSS
background-origin: content-box;
```

### background-clip
background-clip 属性定义如何剪裁。
3 种可能取值: 
- border-box(默认)

``` CSS
background-clip: border-box;
```
- padding-box

``` CSS
background-clip: padding-box;
```
- content-box

``` CSS
background-clip: content-box;
```

### background 简写
属性的书写顺序: 
background: [background-color] [background-image] [background-repeat] [background-attachment] [background-position] / [ background-size] [background-origin] [background-clip];
``` CSS
background: red url(img.png) no-repeat scroll center center / 50% content-box content-box;
```