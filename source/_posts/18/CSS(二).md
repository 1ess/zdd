---
title: CSS(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog18.jpg
date: 2018/06/24
---

这一篇讲解在 CSS 中与字体和文本相关的属性。

## font 和 text 相关属性
***  
1. font
- font-family
- font-size
- font-weight
- font-style
- font-variant
- font简写

2. text
- color
- text-indent
- letter-spacing
- word-spacing
- text-decoration
- text-align
- vertical-align
- line-height

![](https://cdn-fawn.vercel.app/contentImg/other-font-image/web-typography-terminology-e06b82.png)
## font-family
***  
font-family 定义了页面所使用的字体。
``` CSS
font-family: "Source Sans Pro", "Arial", sans-serif;
```
当使用多个值时，font-family 属性值字体列表定义浏览器应选择字体系列的优先级。
浏览器将在用户的计算机或者任何 @font-face 资源中查找每个字体。
所使用的字体优先级按**从左到右**的排序: 如果可用，它将使用第一个值，否则跳到下一个值，直到最后。默认字体系列由浏览器首选项定义。
在上面的示例中，浏览器将首先尝试使用 Source Sans Pro。如果不可用，它会尝试使用 Arial。如果也不可用，它将使用浏览器的 sans-serif 字体族中的可用字体。
![](https://cdn-fawn.vercel.app/contentImg/other-font-image/bulletproof-font-face-d18a22.png)

### 5 种字体族
- serif: 有衬线字体族

``` CSS
font-family: serif;
```
![](https://cdn-fawn.vercel.app/contentImg/font-family/serif-font.png)
- sans-serif: 无衬线字体族

``` CSS
font-family: sans-serif;
```
![](https://cdn-fawn.vercel.app/contentImg/font-family/sans-serif-font.png)
- monospace: 等宽字体族

``` CSS
font-family: monospace;
```
![](https://cdn-fawn.vercel.app/contentImg/font-family/monospace-font.png)
- cursive: 草书或手写体字体族

``` CSS
font-family: cursive;
```
![](https://cdn-fawn.vercel.app/contentImg/font-family/cursive-font.png)
- fantasy: 奇幻字体族

``` CSS
font-family: fantasy;
```
![](https://cdn-fawn.vercel.app/contentImg/font-family/fantasy-font.png)

## font-size
***  
font-size 定义了页面字体尺寸，浏览器默认使用字体尺寸为 medium 关键字。

### 6 种 font-size 可用取值
- 像素(pixel)

``` CSS
font-size: 20px;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/pixel-value.png)
- em: 相对于父元素的 font-size

``` CSS
font-size: 1.2em;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/em-value.png)
- rem: 相对于根元素的 font-size(即 html 元素)

``` CSS
font-size: 1.2rem;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/rem-value.png)

- 百分数(percentage): 相对于父元素的 font-size

``` CSS
font-size: 90%;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/percentage-value.png)

- 相对关键字(relative-keywords): 相对于父元素的 font-size
可用关键字: 
 1. larger
 2. smaller

``` CSS
font-size: smaller;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/rel-keywords-value.png)

- 绝对关键字(absolute-keywords): 相对于根元素的 font-size(即 html 元素)
可用关键字: 
 1. xx-larger
 2. x-large
 3. large
 4. medium
 5. small
 6. x-small
 7. xx-small

``` CSS
font-size: x-large;
```
![](https://cdn-fawn.vercel.app/contentImg/font-size/abs-keywords-value.png)

## font-style
***  
font-style 定义字体样式。
``` CSS
font-style: normal;
```

还有两个之可选: 
- italic
- oblique

均为斜体。

## font-weight
***  
font-weight 定义字重。

### 3 种 font-weight 可用取值
- 关键字
 1. Thin
 2. Extra Light
 3. Light
 4. Normal
 5. Medium
 6. Semi Bold
 7. Bold
 8. Extra Bold
 9. Ultra Bold

``` CSS
font-weight: bold;
```

- 数字
 1. 100 对应 Thin
 2. 200 对应 Extra Light
 3. 300 对应 Light
 4. 400 对应 Normal
 5. 500 对应 Medium
 6. 600 对应 Semi Bold
 7. 700 对应 Bold
 8. 800 对应 Extra Bold
 9. 900 对应 Ultra Bold

``` CSS
font-weight: 600;
```

- 相对关键字
 1. lighter
 2. bolder

浏览器会选择下一个可用字重。
``` CSS
font-weight: bolder;
```

## font-variant
***  
font-variant 定义了所使用的字形，normal 为浏览器默认取值。
``` CSS
font-variant: normal;
```
还有一个值可选: 
- small-caps

## font 简写
***  
注意 font 所有属性都是可继承的属性。
``` CSS
font: bold italic 18px Simsun,sans-serif;
```
font简写属性要求: 
- 必须同时包含 font-size 和 font-family 属性，且 font-size 在 font-family 之前。
- 如果有其他 font 相关属性，必须放在 font-size 之前。

## color
***  
color 属性定义元素**前景色**。(边框，文本等)
### 7 种可选取值
- transparent

``` CSS
color: transparent;
```

- color keyword

``` CSS
color: red;
```

- hexadecimal color codes

``` CSS
color: #05ffb0;
```

- rgb()

``` CSS
color: rgb(50, 115, 220);
```

- rgba()

``` CSS
color: rgba(0, 0, 0, 0.5);
```

- hsl()

``` CSS
color: hsl(14, 100%, 53%);
```

- hsla()

``` CSS
color: hsla(14, 100%, 53%, 0.6);
```

## text-indent
***  
text-indent 属性定义文本缩进。
可以使用 pixel，em，rem，percentage 等。
可以使用负值。
``` CSS
text-indent: 2em;
```

## letter-spacing
***  
letter-spacing 属性定义字符间距，normal 为浏览器默认取值。

### 3 种可选取值
- normal

``` CSS
letter-spacing: normal;
```
![](https://cdn-fawn.vercel.app/contentImg/letter-spacing/normal-spacing.png)
- 像素(pixel)

``` CSS
letter-spacing: 2px;
```
![](https://cdn-fawn.vercel.app/contentImg/letter-spacing/pixel-spacing.png)
- em

``` CSS
letter-spacing: 0.1em;
```
![](https://cdn-fawn.vercel.app/contentImg/letter-spacing/em-spacing.png)

## word-spacing
***  
word-spacing 属性定义单词间距，0px 为浏览器默认取值。

### 3 种可选取值
- normal

``` CSS
word-spacing: normal;
```
![](https://cdn-fawn.vercel.app/contentImg/word-spacing/normal-spacing.png)
- 像素(pixel)

``` CSS
word-spacing: 5px;
```
![](https://cdn-fawn.vercel.app/contentImg/word-spacing/pixel-spacing.png)
- em

``` CSS
word-spacing: 2em;
```
![](https://cdn-fawn.vercel.app/contentImg/word-spacing/em-spacing.png)

## line-height
***  
line-height 属性定义单行文本高度。

### 4 种可选取值
- normal

``` CSS
line-height: normal;
```

- unitless: 行高相对于 font-size

``` CSS
line-height: 1.6;
```

- pixel

``` CSS
line-height: 30px;
```

- em: 行高相对于 font-size

``` CSS
line-height: 0.8em;
```
**单行文本垂直居中只需要设置 height 和 line-height 相同即可。**
注意: line-height 属性也可以放到 font 简写属性里，写法为在 font-size 后加一个 / ，再跟 line-height 的值。
``` CSS
font: bold italic 18px/1.5 Simsun,sans-serif;
```

## text-decoration
***  
text-decoration 属性定义文本装饰线样式。

### 4 种可选取值
- none: 移除所有装饰线样式。

``` CSS
text-decoration: none;
```

- underline: 下划线样式

``` CSS
text-decoration: underline;
```

- line-through: 中划线样式

``` CSS
text-decoration: line-through;
```

- overline: 上划线样式

``` CSS
text-decoration: overline;
```

## text-overflow
***  
text-overflow 属性定义文本溢出时的行为。

### 2 种可选取值
- clip: 剪切

``` CSS
text-overflow: clip;
```
- ellipsis: 折叠

``` CSS
text-overflow: ellipsis;
```

## text-transform
***  
text-transform 属性定义文本内容变换。

### 4 种可选取值
- none: 取消所有变换

``` CSS
text-transform: none;
```
- capitalize: 首字符大写

``` CSS
text-transform: capitalize;
```
- uppercase: 全字符大写

``` CSS
text-transform: uppercase;
```
- lowercase: 全字符小写

``` CSS
text-transform: lowercase;
```

## text-align
***  
text-align 属性作用于块级元素，控制其内部行内内容(如文本或行内元素等)对齐方式。是可继承属性。

### 4 种可选取值
- left: 左对齐

``` CSS
text-align: left;
```
![](https://cdn-fawn.vercel.app/contentImg/other-font-image/left-text-alignment-26dbc5.png)
- right: 右对齐

``` CSS
text-align: right;
```
- center: 居中对齐

``` CSS
text-align: center;
```
![](https://cdn-fawn.vercel.app/contentImg/other-font-image/center-text-alignment-29e1d3.png)
- justify: 两端对齐

``` CSS
text-align: justify;
```
![](https://cdn-fawn.vercel.app/contentImg/other-font-image/good-vs-bad-hyphenation-engine-ba40e3.png)
**justify 只对多行文本有效，且多行文本的最后一行无效。要想对最后一行有效需要使用 text-align-last: justify; 或使用伪元素::after 把最后一行变为非最后一行**

## vertical-align
***  
vertical-align 属性定义了一个行内元素如何垂直对齐。

### 8 种可选取值
- baseline

``` CSS
vertical-align: baseline;
```
- sub

``` CSS
vertical-align: sub;
```
- super

``` CSS
vertical-align: super;
```
- text-top

``` CSS
vertical-align: text-top;
```
- text-bottom

``` CSS
vertical-align: text-bottom;
```
- middle

``` CSS
vertical-align: middle;
```
- top

``` CSS
vertical-align: top;
```
- bottom

``` CSS
vertical-align: bottom;
```