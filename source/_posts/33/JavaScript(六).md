---
title: JavaScript(六)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog33.jpg
date: 2018/07/26
---

本篇，我们讲一讲 JavaScript 中的重要对象以及常用方法。

## Function 类型概述
***  
ECMAScript 中的函数实际上是对象，每个函数都是 Function 类型的实例，而且都与其他引用类型一样具有属性和方法。函数通常是使用函数声明语法定义的，如下: 
``` javascript
function sum (num1, num2) {
    return num1 + num2;
}
```

这与下面使用函数表达式定义函数的方式几乎相差无几: 
``` javascript
var sum = function (num1, num2) {
    return num1 + num2;
};
```

以上代码定义了变量 sum 并将其初始化为一个函数。
注意: function 关键字后面没有函数名，这是因为在使用函数表达式定义函数时，没有必要使用函数名，我们是通过变量 sum 来引用该函数。另外，还要注意函数末尾有一个分号，就像声明其他变量时一样。
最后一种定义函数的方式是使用 Function 构造函数。Function 构造函数可以接收任意数量的参数，但最后一个参数始终都被看成是函数体，而前面的参数则枚举出了新函数的参数。如下: 
``` javascript
var sum = new Function("num1", "num2", "return num1 + num2");  // 不推荐
```

这种语法会导致解析两次代码(第一次是解析常规 ECMAScript 代码，第二次是解析传入构造函数中的字符串)，从而影响性能。

由于函数名仅仅是指向函数的指针，因此函数名与包含对象指针的其他变量没有什么不同。换句话说，一个函数可能会有多个名字，如下: 
``` javascript
function sum (num1, num2) {
    return num1 + num2;
}
alert(sum(10, 10));        //20

var anotherSum = sum;
alert(anotherSum(10, 10)); //20

sum = null;
alert(anotherSum(10, 10)); //20
```

## 没有重载
***  
之前我们说过 ECMAScript 没有重载，因为函数也是对象。
``` javascript
function addSomeNumber(num) {
    return num + 100;
}

function addSomeNumber(num) {
    return num + 200;
}

var result = addSomeNumber(100); //300
```

这个例子中声明了两个同名函数，而结果则是后面的函数覆盖了前面的函数。以上代码实际上与下面的代码没有什么区别。
``` javascript
var addSomeNumber = function (num) {
    return num + 100;
};

addSomeNumber = function (num) {
    return num + 200;
};

var result = addSomeNumber(100); //300
```

## 函数声明与函数表达式
***  
实际上，解析器在向执行环境中加载数据时，对函数声明和函数表达式是区别对待的。解析器会率先读取函数声明，并使其在执行任何代码之前可用(可以访问); 至于函数表达式，则必须等到解析器执行到它所在的代码行，才会真正被解释执行。
``` javascript
alert(sum(10, 10));
function sum (num1, num2) {
    return num1 + num2;
}
```

以上代码完全可以正常运行。在代码开始执行之前，解析器就已经通过一个名为函数声明提升(function declaration hoisting)的过程，读取并将函数声明添加到执行环境中。对代码求值时，JavaScript 引擎在第一遍会声明函数并将它们放到源代码树的顶部。所以，即使声明函数的代码在调用它的代码后面，JavaScript 引擎也能把函数声明提升到顶部。
把上面的函数声明改为等价的函数表达式，就会在执行期间导致错误。
``` javascript
alert(sum(10, 10));
var sum = function (num1, num2) {
    return num1 + num2;
};
```

原因在于函数位于一个初始化语句中，而不是一个函数声明。换句话说，在执行到函数所在的语句之前，变量 sum 中不会保存有对函数的引用。

## 作为值的函数
***  
因为 ECMAScript 中的函数名本身就是变量，所以函数也可以作为值来使用。也就是说，不仅可以像传递参数一样把一个函数传递给另一个函数，而且可以将一个函数作为另一个函数的结果返回。
``` javascript
function callSomeFunction(someFunction, someArgument) {
    return someFunction(someArgument);
}
function add10(num) {
    return num + 10;
}

var result1 = callSomeFunction(add10, 10);
alert(result1);   //20
```

