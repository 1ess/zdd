---
title: C Plus Plus From Zero To Hero(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog238.jpg
date: 2022-05-26
---

### 编译和链接
编译是指对一个编译单元进行编译，只要每个编译单元没有问题(即使某个函数只有声明而没有定义也不会报错)，编译阶段就会通过。
链接是指编译单元编译后，对其进行链接，链接阶段会对只有声明而没有定义或多个编译单元重复定义的数据或函数进行检查。

### 类和结构体
类和结构体在 C++ 中没有什么本质区别，只是在默认访问级别中会有不同: 类中成员的默认访问级别是 private，而结构体中成员的默认访问级别是 public。我们通常也可以使用: 
``` cpp
#define struct class
```

## static
***  
### 类外的 static
在类外的数据或方法上使用 static 关键字表示，该数据或函数只在该编译单元中可以访问，编译单元外部无法访问，例如:
``` cpp
// A.cpp
static int a = 10; 

// B.cpp
extern int a;
void B::func(void)
{
    // error: undefined reference to 'a'
    std::cout << a << std::endl;
}
```

### 类内的 static
在类内的数据成员或成员函数上使用 static 关键字表示，该成员需要使用类调用，静态成员函数内部无法使用非静态成员。并且要特别注意: **类内静态数据成员需要在类外再进行定义才能使用**。例如: 
``` cpp
// A.cpp
class A
{
public:
    static int a;
}

// A.cpp
// 必须在类外定义，否则报错 error: undefined reference to A::a
int A::a;

// b.cpp
void B::func(void)
{
    std::cout << A::a << std::endl;
}
```

本质是静态成员变量在类中仅仅是声明而没有定义，所以要在类的外⾯定义，实际上是给静态成员变量分配内存。

静态函数成员必须定义在类内，例如: 
``` cpp
// A.cpp
// error: 'static' can only be specified inside the class definition
static void A::func()
{
    std::cout << "0x7c00";
}

// A.h
class A
{
    // you can do this
    static void func2()
    {
        std::cout << "0x7c00";
    }
}
```

### 局部变量的 static
在局部变量上使用 static 关键字表示，该局部变量在程序整个生命周期都存在，第一次访问时进行初始化，访问作用域局限于该局部变量的作用域。
``` cpp
// A.cpp
void A::func()
{
    static a = 10;
    a++;
    std::cout << a << " ";
}

// B.cpp
void B::func()
{
    A a;
    for (int i = 0; i < 5; i++)
    {
        // 11 12 13 14 15 
        a.func();
    }
}
```

## 指针和引用
***  
### 指针 Pointer
![](https://cdn.0xfee1dead.cn/contentImg/cpp/MemoryAddressContent.png)

指针变量(或简称指针 Pointer)与其他变量基本相同，可以存储一条数据。与存储值的普通变量 int、 double 不同的是，指针存储的是内存地址。

#### 声明指针
与普通变量一样，指针必须在使用前进行声明: 
``` cpp
type *ptr;
// or
type* ptr;
// or
type * ptr;
```

特别注意，声明语句中的 * 不是运算符，而是表示后面的变量是指针变量。

多个变量同时声明时，注意变量类型: 
``` cpp
int *p1, *p2, i;    // p1 and p2 are int pointers. i is an int
int* p1, p2, i;     // p1 is a int pointer, p2 and i are int
int * p1, * p2, i;  // p1 and p2 are int pointers. i is an int
```

指针的命名约定: 包括一个 p 作为前缀或 ptr 作为后缀，例如 pNumber、iPtr。

#### 取址运算符 &
当声明一个指针变量时，与普通变量类似，它没有被初始化。使用前必须为其分配一个有效地址，通过取址 & 运算符初始化该指针: 
``` cpp
int number = 88;     
int * pNumber;       
pNumber = &number;  // 赋值
 
int * pAnother = &number;  // 声明并初始化
```

![](https://cdn.0xfee1dead.cn/contentImg/cpp/PointerDeclaration.png)

#### 解引用运算符 *
解引用运算符对指针进行操作，返回存储在指针变量中保存的地址指向的值。
``` cpp
int number = 88;
int * pNumber = &number;  // pNumber 存储 0x22ccec
cout << pNumber<< endl;   // 0x22ccec
cout << *pNumber << endl; // 88
*pNumber = 99;            
cout << *pNumber << endl; // 99
cout << number << endl;   // 99
```

请注意，符号 * 在声明语句和表达式中具有不同的含义。当它在声明中使用时(例如，int * pNumber)，表示是一个指针变量。而当它用于表达式作为一目运算符(例如，*pNumber = 99)时，表示解引用，指的是指针变量所指向的值。

#### 指针类型
指针与它所指向的值的类型相关联，该类型在声明时指定。指针只能保存声明类型的地址，不能保存不同类型的地址。
``` cpp
int i = 88;
double d = 55.66;
int * iPtr = &i;    // 整型指针
double * dPtr = &d; // 浮点数指针
 
iPtr = &d;   // error 
dPtr = &i;   // error
iPtr = i;    // error 
 
int j = 99;
iPtr = &j;  // ok
```

#### 空指针
将指针初始化为 0 或 NULL，即它不指向任何内容。被称为空指针。解引用空指针( *p)会导致程序异常。
``` cpp
int * iPtr = 0;         // 声明并初始化一个 int 空指针
cout << *iPtr << endl;  // error 
 
int * p = NULL；         // 也可以使用 NULL 声明并初始化空指针
```

``` cpp
// stddef.h
// 标准库中对 NULL 的定义
#if defined (_STDDEF_H) || defined (__need_NULL)
#undef NULL		/* in case <stdio.h> has defined it. */
#if defined(__GNUG__) && __GNUG__ >= 3
#define NULL __null
#else   /* G++ */
#ifndef __cplusplus
#define NULL ((void *)0)
#else   /* C++ */
#ifndef _WIN64
#define NULL 0
#else
#define NULL 0LL
#endif  /* W64 */
#endif  /* C++ */
#endif  /* G++ */
#endif	/* NULL not defined and <stddef.h> or need NULL.  */
#undef	__need_NULL
```

注意: 在声明时初始化一个指向 NULL 的指针是一种很好的软件工程实践。C++11 引入了一个新的关键字 nullptr 来表示空指针。

### 引用 Reference
C++ 添加了引用变量(或简称引用 Reference)。引用的本质是别名。引用的主要用途是充当函数参数以支持按引用传递。在将引用变量传递给函数时，该函数对原始副本起作用。函数内部对引用变量的操作会反映在函数外部。
引用类似于指针。在许多情况下，引用可以用作指针的替代方法，特别是对于函数参数。

#### 声明引用
C++ 用于 & 在表达式中表示取址运算符。在声明变量时 & 表达z声明一个引用变量。
``` cpp
type &newName = existingName;
// or
type& newName = existingName;
// or
type & newName = existingName;
```

我们再来理解一下别名的含义: 
``` cpp
int number = 88;         
int & refNumber = number; 

cout << number << endl;    // 88
cout << refNumber << endl; // 88

refNumber = 99;           
cout << refNumber << endl; // 99
cout << number << endl;    // 99

number = 55;              
cout << number << endl;    // 55
cout << refNumber << endl; // 55
```

引用的命名约定: 包括一个 r 作为前缀，例如 rNumber。

![](https://cdn.0xfee1dead.cn/contentImg/cpp/PointerReferencing.png)

**引用可以被视为一个 const 指针**。

另外，我们要特别注意在不同位置 * 和 & 表达的不同含义区别。

### 指针和引用的区别联系
指针和引用是等价的，除了: 
1. 引用是别名，需要在声明时初始化引用

``` cpp
int & iRef;   //error
```
2. 对指针来说，要获取指针所指向的值，需要使用解引用运算符 *，要将变量的地址分配给指针，您需要使用取址运算符 &。而对引用来说，引用和解引用是隐式完成的。例如，refNumber 是对另一个 int 变量的引用，则 refNumber 直接返回该变量的值。不应显式使用解引用运算符。此外，要将变量的地址分配给引用变量，不需要使用取址运算符

``` cpp
int number1 = 88, number2 = 22;

// 指针
int * pNumber1 = &number1;  
*pNumber1 = 99;             
cout << *pNumber1 << endl;  // 99
cout << &number1 << endl;   // 0x22ff18
cout << pNumber1 << endl;   // 0x22ff18
cout << &pNumber1 << endl;  // 0x22ff10
pNumber1 = &number2;        // 指针重新赋值成另一个地址

// 引用
int & refNumber1 = number1;  
refNumber1 = 11;             
cout << refNumber1 << endl;  // 11
cout << &number1 << endl;    // 0x22ff18
cout << &refNumber1 << endl; // 0x22ff18
refNumber1 = &number2;       // error 引用不能重新赋值成其他地址，即无法转换 int & 到 int *
refNumber1 = number2;        // refNumber1 仍然是 number1 的别名，只不过将 number2 的值赋值给了 refNumber1(number1)
                             
number2++;   
cout << refNumber1 << endl;  // 22
cout << number1 << endl;     // 22
cout << number2 << endl;     // 23
```

### pass by value
C++ 中，默认情况参数是以 value 方式传递(数组除外，被对待为指针)，也就是说，创建参数的副本并将其传递给函数。即在函数内部改变克隆副本不会影响调用方的原始参数。
``` cpp
#include <iostream>
using namespace std;
 
int square(int);
 
int main() {
    int number = 8;
    cout <<  "In main(): " << &number << endl;  // 0x22ff1c
    cout << number << endl;         // 8
    cout << square(number) << endl; // 64
    cout << number << endl;         // 8 不发生变化
}
 
int square(int n) {
    cout <<  "In square(): " << &n << endl;  // 0x22ff00
    n *= n;           // 函数内部修改克隆数据
    return n;
}
```

我们可以看到参数在函数内外是不同地址。

### pass by reference  with pointer arguments
很多情况下，我们也希望直接修改原始副本数据来避免克隆的开销，例如传递很大的对象或数组。可以通过将对象的指针传递给函数来完成该操作。
``` cpp
#include <iostream>
using namespace std;
 
void square(int *);
 
int main() {
    int number = 8;
    cout <<  "In main(): " << &number << endl;  // 0x22ff1c
    cout << number << endl;   // 8
    square(&number);          
    cout << number << endl;   // 64
}
 
void square(int * pNumber) {
    cout <<  "In square(): " << pNumber << endl;  // 0x22ff1c
    *pNumber *= *pNumber;      
}
```

### pass by reference  with reference arguments
除了将指针传递给函数，还可以将引用传递给函数，达到直接修改原始副本数据，而且避免了使用指针产生的笨拙语法。
``` cpp
#include <iostream>
using namespace std;
 
void square(int &);
 
int main() {
    int number = 8;
    cout <<  "In main(): " << &number << endl;  // 0x22ff1c
    cout << number << endl;  // 8
    square(number);          
    cout << number << endl;  // 64
}
 
void square(int & rNumber) {
    cout <<  "In square(): " << &rNumber << endl;  // 0x22ff1c
    rNumber *= rNumber;        
}
```

### const 修饰函数的 reference/pointer 参数
由 const 修饰的参数不能再函数内部被修改，传递参数时尽可能使用 const 修饰，以尽可能地避免在无意中修改参数的情况。
一个 const 修饰的形参可以接收 const 或 non-const 的实参。但是 non-const 的  reference/pointer 形参只能接收 non-const 的实参。
``` cpp
#include <iostream>
using namespace std;
 
int squareConst(const int);
int squareNonConst(int);
int squareConstRef(const int &);
int squareNonConstRef(int &);
 
int main() {
    int number = 8;
    const int constNumber = 9;
    cout << squareConst(number) << endl;
    cout << squareConst(constNumber) << endl;
    cout << squareNonConst(number) << endl;
    cout << squareNonConst(constNumber) << endl;
    
    cout << squareConstRef(number) << endl;
    cout << squareConstRef(constNumber) << endl;
    cout << squareNonConstRef(number) << endl;
    // cout << squareNonConstRef(constNumber) << endl; // error
}
 
int squareConst(const int number) {
    // number *= number;  // error: number 不可变
    return number * number;
}
 
int squareNonConst(int number) {  // non-const parameter
    number *= number;
    return number;
}
 
int squareConstRef(const int & number) {  // const reference
    // number *= number;  // error
    return number * number;
}
 
int squareNonConstRef(int & number) {  // non-const reference
    return number * number;
}
```

### passing the return value as reference
``` cpp
#include <iostream>
using namespace std;
 
int & squareRef(int &);
int * squarePtr(int *);
 
int main() {
    int number1 = 8;
    cout <<  "In main() &number1: " << &number1 << endl;  // 0x22ff14
    int & result = squareRef(number1);
    cout <<  "In main() &result: " << &result << endl;  // 0x22ff14
    cout << result << endl;   // 64
    cout << number1 << endl;  // 64
    
    int number2 = 9;
    cout <<  "In main() &number2: " << &number2 << endl;  // 0x22ff10
    int * pResult = squarePtr(&number2);
    cout <<  "In main() pResult: " << pResult << endl;  // 0x22ff10
    cout << *pResult << endl;   // 81
    cout << number2 << endl;    // 81
}
 
int & squareRef(int & rNumber) {
    cout <<  "In squareRef(): " << &rNumber << endl;  // 0x22ff14
    rNumber *= rNumber;
    return rNumber;
}
 
int * squarePtr(int * pNumber) {
    cout <<  "In squarePtr(): " << pNumber << endl;  // 0x22ff10
    *pNumber *= *pNumber;
    return pNumber;
}
```

### 当 return value by reference 时不要传递本地变量
因为函数的局部变量通过引用作为返回值传回时，本地变量在函数中具有局部范围，它的值在函数退出后被销毁。因此千万不要这样做。而返回一个作为参数传入函数的引用是安全的。
``` cpp
#include <iostream>
using namespace std;
 
int * squarePtr(int);
int & squareRef(int);
 
int main() {
    int number = 8;
    cout << number << endl;  // 8
    cout << *squarePtr(number) << endl;  // ??
    cout << squareRef(number) << endl;   // ??
}
 
int * squarePtr(int number) {
    int localResult = number * number;
    return &localResult; // warning: address of local variable 'localResult' returned
}
 
int & squareRef(int number) {
    int localResult = number * number;
    return localResult; // warning: reference of local variable 'localResult' returned
}
```

### 当 return value by reference 需要传递本地变量时，需要使用动态分配内存的变量
``` cpp
#include <iostream>
using namespace std;
 
int * squarePtr(int);
int & squareRef(int);
 
int main() {
    int number = 8;
    cout << number << endl;  // 8
    cout << *squarePtr(number) << endl;  // 64
    cout << squareRef(number) << endl;   // 64
}
 
int * squarePtr(int number) {
    int * dynamicAllocatedResult = new int(number * number);
    return dynamicAllocatedResult;
}
 
int & squareRef(int number) {
    int * dynamicAllocatedResult = new int(number * number);
    return *dynamicAllocatedResult;
}
```