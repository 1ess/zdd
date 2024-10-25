---
title: 『Rust 程序设计语言』读书笔记(五)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog276.jpg
date: 2024/10/23
---
本篇我们介绍结构体(struct)，它是由其它数据类型组合而来。 其它语言也有类似的数据结构。
和元组一样，结构体的每一部分可以是不同类型。但不同于元组，结构体可以为内部的每个字段起一个富有含义的名称。因此结构体更加灵活，无需依赖字段的顺序来访问和解析。

### 结构体定义
定义结构体，需要使用 struct 关键字并为整个结构体提供一个名字。接着，在大括号中，定义每一部分数据的名字和类型，我们称为**字段**(field): 
``` rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

一旦定义了结构体后，为了使用它，通过为每个字段指定具体值来创建这个结构体的**实例**。创建一个实例需要以结构体的名字开头，接着在大括号中使用 key: value 键值对的形式提供字段: 
``` rust
fn main() {
    let user1 = User {
        active: true,
        username: String::from("StephenChang"),
        email: String::from("pipelining@qq.com"),
        sign_in_count: 1,
    };
}
```

为了从结构体中获取某个特定的值，可以使用点号，如果结构体的实例是可变的，我们可以使用点号并为对应的字段赋值: 
``` rust
fn main() {
    let mut user1 = User {
        active: true,
        username: String::from("StephenChang"),
        email: String::from("pipelining@qq.com"),
        sign_in_count: 1,
    };

    user1.email = String::from("stephenchang@qq.com");
}
```

注意整个实例必须是可变的，Rust 并不允许只将某个字段标记为可变。

### 使用字段初始化简写语法
如果参数名与字段名都完全相同，我们可以使用**字段初始化简写语法**，来构建实例: 
``` rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```

### 使用结构体更新语法从其他实例创建实例
使用旧实例的大部分值但改变其部分值来创建一个新的结构体实例通常是很有用的。这可以通过**结构体更新语法**实现: 
``` rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("pipelining@qq.com"),
        ..user1
    };
}
```

.. 语法指定了剩余未显式设置值的字段应有与给定实例对应字段相同的值。
需要注意，上例中的 ..user1 必须放在最后，以指定其余的字段应从 user1 的相应字段中获取其值。

还需要特别注意，结构更新语法就像带有 = 的赋值，因为它移动了数据，因此上例中，在创建 user2 后不能就再使用 user1 了，因为 user1 的 username 字段中的 String 被移到 user2 中。如果我们给 user2 的 email 和 username 都赋予新的 String 值，而只使用 user1 的 active 和 sign_in_count 值，那么 user1 在创建 user2 后仍然有效。因为 active 和 sign_in_count 的类型是实现 Copy trait 的类型。

### 使用没有命名字段的元组结构体来创建不同的类型
也可以定义与元组类似的结构体，称为**元组结构体**(tuple structs)。元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。要定义元组结构体，以 struct 关键字和结构体名开头并后跟元组中的类型。
``` rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

fn main() {
    let black = Color(0, 0, 0);
    let origin = Point(0, 0, 0);
}
```
元组结构体实例类似于元组，你可以将它们解构为单独的部分，也可以使用 . 后跟索引来访问单独的值。

在上述的 User 结构体的定义中，我们使用了自身拥有所有权的 String 类型而不是 &str 字符串 slice 类型，因为我们想要这个结构体拥有它所有的数据。
可以使结构体存储被其他对象拥有的数据的引用，不过这么做的话需要用上**生命周期**，我们会在之后章节介绍。如果你尝试在结构体中存储一个引用而不指定生命周期将是无效的: 
``` rust
struct User {
    active: bool,
    // error[E0106]: missing lifetime specifier
    username: &str,
    email: &str,
    sign_in_count: u64,
}

fn main() {
    let user1 = User {
        active: true,
        username: "StephenChang",
        email: "pipelining@qq.com",
        sign_in_count: 1,
    };
}
```

注意: **访问对结构体引用的字段不会移动字段的所有权**，这就是为什么你经常看到对结构体的引用。

### 方法
**方法**(method)与函数类似: 它们使用 fn 关键字和名称声明，可以拥有参数和返回值，同时包含在某处调用该方法时会执行的代码。不过方法与函数是不同的，它们在**结构体、枚举或 trait 对象**的上下文中被定义。并且它们第一个参数总是 self，它代表调用该方法的实例。

方法在 impl 代码块中定义: 
``` rust
struct Point {
    x: f64,
    y: f64,
}

