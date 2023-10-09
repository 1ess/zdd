---
title: SICP 笔记(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog264.jpg
date: 2023/10/09
---
## 构造过程抽象
程序设计中，我们需要处理两类要素:
1. 过程(procedures)
2. 数据(data)

**数据就是我们要操作的"东西"，而过程是对操作数据规则的描述。实际上两个要素的区分并不严格**

### 表达式
一个数字就是一个基本表达式，我们可以把基本表达式组合起来形成复合表达式，称为**组合式**。通过在括号内分隔表达式列表构成，列表最左侧的元素成为运算符，其余元素称为运算子。将运算符放在最左侧称为前缀表示。

### 命名
在 Scheme 中，通过 define 关键字给对象命名: 
``` scheme
> (define size 2)
> size
2
> (* size 5)
10

> (define pi 3.14159)
> (define radius 10)
> (* pi (* radius radius))
314.159
> (define circumference (* 2 pi radius))
> circumference
62.8318
```

### 组合式求值
与大多数其他编程语言相比，Lisp 有着非常简单的语法。也就是说，表达式的求值规则可以用一个简单的通用规则和针对少数特殊形式的专门规则来描述。
通用规则: 
1. 求值该表达式的各子表达式
2. 将作为最左表达式的值的过程应用实际参数

目前为止，我们只看到了一个特殊形式的规则，即 define 过程。

### 过程定义
过程定义的一般形式是: 
``` scheme
(define (⟨name⟩ ⟨formal parameters⟩) 
  ⟨body⟩)
```

例如平方，可以表述为: 
``` scheme
(define (square x) (* x x))
```