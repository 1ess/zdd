---
title: 『Rust 程序设计语言』读书笔记(六)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog277.jpg
date: 2024/11/11
---
本章我们介绍枚举(enums)，枚举是一个很多语言都有的功能，不过不同语言中其功能各不相同。Rust 的枚举与一些函数式语言例如 F# 的含义最为相似。

### 枚举定义
可以通过在代码中定义一个 IpAddrKind 枚举来表现这个概念并列出可能的 IP 地址类型，V4 和 V6。这被称为枚举的**成员**。
``` rust
enum IpAddrKind {
    V4,
    V6,
}
```

### 枚举值
``` rust
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;
```

注意枚举的成员位于其标识符的命名空间中，并使用两个冒号分开。

在其他语言中，我们如果想存储 IP 地址类型与地址值，通常使用类或结构体与枚举配合使用: 
``` rust
enum IpAddrKind {
    V4,
    V6,
}

struct IpAddr {
    kind: IpAddrKind,
    address: String,
}

let home = IpAddr {
    kind: IpAddrKind::V4,
    address: String::from("127.0.0.1"),
};

let loopback = IpAddr {
    kind: IpAddrKind::V6,
    address: String::from("::1"),
};
```

Rust 种我们可以使用一种更简洁的方式来表达相同的概念，仅仅使用枚举并将数据直接放进每一个枚举成员而不是将枚举作为结构体的一部分。
``` rust
enum IpAddr {
    V4(String),
    V6(String),
}

let home = IpAddr::V4(String::from("127.0.0.1"));

let loopback = IpAddr::V6(String::from("::1"));
```
我们直接将数据附加到枚举的每个成员上，这样就不需要一个额外的结构体了。

枚举和结构体还有另一个相似点：就像可以使用 impl 来为结构体定义方法那样，也可以在枚举上定义方法。
``` rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        // 在这里定义方法体
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

### 标准库 Option 枚举
Option 是标准库定义的一个枚举。Option 类型应用广泛因为它编码了一个非常普遍的场景，即一个值要么有值要么没值。Rust 并没有很多其他语言中有的空值(null)功能，null 是一个值，它代表没有值。在有空值的语言中，变量总是这两种状态之一: 空值和非空值。
Rust 并没有空值，不过它确实拥有一个可以编码存在或不存在概念的枚举。这个枚举是 Option\<T\>: 
``` rust
enum Option<T> {
    Some(T),
    None,
}
```
 
Option\<T\> 枚举是如此有用以至于它甚至被包含在了 prelude 之中，你不需要将其显式引入作用域。另外，它的成员也是如此，可以不需要 Option:: 前缀来直接使用 Some 和 None。

\<T\> 语法与其他语言类似它是一个泛型类型参数，之后会详细介绍 Rust 中的用法。

在对 Option\<T\> 进行 T 的运算之前必须将其转换为 T，为了使用 Option\<T\> 值，需要编写处理每个成员的代码。你想要一些代码只当拥有 Some(T) 值时运行，允许这些代码使用其中的 T。也希望一些代码在值为 None 时运行，这些代码并没有一个可用的 T 值。match 表达式就是这么一个处理枚举的控制流结构。

### match 控制流运算符
match 它允许我们将一个值与一系列的模式相比较，并根据相匹配的模式执行相应代码。模式可由字面量、变量、通配符和许多其他内容构成。
match 的力量来源于模式的表现力以及编译器检查，它确保了所有可能的情况都得到处理。

``` rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        }
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

### 绑定值的模式
匹配分支的另一个有用的功能是可以绑定匹配的模式的部分值。这也就是如何从枚举成员中提取值的。
``` rust
enum UsState {
    Alabama,
    Alaska,
    // ...
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        }
    }
}

fn main() {
    value_in_cents(Coin::Quarter(UsState::Alaska));
}

```

### 匹配 Option\<T\>
``` rust
fn main() {
    fn plus_one(x: Option<i32>) -> Option<i32> {
        match x {
            None => None,
            Some(i) => Some(i + 1),
        }
    }

    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

在 Rust 中，匹配必须覆盖所有情况，也就是说 Rust 中的匹配是**穷举式的**，必须穷举到最后的可能性来使代码有效，否则编译器会报错。

### 通配模式和 _ 占位符
如果我们希望对一些特定的值采取特殊操作，而对其他的值采取默认操作。我们可以使用**通配模式**。
``` rust
fn main() {
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
}
```
请注意，我们必须将通配分支放在最后，因为模式是按顺序匹配的。如果我们在通配分支后添加其他分支，Rust 将会警告我们，此后的分支永远不会被匹配到。

Rust 还提供了一个模式，当我们不想使用通配模式获取的值时，类似 Python 语言，可以使用 _ ，这是一个特殊的模式，可以匹配任意值而不绑定到该值。
``` rust
fn main() {
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}
}
```

注意，如果我们想在忽略模式下，不想运行任何代码，可以使用单元值作为返回值: 
``` rust
fn main() {
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => (),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
}
```

### if let 简单控制流
if let 语法让我们以一种不那么冗长的方式结合 if 和 let，来处理只匹配一个模式的值而忽略其他模式的情况。
``` rust
fn main() {
	let some_u8_value = Some(0u8);
	if let Some(3) = some_u8_value {
	    println!("three");
	}
}
```

换句话说，可以认为 if let 是 match 的一个语法糖，它当值匹配某一模式时执行代码而忽略所有其他值。