## 函数内部属性
***  
在函数内部，有两个特殊的对象: arguments 和 this。其中，arguments 之前说过，它是一个类数组对象，包含着传入函数中的所有参数。这个对象还有一个名叫 callee 的属性，该属性是一个指针，指向拥有这个 arguments 对象的函数。
``` javascript
function factorial(num) {
    if (num <=1) {
        return 1;
    } else {
        return num * factorial(num-1)
    }
}
```

我们可以使用 callee 消除与函数名的耦合。
``` javascript
function factorial(num) {
    if (num <=1) {
        return 1;
    } else {
        return num * arguments.callee(num-1)
    }
}
```

这样，无论引用函数时使用的是什么名字，都可以保证正常完成递归调用。例如: 
``` javascript
var trueFactorial = factorial;

factorial = function() {
    return 0;
};

alert(trueFactorial(5));     //120
alert(factorial(5));         //0
```

函数内部的另一个特殊对象是 this，其行为与 Java 和 C# 中的 this 大致类似。换句话说，this 引用的是函数据以执行的环境对象——或者也可以说是 this 值(当在网页的全局作用域中调用函数时，this 对象引用的就是 window)。
``` javascript
window.color = "red";
var o = { color: "blue" };

function sayColor() {
    alert(this.color);
}

sayColor();     //"red"

o.sayColor = sayColor;
o.sayColor();   //"blue"
```

上面这个函数 sayColor() 是在全局作用域中定义的，它引用了 this 对象。由于在调用函数之前，this 的值并不确定，因此 this 可能会在代码执行过程中引用不同的对象。当在全局作用域中调用 sayColor() 时，this 引用的是全局对象 window，换句话说，对 this.color 求值会转换成对 window.color 求值，于是结果就返回了 "red"。而当把这个函数赋给对象 o 并调用 o.sayColor() 时，this 引用的是对象 o，因此对 this.color 求值会转换成对 o.color 求值，结果就返回了 "blue"。
注意: 函数的名字仅仅是一个包含指针的变量而已。因此，即使是在不同的环境中执行，全局的 sayColor() 函数与 o.sayColor() 指向的仍然是同一个函数。

ECMAScript 5 也规范化了另一个函数对象的属性: caller。这个属性中保存着调用当前函数的函数的引用，如果是在全局作用域中调用当前函数，它的值为 null。
``` javascript
function outer() {
    inner(); 
}

function inner() {
    alert(inner.caller);
}

outer();
```

以上代码会导致警告框中显示 outer() 函数的源代码。因为 outer() 调用了 inter()，所以 inner.caller 就指向 outer()。
当函数在严格模式下运行时，访问 arguments.callee 会导致错误。ECMAScript 5 还定义了 arguments.caller 属性，但在严格模式下访问它也会导致错误，而在非严格模式下这个属性始终是 undefined。定义这个属性是为了分清 arguments.caller 和函数的 caller 属性。

## 函数属性和方法
***  
ECMAScript 中的函数是对象，因此函数也有属性和方法。每个函数都包含两个属性: length 和 prototype。其中，length 属性表示函数希望接收的命名参数的个数: 
``` javascript
function sayName(name) {
    alert(name);
}      

function sum(num1, num2) {
    return num1 + num2;
}

function sayHi() {
    alert("hi");
}

alert(sayName.length);      //1
alert(sum.length);          //2
alert(sayHi.length);        //0
```

