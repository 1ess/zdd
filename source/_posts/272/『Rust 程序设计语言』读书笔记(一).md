---
title: 『Rust 程序设计语言』读书笔记(一)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog272.jpg
date: 2024/10/12
---
本章介绍一些几乎所有编程语言都有的通用概念，以及它们在 Rust 中是如何工作的。主要包括变量、基本类型、函数、注释和控制流。

## 关键字
***  
关键字不能被用作标识符，包括函数、变量、参数、结构体字段、模块、crate、常量、宏、静态值、属性、类型、trait 或生命周期。
### 关键字列表
as、async、await、break、const、continue、crate、dyn、else、enum、extern、false、fn、for、if、impl、in、let、loop、match、mod、move、mut、pub、ref、return、Self、self、static、struct、super、trait、true、type、union、unsafe、use、where、while

### 保留字列表
abstract、become、box、do、final、macro、override、priv、try、typeof、unsized、virtual、yield

## 变量和可变性
***  
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

## 常量
***  
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

## Shadowing
***  
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

## 数据类型
***  
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

对于数学上未定义的结果，例如对负数取平方根 -42.1.sqrt()，会产生一个特殊的结果: Rust 的浮点数类型使用 NaN (not a number)来处理这些情况。出于防御性编程的考虑，可以使用 is_nan() 等方法，可以用来判断一个数值是否是 NaN: 
``` rust
fn main() {
    let x = (-42.0_f32).sqrt();
    if x.is_nan() {
        println!("x is not a number")
    }
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

## 序列(Range)
***  
Rust 提供了一个非常简洁的方式，用来生成连续的数值: 
``` rust
for i in 1..=5 {
    println!("结果一: {}",i);
}
println!("\r");
for i in 1..5 {
    println!("结果二: {}",i);
}
```

输出结果如下: 
```console
结果一: 1
结果一: 2
结果一: 3
结果一: 4
结果一: 5

结果二: 1
结果二: 2
结果二: 3
结果二: 4
```

## 函数
***  
### 函数定义
在 Rust 中通过输入 fn 后面跟着函数名和一对圆括号来定义函数，后跟大括号定义函数体的开始和结尾。Rust 代码中的函数和变量名使用 **snake case** 规范风格。使用函数名后跟圆括号来调用我们定义过的任意函数。
``` rust
fn main() {
    println!("Hello, world!");

    another_function();
}

fn another_function() {
    println!("Another function.");
}
```

### 参数
与其他语言一样，我们可以定义为拥有 **参数**(parameters)的函数，参数是特殊变量，是函数签名的一部分。当函数拥有参数(形参)时，在函数调用时可以为这些参数提供具体的值(实参)。技术上讲，这些具体值被称为参数(arguments)。在函数签名中，**必须**声明每个参数的类型。
``` rust
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("The value of x is: {x}");
}
```

### 语句和表达式(Statements and Expressions)
函数体由**一系列的语句和一个可选的结尾表达式**构成。
**语句**(Statements)是执行一些操作但不返回值的指令。
**表达式**(Expressions)计算并产生一个值。
``` rust
fn main() {
	// 语句
    let y = 6;
}
```

函数定义也是语句，语句不返回值。
``` rust
fn main() {
	// error: expected expression, found `let` statement
    let x = (let y = 6);
}
```

let y = 6 语句并不返回值，所以没有可以绑定到 x 上的值。这与 C 语言设计不同，C 的赋值语句会返回所赋的值。在 C 语言中，可以这么写 x = y = 6。

表达式会计算出一个值，考虑一个数学运算，比如 5 + 6，这是一个表达式并计算出值 11。表达式可以是语句的一部分，例如上述例子，语句 let y = 6; 中的 6 是一个表达式，它计算出的值是 6。
函数调用是一个表达式，宏调用是一个表达式，用大括号创建的一个新的块作用域也是一个表达式，例如: 
``` rust
fn main() {
    let y = {
        let x = 3;
        // 注意没有分号
        x + 1
    };

    println!("The value of y is: {y}");
}
```

表达式的结尾没有分号。如果在表达式的结尾加上分号，它就变成了语句。

### 具有返回值的函数
函数可以向调用它的代码返回值。我们并不对返回值命名，但要在箭头 -> 后声明它的类型。在 Rust 中，函数的返回值等同于函数体最后一个表达式的值。使用 return 关键字和指定值，可从函数中提前返回。
``` rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five();

    println!("The value of x is: {x}");
}
```

## 注释
***  
与大多数语言类似，在 Rust 中，惯用的注释样式是以两个斜杠开始注释，并持续到本行的结尾。
与某些语言类似，Rust 还有另一种注释，称为文档注释，我们将在之后介绍。

## 控制流
***  
### if 表达式
if 表达式允许根据条件执行不同的代码分支。所有的 if 表达式都以 if 关键字开头，其后跟一个条件，与 Python 类似，条件也不需要括号包裹。也可以包含一个可选的 else 表达式来提供一个在条件为 false 时应当执行的代码块。同时也支持 else if 表达式实现多重条件。
``` rust
fn main() {
    let number = 3;

    if number < 5 {
        println!("condition was true");
    } else {
        println!("condition was false");
    }
}
```

不像 JavaScript、Python 这样的语言，值得注意的是代码中的条件**必须**是 bool 值。Rust 并不会尝试自动地将非布尔值转换为布尔值。

使用过多的 else if 表达式会使代码显得杂乱无章，之后我们会介绍另一个强大的 Rust 分支结构(branching construct)，叫做 match。

### 在 let 语句中使用 if
因为 if 是一个表达式，我们可以在 let 语句的右侧使用它，语法类似 Python: 
``` rust
fn main() {
    let condition = true;
    let number = if condition { 5 } else { 6 };

    println!("The value of number is: {number}");
}
```

需要注意，每个分支的可能的返回值都必须是相同类型。否则会出现错误: 
``` rust
fn main() {
    let condition = true;
	// error[E0308]: `if` and `else` have incompatible types
    let number = if condition { 5 } else { "six" };

    println!("The value of number is: {number}");
}
```

### 循环
Rust 支持三种循环: loop、while 和 for。
#### 使用 loop 重复执行代码
``` rust
fn main() {
    loop {
        println!("again!");
    }
}
```

Rust 提供了一种从代码中跳出循环的方法。可以使用 break 关键字来告诉程序何时停止循环。continue 关键字则告诉程序跳过这个循环迭代中的任何剩余代码，并转到下一个迭代。

#### while 条件循环
当条件为 true，执行循环。当条件不再为 true，调用 break 停止循环。
``` rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{number}!");

        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

#### 使用 for 遍历集合
``` rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a {
        println!("the value is: {element}");
    }
}
```

相比其他循环，for 循环的安全性和简洁性使得它成为 Rust 中使用最多的循环结构。