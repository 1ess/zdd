---
title: CSS(八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog24.jpg
date: 2018/07/08
---

这一篇，我们来介绍一下响应式设计及其三大关键技术 - 流式布局，弹性媒体和媒体查询。并会介绍移动优先的响应式设计。

## 概述 
***  
响应式设计指的是网站可以在不论是宽屏显示器还是移动设备都能表现得同样出色。这是一种网页设计和开发方法，它消除了网站的移动版本与桌面版本之间的区别。
![](https://cdn.0xfee1dead.cn/contentImg/responsive-design/how-responsive-websites-work-5f0a33.png)

响应式设计是通过**媒体查询**完成的。

## 流式布局
***  
![](https://cdn.0xfee1dead.cn/contentImg/responsive-design/fixed-width-vs-fluid-layouts-258df9.png)

流式布局是一种拉伸和缩小以填充屏幕宽度的布局，如之前我们介绍过的 Flexbox 布局一样。

## 弹性媒体
***  
不同的设备有不同的图像要求。HTML 提供了为用户设备选择最佳图像的方法。 

### srcset 属性
``` html
<div class='illustration'>
  <img src='illustration-small.png'
       srcset='images/illustration-small.png 1x,
               images/illustration-big.png 2x'
       style='max-width: 500px'/>
</div>

```
srcset 属性指向备用图像文件列表，以及定义浏览器何时应使用它们的属性。1x 告诉浏览器在标准分辨率屏幕上显示 illustration-small.png。2x 意味着 illustration-big.png 适用于视网膜屏幕。不支持 srcset 属性的较旧浏览器会回退到 src 属性。 

``` html
<div class='section header'>
  <div class='photo'>
    <img src='images/photo-small.jpg'
         srcset='images/photo-big.jpg 2000w,
                 images/photo-small.jpg 1000w'
         sizes='(min-width: 960px) 960px,
                100vw'/>
  </div>
</div>
```
srcset 属性还可以提供了图像固有的物理宽度，而不是 1x 和 2x 描述符。 2000w 告诉浏览器 photo-big.jpg 文件是 2000 像素宽。 同样，1000w 意味着 photo-small.jpg 的宽度为 1000 像素。 
w 字符，它是一个特殊的单位。
我们还需要告诉图像的最终渲染宽度是多少。 这就是 sizes 属性的来源。它定义了一系列媒体查询以及媒体查询生效时图像的渲染宽度。
上面的例子中，当屏幕宽度至少为 960 像素时，图像也将是 960 像素宽。 否则，100vw 默认值告诉浏览器图像的宽度将是"视口宽度"的 100％。

## 媒体查询
***  
![](https://cdn.0xfee1dead.cn/contentImg/responsive-design/media-query-terms-137d06.png)

媒体查询分为两部分
- 媒体类型(Media Type)
- 媒体特征(Media Feature)

媒体类型与媒体特征之间通过 And 进行连接，多个媒体特征之间也通过 And 进行连接
### Media Type
可取值: 
- all
- print
- screen
- speech

### Media Feature
媒体特征指定要定位的设备尺寸。如: 
- min-width
- max-width
- min-height
- max-height
- min-aspect-ratio
- max-aspect-ratio
- orientation(landscape，portrait)

## 移动优先的响应式设计
***  
所谓移动优先，即优先考虑移动设备的样式，在非移动设备中进行响应式适配，这样做的好处是既可以在移动端有更好的表现，又能够在其他设备看到适配后的页面。现在人们使用移动设备的时间比例越来越高，如果你产品的用户也是更多地使用移动设备浏览页面的话，应该采用移动优先的设计方案。
当然很多 Web 开发并不是移动优先的设计，做响应式网页的时候如果先开发的 PC 端，再进行移动适配，这就是 "PC 优先"。