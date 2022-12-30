---
title: JavaScript(十四)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog41.jpg
date: 2018/08/21
---

这一篇，我们讲讲 ES6 的新特性。

## 变量
***  
### var 的缺点
1. 可以重复声明

``` javascript
var a = 12;
var a = 5;
alert(a);  //5
```
2. 无法限制修改
3. 没有块级作用域

``` javascript
if (true) {
    var a = 12;
}

alert(a);
```

### let 和 const
let 和 const 解决了之前 var 的问题。首先，let 和 const 声明的变量不能重复声明。其次，使用 let 声明的变量是可以修改的，而使用 const 声明的变量是不能修改的(也就是其他语言的常量)。最后，使用 let 和 const 声明的变量有块级作用域。

## 函数
***  
### 箭头函数
1. 如果只有一个参数，圆括号可以省略
2. 如果只有一个 return 语句，花括号和 return 关键字可以省略

``` javascript
let addOne = e => e + 1;
addOne(5);  //6
```

### 函数参数
1. 剩余参数(必须放在最后)

``` javascript
let show = function (a, b, ...args) {
    alert(a);
    alert(b);
    alert(args);
}

show(12, 15, 8, 23, 2);  // [8, 23, 2]

const say = function({name, ...rest}) {
    console.log(rest);
}

say({name: '1ess', age: 18});  // {age: 18}
```

如果参数不是对象，则剩余参数 rest 是数组，否则，rest 是对象。

2. 默认参数

``` javascript
let show = function (a, b = 10, c = 20) {
    console.log(a);
    console.log(b);
    console.log(c);
 }
        
show(99);
```

3. 展开运算符

``` javascript
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

let arr = [...arr1, ...arr2];  //1, 2, 3, 4, 5, 6
```

**ES7 也允许对象使用展开运算符，相当于复制一个新对象**
``` javascript
const a = {name: '1ess', age: 20};
const b = {...a};
console.log(b);
```

## 解构赋值
***  
1. 左右两侧结构必须一样
2. 声明的同时必须初始化
3. 解构赋值也可以使用剩余参数

``` javascript
let [a, b, c] = [1, 2, 3];
console.log(a, b, c);  //1, 2, 3

let {a, c, d} = {a: 12, c: 5, d: 16};
console.log(a, c, d);  //12, 5, 16

let [{a, b}, [n1, n2, n3], c, d] = [{a: 10, b : 20}, [1, 2, 3], 4, 'c'];
console.log(a, b, c, d, n1, n2, n3);  //10, 20, 4, c, 1, 2, 3

//粒度控制
let [json, [n1, n2, n3], c, d] = [{a: 10, b : 20}, [1, 2, 3], 4, 'c'];
console.log(json, c, d, n1, n2, n3);  //object, 4, c, 1, 2, 3
```

**数组和对象都可以使用解构赋值。**

## 数组
***  
1. includes() 方法判断元素是否存在于该数组

``` javascript
let arr = [1, 2, 3];
console.log(arr.includes(2));  //true
```
2. for ... of 循环迭代器

``` javascript
let arr = [10, 20, 30];
for (const iterator of arr) {
    console.log(iterator);  //10, 20, 30
}
```

由于对象不可迭代，因此无法使用 for ... of 遍历对象。注意与 for ... in 的区别。

3. keys()、values()、entries() 方法

``` javascript
let arr = [10, 20, 30];
for (const key of arr.keys()) {
    console.log(key);  //0, 1, 2
}

for (const value of arr.values()) {
    console.log(value);  //10, 20, 30
}

for (const [key, value] of arr.entries()) {
    console.log(key);  //0, 1, 2
    console.log(value);  //10, 20, 30
}
```

## 字符串
***  
1. startsWith 和 endsWith

``` javascript
let str = 'Hello ES6!';
alert(str.startsWith('Hello'));  //true
alert(str.endsWith(6));  //false
```
2. 字符串模板