对于 ECMAScript 中的引用类型而言，prototype 是保存它们所有实例方法的真正所在。换句话说，诸如 toString() 和 valueOf() 等方法实际上都保存在 prototype 名下，只不过是通过各自对象的实例访问罢了。在创建自定义引用类型以及实现继承时，prototype 属性的作用是极为重要的。在 ECMAScript 5中， prototype 属性是不可枚举的，因此使用 for-in 无法发现。
每个函数都包含两个非继承而来的方法: apply() 和 call()。这两个方法的用途都是在特定的作用域中调用函数，实际上等于设置函数体内 this 对象的值。
首先，apply() 方法接收两个参数: 一个是在其中运行函数的作用域，另一个是参数数组。其中，第二个参数可以是 Array 的实例，也可以是 arguments 对象。
``` javascript
function sum(num1, num2) {
    return num1 + num2;
}

function callSum1(num1, num2) {
    return sum.apply(this, arguments);        // 传入arguments对象
}

function callSum2(num1, num2) {
    return sum.apply(this, [num1, num2]);    // 传入数组
}

alert(callSum1(10, 10));   //20
alert(callSum2(10, 10));   //20
```

在严格模式下，未指定环境对象而调用函数，则 this 值不会转型为 window。除非明确把函数添加到某个对象或者调用 apply() 或 call()，否则 this 值将是 undefined。
call() 方法与 apply() 方法的作用相同，它们的区别仅在于接收参数的方式不同。对于 call() 方法而言，第一个参数是 this 值没有变化，变化的是其余参数都直接传递给函数。换句话说，在使用 call() 方法时，传递给函数的参数必须逐个列举出来: 
``` javascript
function sum(num1, num2) {
    return num1 + num2;
}

function callSum(num1, num2) {
    return sum.call(this, num1, num2);
}

alert(callSum(10, 10));   //20
```

决定使用 apply() 还是 call()，完全取决于你采取哪种给函数传递参数的方式最方便。如果你打算直接传入 arguments 对象，或者包含函数中先接收到的也是一个数组，那么使用 apply() 肯定更方便，否则，选择 call() 可能更合适。

事实上，传递参数并非 apply() 和 call() 真正的用武之地，它们真正强大的地方是能够扩充函数赖以运行的作用域。
``` javascript
window.color = "red";
var o = { color: "blue" };

function sayColor(){
    alert(this.color);
}

sayColor();                //red

sayColor.call(this);       //red
sayColor.call(window);     //red
sayColor.call(o);          //blue
```

使用 call()(或 apply())来扩充作用域的最大好处，就是对象不需要与方法有任何耦合关系。在前面例子的第一个版本中，我们是先将 sayColor() 函数放到了对象 o 中，然后再通过 o 来调用它的，而在这里重写的例子中，就不需要先前那个多余的步骤了。
ECMAScript 5 还定义了一个方法: bind()。这个方法会创建一个函数的实例，其 this 值会被绑定到传给 bind() 函数的值。
``` javascript
window.color = "red";
var o = { color: "blue" };

function sayColor(){
    alert(this.color);
} 
var objectSayColor = sayColor.bind(o);
objectSayColor();    //blue
```

每个函数继承的 toLocaleString()、toString() 和 valueOf() 方法始终都返回函数的代码，返回代码的格式则因浏览器而异。

## 基本包装类型概述
***  
为了便于操作基本类型值，ECMAScript 还提供了3个特殊的引用类型: Boolean、Number 和 String。
实际上，每当读取一个基本类型值的时候，后台就会创建一个对应的基本包装类型的对象，从而让我们能够调用一些方法来操作这些数据。如: 
``` javascript
var s1 = "some text";
var s2 = s1.substring(2);
```

这个例子中的变量 s1 包含一个字符串，字符串当然是基本类型值。而下一行调用了 s1 的 substring() 方法，并将返回的结果保存在了 s2 中。我们知道，基本类型值不是对象，因而从逻辑上讲它们不应该有方法。
其实，为了让我们实现这种直观的操作，后台已经自动完成了一系列的处理。当第二行代码访问 s1 时，访问过程处于一种读取模式，也就是要从内存中读取这个字符串的值。而在读取模式中访问字符串时，后台都会自动完成下列处理。
1. 创建 String 类型的一个实例
2. 在实例上调用指定的方法
3. 销毁这个实例

