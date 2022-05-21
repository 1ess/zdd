---
title: C Sharp(十七)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog63.jpg
date: 2018/12/04
---

这一篇，介绍一些 C# 中的比较常见的预处理指令。

C 和 C++ 都有实际的预处理阶段，而在 C# 中是没有的，预处理指令是由编译器来处理。
在 Objective-C 中预处理指令也特别常用。

### 基本规则
下面是预处理指令的主要规则: 
- 预处理指令必须与 C# 代码处于不同行
- 包含预处理指令的行必须以 # 开头
  1. \# 字符前可以有空格
  2. \# 字符与预处理指令之间可以有空格
- 允许行尾有单行注释，不可以有多行注释

### #define 和 #undef 指令
编译符号是只有两种状态的标识符。要么被定义，要么未被定义。
编译符号有如下特性: 
- 可以是除了 true 和 false 之外的任何标识符，包括 C# 关键字，以及在 C# 中声明的标识符
- 他没有值，与 C 不同，他不表示字符串

#define 指令声明一个编译符号，#undef 指令取消声明一个编译符号。
``` csharp
#define PremiumVersion
#define EconomyVersion
...

#undef PremiumVersion
```

注意: #define 和 #undef 指令只能用于任何 C# 代码之前，在 C# 代码开始之后，这两个指令就都不可以使用了。

``` csharp
using System;
#define PremiumVersion    //错误，必须出现在所有 C# 代码之前

namespace Eagle
{
    #define PremiumVersion    //错误
}
```

重复定义编译符号也是允许的。

### 条件编译
条件编译允许我们根据某个编译符号是否被定义来标注一段代码被编译或跳过。
有4个指令用来指定条件编译: 
- #if
- #else
- #elif
- #endif

如下: 
``` csharp
#if PremiumVersion
...
#endif

#if (PremiumVersion && LeftHanded)
...
#endif

#if true  //总被编译
...
#endif
```

### 条件编译的结构
如下: 
``` csharp
#if Cond1
...
#elif Cond2
...
#elif Cond3
...
#endif

#if Cond1
...
#else
...
#endif
```

### 诊断指令
下面是诊断指令的语法，注意与 C# 普通字符串不同，Message 无需引号包裹: 
``` csharp
#warning Message
#error Message
```

### 区域指令
区域指令允许我们命名一段代码，#region 指令特性如下: 
- 放置在希望标注的代码段之上
- 在该指令后放置可选字符串作为名字
- 之后的代码由 #endregion 指令终止

VisualStudio 可以显式和隐藏由区域指令包裹的代码段。

``` csharp
#region Constructor
public MyClass()
{

}

public MyClass(string s)
{

}
#endregion
```

### #pragma warning
该指令允许我们关闭和开启警告信息: 
``` csharp
#pragma warning disable 618, 414
...

#pragma warning restore 618
```