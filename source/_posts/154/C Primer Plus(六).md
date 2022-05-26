---
title: C Primer Plus(六)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog154.jpg
date: 2020/07/12
---

上一篇，我们介绍了指针以及指针和数组的关系的基本知识，本篇我们继续讲讲有关指针的其他知识。

## 函数、指针和数组
***  
在传递数组作为函数参数时要特别注意传递的只是指针，如下: 
``` c
#include <stdio.h>

void testArrayParameter(int arr[]);

int main(void) {
    int arr[10] = {1, 2, 3, 4}
    printf("%d", sizeof arr); //40
    testArrayParameter(arr);
    return 0;
}

void testArrayParameter(int arr[]) {
    printf("%d", sizeof arr); //8
}

```

在我们的系统中，指针占用 8 个字节。

int *arr 形式和 int arr[] 形式都表示 arr 是一个指向 int 的指针。但是 int arr[] 只能用于声明形式参数。因为数组名是该数组首元素的地址，作为实际参数的数组名要求形式参数是一个与之匹配的指针。只有在这种情况下，C 才会把 int arr[] 和 int * arr 解释成一样。由于函数原型可以省略参数名，所以下面 4 种原型都是等价的: 
- int sum(int *arr, int n);
- int sum(int *, int);
- int sum(int arr[], int n);
- int sum(int [], int);

从以上分析可知，处理数组的函数实际上用指针作为参数，但是在编写这样的函数时，可以选择是使用数组表示法还是指针表示法。但是，只有当 arr 是指针变量时，才能使用 arr++ 这样的表达式。

## 指针操作
***  
C 提供了一些基本的指针操作，我们接下来演示了 6 种不同的关于指针的操作。
``` c
#include <stdio.h>

int main(void) {
    int urn[5] = { 100, 200, 300, 400, 500 };
    int * ptr1, *ptr2, *ptr3;
    ptr1 = urn;       // 把一个地址赋给指针
    ptr2 = &urn[2];     // 把一个地址赋给指针

    // 解引用指针，以及获得指针的地址
    printf("ptr1 = %p, *ptr1 =%d, &ptr1 = %p\n", ptr1, *ptr1, &ptr1);

    // 指针加法
    ptr3 = ptr1 + 4;
    printf("ptr1 + 4 = %p, *(ptr1 + 4) = %d\n", ptr1 + 4, *(ptr1 + 4));

    // 指针减法
    printf("ptr3 = %p, ptr3 - 2 = %p\n", ptr3, ptr3 - 2);
    
    // 递增指针
    ptr1++;         
    printf("ptr1 = %p, *ptr1 =%d, &ptr1 = %p\n", ptr1, *ptr1, &ptr1);

    // 递减指针
    ptr2--;         
    printf("ptr2 = %p, *ptr2 = %d, &ptr2 = %p\n", ptr2, *ptr2, &ptr2);

    // 一个指针减去另一个指针
    printf("ptr2 + 1 = %p, ptr1 = %p, ptr2 + 1 - ptr1 = %td\n", ptr2 + 1, ptr1, ptr2 + 1 - ptr1);

    return 0;
}
```

下面是我们的系统运行该程序后的输出: 
``` c
ptr1 = 0x7fff5fbff8d0, *ptr1 =100, &ptr1 = 0x7fff5fbff8c8
ptr1 + 4 = 0x7fff5fbff8e0, *(ptr1 + 4) = 500
ptr3 = 0x7fff5fbff8e0, ptr3 - 2 = 0x7fff5fbff8d8
ptr1 = 0x7fff5fbff8d4, *ptr1 =200, &ptr1 = 0x7fff5fbff8c8
ptr2 = 0x7fff5fbff8d4, *ptr2 = 200, &ptr2 = 0x7fff5fbff8c0
ptr2 = 0x7fff5fbff8d8, ptr1 = 0x7fff5fbff8d4, ptr2 - ptr1 = 1
```