可以将以上三个步骤想象成是执行了下列 ECMAScript 代码: 
``` javascript
var s1 = new String("some text");
var s2 = s1.substring(2);
s1 = null;
```

上面这三个步骤也分别适用于 Boolean 和 Number 类型对应的布尔值和数字值。
引用类型与基本包装类型的主要区别就是**对象的生存期。**
- 使用 new 操作符创建的引用类型的实例，在执行流离开当前作用域之前都一直保存在内存中
- 自动创建的基本包装类型的对象，则只存在于一行代码的执行瞬间，然后立即被销毁

这意味着我们不能在运行时为基本类型值添加属性和方法。

可以显式地调用 Boolean、Number 和 String 来创建基本包装类型的对象。但一般不这么做。
对基本包装类型的实例调用 typeof 会返回 "object"，而且所有基本包装类型的对象都会被转换为布尔值 true。

Object 构造函数也会像工厂方法一样，根据传入值的类型返回相应基本包装类型的实例。
``` javascript
var obj = new Object("some text");
alert(obj instanceof String);   //true
```

要注意的是，使用 new 调用基本包装类型的构造函数，与直接调用同名的转型函数是不一样的: 
``` javascript
var value = "25";
var number = Number(value);  //转型函数
alert(typeof number);        //"number"

var obj = new Number(value); //构造函数
alert(typeof obj);           //"object"
```

### Boolean 类型
Boolean 类型是与布尔值对应的引用类型。要创建 Boolean 对象，可以像下面这样调用 Boolean 构造函数并传入 true 或 false 值。
``` javascript
var booleanObject = new Boolean(true);
```

Boolean 类型的实例重写了 valueOf() 方法，返回基本类型值 true 或 false，重写了 toString() 方法，返回字符串 "true" 和 "false"。
**注意: 布尔表达式中的所有对象都会被转换为 true。**

基本类型与引用类型的布尔值还有两个区别: 
- typeof 操作符对基本类型返回 "boolean"，而对引用类型返回 "object"。
- 由于 Boolean 对象是 Boolean 类型的实例，所以使用 instanceof 操作符测试 Boolean 对象会返回 true，而测试基本类型的布尔值则返回 false。

**建议: 永远不要使用 Boolean 对象。**

### Number 类型
Number 是与数字值对应的引用类型。要创建 Number 对象，可以在调用 Number 构造函数时向其中传递相应的数值。
``` javascript
var numberObject = new Number(10);
```

Number 类型也重写了 valueOf()、toLocaleString() 和 toString() 方法。重写后的 valueOf() 方法返回对象表示的基本类型的数值，另外两个方法则返回字符串形式的数值，并且，toString() 方法可以传递一个表示基数的参数，告诉它返回几进制数值的字符串形式: 
``` javascript
var num = 10;
alert(num.toString());      //"10"
alert(num.toString(2));     //"1010"
alert(num.toString(8));     //"12"
alert(num.toString(10));    //"10"
alert(num.toString(16));    //"a"
```

Number 类型还提供了一些用于将数值格式化为字符串的方法。
- toFixed() 方法会按照指定的小数位返回数值的字符串表示: 

``` javascript
var num = 10;
alert(num.toFixed(2));     //"10.00"
```

如果数值本身包含的小数位比指定的还多，那么接近指定的最大小数位的值 4 舍 5 入: 
``` javascript
var num1 = 10.005;
alert(num1.toFixed(2));     //"10.01"

var num2 = 10.004;
alert(num2.toFixed(2));    //"10.00"
```
- toExponential() 方法返回以指数表示法表示的数值的字符串形式，toExponential() 也接收一个参数，用于指定输出结果中的小数位数: 

``` javascript
var num = 10;
alert(num.toExponential(1));     //"1.0e+1"
```
- toPrecision() 方法可能会返回固定大小(fixed)格式，也可能返回指数(exponential)格式，具体规则是看哪种格式最合适。这个方法接收一个参数，即表示数值的所有数字的位数: 

