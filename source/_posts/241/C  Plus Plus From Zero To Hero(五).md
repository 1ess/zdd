---
title: C Plus Plus From Zero To Hero(五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog241.jpg
date: 2022-06-02
---

## 模板和泛型编程
通常我们向一个函数传递值或变量，对于模板来说，我们向其传递**类型**。这就被称为泛型编程。使用用通用类型编程，并使用特定类型来执行代码。
泛型编程的目标是编写**独立于数据类型**的代码。例如在 C 语言中，所有的代码都与特定的数据类型相联系，对于容器数据结构(如数组、结构体)，需要指定元素的类型。
模板让你在通用类型而不是在特定类型上编程，模板支持所谓的参数化类型。也就是说，可以在创建类或函数时使用类型作为参数(在类模板或函数模板中)。C++ 的标准模板库(STL)提供了许多容器类的模板实现，如 vector。

### STL vector 类
C/C++ 内置数组有很多缺点: 
1. 内置数组大小固定，需要在声明时就分配大小，不能在执行期间扩展数组大小
2. 内置数组不提供索引越界检查

因为这些问题，C++ 在 STL 中提供了一个 vector 模板类，可以用类型实例化，例如: vector<int>、vector<double>、vector<string> 等，同一个模板类可用于处理多种类型，而不是为每种类型重复编写代码。

### 函数模板
函数模板是泛型函数，编译器将为使用的每种特定类型生成一个函数。因为函数参数中使用了类型，所以它们也被称为**参数化类型**。
定义函数模板的语法为: 
``` cpp
template <typename T> 
// or
template <class T>
return-type function-name(function-parameter-list) { ...... }
```

例如: 
``` cpp
#include <iostream>
using namespace std;
 
template <typename T>
void mySwap(T &a, T &b);
    // Swap two variables of generic type passed-by-reference
    // There is a version of swap() in <iostream>
 
int main() {
    int i1 = 1, i2 = 2;
    mySwap(i1, i2);   // Compiler generates mySwap(int &, int &)
    cout << "i1 is " << i1 << ", i2 is " << i2 << endl;
    
    char c1 = 'a', c2 = 'b';
    mySwap(c1, c2);   // Compiler generates mySwap(char &, char &)
    cout << "c1 is " << c1 << ", c2 is " << c2 << endl;
    
    double d1 = 1.1, d2 = 2.2;
    mySwap(d1, d2);   // Compiler generates mySwap(double &, double &)
    cout << "d1 is " << d1 << ", d2 is " << d2 << endl;
 
    // mySwap(i1, d1); // error
}
 
template <typename T>
void mySwap(T &a, T &b) {
    T temp;
    temp = a;
    a = b;
    b = temp;
}
```

使用函数模板在执行速度或内存使用方面没有任何改进。但是工作效率、易用性和易维护性都有很大的提高。

### 类模板
定义类模板的语法如下: 
``` cpp
template <class T > 
// or
template <typename T> 
class ClassName { 
   ...... 
}
```

在使用定义的类模板时，语法为: 
``` cpp
ClassName<actual-type>
```

例如: 
``` cpp
#include <iostream>
using namespace std;
 
template <typename T>
class Number {
private:
    T value;
public:
    Number(T value) { this->value = value; };
    T getValue() { return value; }
    void setValue(T value) { this->value = value; };
};
 
int main() {
    Number<int> i(55);
    cout << i.getValue() << endl;
    
    Number<double> d(55.66);
    cout << d.getValue() << endl;
    
    Number<char> c('a');
    cout << c.getValue() << endl;
    
    Number<string> s("Hello");
    cout << s.getValue() << endl;
}
```

### 其他
#### 多个类型参数
模板可以有多个类型参数，语法为: 
``` cpp
template <typename T1, typename T2, ....>
class ClassName { ...... }
```

#### 默认类型
类型可以赋予默认值，语法为: 
``` cpp
template <typename T = int>
class ClassName { ...... }
```
使用默认类型进行实例化时，使用: 
``` cpp
ClassName<>
```