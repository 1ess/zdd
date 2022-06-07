---
title: C Plus Plus From Zero To Hero(八)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog244.jpg
date: 2022-06-07
---

## 动态内存
***  
C++ 中，动态内存的管理是通过 new、delete 两个运算符完成的。动态内存的正确使用是非常困难的，有时会忘记释放内存，就会产生**内存泄漏**。有时又会过早的释放内存，导致**空指针异常**。

那么为了更安全、容易地使用动态内存，新标准库提供了两种智能指针来管理动态对象。

智能指针的行为类似普通指针，区别是智能指针负责自动释放所指向的对象。

两种智能指针的区别在于管理指针的方式: shared_ptr 允许多个指针指向同一对象，unique_ptr 则独占对象。标准库还定义了 weak_ptr 指向 shared_ptr 所指向的对象，只不过其是弱引用。

三种类型都定义在 memory 头文件中。

### shared_ptr
shared_ptr 也是模板。使用方式如下: 
``` cpp
shared_ptr<string> p1; 

shared_ptr<list<int>> p2;
```

智能指针使用方式与普通指针类似，解引用一个智能指针返回指向的对象。

shared_ptr 与 unique_ptr 都支持的操作如下: 

| 操作 | 说明 |
| -- | -- |
| shared_ptr<T> sp | 空指针，可以指向类型为 T 的对象 |
| unique_ptr<T> up | 空指针，可以指向类型为 T 的对象 |
| p | 用于条件判断，若 p 指向一个对象，则为 true |
| *p | 解引用，获取指向的对象 |
| p->mem | 等价于 (*p).mem |
| p.get() | 返回 p 中保存的指针 |
| swap(p, q) | 交换 p 和 q 的指针 |
| p.swap(q) | 交换 p 和 q 的指针 |

shared_ptr 独有的操作如下: 

| 操作 | 说明 |
| -- | -- |
| make_shared<T>(args) | 使用 args 初始化类型为 T 的对象，并返回 shared_ptr 指针 |
| shared_ptr<T>p(q) | p 是 shared_ptr q 的拷贝，此操作会递增 q 的引用计数 |
| p = q | 此操作会递减 p 的引用计数，递增 q 的引用计数，当智能指针的引用计数为 0 时，会释放内存 |
| p.use_count() | 返回与 p 共享对象的智能指针的数量，主要用于调试 |
| p.unique() | 当 p.use_count() 返回 1 时为 true，否则为 false |

### make_shared 函数
最安全使用动态内存的方式是使用 make_shared 函数，使用方式如下: 
``` cpp
shared_ptr<int> p3 = make_shared<int>(42);

shared_ptr<int> p3 = make_shared<int>();
```

通常使用 auto 定义一个对象保存 make_shared 的返回值: 
``` cpp
auto p6 = make_shared<vector<string>>();
```

### 拷贝与赋值
当进行拷贝与赋值操作时，shared_ptr 会记录有多少个其他 shared_ptr 指向相同对象。通常称为**引用计数**。

### unique_ptr
一个 unique_ptr 拥有它所指向的对象。当 unique_ptr 被销毁时，它所指向的对象也被销毁。

unique_ptr 独有的操作如下: 

| 操作 | 说明 |
| -- | -- |
| unique_ptr<T> u1 | 空 unique_ptr，指向类型为 T 的对象 |
| u = nullptr | 释放 u 所指向的对象 |
| u.release() | 释放 u 所指向的对象 |
| u.reset() | 释放 u 所指向的对象 |
| u.reset(nullptr) | 释放 u 所指向的对象 |
| u.reset(p) | 如果提供了内置指针 p，将 u 指向该对象 |

虽然无法赋值或拷贝 unique_ptr，但是可以通过 release 或 reset 将指针所有权从一个 unique_ptr 转移到另一个。
与 shared_ptr 不同的是，没有 make_shared 函数返回该指针，当定义一个 unique_ptr 时，需要将其绑定到一个 new 操作符返回的指针上。

### weak_ptr
将 weak_ptr 指向 shared_ptr 对象不会改变 shared_ptr 的引用计数，一旦最后一个指向该对象的 shared_ptr 被销毁，对象就会被释放。
检查 weak_ptr 指向的对象是否存在需要使用 lock 方法: 
``` cpp
if (shared_ptr<int> p = wp.lock())
{
    ...
}
```