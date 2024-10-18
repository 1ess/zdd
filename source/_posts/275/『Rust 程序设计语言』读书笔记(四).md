---
title: 『Rust 程序设计语言』读书笔记(四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog275.jpg
date: 2024/10/18
---
Slice 类型通常翻译为切片，它表示从某个包含多个元素的容器中取得局部数据，这个过程称为**切片操作**。不同语言对切片的支持有所不同，比如有些语言只允许取得连续的局部元素，而有些语言可以取得离散元素。

Rust 也支持 Slice 操作，Rust 中的切片操作只允许获取一段连续的局部数据，切片操作获取到的数据称为**切片数据**。

Rust 常见的数据类型中，有三种类型支持 Slice 操作: String 类型、Array 类型和 Vec 类型。
当然 Slice 类型自身也支持切片操作。

### Slice 操作
有以下几种切片方式: 
1. s[n1..n2] 获取 s 中 index=n1 到 index=n2 (不包括 n2)之间的所有元素
2. s[n1..] 获取 s 中 index=n1 到最后一个元素之间的所有元素
3. s[..n2] 获取 s 中第一个元素到 index=n2 (不包括 n2)之间的所有元素
4. s[..] 获取 s 中所有元素
5. s[n1..=n2] 表示取 index=n1 到 index=n2 (包括 n2)之间的所有元素

### Slice 作为数据类型
和其他语言的 Slice 不同，Rust 除了支持切片操作，还将 Slice 上升为一种**原始数据类型**(primitive type)，切片数据的数据类型就是 Slice 类型。
**Slice类型是一个胖指针**，它包含两份元数据: 
- 第一份元数据是指向源数据中切片起点元素的指针
- 第二份元数据是切片数据中包含的元素数量，即切片的长度

Slice 类型的描述方式为 [T]，其中 T 为切片数据的数据类型。例如对存放了 i32 类型的数组进行切片，切片数据的类型为 [i32]。

在 **Rust 中几乎总是使用切片数据的引用**。切片数据的引用对应的数据类型描述为 &[T] 或 &mut [T]，前者不可通过 Slice 引用来修改源数据，后者可修改源数据。
``` rust
fn main(){
  let mut arr = [1, 2, 3, 4];

  let arr_slice1 = &arr[..=1]; // 不可变 slice
  println!("{:?}", arr_slice1); // [1,2];

  let arr_slice2 = &mut arr[..=1]; // 可变 slice
  arr_slice2[0] = 0;
  println!("{:?}", arr_slice2); // [0, 2];
  println!("{:?}", arr); // [0, 2, 3, 4];
}
```

### 特殊对待的 str 切片类型
需要特别注意的是，**String 的切片和普通的切片有些不同**。
首先，String 的切片类型是 str，而非 [String]，String 切片的引用是 &str 而非 &[String]。
其次，Rust 为了保证字符串总是有效的 Unicode 字符，它不允许用户直接修改字符串中的字符，所以也无法通过切片引用来修改源字符串，除非那是 ASCII 字符。事实上，Rust 只为 &str 提供了两个转换 ASCII 大小写的方法来修改源字符串，除此之外，没有为字符串切片类型提供任何其他原地修改字符串的方法。
``` rust
fn main(){
  let mut hello = String::from("HELLO");
  let hello_slice = &mut hello[..];

  // make_ascii_lowercase()
  // make_ascii_uppercase()
  hello_slice.make_ascii_lowercase();
  println!("{}", hello); // hello
}
```

### 字符串字面值就是 Slice
``` rust
let s = "Hello, world!";
```

这里 s 的类型是 &str，它是一个指向二进制程序特定位置的 slice。这也就是为什么字符串字面值是不可变的，&str 是一个不可变引用。