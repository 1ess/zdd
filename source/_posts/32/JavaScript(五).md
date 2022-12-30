---
title: JavaScript(五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog32.jpg
date: 2018/07/25
---

这一篇，我们讲讲 JavaScript 引用类型中的 Object、Array 和 Date。
在 ECMAScript 中，引用类型是一种数据结构，用于将数据和功能组织在一起。它也常被称为类，但这种称呼并不妥当。尽管 ECMAScript 从技术上讲是一门面向对象的语言，但它不具备传统的面向对象语言所支持的类和接口等基本结构。引用类型有时候也被称为对象定义，因为它们描述的是一类对象所具有的属性和方法。
对象是某个特定引用类型的实例，新对象是使用 new 操作符后跟一个构造函数来创建的。构造函数本身就是一个函数，其目的是创建新对象。如下: 
``` javascript
var person = new Object(); 
```

这行代码创建了 Object 引用类型的一个新实例，然后把该实例保存在了变量 person 中，使用的构造函数是 Object。
ECMAScript 提供了很多原生引用类型，如: 
- Object
- Array
- Date
- RegExp
- Function

等等。

## Object 类型
***  
创建 Object 实例的方式有两种: 
- 使用 new 操作符后跟 Object 构造函数

``` javascript
var person = new Object();
person.name = "Nicholas";
person.age = 29;
```
- 使用对象字面量表示法

``` javascript
var person = {
    name : "Nicholas",
    age : 29
};
```

对象字面量是对象定义的一种简写形式，目的在于简化创建包含大量属性的对象的过程。

在使用对象字面量语法时，属性名也可以使用字符串。
``` javascript
var person = {
    "name" : "Nicholas",
    "age" : 29,
    5 : true
};
```

这个例子会创建一个对象，包含三个属性: name、age 和 5。但这里的数值属性名会自动转换为字符串。
另外，使用对象字面量语法时，如果留空其花括号，则可以定义只包含默认属性和方法的对象，如下: 
``` javascript
var person = {};  //与 new Object() 相同
person.name = "Nicholas";
person.age = 29;
```

注意: 左边的花括号 { 表示对象字面量的开始，因为它出现在了表达式上下文(expression context)中。ECMAScript 中的表达式上下文指的是能够返回一个值(表达式)。赋值操作符表示后面是一个值，所以左花括号在这里表示一个表达式的开始。同样的花括号，如果出现在一个语句上下文(statement context)中，例如跟在 if 语句条件的后面，则表示一个语句块的开始。

一般来说，访问对象属性时使用的都是点表示法，这也是很多面向对象语言中通用的语法。不过，在 JavaScript 也可以使用方括号表示法来访问对象的属性。在使用方括号语法时，应该将要访问的属性以字符串的形式放在方括号中，如下: 
``` javascript
alert(person["name"]);  //"Nicholas"
alert(person.name);  //"Nicholas"
```

从功能上看，这两种访问对象属性的方法没有任何区别。但方括号语法的主要优点是可以通过变量来访问属性，例如: 
``` javascript
var propertyName = "name";
alert(person[propertyName]);    //"Nicholas"
```

**通常，除非必须使用变量来访问属性，否则我们建议使用点表示法。**

## Array
***  
ECMAScript 中的数组与其他多数语言中的数组有着相当大的区别: 
- ECMAScript 数组的每一项可以保存任何类型的数据。也就是说，可以用数组的第一个位置来保存字符串，用第二位置来保存数值，用第三个位置来保存对象，以此类推
- ECMAScript 数组的大小是可以动态调整的，即可以随着数据的添加自动增长以容纳新增数据

创建数组的基本方式有两种: 
- 使用Array构造函数，如下: 

``` javascript
var colors = new Array();
```

如果预先知道数组要保存的项目数量，也可以给构造函数传递该数量，而该数量会自动变成 length 属性的值: 
``` javascript
var colors = new Array(20);
```

也可以向Array构造函数传递数组中应该包含的项: 
``` javascript
var colors = new Array("red", "blue", "green");
```

**注意: 给构造函数传递一个值也可以创建数组。但这时候问题就复杂一点了，因为如果传递的是数值，则会按照该数值创建包含给定项数的数组; 而如果传递的是其他类型的参数，则会创建包含那个值的只有一项的数组。**

另外，在使用Array构造函数时也可以省略new操作符: 
``` javascript
var colors = Array(3);               // 创建一个包含3项的数组
var names = Array("Greg");           // 创建一个包含1项，即字符串"Greg"的数组
```

- 使用数组字面量表示法。数组字面量由一对包含数组项的方括号表示，多个数组项之间以逗号隔开，如下所示: 

``` javascript
var colors = ["red", "blue", "green"];   // 创建一个包含3个字符串的数组
var names = [];                          // 创建一个空数组
var values = [1,2,];                     // 不要这样！这样会创建一个包含2或3项的数组
var options = [,,,,,];                   // 不要这样！这样会创建一个包含5或6项的数组
```

在读取和设置数组的值时，要使用方括号并提供相应值的基于 0 的数字索引，如下所示: 
``` javascript
var colors = ["red", "blue", "green"];    // 定义一个字符串数组
alert(colors[0]);                         // 显示第一项
colors[2] = "black";                      // 修改第三项
colors[3] = "brown";                      // 新增第四项
```

方括号中的索引表示要访问的值。如果索引小于数组中的项数，则返回对应项的值，设置数组的值也使用相同的语法，但会替换指定位置的值。如果设置某个值的索引超过了数组现有项数，数组就会自动增加到该索引值加1的长度。

数组的项数保存在其 length 属性中，这个属性始终会返回 0 或更大的值，如下面这个例子所示: 
``` javascript
var colors = ["red", "blue", "green"];       // 创建一个包含3个字符串的数组
var names = [];                              // 创建一个空数组
alert(colors.length);            //3
alert(names.length);             //0
```

需要注意: ECMAScript 中的数组的 length 属性不是只读的。因此，通过设置这个属性，可以从数组的末尾移除项或向数组中添加新项: 
``` javascript
var colors = ["red", "blue", "green"];     // 创建一个包含3个字符串的数组
colors.length = 2;
alert(colors[2]);                 //undefined
```

利用 length 属性的这个特点就可以方便地在数组末尾添加新项，如下所示: 
``` javascript
var colors = ["red", "blue", "green"];        // 创建一个包含3个字符串的数组
colors[colors.length] = "black";                   //(在位置3)添加一种颜色
colors[colors.length] = "brown";                   //(在位置4)再添加一种颜色
```

### 检测数组
ECMAScript 5 新增了 Array.isArray() 方法。这个方法的目的是最终确定某个值到底是不是数组，而不管它是在哪个全局执行环境中创建的。
``` javascript
if (Array.isArray(value)){
    //对数组执行某些操作
}
```

### 转换方法
之前说过，所有对象都具有 toLocaleString()、toString() 和 valueOf() 方法。其中，调用数组的 toString() 和 valueOf() 方法会返回相同的值，即由数组中每个值的字符串形式拼接而成的一个以逗号分隔的字符串。实际上，为了创建这个字符串会调用数组每一项的 toString() 方法。
``` javascript
var colors = ["red", "blue", "green"];      // 创建一个包含3个字符串的数组
alert(colors.toString());     // red,blue,green
alert(colors.valueOf());      // red,blue,green
alert(colors);                // red,blue,green
```

当调用数组的 toLocaleString() 方法时，它也会创建一个数组值的以逗号分隔的字符串。而与前两个方法唯一的不同之处在于，这一次为了取得每一项的值，调用的是每一项的 toLocaleString() 方法，而不是 toString() 方法。

数组继承的 toLocaleString()、toString() 和 valueOf() 方法，在默认情况下都会以逗号分隔的字符串的形式返回数组项。而如果使用 join() 方法，则根据传入的字符串参数使用不同的分隔符来构建这个字符串。
``` javascript
var colors = ["red", "green", "blue"];
alert(colors.join(","));       //red,green,blue
alert(colors.join("||"));      //red||green||blue
```

如果不给 join() 方法传入任何值，或者给它传入 undefined，则使用逗号作为分隔符。
注意: 如果数组中的某一项的值是 null 或者 undefined，那么该值在 join()、toLocaleString()、toString() 和 valueOf() 方法返回的结果中以空字符串表示。

### 栈方法
ECMAScript 数组也提供了一种让数组的行为类似于其他数据结构的方法。具体说来，数组可以表现得就像栈一样。栈是一种 LIFO(Last-In-First-Out，后进先出)的数据结构，也就是最新添加的项最早被移除。而栈中项的插入(叫做推入)和移除(叫做弹出)，只发生在一个位置——栈的顶部。ECMAScript 为数组专门提供了 push() 和 pop() 方法，以便实现类似栈的行为。
push() 方法可以接收任意数量的参数，把它们逐个添加到数组末尾，并返回修改后数组的长度。而 pop() 方法则从数组末尾移除最后一项，减少数组的 length 值，然后返回移除的项。
``` javascript
var colors = new Array();                       // 创建一个数组
var count = colors.push("red", "green");        // 推入两项
alert(count);    //2

count = colors.push("black");                   // 推入另一项
alert(count);     //3

var item = colors.pop();                        // 取得最后一项
alert(item);      //"black"
alert(colors.length);   //2
```

### 队列方法
队列数据结构的访问规则是 FIFO(First-In-First-Out，先进先出)。队列在列表的末端添加项，从列表的前端移除项。由于 push() 是向数组末端添加项的方法，因此要模拟队列只需一个从数组前端取得项的方法。实现这一操作的数组方法就是 shift()，它能够移除数组中的第一个项并返回该项，同时将数组长度减1。结合使用 shift() 和 push() 方法，可以像使用队列一样使用数组。
``` javascript
var colors = new Array();                   //创建一个数组
var count = colors.push("red", "green");    //推入两项
alert(count);    //2

count = colors.push("black");               //推入另一项
alert(count);     //3

var item = colors.shift();                  //取得第一项
alert(item);      //"red"
alert(colors.length); //2
```

ECMAScript 还为数组提供了一个 unshift() 方法。顾名思义，unshift() 与 shift() 的用途相反: 它能在数组前端添加任意个项并返回新数组的长度。因此，同时使用 unshift() 和 pop() 方法，可以从相反的方向来模拟队列。

### 重排序方法
数组中已经存在两个可以直接用来重排序的方法: reverse() 和 sort()。
- reverse() 方法会对反转数组项: 

``` javascript
var values = [1, 2, 3, 4, 5];
values.reverse();
alert(values);        //5,4,3,2,1
```
- 在默认情况下，sort() 方法按升序排列数组项——即最小的值位于最前面，最大的值排在最后面。为了实现排序，sort() 方方法会调用每个数组项的 toString() 转型方法，然后比较得到的字符串，以确定如何排序。即使数组中的每一项都是数值，sort() 方法比较的也是字符串: 

``` javascript
var values = [0, 1, 5, 10, 15];
values.sort();
alert(values);     //0,1,10,15,5
```
- sort() 方法还可以接收一个比较函数作为参数，以便我们指定哪个值位于哪个值的前面。比较函数接收两个参数，如果第一个参数应该位于第二个之前则返回一个负数，如果两个参数相等则返回0，如果第一个参数应该位于第二个之后则返回一个正数: 

``` javascript
function compare(value1, value2) {
    if (value1 < value2) {
        return -1;
    } else if (value1 > value2) {
        return 1;
    } else {
        return 0;
    }
}

var values = [0, 1, 5, 10, 15];
values.sort(compare);
alert(values);   //0,1,5,10,15
```

### 操作方法
ECMAScript 为操作已经包含在数组中的项提供了很多方法。
- concat() 方法可以基于当前数组中的所有项创建一个新数组。具体来说，这个方法会先创建当前数组一个副本，然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。在没有给 concat() 方法传递参数的情况下，它只是复制当前数组并返回副本。如果传递给 concat() 方法的是一或多个数组，则该方法会将这些数组中的每一项都添加到结果数组中。如果传递的值不是数组，这些值就会被简单地添加到结果数组的末尾: 

``` javascript
var colors = ["red", "green", "blue"];
var colors2 = colors.concat("yellow", ["black", "brown"]);

alert(colors);     //red,green,blue
alert(colors2);    //red,green,blue,yellow,black,brown
```
- slice() 方法能够基于当前数组中的一或多个项创建一个新数组。slice() 方法可以接受一或两个参数，即要返回项的起始和结束位置。在只有一个参数的情况下，slice() 方法返回从该参数指定位置开始到当前数组末尾的所有项。如果有两个参数，该方法返回起始和结束位置之间的项——但不包括结束位置的项。注意，slice() 方法不会影响原始数组: 

``` javascript
var colors = ["red", "green", "blue", "yellow", "purple"];
var colors2 = colors.slice(1);
var colors3 = colors.slice(1, 4);

alert(colors2);   //green,blue,yellow,purple
alert(colors3);   //green,blue,yellow
```

- splice() 方法恐怕要算是最强大的数组方法了，它有很多种用法。splice() 的主要用途是向数组的中部插入项，但使用这种方法的方式则有如下3种: 
 1. 删除: 可以删除任意数量的项，只需指定 2 个参数: 要删除的第一项的位置和要删除的项数。例如，splice(0, 2) 会删除数组中的前两项
 2. 插入: 可以向指定位置插入任意数量的项，只需提供 3 个参数: 起始位置、0(要删除的项数)和要插入的项。如果要插入多个项，可以再传入第四、第五，以至任意多个项。例如，splice(2, 0, "red", "green") 会从当前数组的位置2开始插入字符串 "red" 和 "green"
 3. 替换: 可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 个参数: 起始位置、要删除的项数和要插入的任意数量的项。插入的项数不必与删除的项数相等。例如，splice (2, 1, "red", "green") 会删除当前数组位置 2 的项，然后再从位置 2 开始插入字符串 "red" 和 "green"

splice() 方法始终都会返回一个数组，该数组中包含从原始数组中删除的项(如果没有删除任何项，则返回一个空数组)。

### 位置方法
ECMAScript 5 为数组实例添加了两个位置方法: indexOf() 和 lastIndexOf()。这两个方法都接收两个参数: 要查找的项和(可选的)表示查找起点位置的索引。其中，indexOf() 方法从数组的开头(位置0)开始向后查找，lastIndexOf() 方法则从数组的末尾开始向前查找。
这两个方法都返回要查找的项在数组中的位置，或者在没找到的情况下返回 -1。
``` javascript
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

alert(numbers.indexOf(4));        //3
alert(numbers.lastIndexOf(4));    //5

alert(numbers.indexOf(4, 4));     //5
alert(numbers.lastIndexOf(4, 4)); //3
```

### 迭代方法
ECMAScript 5 为数组定义了 5 个迭代方法。每个方法都接收两个参数: 要在每一项上运行的函数和(可选的)运行该函数的作用域对象——影响 this 的值。传入这些方法中的函数会接收三个参数: 数组项的值、该项在数组中的位置和数组对象本身。根据使用的方法不同，这个函数执行后的返回值可能会也可能不会影响访问的返回值。
- every(): 对数组中的每一项运行给定函数，如果该函数对每一项都返回 true，则返回 true
- filter(): 对数组中的每一项运行给定函数，返回该函数会返回 true 的项组成的数组
- forEach(): 对数组中的每一项运行给定函数。这个方法没有返回值
- map(): 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组
- some(): 对数组中的每一项运行给定函数，如果该函数对任一项返回 true，则返回 true

以上方法都不会修改数组中的包含的值。
``` javascript
var numbers = [1, 2, 3, 4, 5, 4, 3, 2, 1];

var everyResult = numbers.every(function(item, index, array){
    return (item > 2); 
});

alert(everyResult);     //false

var someResult = numbers.some(function(item, index, array){
    return (item > 2);
});

alert(someResult);      //true

var filterResult = numbers.filter(function(item, index, array){
    return (item > 2);
});

alert(filterResult);       //[3, 4, 5, 4, 3]

var mapResult = numbers.map(function(item, index, array){
    return item * 2;
});

alert(mapResult);   //[2, 4, 6, 8, 10, 8, 6, 4, 2]

numbers.forEach(function(item, index, array){
    //执行某些操作 
});
```

### 归并方法
ECMAScript 5 新增了两个归并数组的方法: reduce() 和 reduceRight()。这两个方法都会迭代数组的所有项，然后构建一个最终返回的值。其中，reduce() 方法从数组的第一项开始，逐个遍历到最后。而 reduceRight() 则从数组的最后一项开始，向前遍历到第一项。

这两个方法都接收两个参数: 一个在每一项上调用的函数和(可选的)作为缩小基础的初始值。传给 reduce() 和 reduceRight() 的函数接收4个参数: 前一个值、当前值、项的索引和数组对象。这个函数返回的任何值都会作为第一个参数自动传给下一项。第一次迭代发生在数组的第二项上，因此第一个参数是数组的第一项，第二个参数就是数组的第二项。
使用 reduce() 方法可以执行求数组中所有值之和的操作: 
``` javascript
var values = [1, 2, 3, 4, 5];
var sum = values.reduce(function(prev, cur, index, array){
    return prev + cur; 
});
alert(sum); //15
```

使用 reduce() 还是 reduceRight()，主要取决于要从哪头开始遍历数组。除此之外，它们完全相同。

## Date 类型
***  
ECMAScript 中的 Date 类型是在早期 Java 中的 java.util.Date 类基础上构建的。为此，Date 类型使用自 UTC(Coordinated Universal Time，国际协调时间)1970 年 1 月 1 日零时开始经过的毫秒数来保存日期。
要创建一个日期对象，使用 new 操作符和 Date 构造函数即可: 
``` javascript
var now = new Date();
```

在调用Date构造函数而不传递参数的情况下，新创建的对象自动获得当前日期和时间。如果想根据特定的日期和时间创建日期对象，必须传入表示该日期的毫秒数(即从UTC时间 1970 年 1 月 1 日午夜起至该日期止经过的毫秒数)。为了简化这一计算过程，ECMAScript 提供了两个方法: Date.parse() 和 Date.UTC()。
- Date.parse()方法接收一个表示日期的字符串参数，然后尝试根据这个字符串返回相应日期的毫秒数。可接受格式: 
 1. 月/日/年，如 6/13/2004
 2. YYYY-MM-DDTHH:mm:ss.sssZ，如 2004-05-25T00:00:00

``` javascript
var someDate = new Date(Date.parse("May 25, 2004"));
```

如果传入 Date.parse() 方法的字符串不能表示日期，那么它会返回 NaN。实际上，如果直接将表示日期的字符串传递给 Date 构造函数，也会在后台调用 Date.parse()。

- Date.UTC() 方法同样也返回表示日期的毫秒数，但它与 Date.parse() 在构建值时使用不同的信息。Date.UTC() 的参数分别是年份、基于 0 的月份(一月是 0，二月是 1，以此类推)、月中的哪一天(1 到 31)、小时数(0 到 23)、分钟、秒以及毫秒数。在这些参数中，只有前两个参数(年和月)是必需的。如果没有提供月中的天数，则假设天数为 1; 如果省略其他参数，则统统假设为 0。

``` javascript
// GMT时间2000年1月1日午夜零时
var y2k = new Date(Date.UTC(2000, 0));

// GMT时间2005年5月5日下午5:55:55
var allFives = new Date(Date.UTC(2005, 4, 5, 17, 55, 55));
```

如同模仿 Date.parse() 一样，Date 构造函数也会模仿 Date.UTC()，但有一点明显不同: 日期和时间都基于本地时区而非 GMT 来创建。不过，Date 构造函数接收的参数仍然与 Date.UTC() 相同。

ECMAScript 5 添加了 Date.now() 方法，返回表示调用这个方法时的日期和时间的毫秒数。

### 日期格式化方法
Date 类型还有一些专门用于将日期格式化为字符串的方法，这些方法如下: 
- toDateString()，以特定于实现的格式显示星期几、月、日和年
- toTimeString()，以特定于实现的格式显示时、分、秒和时区
- toLocaleDateString()，以特定于地区的格式显示星期几、月、日和年
- toLocaleTimeString()，以特定于实现的格式显示时、分、秒
- toUTCString()，以特定于实现的格式完整的 UTC 日期