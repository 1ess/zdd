---
title: CSS(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog23.jpg
date: 2018/07/16
---

Grid 布局是 CSS 中最强大的布局系统。
Grid 布局是一个二维布局系统，意味着它可以处理列和行，不像 Flexbox 主要是一维布局系统。通过将 CSS 规则应用于父元素(称为 grid container)和子元素(称为 grid items)，我们就可以使用网格布局。

上一篇我们就说过，基于传统的 float，position 的方式，在设计布局时会极其复杂，Flexbox 会有所帮助，但它适用于更简单的一维布局，而不是复杂的二维布局(Flexbox 和 Grid 实际上可以很好地协同工作)，Grid 是第一个专门用于解决布局问题的 CSS 模块，学会了 Grid 布局，对于我们的开发工作的帮助是巨大的。

## 基本概念
***  
在深入研究 Grid 的概念之前，理解术语非常重要。由于这里涉及的术语在概念上是相似的，如果你不首先记住网格规范定义的含义，很容易将它们彼此混淆。

### Grid Container
被设置了 display: grid 属性的元素。

### Grid Item
grid container 的**直接**子元素。

### Grid Line
构成网格结构的分界线。
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-line.png)

### Grid Track
两个相邻网格线之间的空间。可以将它们视为网格的列或行。
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-track.png)

### Grid Cell
两个相邻行和两个相邻列网格线之间的空间。它是网格的单个"单元"。
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-cell.png)

### Grid Area
四个网格线包围的总空间。网格区域可以包括任意数量的网格单元。
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-area.png)

## Grid container 上的属性
***  
有 18 个属性定义在 grid container 上
- display: grid
- grid-template-columns
- grid-template-rows
- grid-template-areas
- grid-template
- grid-column-gap
- grid-row-gap
- grid-gap
- justify-items
- align-items
- place-items
- justify-content
- align-content
- place-content
- grid-auto-columns
- grid-auto-rows
- grid-auto-flow
- grid

### display: grid;
display: grid; 定义了一个 grid 容器，为直接子元素提供一个网格上下文。

``` CSS
.container {
  display: grid | inline-grid;
}
```

### grid-template-columns 和 grid-template-rows
- 使用以空格分隔的值列出网格的列宽和行高

``` CSS
.container {
  grid-template-columns: 40px 50px auto 50px 40px;
  grid-template-rows: 25% 100px auto;
}
```

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-numbers.png)

- 我们也可以明确命名行列名称

``` CSS
.container {
  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
}
```

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-names.png)

- 一行也可以有多个名称

``` CSS
.container {
  grid-template-rows: [row1-start] 25% [row1-end row2-start] 25% [row2-end];
}
```

- 可以使用 repeat() 表示法来简化书写

``` CSS
.container {
  grid-template-columns: repeat(3, 20px [col-start]);
}
```

等价于

``` CSS
.container {
  grid-template-columns: [col-start] 20px [col-start] 20px [col-start] 20px;
}
```

注意: 如果多行共享相同的名称，则可以通过其行名称和计数来引用它们。

``` CSS
.item {
  grid-column-start: col-start 2;
}
```

我们可以使用 fr 单位定义行高或者列宽的大小比例。

``` CSS
.container {
  grid-template-columns: 1fr 1fr 1fr;
}
```

``` CSS
.container {
  grid-template-columns: 1fr 50px 1fr 1fr;
}
```

### grid-template-areas
通过使用 grid-area 属性指定的网格区域的名称来定义网格模板。重复网格区域的名称会导致内容跨越这些单元格。. 表示空单元格。 

``` CSS
.item-a {
  grid-area: header;
}
.item-b {
  grid-area: main;
}
.item-c {
  grid-area: sidebar;
}
.item-d {
  grid-area: footer;
}

.container {
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto;
  grid-template-areas: 
    "header header header header"
    "main main . sidebar"
    "footer footer footer footer";
}
```

注意: 当我们通过这种方式给我们网格区域时，会自动给相应的网格线命名，比如下图中 main 区域，其行线及列线的起始线就会被自动设置为 main-start，行线及列线的结束线就命为 main-end。

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-template-areas.png)

### grid-template
grid-template 属性是 grid-template-rows，grid-template-columns 和 grid-template-areas 的简写形式。