``` javascript
var num = 99;
alert(num.toPrecision(1));     //"1e+2"
alert(num.toPrecision(2));     //"99"
alert(num.toPrecision(3));     //"99.0"
```

以上代码首先完成的任务是以一位数来表示 99，结果是 "1e+2"，即 100。因为一位数无法准确地表示 99，因此 toPrecision() 就将它向上舍入为 100，这样就可以使用一位数来表示它了。而接下来的用两位数表示 99，当然还是 "99"。最后，在想以三位数表示 99 时，toPrecision() 方法返回了 "99.0"。实际上，toPrecision() 会根据要处理的数值决定到底是调用 toFixed() 还是调用 toExponential()。

## String 类型
***  
String 类型是字符串的对象包装类型，可以像下面这样使用 String 构造函数来创建: 
``` javascript
var stringObject = new String("hello world");
```

String 对象的方法也可以在所有基本的字符串值中访问到。其中，继承的 valueOf()、toLocaleString() 和 toString() 方法，都返回对象所表示的基本字符串值。
String 类型的每个实例都有一个 length 属性，表示字符串中包含字符个数。
注意: 使字符串中包含双字节字符(不是占一个字节的 ASCII 字符)，每个字符也仍然算一个字符。

String 类型提供了很多方法，用于辅助完成对 ECMAScript 中字符串的解析和操作。

### 字符方法
两个用于访问字符串中特定字符的方法是: 
- charAt()
- charCodeAt()

这两个方法都接收一个参数，即基于 0 的字符位置。
其中，charAt() 方法以单字符字符串的形式返回给定位置的那个字符(**ECMAScript 中没有字符类型**): 
``` javascript
var stringValue = "hello world";
alert(stringValue.charAt(1));   //"e"
```

如果你想得到的不是字符而是字符编码，那么就要使用 charCodeAt(): 
``` javascript
var stringValue = "hello world";
alert(stringValue.charCodeAt(1));   //输出"101"
```

ECMAScript 5还定义了另一个访问个别字符的方法，使用方括号加数字索引来访问字符串中的特定字符: 
``` javascript
var stringValue = "hello world";
alert(stringValue[1]);   //"e"
```

### 字符串操作方法
- concat() 用于将一或多个字符串拼接起来，返回拼接得到的新字符串: 

``` javascript
var stringValue = "hello ";
var result = stringValue.concat("world");
alert(result);             //"hello world"
alert(stringValue);        //"hello"
```

concat() 方法可以接受任意多个参数，也就是说可以通过它拼接任意多个字符串。
虽然 concat() 是专门用来拼接字符串的方法，但实践中使用更多的还是加号操作符。

- slice() 方法会返回被操作字符串的一个子字符串，接受一或两个参数。第一个参数指定子字符串的开始位置，第二个参数(在指定的情况下)表示子字符串到哪里结束。**第二个参数指定的是子字符串最后一个字符后面的位置**: 

``` javascript
var stringValue = "hello world";
alert(stringValue.slice(3));            //"lo world"
alert(stringValue.slice(3, 7));         //"lo w"
```
- substring() 方法与 slice() 方法一样: 

``` javascript
var stringValue = "hello world";
alert(stringValue.substring(3));        //"lo world"
alert(stringValue.substring(3, 7));      //"lo w"
```
- substr() 方法会返回被操作字符串的一个子字符串，接受一或两个参数。第一个参数指定子字符串的开始位置，第二个参数指定的则是返回的字符个数: 

``` javascript
var stringValue = "hello world";
alert(stringValue.substr(3));           //"lo world"
alert(stringValue.substr(3, 7));        //"lo worl"
```

### 字符串位置方法
有两个可以从字符串中查找子字符串的方法: indexOf() 和 lastIndexOf()。这两个方法都是从一个字符串中搜索给定的子字符串，然后返子字符串的位置(如果没有找到该子字符串，则返回 -1)。
这两个方法的区别在于: indexOf() 方法从字符串的开头向后搜索子字符串，而 lastIndexOf() 方法是从字符串的末尾向前搜索子字符串: 
``` javascript
var stringValue = "hello world";
alert(stringValue.indexOf("o"));             //4
alert(stringValue.lastIndexOf("o"));         //7
```

