---
title: 『Rust 程序设计语言』读书笔记(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog274.jpg
date: 2024/10/17
---
如果仅仅支持通过转移所有权的方式获取一个值，那会让程序变得复杂。例如，如果我们希望在调用方法之后仍可以使用传递的参数，我们需要在函数中返回传入的参数。Rust 能否像其它编程语言一样，使用某个变量的指针或者引用呢？答案是可以。

**引用**(reference)与指针类似，因为它是一个地址，我们可以由此访问储存于该地址的属于其他变量的数据。 与指针不同，引用确保指向某个特定类型的有效值。
在不使用引用时: 
``` rust
fn main() {
    let s1 = String::from("hello");

    let (s2, len) = calculate_length(s1);

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();

    (s, length)
}
```

使用引用之后: 
``` rust
fn main() {
    let s1 = String::from("hello");

    let len = calculate_length(&s1);

    println!("The length of '{s1}' is {len}.");
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

注意我们传递 &s1 给 calculate_length 函数，& 符号就是**引用**，它们允许你使用值但不获取其所有权。

特别注意: 对于函数和方法的传参，Rust 提供了一个极其有用的隐式转换: Deref 转换。若一个类型实现了 Deref 特征，那它的引用在传给函数或方法时，会根据参数签名来决定是否进行隐式的 Deref 转换。我们会在之后详细介绍。

``` rust
fn calculate_length(s: &String) -> usize { // s 是 String 的引用
    s.len()
} // 这里，s 离开了作用域。但因为它并不拥有引用值的所有权，所以什么也不会发生
```

变量 s 有效的作用域与函数参数的作用域一样，不过当 s 停止使用时并不丢弃引用指向的数据，当函数使用引用而不是实际值作为参数，无需返回值来交还所有权。

我们将创建一个引用的行为称为**借用**(borrowing)。

如果我们尝试修改借用的变量呢: 
``` rust
fn main() {
    let s = String::from("hello");

    change(&s);
}

fn change(some_string: &String) {
    // error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
    some_string.push_str(", world");
}
```

正如变量默认是不可变的，引用也一样，默认不允许修改引用的值。

### 可变引用
``` rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

首先，我们必须将 s 改为 mut。然后在调用 change 函数的地方创建一个可变引用 &mut s，并更新函数签名以接受一个可变引用 some_string: &mut String。这就非常清楚地表明，change 函数将改变它所借用的值。

可变引用有一个很大的限制，**如果你有一个对该变量的可变引用，你就不能再创建对该变量的引用**。
``` rust
let mut s = String::from("hello");

let r1 = &mut s;
// error[E0499]: cannot borrow `s` as mutable more than once at a time
let r2 = &mut s;

println!("{}, {}", r1, r2);
```

这一限制以一种非常小心谨慎的方式允许可变性，防止同一时间对同一数据存在多个可变引用。

Rust 在同时使用可变与不可变引用时也采用的类似的规则，我们**也不能在拥有不可变引用的同时拥有可变引用** 。
``` rust
let mut s = String::from("hello");

let r1 = &s;
let r2 = &s;
// error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
let r3 = &mut s;

println!("{}, {}, and {}", r1, r2, r3);
```

需要注意: 引用的作用域从引入它的地方开始，一直持续到上次使用该引用时为止。也就是说，下面的用法是没问题的: 
``` rust
let mut s = String::from("hello");

let r1 = &s;
let r2 = &s;
println!("{} and {}", r1, r2);
// 此位置之后 r1 和 r2 不再使用

let r3 = &mut s;
println!("{}", r3);
```

### 悬垂引用(Dangling References)
在具有指针的语言中，很容易通过释放内存时保留指向它的指针而错误地生成一个**悬垂指针**，所谓悬垂指针是其指向的内存可能已经被分配给其它持有者。相比之下，在 Rust 中编译器确保引用永远也不会变成悬垂状态。

当我们尝试创建一个悬垂引用，Rust 会通过一个编译时错误来避免: 
``` rust
fn main() {
    let reference_to_nothing = dangle();
}

fn dangle() -> &String {
    let s = String::from("hello");

    &s
} // 这里 s 离开作用域并被丢弃，其内存被释放
```
因为 s 是在 dangle 函数内创建的，当 dangle 的代码执行完毕后，s 将被释放。不过我们尝试返回它的引用。这意味着这个引用会指向一个无效的 String。

解决方法是直接返回 String: 
``` rust
fn no_dangle() -> String {
    let s = String::from("hello");

    s
} // 所有权被移动出去，所以没有值被释放
```