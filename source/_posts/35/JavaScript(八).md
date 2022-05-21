---
title: JavaScript(八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog35.jpg
date: 2018/08/28
---

这一篇，我们介绍一下函数表达式。
之前说过，定义函数的方式有两种: 一种是函数声明，另一种就是函数表达式。

函数表达式有几种不同的语法形式。下面是最常见的一种形式: 
``` javascript
var functionName = function(arg0, arg1, arg2){
    //函数体 
};
```

这种形式看起来好像是常规的变量赋值语句，即创建一个函数并将它赋值给变量 functionName。这种情况下创建的函数叫做匿名函数(anonymous function)，因为 function 关键字后面没有标识符。

在把函数当成值来使用的情况下，都可以使用匿名函数。不过，这并不是匿名函数唯一的用途。

## 递归
***  
递归函数是在一个函数通过名字调用自身的情况: 
``` javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num-1);
    }
}
```

虽然这个函数表面看来没什么问题，但下面的代码却可能导致它出错。
``` javascript
var anotherFactorial = factorial;
factorial = null;
alert(anotherFactorial(4)); //出错！
```

之前也说过，arguments.callee 是一个指向正在执行的函数的指针，因此可以用它来实现对函数的递归调用，例如: 
``` javascript
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num-1);
    }
}
```

但在严格模式下，不能通过脚本访问 arguments.callee，访问这个属性会导致错误。不过，可以使用命名函数表达式来达成相同的结果: 
``` javascript
var factorial = (function f(num) {
    if (num <= 1) { 
        return 1;
    } else {
        return num * f(num-1);
    }
});
```

这种方式在严格模式和非严格模式下都行得通。

## 闭包
***  
有不少开发人员总是搞不清匿名函数和闭包这两个概念。
**闭包是指有权访问另一个函数作用域中的变量的函数。**
创建闭包的常见方式，就是在一个函数内部创建另一个函数: 
``` javascript
function createComparisonFunction(propertyName) {

    return function(object1, object2) {
        var value1 = object1[propertyName];
        var value2 = object2[propertyName];

        if (value1 < value2) {
            return -1;
        } else if (value1 > value2) {
            return 1;
        } else {
            return 0;
        }
    };
}
```

当某个函数第一次被调用时，会创建一个执行环境(execution context)及相应的作用域链，并把作用域链赋值给一个特殊的内部属性(即[[Scope]])。然后，使用 this、arguments 和其他命名参数的值来初始化函数的活动对象(activation object)。但在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，直至作为作用域链终点的全局执行环境。

无论什么时候在函数中访问一个变量时，就会从作用域链中搜索具有相应名字的变量。一般来讲，当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局作用域(全局执行环境的变量对象)。但是，闭包的情况又有所不同。
在另一个函数内部定义的函数会将包含函数(即外部函数)的活动对象添加到它的作用域链中。这样，匿名函数就可以访问在 createComparisonFunction() 中定义的所有变量。更为重要的是，createComparisonFunction() 函数在执行完毕后，其活动对象也不会被销毁，因为匿名函数的作用域链仍然在引用这个活动对象。

### 闭包与变量
作用域链的这种配置机制引出了一个值得注意的副作用，即闭包只能取得包含函数中任何变量的最后一个值。
``` javascript
function createFunctions() {
    var result = new Array();

    for (var i=0; i < 10; i++) {
        result[i] = function() {
            return i;
        };
    }

    return result;
} 
```

这个函数会返回一个函数数组。表面上看，似乎每个函数都应该返自己的索引值，即位置 0 的函数返回 0，位置 1 的函数返回 1，以此类推。但实际上，每个函数都返回 10。因为每个函数的作用域链中都保存着 createFunctions() 函数的活动对象，所以它们引用的都是同一个变量 i。
但是，我们可以通过创建另一个匿名函数强制让闭包的行为符合预期: 
``` javascript
function createFunctions() {
    var result = new Array();

    for (var i=0; i < 10; i++) {
        result[i] = function(num) {
            return function(){
                return num;
            };
        }(i);
    }

    return result;
}
```

### 关于 this 对象
在闭包中使用 this 对象也可能会导致一些问题。我们知道，this 对象是在运行时基于函数的执行环境绑定的: 在全局函数中，this 等于 window，而当函数被作为某个对象的方法调用时，this 等于那个对象。不过，匿名函数的执行环境具有全局性，因此其 this 对象通常指向 window。
``` javascript
var name = "The Window";

var object = {
    name : "My Object",

    getNameFunc : function(){
        return function(){
            return this.name;
        };
    }
};

alert(object.getNameFunc()());  //"The Window"(在非严格模式下)
```

前面曾经提到过，每个函数在被调用时，其活动对象都会自动取得两个特殊变量: this 和 arguments。内部函数在搜索这两个变量时，只会搜索到其活动对象为止，因此永远不可能直接访问外部函数中的这两个变量。
不过，把外部作用域中的 this 对象保存在一个闭包能够访问到的变量里，就可以让闭包访问该对象了: 
``` javascript
var name = "The Window";

var object = {
    name : "My Object",

    getNameFunc : function(){
        var that = this;
        return function(){
            return that.name;
        };
    }
};

alert(object.getNameFunc()());  //"My Object"
```

## 模仿块级作用域
***  
如前所述，JavaScript 没有块级作用域的概念。这意味着在块语句中定义的变量，实际上是在包含函数中而非语句中创建的。
JavaScript 从来不会告诉你是否多次声明了同一个变量; 遇到这种情况，它只会对后续的声明视而不见(不过，它会执行后续声明中的变量初始化)。匿名函数可以用来模仿块级作用域并避免这个问题。
用作块级作用域(通常称为私有作用域)的匿名函数的语法如下: 
``` javascript
(function(){
    //这里是块级作用域
})();
```
以上代码定义并立即调用了一个匿名函数。将函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。而紧随其后的另一对圆括号会立即调用这个函数。
注意: 函数声明后面不能跟圆括号。然而，函数表达式的后面可以跟圆括号。要将函数声明转换成函数表达式，只要像上面这样给它加上一对圆括号即可。