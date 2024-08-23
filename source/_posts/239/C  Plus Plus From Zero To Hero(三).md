---
title: C Plus Plus From Zero To Hero(三)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog239.jpg
date: 2022-05-27
---

## 构造
***  
### 默认构造函数
默认构造函数是没有参数的构造函数，或者所有参数都具有默认值的构造函数。注意下面两种声明方式的不同: 
``` cpp
Circle c1;   // 声明一个 Circle 实例 c1 并调用默认构造函数
Circle c1(); // 声明一个 Circle 实例 c1 并调用无参构造函数
```

C++ 中如果你没有提供任何的构造函数，编译器会自动提供一个默认的无参构造函数。如果自定义了任何构造函数，编译器将不会提供默认构造函数。
### 析构函数
析构函数类似于构造函数，是一个特殊的函数，它与类名同名，带有前缀 ~。当对象被销毁时，会隐式调用析构函数。
如果你没有定义析构函数，编译器会提供一个默认值。
``` cpp
class MyClass { 
public: 
    ~MyClass() { } 
...... 
}
```

如果类中包含动态分配内存的数据成员(通过 new、new[] 运算符生成的对象)，需要通过 delete、delete[] 释放存储空间。

### 拷贝构造函数
拷贝构造函数通过复制相同类型的现有对象来构造新对象。也就是说，复制构造函数接收一个相同类型的对象作为参数。
如果没有定义拷贝构造函数，编译器会提供一个默认拷贝构造函数，该默认拷贝构造函数会复制给定对象的所有数据成员。
``` cpp
Circle c4(7.8, "blue");
cout << "Radius=" << c4.getRadius() << " Area=" << c4.getArea()
     << " Color=" << c4.getColor() << endl;
    // Radius=7.8 Area=191.135 Color=blue
 
// 调用拷贝构造函数生成新对象
Circle c5(c4);
cout << "Radius=" << c5.getRadius() << " Area=" << c5.getArea()
     << " Color=" << c5.getColor() << endl;
    // Radius=7.8 Area=191.135 Color=blue
```

注意: 
- **为了避免创建克隆副本的开销，参数通常最好通过 return by reference to const 方式传递**
- 默认的拷贝构造函数使用**浅拷贝**，不会通过 new 或 new[] 运算符动态创建数据成员

### 拷贝赋值
编译器还提供了一个默认赋值运算符(=)，可用于通过成员复制将一个对象分配给同一个类的另一个对象。
``` cpp
Circle c6(5.6, "orange"), c7;
cout << "Radius=" << c6.getRadius() << " Area=" << c6.getArea()
     << " Color=" << c6.getColor() << endl;
    // Radius=5.6 Area=98.5206 Color=orange
cout << "Radius=" << c7.getRadius() << " Area=" << c7.getArea()
     << " Color=" << c7.getColor() << endl;
    // Radius=1 Area=3.1416 Color=red (default constructor)
 
c7 = c6; // memberwise copy assignment
cout << "Radius=" << c7.getRadius() << " Area=" << c7.getArea()
     << " Color=" << c7.getColor() << endl;
    // Radius=5.6 Area=98.5206 Color=orange
```

- 可以通过重载赋值运算符以覆盖默认提供的拷贝赋值操作
- 默认的拷贝赋值使用**浅拷贝**，不会通过 new 或 new[] 运算符动态创建数据成员
- 拷贝赋值与拷贝构造函数的不同之处在于要防止自赋值。重载赋值运算符时应返回此对象的引用以允许链接操作(例如 x = y = z)
- 默认构造函数、默认析构函数、默认拷贝构造函数、默认拷贝赋值被称为特殊成员函数，如果没有显示定义，编译器将自动生成一个默认函数

## 多态
***  
### 多态性
1. 子类实例可以替换超类引用
2. 一旦被替换，只能调用超类的函数，不能调用子类特有函数
3. 如果子类重写了超类函数。我们希望在子类中运行被覆盖的版本

### 虚函数
要实现多态，我们需要使用关键字 virtual 来表示多态的函数。在这种情况下，如果超类指针指向子类对象，并调用 virtual 被子类重写的函数，则将调用子类版本，而不是超类版本。
``` cpp
// Point.h 
class Point { 
    ...... 
    virtual void print() const; 
}
```

对于非虚拟函数，编译器选择将在编译时调用的函数(称为静态绑定)。对于虚函数，选择会延迟到运行时，选择的函数取决于调用函数的实际类型(称为动态绑定或后期绑定)。

### 转换运算符 dynamic_cast
C++ 提供了一个新转换运算符 dynamic_cast<type>(value)，如果类型转换失败，它会返回一个空指针。
``` cpp
MovablePoint * ptrMP1 = dynamic_cast<MovablePoint *> (ptrP1);
```

### 纯虚函数和抽象超类
纯虚函数是通过在其声明中放置" = 0"(称为纯说明符)来指定的: 
``` cpp
virtual double getArea() = 0; // Pure virtual function 等待子类实现
```

包含一个或多个纯虚函数的类称为**抽象类**。您不能从抽象类创建实例，因为它的定义可能不完整。如果要使用抽象类，需要先派生一个子类，重写所有所有纯虚函数的实现。