## 形式参数使用 const
***  
对于函数参数，通常都是直接传递数值，只有程序需要在函数中改变该数值时，才会传递指针。而对于数组来说，必须传递指针。有时传递地址会导致一些问题，例如无意修改了源数据。在 K&R C 的年代，避免类似错误的唯一方法是提高警惕。ANSI C 提供了一种预防手段。如果函数的意图不是修改数组中的数据内容，那么在函数原型和函数定义中声明形式参数时应使用关键字 const。
``` c
int sum(const int arr[], int n); /* 函数原型 */
int sum(const int arr[], int n) /* 函数定义 */ {
    int i;
    int total = 0;
    for( i = 0; i < n; i++)
        total += arr[i];
    return total;
}
```

以上代码中的 const 告诉编译器，该函数不能修改 arr 指向的数组中的内容。如果在函数中不小心使用类似 arr[i]++ 的表达式，编译器会捕获这个错误，并生成一条错误信息。这里一定要理解，这样使用 const 并不是要求原数组是常量，而是该函数在处理数组时将其视为常量，不可更改。

一般而言，如果编写的函数需要修改数组，在声明数组形参时则不使用 const，如果编写的函数不用修改数组，那么在声明数组形参时最好使用 const。

### const 其他内容
我们在前面使用 const 创建过变量: 
``` c
const double PI = 3.14159;
```

虽然用 #define 指令可以创建类似功能的符号常量，但是 const 的用法更加灵活。可以创建 const 数组、const 指针和指向 const 的指针。
``` c
const int days[MONTHS] = {31,28,31,30,31,30,31,31,30,31,30,31};
```

如果程序稍后尝试改变数组元素的值，编译器将生成一个编译期错误消息: 
``` c
days[9] = 44;   /* 编译错误 */
```

指向 const 的指针不能用于改变值，例如: 
``` c
double rates[5] = {88.99, 100.12, 59.45, 183.11, 340.5};
const double * pd = rates; //使用 const 表明不能使用 pd 来更改它所指向的值
*pd = 29.89;   // 不允许
pd[2] = 222.22;  // 不允许
pd++;             // 允许
```

指向 const 的指针通常用于函数形参中，表明该函数不会使用指针改变数据。

关于指针赋值和 const 需要注意一些规则。
首先，把 const 数据或非 const 数据的地址初始化为指向 const 的指针或为其赋值是合法的: 
``` c
double rates[5] = {88.99, 100.12, 59.45, 183.11, 340.5};
const double locked[4] = {0.08, 0.075, 0.0725, 0.07};
const double * pc = rates; // 有效
pc = locked;         // 有效
pc = &rates[3];       // 有效
```

然而，只能把非 const 数据的地址赋给普通指针: 
``` c
double rates[5] = {88.99, 100.12, 59.45, 183.11, 340.5};
const double locked[4] = {0.08, 0.075, 0.0725, 0.07};
double * pnc = rates; // 有效
pnc = locked;      // 无效
pnc = &rates[3];    // 有效
```

这个规则非常合理。否则，通过指针就能改变 const 数组中的数据。

const 还有其他的用法。例如，可以声明并初始化一个不能指向别处的指针，关键是 const 的位置: 
``` c
double rates[5] = {88.99, 100.12, 59.45, 183.11, 340.5};
double * const pc = rates;  // pc指向数组的开始
pc = &rates[2];       // 不允许，因为该指针不能指向别处
*pc = 92.99;          // 没问题，更改rates[0]的值
```

最后，在创建指针时还可以使用 const 两次，使得该指针既不能更改它所指向的地址，也不能修改指向地址上的值: 
``` c
double rates[5] = {88.99, 100.12, 59.45, 183.11, 340.5};
const double * const pc = rates;
pc = &rates[2];  //不允许
*pc = 92.99;   //不允许
```

## 复合字面量
***  
假设给带 int 类型形参的函数传递一个值，要传递 int 类型的变量，但是也可以传递 int 类型常量，如 5。在 C99 标准以前，对于带数组形参的函数，情况不同，可以传递数组，但是没有等价的数组常量。C99 新增了复合字面量(compound literal)。
对于数组，复合字面量类似数组初始化列表，前面是用括号括起来的类型名。例如: 
``` c
int diva[2] = {10, 20}; // 普通的数组声明
(int [2]){10, 20} // 复合字面量
```

初始化有数组名的数组时可以省略数组大小，复合字面量也可以省略大小，编译器会自动计算数组当前的元素个数。
有了复合字面量，我们在把信息传入函数前不必先创建数组，这是复合字面量的典型用法。