``` CSS
.container {
  grid-template:
    [row1-start] "header header header" 25px [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end]
    / auto 50px auto;
}
```

相当于

``` CSS
.container {
  grid-template-rows: [row1-start] 25px [row1-end row2-start] 25px [row2-end];
  grid-template-columns: auto 50px auto;
  grid-template-areas: 
    "header header header" 
    "footer footer footer";
}
```

### grid-column-gap 和 grid-row-gap
该属性指定 line 的宽度，即行之间或列之间的宽度。

``` CSS
.container {
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px; 
  grid-column-gap: 10px;
  grid-row-gap: 15px;
}
```

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-column-row-gap.png)

注意: 仅表示在行与行或者列和列之间的宽度，而不是行或列与边界的宽度。
注意: Chrome 68+，Safari 11.2 Release 50+ 和 Opera 54+ 已经不使用 grid 前缀了。

### grid-gap
grid-gap 属性是 grid-row-gap 和 grid-column-gap 的简写。

``` CSS
.container {
  grid-gap: <grid-row-gap> <grid-column-gap>;
}
```

注意: Chrome 68+，Safari 11.2 Release 50+ 和 Opera 54+ 已经不使用 grid 前缀了。

### justify-items
在 row 轴对齐 grid items。
四种取值: 
- start
- end
- center
- stretch

``` CSS
.container {
  justify-items: start;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-items-start.png)
``` CSS
.container {
  justify-items: end;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-items-end.png)
``` CSS
.container {
  justify-items: center;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-items-center.png)
``` CSS
.container {
  justify-items: stretch;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-items-stretch.png)

### align-items
在 column 轴对齐 grid items。
四种取值: 
- start
- end
- center
- stretch

``` CSS
.container {
 align-items: start;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-items-start.png)
``` CSS
.container {
 align-items: end;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-items-end.png)
``` CSS
.container {
 align-items: center;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-items-center.png)
``` CSS
.container {
 align-items: stretch;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-items-stretch.png)

### place-items
place-items 是 align-items 和 justify-items 的简写。

``` CSS
.container {
  place-items: <align-items> / <justify-items>;
}
```

### justify-content
在 row 轴对齐 grid。
七种取值: 
- start
- end
- center
- stretch
- space-around
- space-between
- space-evenly

``` CSS
.container {
  justify-content: start;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-start.png)
``` CSS
.container {
  justify-content: end;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-end.png)
``` CSS
.container {
  justify-content: center;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-center.png)
``` CSS
.container {
  justify-content: stretch;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-stretch.png)
``` CSS
.container {
  justify-content: space-around;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-space-around.png)
``` CSS
.container {
  justify-content: space-between;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-space-between.png)
``` CSS
.container {
  justify-content: space-evenly;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-content-space-evenly.png)

### align-content
在 column 轴对齐 grid。
七种取值: 
- start
- end
- center
- stretch
- space-around
- space-between
- space-evenly

``` CSS
.container {
  align-content: start;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-start.png)
``` CSS
.container {
  align-content: end;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-end.png)
``` CSS
.container {
  align-content: center;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-center.png)
``` CSS
.container {
  align-content: stretch;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-stretch.png)
``` CSS
.container {
  align-content: space-around;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-space-around.png)
``` CSS
.container {
  align-content: space-between;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-space-between.png)
``` CSS
.container {
  align-content: space-evenly;	
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-content-space-evenly.png)

### place-content
place-content 属性是 align-content 和 justify-content 的简写。

``` CSS
.container {
    place-content: <align-content> / <justify-content>
}
```

### grid-auto-columns 和 grid-auto-rows
指定隐式网格轨道的大小。
前面我们可以通过 grid-template-rows / grid-template-columns 来创建一个确定轨道尺寸的网格系统，也就是所谓的显式网格。而当我们将网格元素的位置放置到我们创建的显示网格系统外的时候，就会创建隐式网格。
默认这些参考线之间的轨道尺寸为 0，我们通过 grid-auto-columns 和 grid-auto-rows 属性定义参考线之间的轨道尺寸。

