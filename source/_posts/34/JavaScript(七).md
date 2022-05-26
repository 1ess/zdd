---
title: JavaScript(七)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog34.jpg
date: 2018/08/26
---

这一篇，我们说说 ES 中的面向对象。
ECMAScript 中没有类的概念，因此它的对象也与基于类的语言中的对象有所不同。
ECMA-262 把对象定义为: "无序属性的集合，其属性可以包含基本值、对象或者函数。"
对象的每个属性或方法都有一个名字，而每个名字都映射到一个值。我们可以把 ECMAScript 的对象想象成**散列表**: 一组键值对，其中值可以是数据或函数。

## 理解对象
***  
创建自定义对象的最简单方式就是创建一个 Object 的实例，然后再为它添加属性和方法: 
```javascript
var person = new Object();
person.name = "Nicholas";
person.age = 29; 
person.job = "Software Engineer";

person.sayName = function(){
    alert(this.name); 
};
```

之后，我们还可以使用对象字面量创建对象: 
``` javascript
var person = {
    name: "Nicholas", 
    age: 29,
    job: "Software Engineer",

    sayName: function(){
        alert(this.name);
    }
};
```

ECMA-262 第 5 版在定义了特性(attribute)来描述属性(property)的各种特征。
我们将特性放在了两对儿方括号中，例如[[Enumerable]]。
ECMAScript 中有两种属性: 数据属性和访问器属性。

### 数据属性
数据属性包含一个数据值的位置。在这个位置可以读取和写入值。数据属性有4个描述其行为的特性: 
- [[Configurable]]: 表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为访问器属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true
- [[Enumerable]]: 表示能否通过 for-in 循环返回属性。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true
- [[Writable]]: 表示能否修改属性的值。像前面例子中那样直接在对象上定义的属性，它们的这个特性默认值为 true
- [[Value]]: 包含这个属性的数据值。读取属性值的时候，从这个位置读; 写入属性值的时候，把新值保存在这个位置。这个特性的默认值为 undefined
 
要修改属性默认的特性，必须使用 ECMAScript 5 的 Object.defineProperty() 方法。这个方法接收三个参数: 属性所在的对象、属性的名字和一个描述符对象。其中，描述符(descriptor)对象的属性必须是: configurable、enumerable、writable 和 value。设置其中的一或多个值，可以修改对应的特性值。例如: 
```javascript
var person = {};
Object.defineProperty(person, "name", {
    writable: false,
    value: "Nicholas" 
});

alert(person.name);    //"Nicholas"
person.name = "Greg";
alert(person.name);    //"Nicholas"
```

这个例子创建了一个名为 name 的属性，它的值 "Nicholas" 是只读的。这个属性的值是不可修改的，如果尝试为它指定新值，则在非严格模式下，赋值操作将被忽略，在严格模式下，赋值操作将会导致抛出错误。

### 访问器属性
访问器属性不包含数据值，它们包含一对儿 getter 和 setter 函数(不过，这两个函数都不是必需的)。在读取访问器属性时，会调用 getter 函数，这个函数负责返回有效的值。在写入访问器属性时，会调用 setter 函数并传入新值，这个函数负责决定如何处理数据。访问器属性有如下 4 个特性: 
- [[Configurable]]: 表示能否通过 delete 删除属性从而重新定义属性，能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，这个特性的默认值为 true
- [[Enumerable]]: 表示能否通过 for-in 循环返回属性。对于直接在对象上定义的属性，这个特性的默认值为 true
- [[Get]]: 在读取属性时调用的函数。默认值为 undefined
- [[Set]]: 在写入属性时调用的函数。默认值为 undefined

访问器属性不能直接定义，必须使用 Object.defineProperty() 来定义: 
``` javascript
var book = {
    _year: 2004, 
    edition: 1
};

Object.defineProperty(book, "year", {
    get: function() {
        return this._year;
    },
    set: function(newValue) {
        if (newValue > 2004) {
            this._year = newValue;
            this.edition += newValue - 2004;
        }
    }
});

book.year = 2005;
alert(book.edition);  //2
```