这两个方法都可以接收可选的第二个参数，表示从字符串中的哪个位置开始搜索。

### trim() 方法
ECMAScript 5 为所有字符串定义了 trim() 方法。这个方法会创建一个字符串的副本，删除前置及后缀的所有空格，然后返回结果: 
``` javascript
var stringValue = "   hello world   ";
var trimmedStringValue = stringValue.trim();
alert(stringValue);            //"   hello world   "
alert(trimmedStringValue);     //"hello world" 
```

### 字符串大小写转换方法
ECMAScript 中涉及字符串大小写转换的方法有 4 个: 
- toLowerCase()
- toLocaleLowerCase()
- toUpperCase()
- toLocaleUpperCase()

其中，toLowerCase() 和 toUpperCase() 是两个经典的方法，借鉴自 java.lang.String 中的同名方法。而 toLocaleLowerCase() 和 toLocaleUpperCase() 方法则是针对特定地区的实现。
``` javascript
var stringValue = "hello world";
alert(stringValue.toLocaleUpperCase());  //"HELLO WORLD"
alert(stringValue.toUpperCase());        //"HELLO WORLD"
alert(stringValue.toLocaleLowerCase());  //"hello world"
alert(stringValue.toLowerCase());        //"hello world"
```

### localeCompare() 方法
这个方法比较两个字符串，并返回下列值中的一个: 
- 如果字符串在字母表中应该排在字符串参数之前，则返回一个负数(大多数情况下是 -1，具体的值要视实现而定)
- 如果字符串等于字符串参数，则返回 0
- 如果字符串在字母表中应该排在字符串参数之后，则返回一个正数(大多数情况下是 1，具体的值同样要视实现而定)

``` javascript
var stringValue = "yellow";       
alert(stringValue.localeCompare("brick"));         //1
alert(stringValue.localeCompare("yellow"));        //0
alert(stringValue.localeCompare("zoo"));           //-1
```

## 单体内置对象
***  
单体内置对象是由 ECMAScript 实现提供的、不依赖于宿主环境的对象，这些对象在 ECMAScript 程序执行之前就已经存在了。
意思就是说，开发人员不必显式地实例化内置对象，因为它们已经实例化了。
前面我们说的 Object、Array 和 String 都是内置对象。
ECMA-262 还定义了两个单体内置对象: Global 和 Math。

## Global 对象
***  
Global(全局)对象可以说是 ECMAScript 中最特别的一个对象了。不属于任何其他对象的属性和方法，最终都是它的属性和方法。事实上，没有全局变量或全局函数，所有在全局作用域中定义的属性和函数，都是 Global 对象的属性。本书前面介绍过的那些函数，诸如 isNaN()、isFinite()、parseInt() 以及 parseFloat()，实际上全都是 Global 对象的方法。

### URI 编码方法
Global 对象的 encodeURI() 和 encodeURIComponent() 方法可以对 URI 进行编码，以便发送给浏览器。
**这两个 URI 编码方法可以对 URI 进行编码，它们用特殊的 UTF-8 编码替换所有无效的字符，从而让浏览器能够接受和理解。**
- encodeURI() 主要用于整个 URI
- encodeURIComponent() 主要用于对 URI 中的某一段

它们的主要区别在于: 
- encodeURI() 不会对本身属于 URI 的特殊字符进行编码，例如冒号、正斜杠、问号和井字号
- encodeURIComponent() 则会对它发现的任何非标准字符进行编码

``` javascript
var uri = "http://www.wrox.com/illegal value.htm#start";

//"http://www.wrox.com/illegal%20value.htm#start"
alert(encodeURI(uri));

//"http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start"
alert(encodeURIComponent(uri));
```