``` CSS
.item-a {
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.item-b {
  grid-column: 5 / 6;
  grid-row: 2 / 3;
}
.container {
  grid-auto-columns: 60px;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/implicit-tracks-with-widths.png)

### grid-auto-flow
grid-auto-flow 属性用于控制自动布局算法的工作方式。
三个取值: 
- row: 告诉自动布局算法依次填充每行，根据需要添加新行(默认)
- column: 告诉自动布局算法依次填充每列，根据需要添加新列
- dense: 告诉自动布局算法，如果后面出现较小的 grid item，则尝试在网格中填充空洞

``` CSS
.container {
  grid-auto-flow: row | column | row dense | column dense
}
```

``` CSS
.item-a {
  grid-column: 1;
  grid-row: 1 / 3;
}
.item-e {
  grid-column: 5;
  grid-row: 1 / 3;
}
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: column;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-auto-flow-row.png)
``` CSS
.item-a {
  grid-column: 1;
  grid-row: 1 / 3;
}
.item-e {
  grid-column: 5;
  grid-row: 1 / 3;
}
.container {
  display: grid;
  grid-template-columns: 60px 60px 60px 60px 60px;
  grid-template-rows: 30px 30px;
  grid-auto-flow: column;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-auto-flow-column.png)

### grid
grid 属性是 grid-template-rows，grid-template-columns，grid-template-areas，grid-auto-rows，grid-auto-columns 和 grid-auto-flow 的简写。

``` CSS
.container {
    grid: none | <grid-template-rows> / <grid-template-columns> | <grid-auto-flow> [<grid-auto-rows> [/ <grid-auto-columns>]];
}
```

Grid items上的属性

有10个属性定义在 grid items上
- grid-column-start
- grid-column-end
- grid-row-start
- grid-row-end
- grid-column
- grid-row
- grid-area
- justify-self
- align-self
- place-self

注意: float，display: inline-block，display: table-cell 和 vertical-align 都无效。

### grid-column-start，grid-column-end，grid-row-start 和 grid-row-end

``` CSS
.item-a {
  grid-column-start: 2;
  grid-column-end: five;
  grid-row-start: row1-start
  grid-row-end: 3
}
```

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-start-end-a.png)
注意: 如果没有声明 grid-column-end / grid-row-end，默认情况下，该网格项将跨越 1 个轨道。

### grid-column 和 grid-row
grid-column-start + grid-column-end 以及 and grid-row-start + grid-row-end 的简写。

``` CSS
.item-c {
  grid-column: 3 / span 2;
  grid-row: third-line / 4;
}
```

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-start-end-c.png)

### grid-area
给 grid item 进行命名以便于使用 grid-template-areas 属性创建模板时来进行引用。另外也可以做为 grid-row-start + grid-column-start + grid-row-end + grid-column-end 的简写形式。

``` CSS
.item-d {
  grid-area: header
}
```

``` CSS
.item-d {
  grid-area: 1 / col4-start / last-line / 6
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-start-end-d.png)

### justify-self
沿着行轴对齐 grid item 里的内容。

- start: 将内容对齐到网格区域的左端
- end: 将内容对齐到网格区域的右端
- center: 将内容对齐到网格区域的中间
- stretch: 填充网格区域的宽度(默认)

``` CSS
.item-a {
  justify-self: start;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-self-start.png)
``` CSS
.item-a {
  justify-self: end;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-self-end.png)
``` CSS
.item-a {
  justify-self: center;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-self-center.png)
``` CSS
.item-a {
  justify-self: stretch;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-justify-self-stretch.png)

### align-self
沿着列轴对齐 grid item 里的内容。
- start: 将内容对齐到网格区域的顶部
- end: 将内容对齐到网格区域的底部
- center: 将内容对齐到网格区域的中间
- stretch: 填充网格区域的高度(默认)

``` CSS
.item-a {
  align-self: start;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-self-start.png)

``` CSS
.item-a {
  align-self: end;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-self-end.png)

``` CSS
.item-a {
  align-self: center;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-self-center.png)

``` CSS
.item-a {
  align-self: stretch;
}
```
![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-self-stretch.png)

### place-self
place-self 是 align-self 和 justify-self 的简写。

``` CSS
.item-a {
  place-self: center stretch;
}
``` 

![](https://cdn-fawn.vercel.app/contentImg/grid/grid-align-self-center.png) 

## 参考
***  
[A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
[MDN grid](https://developer.mozilla.org/en-US/docs/Web/CSS/grid)