下划线加属性名是一种常用的记号，用于表示只能通过对象方法访问的属性。
不一定非要同时指定 getter 和 setter。只指定 getter 意味着属性是不能写，尝试写入属性会被忽略。在严格模式下，尝试写入只指定了 getter 函数的属性会抛出错误。类似地，只指定 setter 函数的属性也不能读，否则在非严格模式下会返回 undefined，而在严格模式下会抛出错误。

### 定义多个属性
由于为对象定义多个属性的可能性很大，ECMAScript 5 又定义了一个 Object.defineProperties() 方法。利用这个方法可以通过描述符一次定义多个属性。这个方法接收两个对象参数: 第一个对象是要添加和修改其属性的对象，第二个对象的属性与第一个对象中要添加或修改的属性一一对应。例如: 
``` javascript
var book = {};

Object.defineProperties(book, {
    _year: {
        value: 2004
    },

    edition: {
        value: 1
    },

    year: {
        get: function() {
            return this._year;
        },

        set: function(newValue) {
            if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
            }
        }
    }
});
```

### 读取属性的特性
使用 ECMAScript 5 的 Object.getOwnPropertyDescriptor() 方法，可以取得给定属性的描述符。这个方法接收两个参数: 属性所在的对象和要读取其描述符的属性名称。返回值是一个对象，如果是访问器属性，这个对象的属性有 configurable、enumerable、get 和 set。如果是数据属性，这个对象的属性有configurable、enumerable、writable 和 value。

## 创建对象
***  
虽然 Object 构造函数或对象字面量都可以用来创建单个对象，但这些方式有个明显的缺点: 使用同一个接口创建很多对象，会产生大量的重复代码。为解决这个问题，人们开始使用工厂模式的一种变体。

### 工厂模式
考虑到在 ECMAScript 中无法创建类，开发人员就发明了一种函数，用函数来封装以特定接口创建对象的细节，如下面的例子所示: 
``` javascript
unction createPerson(name, age, job){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        alert(this.name);
    };    
    return o;
}

var person1 = createPerson("Nicholas", 29, "Software Engineer");
var person2 = createPerson("Greg", 27, "Doctor");
```

工厂模式虽然解决了创建多个相似对象的问题，但却没有解决对象识别的问题(即怎样知道一个对象的类型)。随着 JavaScript 的发展，又一个新模式出现了。

### 构造函数模式
``` javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function(){
        alert(this.name);
    };    
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

在这个例子中，Person() 函数取代了 createPerson() 函数。我们注意到，Person() 中的代码除了与 createPerson() 中相同的部分外，还存在以下不同之处: 
- 没有显式地创建对象
- 直接将属性和方法赋给了 this 对象
- 没有 return 语句

**注意: 按照惯例，构造函数始终都应该以一个大写字母开头，而非构造函数则应该以一个小写字母开头。**
**以这种方式定义的构造函数是定义在 Global 对象(在浏览器中是 window 对象)中的。**

构造函数模式虽然好用，但也并非没有缺点。使用构造函数的主要问题，就是每个方法都要在每个实例上重新创建一遍。在前面的例子中，person1 和 person2 都有一个名为 sayName() 的方法，但那两个方法不是同一个 Function 的实例。因此，不同实例上的同名函数是不相等的。
然而，创建两个完成同样任务的 Function 实例的确没有必要，况且有 this 对象在，根本不用在执行代码前就把函数绑定到特定对象上面。因此，大可像下面这样，通过把函数定义转移到构造函数外部来解决这个问题: 
``` javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}

