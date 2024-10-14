---
title: 『Rust 程序设计语言』读书笔记(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog273.png
date: 2024/10/14
---
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