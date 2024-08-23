---
title: C Plus Plus From Zero To Hero(七)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog243.jpg
date: 2022-06-06
---

## 函数指针
***  
函数指针指向的是函数而不是对象。和其他指针一样，函数指针指向特定类型。函数的类型由返回值类型和参数类型共同决定，与函数名和参数名无关。例如: 
``` cpp
bool lengthCompare(const string &, const string &);
```

该类型为: 
``` cpp
bool(const string &, const string &)
```

声明一个该类型的指针时，只需要用指针名代替函数名即可: 
``` cpp
bool (*pf)(const string &, const string &); // 未初始化
```

上例中，pf 前有个 * 表示其声明为指针。需要注意，*pf 两端的括号必不可少，如果去掉括号，则表示声明一个函数，返回值为 bool *。


### 使用函数指针
当把函数名作为值使用时，该值自动转换为函数指针。例如: 
``` cpp
pf = lengthCompare;
// or
pf = &lengthCompare; // 取地址运算符是可选的，与上述赋值等价
```

有三种方式调用函数: 
``` cpp
bool b1 = pf("hello", "world");
// or
bool b2 = (*pf)("hello", "world");
// or
bool b3 = lengthCompare("hello", "world");
```

注意: 可以直接使用函数指针调用该函数，无需解引用。

## lambda
***  
对于一个对象或表达式可以对其使用调用运算符，则称为**可调用的**。即如果 e 是可调用的，那么可以使用 e(args) 对其进行调用，args 使用逗号分割的参数列表。
目前为止，已经介绍过两种可调用对象: 函数、函数指针。还有两种可调用对象: 重载调用运算符的类、lambda 表达式。

lambda 表达式我们可以理解为未命名的内联函数。形式如下: 
``` cpp
[capture list](parameter list) -> return type { function body }
```

其中，捕获列表是一个 lambda 所在函数中定义的局部变量列表。需要注意，与普通函数不同的是，lambda 必须使用尾置返回来指定返回类型。
如果 lambda 包含了 return 语句之外的内容，且未指定返回类型，则返回 void。

### 捕获列表
lambda 以一对 [] 开始，在内部提供以逗号分割的列表，列表的每一项都是在所在函数中定义的。一个 lambda 只有在捕获列表中捕获局部变量，才能在函数体中使用该变量。
捕获变量只用于局部非 static 变量，在函数体中可以直接使用 static 变量。

#### 值捕获
``` cpp
void func1()
{
    size_t v1 = 42;
    auto f = [v1] { return v1; };
    v1 = 0;
    auto j = f(); // 42
}
```

捕获变量的值是在创建 lambda 时拷贝的，随后的修改不会影响 lambda 内部对应的值。

#### 引用捕获
``` cpp
void func2()
{
    size_t v1 = 42;
    auto f2 = [&v1] { return v1; };
    v1 = 0;
    auto j = f2(); // 0
}
```

### 隐式捕获
除了显示指定要捕获的局部变量，还可以使用 & 或 = 让编译器推断捕获的变量。 & 表示以引用方式捕获，= 表示以值方式捕获。

### 捕获列表书写方式
- [] 表示空捕获，即不使用所在函数定义的局部变量 | 
- [names] 表示 names 指定捕获变量列表，默认使用值捕获，如果变量前有 &，表示引用捕获 |
- [&] 表示隐式捕获，采用引用捕获所在函数定义的所有局部变量 |
- [=] 表示隐式捕获，采用值捕获所在函数定义的所有局部变量 |
- [&, names] 表示 names 列表使用值捕获，其余变量使用引用捕获 |
- [=, names] 表示 names 列表使用引用捕获，其余变量使用值捕获 |