function sayName(){
    alert(this.name);
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

但是这样做也有问题: 如果对象需要定义很多方法，那么就要定义很多个全局函数，于是我们这个自定义的引用类型就丝毫没有封装性可言了。好在，这些问题可以通过使用原型模式来解决。

### 原型模式
我们创建的每个函数都有一个 prototype(原型)属性，这个属性是一个指针，指向一个对象，而这个对象的用途是包含可以由特定类型的所有实例共享的属性和方法: 
``` javascript
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
person1.sayName();   //"Nicholas"

var person2 = new Person();
person2.sayName();   //"Nicholas"

alert(person1.sayName == person2.sayName);  //true
```

### 组合使用构造函数模式和原型模式
创建自定义类型的最常见方式，就是组合使用构造函数模式与原型模式。
构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度地节省了内存: 
``` javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.friends = ["Shelby", "Court"];
}

Person.prototype = {
    constructor : Person,
    sayName : function(){
        alert(this.name);
    }
}

var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");

person1.friends.push("Van");
alert(person1.friends);    //"Shelby,Count,Van"
alert(person2.friends);    //"Shelby,Count"
alert(person1.friends === person2.friends);    //false
alert(person1.sayName === person2.sayName);    //true
```

这种构造函数与原型混成的模式，是目前在 ECMAScript 中使用最广泛、认同度最高的一种创建自定义类型的方法。

### 动态原型模式
通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型: 
``` javascript
function Person(name, age, job){

    //属性
    this.name = name;
    this.age = age;
    this.job = job;

    //方法
    if (typeof this.sayName != "function"){

        Person.prototype.sayName = function(){
            alert(this.name);
        };

    }
}

var friend = new Person("Nicholas", 29, "Software Engineer");
friend.sayName();
```

## 理解原型
***  
无论什么时候，只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个 prototype 属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个 constructor(构造函数)属性，这个属性包含一个指向 prototype 属性所在函数的指针。

创建了自定义的构造函数之后，其原型对象默认只会取得 constructor 属性; 至于其他方法，则都是从 Object 继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针(内部属性)，指向构造函数的原型对象。

虽然在脚本中没有标准的方式访问[[Prototype]]，但 Firefox、Safari 和 Chrome 在每个对象上都支持一个属性 \_\_proto\_\_。

虽然在所有实现中都无法访问到[[Prototype]]，但可以通过 isPrototypeOf() 方法来确定对象之间是否存在这种关系。
```javascript
alert(Person.prototype.isPrototypeOf(person1));  //true
```

ECMAScript 5增加了一个新方法，叫 Object.getPrototypeOf()，在所有支持的实现中，这个方法返回[[Prototype]]的值。
``` javascript
alert(Object.getPrototypeOf(person1) == Person.prototype); //true
alert(Object.getPrototypeOf(person1).name); //"Nicholas"
```

每当代码读取某个对象的某个属性时，都会执行一次搜索，目标是具有给定名字的属性。搜索首先从对象实例本身开始。如果在实例中找到了具有给定名字的属性，则返回该属性的值; 如果没有找到，则继续搜索指针指向的原型对象，在原型对象中查找具有给定名字的属性。如果在原型对象中找到了这个属性，则返回该属性的值。

虽然可以通过对象实例访问保存在原型中的值，但却不能通过对象实例重写原型中的值。如果我们在实例中添加了一个属性，而该属性与实例原型中的一个属性同名，那我们就在实例中创建该属性，该属性将会屏蔽原型中的那个属性。

使用 hasOwnProperty() 方法可以检测一个属性是存在于实例中，还是存在于原型中。这个方法(不要忘了它是从 Object 继承来的)只在给定属性存在于对象实例中时，才会返回 true。
``` javascript
function Person(){
}

Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};

var person1 = new Person();
var person2 = new Person();

alert(person1.hasOwnProperty("name"));  //false

person1.name = "Greg";
alert(person1.name);     //"Greg"——来自实例
alert(person1.hasOwnProperty("name"));  //true
```

### 原型与 in 操作符
有两种方式使用 in 操作符: 
- 单独使用
- 在 for-in 循环中使用

在单独使用时，in 操作符会在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中。
在使用 for-in 循环时，返回的是所有能够通过对象访问的、可枚举的(enumerated)属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。

### 更简单的原型语法
为减少不必要的输入，也为了从视觉上更好地封装原型的功能，更常见的做法是用一个包含所有属性和方法的对象字面量来重写整个原型对象: 
``` javascript
function Person(){
}

Person.prototype = {
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName: function () {
        alert(this.name);
    }
};
```

注意: 这种写法的 constructor 属性不再指向 Person 了。

如果 constructor 的值真的很重要，可以像下面这样特意将它设置回适当的值: 
``` javascript
function Person(){
}

Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    sayName: function () {
        alert(this.name);
    }
};
```

### 原生对象的原型
原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的引用类型，都是采用这种模式创建的。所有原生引用类型(Object、Array、String 等等)都在其构造函数的原型上定义了方法。例如，在 Array.prototype 中可以找到 sort() 方法，而在 String.prototype 中可以找到 substring() 方法，如下所示: 
``` javascript
alert(typeof Array.prototype.sort);              //"function"
alert(typeof String.prototype.substring);        //"function"
```

### 原型对象的问题
- 省略了为构造函数传递初始化参数这一环节，结果所有实例在默认情况下都将取得相同的属性值
- 原型中所有属性是被很多实例共享的，这种共享对于函数非常合适，然而，对于包含引用类型值的属性来说，就会出现问题

``` javascript
function Person(){
}

Person.prototype = {
    constructor: Person,
    name: "Nicholas",
    age: 29,
    job: "Software Engineer",
    friends: ["Shelby", "Court"],
    sayName: function () {
        alert(this.name);
    }
};

var person1 = new Person();
var person2 = new Person();

person1.friends.push("Van");

alert(person1.friends);    //"Shelby,Court,Van"
alert(person2.friends);    //"Shelby,Court,Van"
alert(person1.friends === person2.friends);  //true
```

这个问题正是我们很少看到有人单独使用原型模式的原因所在。

## 继承
***  
ECMAScript 只支持实现继承，而且其实现继承主要是依靠原型链来实现的。

### 原型链
ECMAScript 中描述了原型链的概念，并将原型链作为实现继承的主要方法。其基本思想是利用原型让一个引用类型继承另一个引用类型的属性和方法。
回顾一下构造函数、原型和实例的关系: **每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。**
``` javascript
function SuperType(){
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){
    return this.property;
};

function SubType(){
    this.subproperty = false;
}

//继承了SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function (){
    return this.subproperty;
};

var instance = new SubType();
alert(instance.getSuperValue());      //true
```

### 谨慎地定义方法
子类型有时候需要重写超类型中的某个方法，或者需要添加超类型中不存在的某个方法。但不管怎样，给原型添加方法的代码一定要放在替换原型的语句之后。
``` javascript
function SuperType(){
    this.property = true;
}

SuperType.prototype.getSuperValue = function(){
    return this.property;
};

function SubType(){
    this.subproperty = false;
}

//继承了SuperType
SubType.prototype = new SuperType();

//添加新方法
SubType.prototype.getSubValue = function (){
    return this.subproperty;
};

//重写超类型中的方法
SubType.prototype.getSuperValue = function (){
    return false;
};

var instance = new SubType();
alert(instance.getSuperValue());   //false
```

### 原型链的问题
主要的问题来自包含引用类型值的原型。
我们前面介绍过包含引用类型值的原型属性会被所有实例共享，而这也正是为什么要在构造函数中，而不是在原型对象中定义属性的原因。
在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就变成了现在的原型属性了。
``` javascript
function SuperType(){
    this.colors = ["red", "blue", "green"];
}

function SubType(){            
}

//继承了SuperType
SubType.prototype = new SuperType();

var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);        //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors);        //"red,blue,green,black"
```

原型链的第二个问题是: 在创建子类型的实例时，不能向超类型的构造函数中传递参数。
因此，实践中很少会单独使用原型链。

### 借用构造函数
为解决原型中包含引用类型值所带来问题，使用一种叫做借用构造函数(constructor stealing)的技术(有时候也叫做伪造对象或经典继承)。这种技术的基本思想相当简单，即在子类型构造函数的内部调用超类型构造函数。
``` javascript
function SuperType(){
    this.colors = ["red", "blue", "green"];
}

function SubType(){  
    //继承了SuperType
    SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors);    //"red,blue,green,black"

var instance2 = new SubType();
alert(instance2.colors);    //"red,blue,green"
```

这样，在新 SubType 对象上执行 SuperType() 函数中定义的所有对象初始化代码。结果，SubType 的每个实例就都会具有自己的 colors 属性的副本了。

相对于原型链而言，借用构造函数有一个很大的优势，即可以在子类型构造函数中向超类型构造函数传递参数: 
``` javascript
function SuperType(name){
    this.name = name;
}

function SubType(){  
    //继承了SuperType，同时还传递了参数
    SuperType.call(this, "Nicholas");

    //实例属性
    this.age = 29;
}

var instance = new SubType();
alert(instance.name);    //"Nicholas";
alert(instance.age);     //29
```

### 借用构造函数的问题
如果仅仅是借用构造函数，那么也将无法避免构造函数模式存在的问题 —— 方法都在构造函数中定义，因此函数复用就无从谈起了。而且，在超类型的原型中定义的方法，对子类型而言也是不可见的，结果所有类型都只能使用构造函数模式。考虑到这些问题，借用构造函数的技术也是很少单独使用的。

### 组合继承
组合继承(combination inheritance)，有时候也叫做伪经典继承，指的是将原型链和借用构造函数的技术组合到一块，从而发挥二者之长的一种继承模式。
其背后的思路是使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。
``` javascript
function SuperType(name){
    this.name = name;
    this.colors = ["red", "blue", "green"];
}

SuperType.prototype.sayName = function(){
    alert(this.name);
};

function SubType(name, age){  

    //继承属性
    SuperType.call(this, name);
    this.age = age;
}

//继承方法
SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
    alert(this.age);
};

var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors);      //"red,blue,green,black"
instance1.sayName();          //"Nicholas";
instance1.sayAge();           //29

var instance2 = new SubType("Greg", 27);
alert(instance2.colors);      //"red,blue,green"
instance2.sayName();          //"Greg";
instance2.sayAge();           //27
```

组合继承避免了原型链和借用构造函数的缺陷，融合了它们的优点，成为 JavaScript 中最常用的继承模式。

### 原型式继承
为了达到基于已有的对象创建新对象，同时还不必因此创建自定义类型的目的，使用如下函数: 
``` javascript
function object(o){
    function F(){}
    F.prototype = o;
    return new F();
}
```

在 object() 函数内部，先创建了一个临时性的构造函数，然后将传入的对象作为这个构造函数的原型，最后返回了这个临时类型的一个新实例。
从本质上讲，object() 对传入其中的对象执行了一次浅复制。
``` javascript
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = object(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = object(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends);   //"Shelby,Court,Van,Rob,Barbie"
```

这种原型式继承，要求你必须有一个对象可以作为另一个对象的基础。如果有这么一个对象的话，可以把它传递给 object() 函数，然后再根据具体需求对得到的对象加以修改即可。

ECMAScript 5 通过新增 Object.create() 方法规范化了原型式继承。这个方法接收两个参数: 一个用作新对象原型的对象和(可选的)一个为新对象定义额外属性的对象。在传入一个参数的情况下，Object.create() 与 object() 方法的行为相同。
``` javascript
var person = {
    name: "Nicholas",
    friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = Object.create(person);
anotherPerson.name = "Greg";
anotherPerson.friends.push("Rob");

var yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Linda";
yetAnotherPerson.friends.push("Barbie");

alert(person.friends); //"Shelby,Court,Van,Rob,Barbie"
```

Object.create() 方法的第二个参数与 Object.defineProperties() 方法的第二个参数格式相同: 每个属性都是通过自己的描述符定义的。以这种方式指定的任何属性都会覆盖原型对象上的同名属性。

在没有必要兴师动众地创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。不过别忘了，包含引用类型值的属性始终都会共享相应的值，就像使用原型模式一样。

### 寄生式继承
寄生式(parasitic)继承是与原型式继承紧密相关的一种思路，创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后再像真地是它做了所有工作一样返回对象。
``` javascript
function createAnother(original){
    var clone = object(original);    //通过调用函数创建一个新对象
    clone.sayHi = function(){        //以某种方式来增强这个对象
        alert("hi");
    };
    return clone;                    //返回这个对象
}
```

使用寄生式继承来为对象添加函数，会由于不能做到函数复用而降低效率，这一点与构造函数模式类似。