**一般来说，我们使用 encodeURIComponent() 方法的时候要比使用 encodeURI() 更多，因为在实践中更常见的是对查询字符串参数而不是对基础URI进行编码。**

与 encodeURI() 和 encodeURIComponent() 方法对应的两个方法分别是 decodeURI() 和 decodeURIComponent(): 
``` javascript
var uri = "http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.htm%23start";

//http%3A%2F%2Fwww.wrox.com%2Fillegal value.htm%23start
alert(decodeURI(uri));

//http://www.wrox.com/illegal value.htm#start
alert(decodeURIComponent(uri));
```

### eval() 方法
eval() 方法就像是一个完整的 ECMAScript 解析器，它只接受一个参数，即要执行的 ECMAScript(或 JavaScript)字符串: 
``` javascript
eval("alert('hi')");
//等价于
alert("hi");
```

当解析器发现代码中调用 eval() 方法时，它会将传入的参数当作实际的 ECMAScript 语句来解析，然后把执行结果插入到原位置。

### Global 对象的属性
Global 对象还包含一些属性，例如，特殊的值 undefined、NaN 以及 Infinity 都是 Global 对象的属性。此外，所有原生引用类型的构造函数，像 Object 和 Function，也都是Global对象的属性。
ECMAScript 5 明确禁止给 undefined、NaN 和 Infinity 赋值，这样做即使在非严格模式下也会导致错误。

## window 对象
***  
ECMAScript 虽然没有指出如何直接访问 Global 对象，但 Web 浏览器都是将这个全局对象作为 window 对象的一部分加以实现的。因此，在全局作用域中声明的所有变量和函数，就都成为了 window 对象的属性: 
``` javascript
var color = "red";

function sayColor(){
    alert(window.color);
}

window.sayColor();  //"red"
```

另一种取得 Global 对象的方法是使用以下代码: 
``` javascript
var global = function(){
    return this; 
}();
```

在没有给函数明确指定 this 值的情况下(无论是通过将函数添加为对象的方法，还是通过调用 call() 或 apply())，this 值等于 Global 对象。

## Math 对象
***  
ECMAScript 还为保存数学公式和信息提供了一个公共位置，即 Math 对象。

### min() 和 max() 方法
min() 和 max() 方法用于确定一组数值中的最小值和最大值。这两个方法都可以接收任意多个数值参数: 
``` javascript
var max = Math.max(3, 54, 32, 16);
alert(max);    //54

var min = Math.min(3, 54, 32, 16);
alert(min);    //3
```

要找到数组中的最大或最小值，可以像下面这样使用 apply() 方法: 
``` javascript
var values = [1, 2, 3, 4, 5, 6, 7, 8];
var max = Math.max.apply(Math, values);
```

### 舍入方法
Math.ceil()、Math.floor() 和 Math.round()。这三个方法分别遵循下列舍入规则: 
- Math.ceil() 执行向上舍入，即它总是将数值向上舍入为最接近的整数
- Math.floor() 执行向下舍入，即它总是将数值向下舍入为最接近的整数
- Math.round() 执行标准舍入，即它总是将数值四舍五入为最接近的整数

``` javascript
alert(Math.ceil(25.9));     //26
alert(Math.ceil(25.5));     //26
alert(Math.ceil(25.1));     //26

alert(Math.round(25.9));    //26
alert(Math.round(25.5));    //26
alert(Math.round(25.1));    //25

alert(Math.floor(25.9));    //25
alert(Math.floor(25.5));    //25
alert(Math.floor(25.1));    //25
```

### random() 方法
Math.random() 方法返回介于 0 和 1 之间一个随机数，不包括 0 和 1。
套用下面的公式，就可以利用 Math.random() 从某个整数范围内随机选择一个值: 
> 值 = Math.floor(Math.random() * 可能值的总数 + 第一个可能的值)

如果你想选择一个 1 到 10 之间的数值，可以像下面这样编写代码: 
``` javascript
var num = Math.floor(Math.random() * 10 + 1);
```