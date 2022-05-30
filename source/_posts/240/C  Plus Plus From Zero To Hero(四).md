---
title: C Plus Plus From Zero To Hero(四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog240.jpg
date: 2022-05-30
---

## 运算符重载
***  
运算符重载是指运算符执行的操作取决于提供给运算符的操作数的类型。C++ 允许您将运算符重载扩展到用户定义的类型。
运算符重载类似于函数重载，其中有许多同名函数，通过它们的参数列表来区分。

### 字符串中的重载运算符
- 字符串比较(==、!=、>、<、>=、<=): 例如 str1 == str2 表示比较两个 string 对象的内容
- 输入输出流(<<、>>): 使用 cout << str1 和 cin >> str2 来输出/输入 string 对象
- 字符串连接(+、+=): str1 + str2 表示将两个 string 对象连接起来产生一个新 string 对象。str1 += str2 表示追加 str2 到 str1
- 索引([]): 使用索引获取或设置对应下标的字符
- 赋值(=): str1 = str2 表示 str2 赋值给 str1

特别注意: 关系运算符、+、<<、>> 重载为非成员函数，因为左操作数可以是非字符串类型。[]、=、+= 被重载为成员函数。

### 自定义运算符重载
要重载自定义运算符，需要使用operator function 的特殊函数形式: 
``` cpp
return-type operator Δ(parameter-list)
```

例如，operator+() 重载 + 运算符，上例中 Δ 必须是现有的 C++ 运算符，不能自己创建运算符。
``` cpp
// Point.h
#ifndef POINT_H
#define POINT_H
 
class Point {
private:
    int x, y; // Private data members
 
public:
    Point(int x = 0, int y = 0); // Constructor
    int getX() const; // Getters
    int getY() const;
    void setX(int x); // Setters
    void setY(int y);
    void print() const;

    // Overload '+' operator as member function of the class
    const Point operator+(const Point & rhs) const; 
};
#endif

// Point.cpp
#include "Point.h"
#include <iostream>
using namespace std;
 
Point::Point(int x, int y) : x(x), y(y) { } 
 
// Getters
int Point::getX() const { return x; }
int Point::getY() const { return y; }
 
// Setters
void Point::setX(int x) { this->x = x; }
void Point::setY(int y) { this->y = y; }
 
void Point::print() const {
   cout << "(" << x << "," << y << ")" << endl;
}
 
const Point Point::operator+(const Point & rhs) const {
   return Point(x + rhs.x, y + rhs.y);
}
```

注意点: 
1. 重载的 + 运算符的返回值是 return by value，因为不能返回在函数内部创建的局部变量的引用
2. 参数通过 pass by reference 以提高性能
3. 成员函数被声明为 const，表示不能在函数内部修改数据成员
4. 返回值声明 const，以防止它被用作左值，如 (p1 + p2) = p3

### 运算符重载的限制
1. 重载的运算符必须是现有且有效的运算符
2. 某些 C++ 运算符不能重载，主要有 sizeof、点运算符(.)、作用域运算符(::)、三目运算符(?:)
3. 重载运算符必须至少有一个操作数是用户定义类型，也就是说，不能重载两个 int 类型的 + 运算符
4. 不能通过重载运算符修改原本的语法规则

### 二元运算符重载
既可以将二元运算符重载为成员函数 也可以重载为非成员函数: 
``` cpp
// 成员函数
class Point {
public:
    bool operator==(const Point & rhs) const;  // p1.operator==(p2)
    ......
};
// 编译器将 p1 == p2 转换为 p1.operator==(p2)

// 非成员函数
class Point {
    friend bool operator==(const Point & lhs, const Point & rhs); // operator==(p1,p2)
    ......
};
// 编译器将 p1 == p2 转换成 operator==(p1, p2)
```

### 一元运算符重载
#### 一元前缀运算符
与二元运算符重载类似，既可以将一元运算符重载为成员函数 也可以重载为非成员函数: 
``` cpp
class Point {
    friend Point & operator++(Point & point);
    ......
};

class Point {
public:
    Point & operator++();  // this Point
    ......
};
```

#### 一元后缀运算符
为了区分前缀运算符，后缀运算符引入了一个虚拟参数来指示后缀操作: 
``` cpp
class Point {
    friend const Point operator++(Point & point, int dummy);
};

class Point {
public:
    const Point operator++(int dummy);  // this Point
    ......
};
```

### 单参数构造函数将值隐式转换和 explicit 关键字
在 C++ 中，可以使用单参数构造函数将值隐式转换为对象: 
``` cpp
#include <iostream>
using namespace std;
 
class Counter {
private:
    int count;
public:
    Counter(int c = 0) : count(c) { }
          // 单参数构造函数
          // 可以隐式地把 int 转为 Counter
    int getCount() const { return count; }    // Getter
    void setCount(int c) { count = c; } // Setter
};
 
int main() {
    Counter c1; 
    cout << c1.getCount() << endl;  // 0
    
    c1 = 9; // 隐式转换，执行单参数构造函数 Counter(9)构建临时对象，然后通过深拷贝赋值给 c1
    cout << c1.getCount() << endl;  // 9
}
```

隐式转换很难跟踪和维护。因此 C++ 引入了一个关键字 explicit 来禁用隐式转换。
``` cpp
#include <iostream>
using namespace std;
 
class Counter {
private:
    int count;
public:
    explicit Counter(int c = 0) : count(c) { }
    int getCount() const { return count; }    // Getter
    void setCount(int c) { count = c; } // Setter
};
 
int main() {
    Counter c1; 
    cout << c1.getCount() << endl;  // 0
 
    Counter c2 = 9; // error
 
    c1 = (Counter)9;  // 显示转换
    cout << c1.getCount() << endl;  // 9
```