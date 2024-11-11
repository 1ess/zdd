---
title: 『Rust 程序设计语言』读书笔记(七)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog278.jpg
date: 2024/11/11
---
Rust 具有许多管理代码组织的功能，包括公开哪些信息、哪些信息是私有的，以及程序中每个范围内的名称。这些功能统称为**模块系统**。包括: 
- Package: 允许构建、测试和分享 crate
- Crates: 模块的树形结构，形成库或可执行文件
- Modules and use: 允许你控制作用域和路径的私有性
- Paths: 命名 item 的一种方式，例如，一个结构体、一个函数、一个模块等

### Package 和 Crate
一个 package 是由一个或多个 crates 组成。一个 package 包含一个 Cargo.toml 文件，用来描述如何构建这些 crates。
一个 crate 可以是一个 binary crate 或者是一个 library crate，binary crate 是可以编译为可以运行的可执行文件的程序，它们必须有一个名为 main 的函数。
library crate 没有  main 函数，也不被编译为可执行程序，他们定义了为了在多个项目共享的功能，例如 rand create 就定义了生成随机数的功能。

package 所包含的内容有几条规则限制: 
1. 一个 package 最多可以包含一个 library crate
2. 一个 package 可以包含任意多个 binary crate
3. 一个 package 必须至少包含一个 crate

### 定义模块来控制作用域与私有性
模块让我们可以将一个 crate 中的代码进行分组，以提高可读性与重用性。模块还控制项目是否可以由外部代码使用。

我们用关键字 mod 定义一个模块，指定模块的名字。并用大括号包围模块的主体。我们可以在模块中包含其他模块，模块中也可以包含其他项，比如结构体、枚举、常量、trait、函数等。
``` rust
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}

        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}

        fn server_order() {}

        fn take_payment() {}
    }
}
```

我们把 src/main.rs 和 src/lib.rs 被称为 crate root。如此称呼的原因是，这两个文件中任意一个的内容会构成名为 crate 的模块，且该模块位于 crate 的被称为模块树的模块结构的根部。
``` text
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

### 路径用于引用模块树中的项
我们使用路径的方式，就像在文件系统使用路径一样在模块树中找到一个项的位置。

路径有两种形式: 
1. 绝对路径: 从 crate 根部开始，以 crate 名或者字面量 crate 开头
2. 相对路径: 从当前模块开始，以 self、super 或当前模块的标识符开头

绝对路径和相对路径都后跟一个或多个由双冒号 :: 分割的标识符。

Rust 中默认所有项(函数、方法、结构体、枚举、模块和常量)都是私有的。父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用他们父模块中的项。可以通过使用 pub 关键字来创建公共项，使子模块的内部部分暴露给上级模块。
``` rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();

    // Relative path
    front_of_house::hosting::add_to_waitlist();
}
```

我们还可以使用 super 开头来构建从父模块开始的相对路径。这么做类似于文件系统中以 .. 开头的语法。
``` rust
fn serve_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::serve_order();
    }

    fn cook_order() {}
}
```

我们还可以使用 pub 来设计公有的结构体和枚举，不过有一些额外的细节需要注意。如果我们在一个结构体定义的前面使用了 pub，这个结构体会变成公有的，但是这个结构体的字段仍然是私有的。我们可以根据情况决定每个字段是否公有。如果我们将枚举设为公有，则它的所有成员都将变为公有。

### 使用 use 关键字将名称引入作用域
到目前为止，我们编写的用于调用函数的路径都很冗长且重复，并不方便。有一种方法可以简化这个过程。我们可以使用 use 关键字将路径一次性引入作用域，然后调用该路径中的项，就如同它们是本地项一样。
``` rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
fn main() {}
```

### 使用 as 关键字提供新的名称
使用 use 可能会遇到将两个同名类型引入同一作用域这个问题，解决方法是在这个类型的路径后面，使用 as 指定一个新的本地名称或者别名。
``` rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // ...
    Ok(())
}

fn function2() -> IoResult<()> {
    // ...
    Ok(())
}
```

### 将模块分割进不同文件
``` rust
mod front_of_house;

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```
声明 front_of_house 模块，其内容将位于 src/front_of_house.rs 中，在 mod front_of_house 后使用分号，而不是代码块，这将告诉 Rust 在另一个与模块同名的文件中加载模块的内容。
接着我们创建一个 src/front_of_house 目录和一个包含 hosting 模块定义的 src/front_of_house/hosting.rs 文件，在 src/front_of_house.rs 中使用 pub mod hosting; 包含此模块。

如此修改之后，src/lib.rs 中的 pub use crate::front_of_house::hosting 语句没有发生改变，在文件作为 crate 的一部分而编译时，use 不会有任何影响。mod 关键字声明了模块，Rust 会在与模块同名的文件中查找模块的代码。