---
title: CSS(六)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog22.jpg
date: 2018/07/15
---

这一篇，我们将来介绍高级布局方式 - Flexbox 布局。
传统布局解决方案是基于盒模型，依赖 display 属性 + position 属性 + float 属性。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

Flexbox 布局旨在提供一种更有效简便的布局解决方案，可以很容易的实现各种布局。
注意: Flexbox 布局最适合应用程序的组件和小规模布局，而 Grid 布局则适用于更大规模的布局。(Flexbox 是一种一维布局方案，而 Grid 是一种二维布局方案)

## 概述
***  
Flexbox 是一个完整的模块而不是单个属性，其中一些是在容器上设置的(父元素，称为 "Flex 容器")，而其他的则设置在子元素上(称为 "Flex items")。
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/flex-container.svg" width="300px" alt="flex-container"><img src="https://cdn-fawn.vercel.app/contentImg/flexbox/flex-items.svg" width="300px" alt="flex-items">

## 基本概念
***  
![](https://cdn-fawn.vercel.app/contentImg/flexbox/flexbox.jpg)
在 flex 容器中默认存在两条轴，水平主轴(main axis)和垂直的交叉轴(cross axis)，这是默认的设置，当然你可以通过修改使垂直方向变为主轴，水平方向变为交叉轴，这个我们后面再说。

在容器中的每个单元块被称之为 flex item，每个项目占据的主轴空间为(main size)，占据的交叉轴的空间为(cross size)。

这里需要强调，不能先入为主认为宽度就是 main size，高度就是 cross size，这个还要取决于你主轴的方向，如果你垂直方向是主轴，那么项目的高度就是 main size。

## Flex container 上的属性
***  
有7个属性定义在 flex container 上
- display: flex
- flex-direction
- flex-wrap
- flex-flow
- justify-content
- align-items
- align-content

### display: flex;
display: flex; 定义了一个 flex 容器(内联或块级取决于给定的值)，为直接子元素提供一个弹性上下文。

``` CSS
.container {
  display: flex; /* or inline-flex */
}
```

注意: 设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。

### flex-direction
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/flex-direction2.svg" width="600px" alt="flex-direction">

flex-direction 属性定义了主轴方向，即定义了 flex items 放置在 flex container 的方向。 Flexbox 是一维布局概念。可以将 flex items 视为主要布置在水平行或垂直列中。
有四个取值: 
- row (默认):  主轴为水平方向，main start 位于左侧
- row-reverse: 主轴为水平方向，main start 位于右侧
- column: 主轴为垂直方向，main start 位于上沿
- column-reverse: 主轴为垂直方向，main start 位于下沿

``` CSS
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

### flex-wrap
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/flex-wrap.svg" width="600px" alt="flex-wrap">

默认情况下，flex items 会尽量布局在一行。我们可以更改 flex-wrap 属性允许 flex items 根据需要进行换行。
有三个取值: 
- nowrap(默认):  所有的 flex items 都将布局在一行
- wrap: flex items 将从上到下换行
- wrap-reverse: flex items 将从下到上换行

``` CSS
.container{
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

### flex-flow
flex-flow 属性是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。

``` CSS
.container{
  flex-flow: <'flex-direction'> || <'flex-wrap'>
}
```

### justify-content
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/justify-content-2.svg" width="400px" alt="justify-content">

justify-content 属性定义了沿主轴方向的对齐方式。
有六个取值: 
- flex-start(默认): items 左对齐
- flex-end: items 右对齐
- center: items 居中对齐
- space-between: items 两端对齐，项目之间的间隔都相等
- space-around: 每个 item 两侧的间隔相等。所以，item 之间的间隔比 item 与容器边界的间隔大一倍
- space-evenly: 任何两个 item 之间以及 item 与容器边界的间隔都相等

``` CSS
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

### align-items
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/align-items.svg" width="400px" alt="align-items">

align-items 属性定义了沿交叉轴方向的对齐方式。
有五个取值: 
-  flex-start: items 以 cross-start 的起始处对齐
-  flex-end: items 以 cross-end 的起始处对齐
-  center: items 处于 cross-axis 的中心点对齐
-  baseline: items 以 baselines 对齐
-  stretch(默认): 拉伸填充满 container(仍遵循 min-width/max-width)

``` CSS
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

### align-content
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/align-content.svg" width="400px" alt="align-content">

align-content 属性定义了多根主轴线的对齐方式。
注意: 当只有一行 flex items 时，此属性无效。
有六个取值: 
- flex-start: items 以 cross-start 的起始处对齐
- flex-end: items 以 cross-end 的起始处对齐
- center: items 处于 cross-axis 的中心点对齐
- space-between: main-cross 均匀分布，第一行处于容器的开头，而最后一行处于容器尾部
- space-around: main-cross 均匀分布，每行间距等宽
- stretch(默认): 每行的 items 伸展以占据剩余空间

``` CSS
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

## Flex items 上的属性
***  
有6个属性定义在 flex items 上: 
- order
- flex-grow
- flex-shrink
- flex-basis
- flex
- align-self

### order
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/order-2.svg" width="400px" alt="order">

默认情况下，Flex 项目按文档加载顺序排列。但是，order 属性控制 items 在 Flex 容器中的显示顺序。数值越小，排列越靠前，默认为 0。

``` CSS
.item {
  order: <integer>; /* default is 0 */
}
```

### flex-grow
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/flex-grow.svg" width="600px" alt="flex-grow">

flex-grow 属性定义了 flex items 在必要时放大比例，默认为 0，即如果存在剩余空间，也不放大。如果所有 items 的 flex-grow 都设置为 1，则容器中的剩余空间将平均分配给所有 item。如果其中一个 item 的值为 2，则剩余空间将占用其他空间的两倍。

``` CSS
.item {
  flex-grow: <number>; /* default 0 */
}
```

### flex-shrink
flex-shrink 属性定义了 flex items 在必要时缩小的能力，默认为 1，即如果空间不足，该项目将缩小。如果所有 item 的 flex-shrink 属性都为 1，当空间不足时，都将等比例缩小。如果一个 item 的 flex-shrink 属性为 0，其他 item 都为 1，则空间不足时，前者不缩小。

``` CSS
.item {
  flex-shrink: <number>; /* default 1 */
}
```

注意: 负值无效。

### flex-basis
flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间(main size)。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

``` CSS
.item {
  flex-basis: <length> | auto; /* default auto */
}
```

### flex
flex 属性是 flex-grow，flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。

``` CSS
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

该属性有两个快捷值: 
- auto(1 1 auto)
- none(0 0 auto)

建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

### align-self
<img src="https://cdn-fawn.vercel.app/contentImg/flexbox/align-self.svg" width="600px" alt="align-self">

align-self 属性允许单个 item 有与其他 item 不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch。

``` CSS
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

## flex-wrap 与 flex-grow 和 flex-shrink 的关系
***  
- 当 flex-wrap 为 wrap | wrap-reverse，且 items 的宽度之和**小于**父容器宽度时，flex-grow 会起作用，item 会根据 flex-grow 设定的值放大(为 0 的项不放大)
- 当 flex-wrap 为 wrap | wrap-reverse，且 items 的宽度之和**超过**父容器宽度时，首先一定会换行，换行后，每一行的右端都可能会有剩余空间(最后一行包含的子项可能比前几行少，所以剩余空间可能会更大)，这时 flex-grow 会起作用，若当前行所有子项的 flex-grow 都为 0，则剩余空间保留，若当前行存在一个子项的 flex-grow 不为 0，则剩余空间会被 flex-grow 不为 0 的 item 占据
- 当 flex-wrap 为 nowrap，且 items 的宽度之和**小于**父容器宽度时，flex-grow 会起作用，item 会根据 flex-grow 设定的值放大(为 0 的项不放大)
- 当 flex-wrap 为 nowrap，且 items 的宽度之和**超过**父容器宽度时，flex-shrink 会起作用，item 会根据 flex-shrink 设定的值进行缩小(为 0 的项不缩小)。但这里有一个较为特殊情况，就是当这一行所有 item 的 flex-shrink 都为 0 时，也就是说所有的子项都不能缩小，就会出现讨厌的横向滚动条

总结上面四点，可以看出不管在什么情况下，在同一时间，flex-shrink 和 flex-grow 只有一个能起作用，这其中的道理细想起来也很浅显: 空间足够时，flex-grow 就有发挥的余地，而空间不足时，flex-shrink 就能起作用。当然，flex-wrap 的值为 wrap | wrap-reverse 时，表明可以换行，既然可以换行，一般情况下空间就总是足够的，flex-shrink 当然就不会起作用。

## 参考
***  
[Flex 布局教程: 语法篇 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)