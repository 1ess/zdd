---
title: 『Rust 程序设计语言』读书笔记(一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog272.png
date: 2024/10/12
---
## 通用编程概念
***  
本章介绍一些几乎所有编程语言都有的概念，以及它们在 Rust 中是如何工作的。主要包括变量、基本类型、函数、注释和控制流。

### 关键字
关键字不能被用作标识符，包括函数、变量、参数、结构体字段、模块、crate、常量、宏、静态值、属性、类型、trait 或生命周期。
#### 关键字列表
as、async、await、break、const、continue、crate、dyn、else、enum、extern、false、fn、for、if、impl、in、let、loop、match、mod、move、mut、pub、ref、return、Self、self、static、struct、super、trait、true、type、union、unsafe、use、where、while

#### 保留字列表
abstract、become、box、do、final、macro、override、priv、try、typeof、unsized、virtual、yield

### 变量和可变性
与大多数流行的编程语言不同，在 Rust 中，变量默认是不可改变的(immutable)，当变量不可变时，一旦值被绑定一个名称上，你就不能改变这个值。
``` rust
fn main() {
    let x = 5;
    println!("The value of x is: {x}");
    // error[E0384]: cannot assign twice to immutable variable `x`
    x = 6;
    println!("The value of x is: {x}");
}
```

尽管变量默认是不可变的，你仍然可以在变量名前添加 mut 来使其可变: 
``` rust
fn main() {
    let mut x = 5;
    println!("The value of x is: {x}");
    x = 6;
    println!("The value of x is: {x}");
}
```

### 常量
类似于不可变变量，**常量** (constants)是绑定到一个标识符上的不允许改变的值。
常量与变量区别如下: 
1. 不允许对常量使用 mut
2. 声明常量使用 const 关键字而不是 let，并且**必须**注明值的类型
3. 常量可以在任何作用域中声明，包括全局作用域
4. 常量只能被设置为常量表达式，而不可以是任何其他只能在运行时计算出的值

``` rust
const THREE_HOURS_IN_SECONDS: u32 = 60 * 60 * 3;
```

Rust 对常量的命名约定是在单词之间使用全大写加下划线。在声明它的作用域之中，常量在整个程序生命周期中都有效，此属性使得常量可以作为多处代码使用的全局范围的值。

### Shadowing
我们可以定义一个与之前变量同名的新变量，称之为第一个变量被第二个 Shadowing 了。此时任何使用该变量名的行为中都会视为是在使用第二个变量，直到第二个变量自己也被隐藏或第二个变量的作用域结束。

重复使用 let 关键字进行 Shadowing: 
``` rust
fn main() {
    let x = 5;

    let x = x + 1;

    {
        let x = x * 2;
        println!("The value of x in the inner scope is: {x}");
    }

    println!("The value of x is: {x}");
}
```

输出如下: 
```console
$ cargo run
The value of x in the inner scope is: 12
The value of x is: 6
```

mut 与 Shadowing 的一个区别是，当再次使用 let 时，实际上创建了一个新变量，我们可以改变值的类型: 
``` rust
    let spaces = "   ";
    let spaces = spaces.len();
	
	// error[E0308]: mismatched types
    let mut spaces = "   ";
    spaces = spaces.len();

```

### 数据类型
类似 Java、C#，Rust 是**静态类型**语言，在编译时就必须知道变量的类型。编译器通常可以推断出想要用的类型。但是当多种类型均有可能时，必须增加类型注解: 
``` rust 
let guess: u32 = "42".parse().expect("Not a number!");
```

### 标量类型
**标量**类型代表一个单独的值。Rust 有四种基本的标量类型: 整型、浮点型、布尔类型和字符类型。

#### 整型
| 长度      | 有符号   | 无符号   |
| ------- | ----- | ----- |
| 8-bit   | i8    | u8    |
| 16-bit  | i16   | u16   |
| 32-bit  | i32   | u32   |
| 64-bit  | i64   | u64   |
| 128-bit | i128  | u128  |
| arch    | isize | usize |
isize 和 usize 类型依赖运行程序的计算机架构: 64 位架构上它们是 64 位的，32 位架构上它们是 32 位的。

Rust 的数字类型默认是 i32。isize 或 usize 主要作为某些集合的索引。

#### 浮点型
Rust 也有两个原生的**浮点数**类型 f32 和 f64，分别占 32 位和 64 位。默认类型是 f64。
``` rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32
}
```

#### 布尔型
与其他大部分编程语言一样，Rust 中的布尔类型有两个可能的值：true 和 false。Rust 中的布尔类型使用 bool 表示。
``` rust
fn main() {
    let t = true;

    let f: bool = false; 
}
```

#### 字符类型
我们用单引号声明 char 字面量，而与之相反的是，使用双引号声明字符串字面量。
Rust 的 char 类型的大小为四个字节，并代表了一个 Unicode 标量值，这意味着它可以比 ASCII 表示更多内容。
``` rust
fn main() {
    let c = 'z';
    let z: char = 'ℤ'; 
    let heart_eyed_cat = '😻';
}
```

**字符**并不是一个 Unicode 中的概念，所以人直觉上的字符可能与 Rust 中的 char 并不符合。

### 复合类型
**复合类型**可以将多个值组合成一个类型。Rust 有两个原生的复合类型: 元组(tuple)和数组(array)。

#### 元组类型
元组是一个将多个其他类型的值组合进一个复合类型的主要方式。元组长度固定: 一旦声明，其长度不会增大或缩小。
我们使用包含在圆括号中的逗号分隔的值列表来创建一个元组。元组中的每一个位置都有一个类型，而且这些不同值的类型也不必相同: 
``` rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

为了从元组中获取单个值，可以使用**模式匹配**(pattern matching)来**解构**(destructure)元组: 
``` rust 
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup;

    println!("The value of y is: {y}");
}
```

我们也可以使用点号后跟值的索引来直接访问它们: 
``` rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

不带任何值的元组叫做 **unit 元组**，这种值以及对应的类型都写作 ()，如果表达式不返回任何其他值，则会隐式返回 unit 元组。

#### 数组类型
另一个包含多个值的方式是**数组**，与元组不同，数组中的每个元素的类型必须相同，并且需要注意 Rust 中的数组长度是固定的。
数组的值写成在方括号内，用逗号分隔: 
``` rust
fn main() {
    let a = [1, 2, 3, 4, 5];
}
```

数组并不如 vector 类型灵活。vector 类型是标准库提供的一个**允许**增长和缩小长度的类似数组的集合类型。

数组的类型在方括号中包含每个元素的类型，后跟分号，再后跟数组元素的数量: 
``` rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```