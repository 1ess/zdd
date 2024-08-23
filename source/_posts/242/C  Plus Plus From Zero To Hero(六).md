---
title: C Plus Plus From Zero To Hero(六)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog242.jpg
date: 2022-06-04
---

## 异常处理
***  
C++ 通过关键字 throw、try 和 catch 进行异常处理，通常还要使用头文件 exception 和 stdexcept 中。

### Throw、Try、Catch
``` cpp
// PositiveInteger.h
#ifndef POSITIVE_INTEGER_H
#define POSITIVE_INTEGER_H
 
class PositiveInteger {
private:
    int value;  // positive integer (>0) only
 
public:
    PositiveInteger(int value = 1);
    void setValue(int value);
    int getValue() const;
};
 
#endif

// PositiveInteger.cpp
#include <iostream>
#include <stdexcept>    // Needed for exception handling
#include "PositiveInteger.h"
using namespace std;
 

PositiveInteger::PositiveInteger(int value) {
    setValue(value);
}
 
// Setter with input validation
void PositiveInteger::setValue(int v) {
    if (v > 0) {
        value = v;
    } else {
        throw invalid_argument("value shall be more than 0."); // need <stdexcept>
    }
}

// Getter
int PositiveInteger::getValue() const {
    return value;
}

// TestPositiveInteger.cpp
#include <iostream>
#include <stdexcept>  // Needed for exception handling
#include "PositiveInteger.h"
using namespace std;
 
int main() {
    // Valid input
    PositiveInteger i1(8);
    cout << i1.getValue() << endl;
 
   try {
        cout << "begin try 1..." << endl;
        PositiveInteger i3(-8); // Exception thrown.
        // Skip
        cout << i3.getValue() << endl;
        cout << "end try 1..." << endl;
   } catch (invalid_argument & ex) {  // need <stdexcept>
        cout << "Exception: " << ex.what() << endl; // Continue to the next statement after try-catch
   }
   cout << "after try-catch 1..." << endl;
}
```

### 异常及其子类
![](https://cdn.zhangdd.tech/contentImg/cpp/ExceptionClasses.png)

## 类型转换运算符
***  
C++ 支持 C 风格的显式类型转换操作 (new-type)value，但是 C 风格的转换过于宽松，往往会产生非预期的结果。
因此 C++ 引入了 4 个新的类型转换运算符: 
- const_cast&lt;new-type&gt;(value)
- static_cast&lt;new-type&gt;(value)
- dynamic_cast&lt;new-type&gt;(value)
- reinterpret_cast&lt;new-type&gt;(value)

来规范类型转换。在 C++ 中应尽量使用 C++ 提供的 4 中转换方式进行类型转换。

### const_cast
const_cast 可用于删除 const 标记，以允许修改其内容。例如，如果有一个变量在大多数时间是恒定的，但在某些情况下需要更改，const_cast 转换将很有用。 

### static_cast
static_cast 用于强制隐式转换。如果转换失败，它会引发类型转换错误。可以使用 static_cast 转换各种基本类型的值。例如，从 double 到 int。

### dynamic_cast
它主要用于执行"安全转换"，当转换失败时返回 0 或空指针。

### reinterpret_cast
该运算符对该对象从位模式上进行重新解释。

## const 指针
***  
### Non-constant pointer to constant data
``` cpp
int i1 = 8, i2 = 9;
const int * iptr = &i1;  // non-constant pointer pointing to constant data
// *iptr = 9;   // error: assignment of read-only location
iptr = &i2;  // okay
```

### Constant pointer to non-constant data
``` cpp
int i1 = 8, i2 = 9;
int * const iptr = &i1;  // constant pointer pointing to non-constant data
*iptr = 9;   // okay
// iptr = &i2;  // error: assignment of read-only variable
```

### Constant pointer to constant data
``` cpp
int i1 = 8, i2 = 9;
const int * const iptr = &i1;  // constant pointer pointing to constant data
// *iptr = 9;   // error: assignment of read-only variable
// iptr = &i2;  // error: assignment of read-only variable
```

### Non-constant pointer to non-constant data
``` cpp
int i1 = 8, i2 = 9;
int * iptr = &i1;  // non-constant pointer pointing to non-constant data
*iptr = 9;   // okay
iptr = &i2;  // okay
```