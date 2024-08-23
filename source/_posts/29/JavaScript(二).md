---
title: JavaScript(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog29.jpg
date: 2018/07/22
---

这一篇，我们来学习一下 JavaScript 基本概念中的基本语法以及数据类型。

## 语法
***  
### 区分大小写
ECMAScript 中的一切(标识符，操作符)都是区分大小写的，即大小写敏感的语言。
如: 变量 test 和变量 Test 分别表示两个变量。

### 标识符
所谓标识符，就是指变量，函数，属性名或者函数参数名。标识符格式规则如下: 
- 第一个字符必须是字母、下划线或者 $ 符
- 其他字符可以是字母、数字、下划线或者 $ 符

ECMAScript 标识符采用驼峰命名，这是一种最佳实践。

### 注释
ECMAScript 使用 C 风格的注释: 
- 单行注释: //
- 多行注释: /**/

### 严格模式
ECMAScript 5引入了严格模式(strict mode)的概念。在严格模式下，一些不确定行为将得到处理，对某些不安全操作也会抛出错误。
- 我们可以在整个脚本中启用严格模式，在脚本最顶部添加如下代码: 

``` javascript
"use strict";
```
- 还可以在函数体内包含这条编译指示，指定一个函数在严格模式下执行: 

``` javascript
function doSomething() {
    "use strict";
    //do something
}
```

### 语句
ECMAScript 中的语句以分号结尾，如果省略分号，则由解析器决定语句的结尾。虽然可以省略结尾的分号，但建议任何时候都不要省略，加上分号也可以提高性能，这可以作为一个最佳实践。

我们可以使用 C 风格的语法将多条语句组合到一个代码块，以 { 开头，以 } 结尾。
在条件控制语句中，只有在执行多条语句才要求使用代码块，但最佳实践是任何时候都是用代码块，即使只执行一条语句。

## 关键字和保留字
***  
ECMAScript 有一组特定用途的关键字，不可以用作标识符。
下面时 ECMAScript 全部关键字: 
> break    do    instanceof    typeof    case    else    new    var    catch    finally    return    void    continue    for    switch    while    debugger    function    this    with    default    if    throw    delete    in    try

ECMAScript 还描述了一组保留字，他们还没有特定用途，但有可能将来被用作关键字: 
ES5 非严格模式保留字: 
> class enum extends super const export import

ES5 严格模式还对以下保留字做了限制: 
> implements package public interface private static let protected yield eval arguments

## 变量
***  
ECMAScript 的变量是松散的，即可以用来保存任何类型的数据。定义变量要用 var 操作符，后跟变量名(标识符)，如下: 
``` javascript
var message;
```

该变量可以用来保存任何值(像这样未经初始化的变量，会保存一个特殊值 —— undefined)，ECAMScript 也支持在定义变量时就赋值，如下: 
``` javascript
var message = 'hi';
```

像这样初始化变量并不会把它标记为字符串类型，因此，可以再修改变量值的同时修改类型。
``` javascript
var message = 'hi';
message = 10;    //有效，不推荐
```

我们可以用一条语句声明多个变量，只要把每个变量用逗号分隔。
``` javascript
var message = 'hi', found = false, age = 20;
```

有一点要注意，即用 var 操作符定义的变量将成为定义该变量的作用域的局部变量，如果省略 var 操作符，则定义了一个全局变量。给未经声明的变量赋值在严格模式会导致抛出 ReferenceError。

## 数据类型
***  
ES5 有 5 种简单类型(基本类型): 
- Undefined
- Null
- Boolean
- Number
- String

1 种复杂类型: 
- Object

ECMAScript 不支持自定义类型的机制，最终所有值都是上述 6 种类型之一。

### typeof 操作符
由于 ECAMScript 是松散类型，因此需要一种手段来检测变量的数据类型 —— typeof 操作符。
对一个值使用 typeof 操作符可能返回以下值: 
- "undefined": 如果这个值未定义
- "boolean": 如果这个值是布尔值
- "number": 如果这个值是数值
- "string": 如果这个值是字符串
- "object": 如果这个值是对象或 null
- "function": 如果这个值是函数

注意: typeof 是一个操作符而不是函数，因此可以省略括号。

### Undefined 类型
Undefined 类型只有一个值，即 undefined。
对于未初始化的变量执行 typeof 操作会返回 undefined，对未声明的变量执行 typeof 操作也会返回 undefined。

### Null 类型
Null 类型也是只有一个值的类型，这个特殊值是 null。逻辑上讲，null 表示一个空对象指针，这也是 typeof 操作符检测 null 返回 "object" 的原因。
如果定义的变量将来用来保存对象，那最好将该变量初始化为 null，这样只需要检查对象是否为 null 就可以知道该变量是否已经保存了一个对象的引用。这样做还有助于区分 null 和 undefined。
``` javascript
if (object != null) {
    //do something
}
```

### Boolean 类型
Boolean 类型只有两个字面值: true 和 false。这两个值与数字值不是一回事。
虽然 Boolean 类型字面值只有两个，但所有类型都有与之等价的值。我们可以调用 Boolean() 函数，将一个值转换为对应的布尔值。
转换规则: 

| 数据类型  | 转换 true 值 | 转换 false 值 |
|-----------|--------------|---------------|
| Boolean   | true         | false         |
| String    | 非空字符串   | ""            |
| Number    | 非0数值      | 0和 NaN       |
| Object    | 非 null 对象 | null          |
| Undefined |              | undefined     |

### Number 类型
#### 整数
基本的数值字面量是十进制整数，除了十进制以外，整数还可以通过八进制或十六进制表示。其中，八进制字面值第一位必须是 0，然后是 0-7 的数字序列，如果字面值的数值超出范围，那么就会被当作十进制解析。
``` javascript
var octalNum1 = 070;  //56
var octalNum2 = 079; //79
var octalNum3 = 08; //8
```

注意: 严格模式下，八进制字面量无效，会抛出错误。
十六进制字面值前两位必须是 0x，后面跟十六进制数字(0-9，a-f)。字母大小写都可以。
在进行数字计算时，所有八进制和十六进制表示的数值都将被转换为十进制数。

#### 浮点数
除了整数意以外，JavaScript 还可以使用浮点数，所谓浮点数就是包含有小数点，并且小数点之后必须至少有一位数字。如果小数点之后没有数字，或者浮点数值本身表示一个整数那么该值就被当作整数保存。
``` javascript
var floatNum1 = 1.1;  //1.1
var floatNum2 = 1.0;  //1
var floatNum3 = 1.;  //1
```

**浮点数最高精度是 17 位小数，因此，永远不要测试某个特定的浮点数。**

ECMAScript 能够表示的最小数值保存在 Number.MIN_VALUE 中，最大数值保存在 Number.MAX_VALUE 中。如果计算结果超出可表示的范围，那么结果会自动转换为特殊的 Infinite(无穷)，正数被转换为 Infinite，负数被转换为 -Infinite。Infinite 无法再参与运算。
访问 Number.NEGATIVE_INFINITE 和 Number.POSITIVE_INFINITE 可以得到负和正 infinite。
我们可以通过 IsFinite() 函数确定一个值是否是有穷的，这个函数在参数位于最大值和最小值之间时返回 true。
#### NaN
NaN 即 Not a Number，是一个特殊值，在 ECMAScript 中 0 除以 0 会返回 NaN，正数除以 0 返回 Infinite，负数除以 0 返回 -Infinite。
NaN 有两个特点: 
- 任何涉及 NaN 的操作都会返回 NaN
- NaN 与任何值都不相等包括 NaN 本身

ECMAScript 定义了 isNaN() 函数，这个函数接受一个任意类型的参数，来判断这个参数是否不是数值。任何不能转化为数值的值都会导致返回 true。
``` javascript
isNaN(NaN);  //true
isNaN(10);  //false
isNaN('10');  //false
isNaN('blue');  //true
isNaN(true);  //false
isNaN('123abc');  //true
```

isNaN 函数也适用于对象，基于对象调用 isNaN 时，会首先调用对象的 valueof() 方法，判断返回值是否可以转换为数值，如果不能，再调用对象的 toString() 方法，再测试返回值。

#### 数值转换
有三个函数可以把非数值转换为数值: 
- Number()
- parseInt()
- parseFloat()

第一个函数，即转型函数 Number() 可以用于任何类型，而另外两个函数专门用来转换字符串。这 3 个函数对于同样的输入会返回不同的结果。

Number() 函数转换规则: 
- 如果是布尔类型， true 和 false 会被转换为 1 和 0
- 如果是数字值，则只是简单的传入传出
- 如果是 null，则返回 0
- 如果是 undefined，则返回 NaN
- 如果是字符串，则遵循下面规则: 
  - 如果字符串只包含数字(包括正负号)，则将其转换为十进制数值(忽略前导 0)
  - 如果字符串中包含有效的浮点数格式，则将其转换为对应的浮点数值(忽略前导 0)
  - 如果字符串中包含有效的十六进制格式，则将其转换为相同大小的十进制整数值
  - 如果是空字符串，则转换为 0
  - 如果字符串包含除上述之外的字符串，则转换为 NaN
- 如果是对象，则调用 valueof() 方法，依次按上述规则转换，如果结果为 NaN，再调用 toString() 方法，再次按照上述规则转换。

``` javascript
Number('Hello World!');  //NaN
Number("");  //0
Number('000011');  //11
Number(true);  //1
```

注意: 一元加操作符与 Number() 函数相同，之后介绍。

parseInt() 函数转换规则: 
他会忽略字符串前面的空格，直到找到第一个非空格字符。
- 如果第一个字符不是数字字符或正负号，会返回 NaN(即转换空字符串会返回 NaN)
- 如果第一个字符是数字字符，则会继续解析下一个字符，直到解析完所有字符或者遇到一个非数值字符。
- parseInt 函数可以识别各种进制，如 0x 开头且后跟数字字符，就会被当作一个十六进制整数，如果以 0 开头且后跟数字字符，就会被当作一个八进制整数。(注意 ES5 中，parseInt 不能再解析八进制了，前导 0 被认为无效)

``` javascript
parseInt('1234abc');  //1234
parseInt(22.5);  //22
parseInt('070');  //70
``` 

为了消除 ES3 和 ES5 不同之处，我们一般提供给 parseInt 函数第二个参数，来确定解析的进制。
``` javascript
parseInt('AF', 16);  //175
```

与 parseInt 类似，parseFloat 函数，不同之处在于，他会解析到遇见一个无效的浮点数字符为止，即字符串中的第一个小数点是有效的，而第二个就无效了，之后的字符串都将被忽略。注意: 如果字符串包含的是一个可解析为整数的数值，parseFloat 函数会返回整数。
``` javascript
parseFloat('1234blue');  //1234
parseFloat('0xA');  //0
parseFloat('22.5');  //22.5
parseFloat(22.34.5);  //22.34
parseFloat(0908.5);  //908.5
```

### String 类型
字符串可以用单引号也可以用双引号表示。
ECMAScript 中的字符串是不可变的，即要改变某个变量保存的字符串，要先销毁原来的字符串，然后再用另一个包含新值的字符串填充该变量。

#### 转换字符串
要把一个值转换为字符串有两种方法: 
- toString() 
- String()

数值、布尔值、对象、字符串都有 toString() 方法，null 和 undefined 值没有。
调用数值的 toString 方法时，可以传递参数，来确定输出数值的进制。
``` javascript
var num = 10;
num.toString();  //'10'
num.toString(2);  //'1010'
num.toString(8);  //'12'
num.toString(16);  //'a'
```

我们在不知道要转换的值是否是 null 或 undefined 时，可以使用转型函数 String()，可以将任意类型的值转换为字符串。转换规则: 
- 如果值有 toString 方法，则调用该方法返回
- 如果值为 null，则返回 'null'
- 如果值为 undefined，则返回 'undefined'

### Object 类型
ECMAScript 中对象就是一组数据和功能的集和。对象可以通过 new 操作符后跟要创建的对象类型名称来创建。
``` javascript
var o = new Object();
```
Object 的每个实例都有下列属性和方法: 
- constructor: 用于创建当前对象的构造函数
- hasOwnProperty(propertyName): 检查属性在当前对象的实例中而不是原型中。参数必须是字符串
- isPrototypeOf(object): 检查传入的对象是否是当前对象的原型
- propertyIsEnumerable(propertyName): 检查给定的属性是否能使用 for-in 语句
- toString(): 返回对象的字符串表示
- valueOf(): 返回对象的字符串、数值、布尔值表示