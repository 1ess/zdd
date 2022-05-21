---
title: C Plus Plus From Zero To Hero(一)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog237.jpg
date: 2022-05-21
---

## C++ 代码基本形式
C++ 代码并不限制文件扩展名，但是通常为了更好的协作开发，我们会将文件扩展名约定写成 .h 和 .cpp。

### 头文件
#### 防卫式声明
在头文件中，大气的程序员(侯捷语)我们通常会使用防卫式声明，即在头文件中运用预编译语句，防止被重复导入: 
``` cpp
// complex.h
#ifndef __COMPLEX__ 
#define __COMPLEX__


#endif
```

以上预编译语句被称为防卫式声明。定义的名称以双下划线开头结尾，中间使用与类名相同的大写字母组成。

#### 头文件布局
头文件布局可分为三块: 
1. 前置声明(forward declarations)
2. 类声明(class declarations)
3. 类定义(class definition)

``` cpp
// complex.h
#ifndef __COMPLEX__ 
#define __COMPLEX__

#include <cmath>

// 前置声明
class ostream;
class complex;

complex& 
    __doapl (complex* ths, const complex& r);

// 类声明
class complex
{
    ...
}

// 类定义
// 成员函数
complex::function ...

// 全局函数
Global-function ...
#endif
```

#### 类声明布局
类声明布局可分为两块: 
1. 类头(class head)
2. 类体(class body)

``` cpp
class complex // 类头
{
    // 类体
public:
    complex(double r = 0, double i = 0)
    : re(r), im(i)
    {}
    complex& operator += (const complex&);
    double real() comst { return re; }
    double imag() comst { return im; }
private:
    double re, im;

}

// 全局函数
inline double 
imag(const complex& x)
{
    return x.imag();
}
```

### 内联函数
默认在类内定义的函数，自动变为内联函数，若为类外定义的函数，需使用 inline 关键字。

### 成员函数和全局函数
我们可以在类声明和类定义中声明和定义成员函数，在类声明中声明时，它所带的函数参数可以只指出其类型，而省略参数名。而在类定义中定义成员函数时必须在函数名之前加上类名前缀，并且在函数名和类名之间加上作用域区分符::，作用域区分符::指明一个成员函数或数据成员所在的类。若作用域区分符::前不加类名，则称该函数为全局数据或全局函数。

### 访问级别
在类内定义时，需指定成员的访问级别，可分为: 
1. public
2. private
3. protected

### 构造函数
与大多数编程语言类似，C++ 也有默认参数，同时还有特殊的初始化列表(initialization list)，用于初始化成员。
``` cpp
class complex
{

public:
    complex(double r = 0, double i = 0)
    : re(r), im(i)
    {}
}
```

需要注意，使用该方式与在构造函数内赋值的区别是时机不同，使用初始化列表是初始化(initialization)，而在内部则是赋值(assignment)。

构造函数也可以重载(overloading)，需要注意的是，特别关注参数列表，刨除默认参数外如果存在相同重载构造函数也不可以。因为编译器无法得知我们究竟调用的是哪个构造函数。

也要注意，构造函数也可以放在 private 区域，即我们无法在外部通过调用构造函数创建对象。这在单例设计模式中是很常见的使用方式。

### const
const 的使用是衡量一个程序员是否老道的一个标准，主要有以下几种使用方式: 
- 修饰返回值: const int& fun(int& a);
- 修饰形参: int& fun(const int& a);
- 修饰成员函数: int& fun(int& a) const{}

#### const 修饰返回值
返回值在引用类型的情况下，为了避免返回值被修改的情况，需要使用 const 修饰返回值: 
``` cpp
#include<iostream>

using namespace std;

class A
{
private:
    int data;
public:
    A(int num):data(num){}
    ~A(){};
    int& get_data()
    {
        return data;
    }
};

int main()
{
    A a(1);
    a.get_data()=3;
    cout<<a.get_data()<<endl; //data=3
    return 0;
}
```

#### const 修饰形参
多数情况下，我们都会选择 pass by reference，这样可以节省内存，并且可以起到改变实参的目的。不过有的时候我们并不希望在函数内部改变实参的值，就要加上 const 关键字修饰形参。

#### const 修饰成员函数

``` cpp
#include<iostream>

using namespace std;

class A
{
private:
    int data;
public:
    A(int num):data(num){}
    ~A(){};
    int& get_data()
    {
        return data;
    }
};

int main()
{
    const A a(1);
    a.get_data();
    return 0;
}
```

以上程序会报错，原因是任何成员函数的参数都是隐式包含 this 指针。上述例子中 a 是一个 const 对象，当调用 get_data 方法，该函数签名是 get_data(a){}，而 a 又是一个 const 对象，默认的 this 指针并不是 const 类型，所以参数类型不匹配，导致编译无法通过。

深刻理解: **const 对象只能调用 const 成员函数，non-const 对象只能调用 non-const 成员函数**。

### 参数传递
参数传递可分为两类: 
1. 传值(pass by value)
2. 传引用(pass by reference [to const])

例如上述示例的构造函数使用 pass by value，运算符重载中使用 pass by value to const。

### 返回值传递
返回值传递与参数传递类似，也可分为两类: 
1. 传值(return by value)
2. 传引用(return by reference [to const])

例如上述示例的获取实部方法使用 return by value，运算符重载中使用 return by value。

### 引用
合时使用 pass by reference 和 return by reference？一句话就是我们在尽可能使用引用的地方都是用引用。

有一个场景无法使用 return by reference，即返回的对象在函数内定义。因为在离开函数作用域时该对象已经被销毁。

### 操作符重载
#### 成员函数操作符重载
当重载的操作符是函数成员时，之前我们也说过，任何成员函数的参数都是隐式包含 this 指针，我们会把操作符的第一个操作数当作 this 指针传递到该函数成员中。

``` cpp
inline complex&
__doapl(complex* ths, const complex& r)
{
...
return *ths; 
}

inline complex&
complex::operator += (const complex& r)
{
return __doapl(this,r);
}
```

还有一点需要注意，传递者无需知道接收者是以何种方式接收。

#### 非成员函数操作符重载
``` cpp
inline complex
operator + (const complex& x, const complex& y)
{
    return complex (real (x) + real (y), 
    imag (x) + imag (y));
}

inline complex
operator + (const complex& x, double y)
{
    return complex (real (x) + y, imag (x));
}

inline complex
operator + (double x, const complex& y)
{
    return complex (x + real (y), imag (y));
}
```

注意上述示例返回值语法: typename(); 意思是返回临时对象，该对象在运行到该行之后即被释放。

还需要注意，之前我们也说过，上面这些函数不可以使用 return by reference。