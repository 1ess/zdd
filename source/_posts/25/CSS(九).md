---
title: CSS(九)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog25.jpg
date: 2018/07/09
---

这一篇，我们主要讲解变换(transform)和过渡(transition)的使用。

## transform
***  
2D transform 相关的属性有两个: 
- transform
- transform-origin

具体讲解这两个属性之前，我们先看一下需要注意的地方: 
- 这两个元素可以作用在 transformable 元素上(常见的 block 元素和 inline-block 都是 transformable 元素)
- 当进行 transform 时，border，padding 和 margin 都会变形

### transform 属性
可取值: 
- none(默认)

``` CSS
transform: none;
```
- rotate(旋转): 正数为顺时针，负数为逆时针

``` CSS
transform: rotate(45deg);
```
- scale，scaleX，scaleY(缩放)

``` CSS
transform: scale(.5);
```
``` CSS
transform: scale(2, .5);
```
``` CSS
transform: scaleX(.5);
```

- translate，translateX，translateY(平移)

``` CSS
transform: translate(12px);
```
``` CSS
transform: translate(12px, 50%);
```
``` CSS
transform: translateX(12px);
```

- skew，skewX，skewY(拉伸)

``` CSS
transform: skew(45deg);
```
``` CSS
transform: skew(50deg, 10deg);
```
``` CSS
transform: skewX(50deg);
```
注意: transform 属性值可以组合使用，在同一个 transform 属性中用空格分隔即可。操作顺序为从右到左。

``` CSS
transform: translate(20px) rotate(45deg) scale(2);
```

### transform-origin
transform-origin 属性指定 transform 操作的基点(与 iOS 中的锚点概念类似)。默认是元素的中心点。
可取值与 background-position 类似: 
- 关键字

``` CSS
transform-origin: left top;
```

- 百分比

``` CSS
transform-origin: 100% 100%;
```
- 像素

``` CSS
transform-origin: 20px 20px;
```

## transition
***  
我们可以使用 transition 属性，为一些属性变化添加过渡效果。

### transition-property
transition-property 属性定义了哪个属性将被添加过渡效果(只有 animated property 可以被添加到该属性中)。
可取值: 
- none

``` CSS
transition-property: none;
```

- all(background，color，transform 属性都将被添加过渡属性)

``` CSS
transition-property: all;
```

- 可动画属性，如: width

``` CSS
transition-property: width;
```
多个可动画属性可以用逗号分隔。

### transition-duration
该属性定义过渡的持续时间。多个可动画属性持续时间可以用逗号分隔。

``` CSS
transition-duration: 1.2s;
# 或者
transition-duration: 2400ms;
```

### transition-delay
定义过渡的等待时间。

``` CSS
transition-delay: 1.2s;
# 或者
transition-delay: 2400ms;
```

### transition-timing-function
定义了过渡函数。
可取值: 
- ease
- ease-in
- ease-out
- ease-in-out
- linear
- step-start
- step-end

``` CSS
transition-timing-function: ease-in-out;
```

### transition
之前属性的简写。只有 transition-duration 属性是必须的。

``` CSS
transition: background 1s linear 500ms;
```
``` CSS
transition: background 4s, transform 1s;
```