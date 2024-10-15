---
title: 『Rust 程序设计语言』读书笔记(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog273.png
date: 2024/10/14
---
本章介绍 Rust 与其他编程语言相比最特殊的一个概念: 所有权(ownership)，它使得 Rust 在不需要垃圾回收机制的情况保持内存安全。我们会介绍与所有权相关的几个概念: borrowing、slice 以及 Rust 的内存布局。

## 所有权
***  
**所有权**是 Rust 用于如何管理内存的一组规则。一些语言中例如 Java、C# 具有垃圾回收机制，在程序运行时有规律地寻找不再使用的内存。在另一些语言例如 C、C++中，程序员必须亲自分配和释放内存。Rust 则选择了第三种方式: 通过所有权系统管理内存，编译器在编译时会根据一系列的规则进行检查，如果违反了任何这些规则，程序无法编译。

### 所有权规则
> 1. Rust 中的每一个值都有一个**所有者**(owner)
> 2. 值在任一时刻有且只有一个所有者
> 3. 当所有者(变量)离开作用域，这个值将被丢弃

### 变量作用域
作用域是一个项(item)在程序中有效的范围。例如: 
``` rust
{                      // s 在这里无效，它尚未声明
    let s = "hello";   // 从此处起，s 是有效的

    // 使用 s
}                      // 此作用域已结束，s 不再有效
```

目前为止，变量是否有效与作用域的关系跟其他编程语言是类似的。

### String 类型
除了字符串字面值，Rust 还有另一种字符串类型 String。这个类型管理被分配到堆上的数据，所以能够存储在编译时未知大小的文本。可以使用 from 函数基于字符串字面值来创建 String: 
``` rust
let s = String::from("hello");
```

我们**可以**修改此字符串: 
``` rust
let mut s = String::from("hello");

s.push_str(", world!"); // 在字符串后追加字面值

println!("{}", s); // 将打印 hello, world!
```

对于 String 类型，为了支持一个可变、可增长的文本片段，需要在堆上分配一块在编译时未知大小的内存来存放内容。这意味着: 
- 必须在运行时向内存分配器 memory allocator 请求内存
- 需要一个当我们处理完 String 时将内存返回给分配器的方法
当调用 String::from 时，它的实现了请求其所需的内存。这在其他编程语言中也是非常通用的。但是将内存返回给分配器不同语言的实现有很大区别，在有**垃圾回收**的语言中，GC 记录并清除不再使用的内存，而我们并不需要关心它。在没有 GC 的语言中，我们需要自己识别出不再使用的内存并调用代码显式释放。
Rust 采取了一个不同的策略: **内存在拥有它的变量离开作用域后就被自动释放**。
``` rust
{
    let s = String::from("hello"); // 从此处起，s 是有效的

    // 使用 s
}                                  // 此作用域已结束，
                                   // s 不再有效
```

当变量离开作用域，Rust 为我们调用一个特殊的 drop 函数。在这里 String 的作者可以放置释放内存的代码。Rust 在作用域结尾处自动调用 drop 函数。

这个模式对编写 Rust 代码的方式有着深远的影响。现在它看起来很简单，不过在更复杂的场景下代码的行为可能是不可预测的。

### 变量与数据交互的方式: 移动
``` rust
let s1 = String::from("hello");
let s2 = s1;
```

类似其他语言的浅拷贝，上述代码在内存中表现为: 
<img src="https://cdn.zhangdd.tech/contentImg/273/trpl04-01.svg" alt="">

<img src="https://cdn.zhangdd.tech/contentImg/273/trpl04-02.svg" alt="">

与其他语言不同，之前我们提到过当变量离开作用域后，Rust 自动调用 drop 函数并清理变量的堆内存，这就有了一个问题：当 s2 和 s1 离开作用域，它们都会尝试释放相同的内存。这是一个叫做 **二次释放**(double free)的错误。
为了确保内存安全，在 let s2 = s1; 之后，Rust 认为 s1 不再有效: 
<img src="https://cdn.zhangdd.tech/contentImg/273/trpl04-03.svg" alt="">

``` rust
let s1 = String::from("hello");
let s2 = s1;
// error[E0382]: borrow of moved value: `s1`
println!("{s1}, world!");
```

注意，当你为现有变量分配一个全新的值时，Rust 将调用 drop 并立即释放原始值的内存。

### 变量与数据交互的方式: 克隆
也是类似其他编程语言，如果我们**确实**需要深度复制 String 中堆上的数据，而不仅仅是栈上的数据，可以使用一个叫做 clone 的通用函数。
``` rust
let s1 = String::from("hello");
let s2 = s1.clone();

println!("s1 = {s1}, s2 = {s2}");
```

需要注意: Rust 有一个特殊的注释，称为 Copy 特征，类似整数类型，如果某个类型实现了 Copy 特征，则使用它的变量不会移动，而是会被简单地复制，从而使它们在分配给另一个变量后仍然有效。
``` rust
let x = 5;
let y = x;
println!("x = {x}, y = {y}");
```

Rust 不允许自身或其任何部分实现了 Drop trait 的类型使用 Copy trait。

哪些类型实现了 Copy trait 的通用规则是: 
1. 任何一组简单标量值的组合都可以实现 Copy
2. 任何不需要分配内存或某种形式资源的类型都可以实现 Copy

### 所有权与函数
将值传递给函数与给变量赋值的原理相似。向函数传递值可能会移动或者复制，就像赋值语句一样。
``` rust
fn main() {
    let s = String::from("hello");  // s 进入作用域

    takes_ownership(s);             // s 的值移动到函数里 ...
                                    // ... 所以到这里不再有效

    let x = 5;                      // x 进入作用域

    makes_copy(x);                  // x 应该移动函数里，
                                    // 但 i32 是 Copy 的，
                                    // 所以在后面可继续使用 x

} // 这里，x 先移出了作用域，然后是 s。但因为 s 的值已被移走，
  // 没有特殊之处

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
} // 这里，some_string 移出作用域并调用 `drop` 方法。
  // 占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 这里，some_integer 移出作用域。没有特殊之处
```

根据上述原则，当尝试在调用 takes_ownership 后使用 s 时，Rust 会抛出一个编译时错误。

### 返回值与作用域
返回值也可以转移所有权。
``` rust
fn main() {
    let s1 = gives_ownership();         // gives_ownership 将返回值
                                        // 转移给 s1

    let s2 = String::from("hello");     // s2 进入作用域

    let s3 = takes_and_gives_back(s2);  // s2 被移动到
                                        // takes_and_gives_back 中，
                                        // 它也将返回值移给 s3
} // 这里，s1、s3 移出作用域并被丢弃。s2 也移出作用域，但已被移走，所以什么也不会发生。

fn gives_ownership() -> String {             // gives_ownership 会将
                                             // 返回值移动给
                                             // 调用它的函数

    let some_string = String::from("yours"); // some_string 进入作用域。

    some_string                              // 返回 some_string 
                                             // 并移出给调用的函数
}

// takes_and_gives_back 将传入字符串并返回该值
fn takes_and_gives_back(a_string: String) -> String { // a_string 进入作用域

    a_string  // 返回 a_string 并移出给调用的函数
}
```

变量的所有权总是遵循相同的模式: 将值赋给另一个变量时移动它。当持有堆中数据值的变量离开作用域时，其值将通过 drop 被清理掉，除非数据被移动为另一个变量所有。