// 实现的代码块，Point 的所有方法都在这里给出
impl Point {
    // 这是一个静态方法（static method）
    // 静态方法不需要被实例调用
    // 这类方法一般用作构造器（constructor）
    fn origin() -> Point {
        Point { x: 0.0, y: 0.0 }
    }

    // 另外一个静态方法，需要两个参数
    fn new(x: f64, y: f64) -> Point {
        Point { x: x, y: y }
    }
}

struct Rectangle {
    p1: Point,
    p2: Point,
}

impl Rectangle {
    // 这是一个实例方法 instance method，Rust 中称为关联函数
    // &self 是 self: &Self 的语法糖，其中 Self 是方法调用者的
    // 类型。在这个例子中 Self = Rectangle
    fn area(&self) -> f64 {
        // self 通过点运算符来访问结构体字段
        let Point { x: x1, y: y1 } = self.p1;
        let Point { x: x2, y: y2 } = self.p2;

        // abs 是一个 f64 类型的方法，返回调用者的绝对值
        ((x1 - x2) * (y1 - y2)).abs()
    }

    fn perimeter(&self) -> f64 {
        let Point { x: x1, y: y1 } = self.p1;
        let Point { x: x2, y: y2 } = self.p2;

        2.0 * ((x1 - x2).abs() + (y1 - y2).abs())
    }

    // 这个方法要求调用者是可变的
    // &mut self 为 self: &mut Self 的语法糖
    fn translate(&mut self, x: f64, y: f64) {
        self.p1.x += x;
        self.p2.x += x;

        self.p1.y += y;
        self.p2.y += y;
    }
}

// Pair 拥有资源：两个堆分配的整型
struct Pair(Box<i32>, Box<i32>);

impl Pair {
    // 这个方法会消耗调用者的资源
    // self 为 self: Self 的语法糖
    fn destroy(self) {
        // 解构 self
        let Pair(first, second) = self;
        println!("Destroying Pair({}, {})", first, second);
        // first 和 second 离开作用域后释放
    }
}

fn main() {
    let rectangle = Rectangle {
        // 静态方法使用双冒号调用
        p1: Point::origin(),
        p2: Point::new(3.0, 4.0),
    };

    // 实例方法通过点运算符来调用
    // 注意第一个参数 &self 是隐式传递的，亦即：
    // rectangle.perimeter() === Rectangle::perimeter(&rectangle)
    println!("Rectangle perimeter: {}", rectangle.perimeter());
    println!("Rectangle area: {}", rectangle.area());

    let mut square = Rectangle {
        p1: Point::origin(),
        p2: Point::new(1.0, 1.0),
    };

    // 报错！ rectangle 是不可变的，但这方法需要一个可变对象
    rectangle.translate(1.0, 0.0);
    
    // 正常运行！可变对象可以调用可变方法
    square.translate(1.0, 1.0);

    let pair = Pair(Box::new(1), Box::new(2));

    pair.destroy();

    // 报错！前面的 destroy 调用消耗了 pair
    pair.destroy();
}
```

需要注意: 有时我们会看到 &self 或者 &mut self 作为第一个参数，其实他们是 self: &Self 与 self: &mut Self 的简写，第一个参数名还是 self。什么时候选择什么参数与前面我们提到的你希望使用 move 语义还是 borrowing 语义有关。

还需要注意: Rust 中没有类似 C/C++ 中的 -> 操作符，Rust 有一个称为**自动引用和解引用**的功能。调用方法是 Rust 中具有这种行为的少数几个地方之一。他的原理是，当您使用 object.something() 调用方法时，Rust 会自动添加 &、&mut 或 * ，以便 object 与方法的签名匹配。因为方法有一个明确的 self 参数的类型。Rust 可以明确地知道方法是仅仅读取(使用 &self)，做出修改(使用 &mut self)或者是获取所有权(使用 self)。