``` javascript
let result = 10;
let str = `<div>${result}</div>`;
alert(str);  //<div>10</div>
```

## 面向对象
***  
### 类
在 ES6 之前，JS 对于面向对象的支持不好，想要实现一个类，如下: 
``` javascript
function User(name, pwd) {
    this.name = name;
    this.pwd = pwd;
}

User.prototype.showName = function() {
    alert(this.name);
};

User.prototype.showPwd= function() {
    alert(this.pwd);
};

let user = new User('1ess', '123456');
user.showName();
user.showPwd();
```

感觉很分散、别扭、不清晰，在 ES6 之后，JS 终于支持 class 关键字，可以很常规的定义一个对象了: 
``` javascript
class User {
    constructor(name, pwd) {
        this.name = name;
        this.pwd = pwd;
    }
    showName() {
        alert(this.name);
    }
    showPwd() {
        alert(this.pwd);
    }
}

let user = new User('1ess', '123456');
user.showName();
user.showPwd();
```

### 继承
在 ES6 之前实现继承，也是很别扭: 
``` javascript
function VipUser(name, pwd, level) {
        User.call(this, name, pwd);
        this.level = level;
}

VipUser.prototype = new User();
VipUser.prototype.constructor = VipUser;
VipUser.prototype.showLevel = function() {
        alert(this.level);
}

let user = new VipUser('1ess', '123456', 10);
user.showName();
user.showPwd();
user.showLevel();
```

在 ES6 之后，JS 支持 extends 和 super 关键字，可以很常规的继承一个对象了: 
``` javascript
class VipUser extends User {
    constructor(name, pwd, level) {
        super(name, pwd);
        this.level = level;
    }
    showLevel() {
        alert(this.level);
    }
}

let user = new VipUser('1ess', '123456', 10);
user.showName();
user.showPwd();
user.showLevel();
```

### set 和 get
ES6 使用 set 和 get 定义属性: 
``` javascript
class Person {
    constructor(name) {
        this.name = name;
    }
    set age(val) {
        this._age = val;
    }
    get age() {
        return this._age;
    }
}

let p = new Person('1ess');
p.age = 26;
console.log(p.age);  //26
```

## JSON
***  
### 规则
1. 必须使用双引号
2. 所有的 key 必须使用引号包裹

当我们想把 JSON 对象变为字符串时，使用 JSON.stringify() 方法。当我们想把 JSON 字符串转为对象时，使用 JSON.parse() 方法。

### 简写
1. 当 key 与 value 同名时，可以简写: 

``` javascript
let a = 10;
let b = 20;
let json = {a, b};
```
2. 如果有方法，也可以使用简写: 

``` javascript
let json = {
    a: 10;
    show() {
        alert(a);  //10
    }
}
```

## Promise
***  
用同步一样的方式，来书写异步代码。
``` javascript
Promise.all([
    $.ajax(url: '/a', dataType: 'json'),
    $.ajax(url: '/b', dataType: 'json'),
]).then(results=>{
    let [res1, res2] = results;
   //res1
   //res2
}, error=>{
    //error
});
```

## import
***  
ES6 引用其他库文件的语法变化。在 ES6 之前，我们一般都是通过 require 方法把库文件导出的方法保存在一个变量中。在 ES6 当中引入了一组个新的关键字 import/export。一般我们都会在文件的开头引入我们需要使用的模块或方法。
我们在一个文件中导入的模块或方法是从另一个文件中导出的。如果是使用 export default 语句导出的方法，我们直接定义其变量名称，这样的方法每个文件只能导出一个: 
``` javascript
// other.js
export default function() {
    console.log("export default function");
}
// index.js
import defaultFunc from 'other';
```

仅用 export 导出的方法，在使用时，则需要把它们包含在大括号里: 
``` javascript
// another.js
export const foo = 'foo';
export function bar() {
    console.log("bar function");
}

// index.js
import {foo, bar} from 'another';
```