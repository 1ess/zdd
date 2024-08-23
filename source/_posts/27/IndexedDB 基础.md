---
title: IndexedDB 基础
featured_image: https://cdn.zhangdd.tech/blogImg/Blog27.jpg
date: 2018/07/20
---

这一篇，由于在自己项目中采用的前端存储 —— IndexedDB，所以这一篇就介绍一些关于 IndexedDB 的知识。

## 概述
***  
在前端开发当中，有时会因为某些需求，要将一些数据存储在前端本地。我们回顾一下有几种手段可依然我们在前端存储数据。

### Cookies
在前端的**上古时代**里，前端想要存储数据，只有一种方式，那就是 Cookies。但是，Cookies 虽然可以做前端存储方案，但是却也有着很多局限性。
- 首先它的存储空间大小只有 4K
- 其次它的存储有效时间有限制
- 然后存在 Cookie 中的数据，在你每次进行请求的时候都会将它带上，使得每次的请求数据都会无意义的增大
- 最重要的一点，Cookies 设计之初就不是就是让前端存数据用的，它只是为了让网站验证用户身份而使用的

### Web Storage
为了克服 Cookies 作为前端存储有这许多缺点，经过前端社区的不断努力，在 HTML5 中有了真正的前端存储方案 Web Storage。
它分为两种: 
- localStorage
- sessionStorage

对比 Cookies，Web Storage 的优势很明显: 
- 存储空间更大，有5M大小
- 在浏览器发送请求是不会带上 Web Storage 里的数据
- 更加友好的 API
- 可以做永久存储(localStorage)

但是随着前端的不断发展，Web Storage 也有了一些不太合适的地方: 
- 随着web应用程序的不断发展，5M 的存储大小对于一些大型的 web 应用程序来说有些不够
- Web Storage 只能存储 string 类型的数据.对于 object 类型的数据只能先用 JSON.stringify() 转换一下再进行存储

基于上述原因，前端社区又提出了浏览器数据库存储这个概念。而 Web SQL Database 和 IndexedDB(索引数据库)是对这个概念的实现。
其中 Web SQL Database 在目前来说基本已经被放弃。所以目前主流的浏览器数据库的实现就是 IndexedDB(索引数据库)。

## 基本概念
***  
> 使用 IndexedDB，你可以存储或者获取数据，使用一个 key 索引。 你可以在事务(transaction)中完成对数据的修改。和大多数 web 存储解决方案相同，IndexedDB 也遵从同源协议(same-origin policy)， 所以你只能访问同域中存储的数据，而不能访问其他域的。

API 包含异步(asynchronous) API 和同步(synchronous)API 两种。  异步 API 适合大多数情况，同步 API 必须同 WebWorkers 一同使用。目前，没有主流浏览器支持同步 API。 即使同步 API 被支持了，我们通常也会在大多数的情况使用异步 API。
IndexedDB 是 WebSQL 数据库的取代品。 IndexedDB 和 WebSQL 的不同点在于: WebSQL 是关系型数据库而 IndexedDB 是 key-value 型数据库。

简单而言，IndexedDB 就是一个基于事务操作的 key-value 型前端数据库。其 API 大多是异步的。

IndexedDB 是一个比较复杂的 API，涉及不少概念。它把不同的实体，抽象成一个个对象接口。学习这个 API，就是学习它的各种对象接口。
- 数据库: IDBDatabase 对象
- 对象仓库: IDBObjectStore 对象
- 事务: IDBTransaction 对象
- 索引: IDBIndex 对象

### 数据库
数据库是一系列相关数据的容器。每个域名(严格的说，是协议 + 域名 + 端口)都可以新建任意多个数据库。IndexedDB 数据库有版本的概念。同一个时刻，只能有一个版本的数据库存在。如果要修改数据库结构(新增或删除表、索引或者主键)，只能通过升级数据库版本完成。

### 对象仓库
每个数据库包含若干个对象仓库(object store)。它类似于关系型数据库的表格。

### 数据记录
对象仓库保存的是数据记录。每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号。
``` javascript
{ id: 1, text: 'foo' }
```

上面的对象中，id 属性可以当作主键。数据体可以是任意数据类型，不限于对象。

### 索引
为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。

### 事务
数据记录的读写和删改，都要通过事务完成。事务对象提供 error、abort 和 complete 三个事件，用来监听操作结果。

## 基本模式
***  
IndexedDB 鼓励使用的基本模式如下所示: 
1. 打开数据库并且开始一个事务
2. 创建一个 object store
3. 构建一个请求来执行一些数据库操作，像增加或提取数据等
4. 通过监听正确类型的 DOM 事件以等待操作完成
5. 在操作结果上进行一些操作(可以在 request 对象中找到)

## IndexedDB 的使用
***  
### 创建一个 IndexedDB 数据库
使用 IndexedDB 的第一步是打开数据库，使用 indexedDB.open() 方法。
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);
var db;

request.onsuccess = function (event) {
    db = request.result;//通过 request 对象的 result 属性拿到数据库对象。
    console.log("连接数据库成功");
}

request.onerror = function (event) {
    console.log("连接数据库失败");
}

request.onupgradeneeded = function (event) {
    db = event.target.result;
}
```

open() 方法接受可以接受两个参数: 第一个是数据库名，第二个是数据库的版本号，同时返回一个 IDBOpenDBRequest 对象用于操作数据库。
其中对于 open() 的第一个参数数据库名，open() 会先去查找本地是否已有这个数据库，如果有则直接将这个数据库返回，如果没有，则先创建这个数据库，再返回。
对于第二个参数版本号，则是一个可选参数，如果不传，默认为 1，但如果传入就必须是一个整数。
我们可以通过监听 indexedDB.open() 方法返回的一个 IDBOpenDBRequest 对象的 success 、error 和 upgradeneeded 事件来执行相应的操作。
如果指定的版本号，大于数据库的实际版本号，就会发生数据库升级事件 upgradeneeded。这时通过事件对象的 target.result 属性，拿到数据库实例。

### 创建一个对象仓库
有了刚刚创建的数据库之后，我们可能就想要去存储数据了，但是只有数据库还不够，我们还需要有对象仓库(object store)，对象仓库是 IndexedDB 数据库的基础，其类似于关系型数据库中表的概念。
> 要创建一个对象仓库必须在 upgradeneeded 事件中，而 upgradeneeded 事件只会在版本号更新，或者第一次创建的时候触发。这是因为 IndexedDB API 中不允许数据库中的数据仓库在同一版本中发生变化。

``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);
var db;
request.onupgradeneeded = function (event) {
    db = e.target.result;
    var objectStore;
    if (!db.objectStoreNames.contains('Users')) {
        const store = db.createObjectStore('Users', {keyPath: 'userId', autoIncrement: false});
        console.log('创建对象仓库成功');
    }
}
```

通过监听 upgradeneeded 事件，并在这个事件触发时使用 createObjectStore() 方法创建了一个对象仓库。
createObjectStore() 方法接受两个参数: 第一个是对象仓库的名字，在同一数据库中，仓库名不能重复，所以才创建前要判断。第二个是可选参数，用于指定数据的主键，以及是否自增主键。

### 创建索引
新建对象仓库以后，下一步可以新建索引。
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);
var db;
request.onupgradeneeded = function (event) {
    db = e.target.result;
    var objectStore;
    if (!db.objectStoreNames.contains('Users')) {
        const store = db.createObjectStore('Users', {keyPath: 'userId', autoIncrement: false});
        console.log('创建对象仓库成功');
    }
    objectStore.createIndex('userName', 'userName', { unique: false });
}
```

### 创建事务
现在我们有了数据库和对象仓库了，但目前仍不能存储数据了，我们还需要 —— 事务。
> 一个数据库事务通常包含了一个序列的对数据库的读/写操作。它的存在包含有以下两个目的: 
> 1. 为数据库操作序列提供了一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持一致性的方法。
> 2. 当多个应用程序在并发访问数据库时，可以在这些应用程序之间提供一个隔离方法，以防止彼此的操作互相干扰。

简单来说，事务就是用来保证数据库操作要么全部成功，要么全部失败的一种限制。
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);
var db;
request.onsuccess = function (event) {
    db = e.target.result;
    const tx = db.transaction('Users','readwrite');
}
```

使用 transaction() 来创建一个事务。transaction() 接受两个参数: 第一个是你要操作的对象仓库名称。第二个是你创建的事务模式。传入 readonly 时只能对对象仓库进行读操作，无法写操作。可以传入readwrite 进行读写操作。

### 操作数据
有了数据库、对象仓库、事务之后，我们就可以操作数据了: 
- add(): 增加数据。接收一个参数，为需要保存到对象仓库中的对象
- put(): 增加或修改数据。接收一个参数，为需要保存到对象仓库中的对象
- get(): 获取数据。接收一个参数，为需要获取数据的主键值
- delete(): 删除数据。接收一个参数，为需要获取数据的主键值
- clear(): 清除记录。无参数
- count(): 返回记录数量。接受 0 或一个参数，不带参数时，该方法返回当前对象仓库的所有记录数量。如果主键或 IDBKeyRange 对象作为参数，则返回对应的记录数量

> add 和 put 的作用类似，区别在于 put 保存数据时，如果该数据的主键在数据库中已经有相同主键的时候，则会修改数据库中对应主键的对象，而使用 add 保存数据，如果该主键已经存在，则保存失败。

#### add
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);
var db;

request.onsuccess = function (event) {
    db = e.target.result;
    const tx = db.transaction('Users','readwrite');
    const store = tx.objectStore('Users');

    // 保存数据
    const reqAdd = store.add({'userId': 1, 'userName': '1ess', 'userAge': 26});
    reqAdd.onsuccess = function (event) {
      console.log('保存成功')
    }
}
```

#### get
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);

request.onsuccess = function (event) {
    const db = e.target.result;
    const tx = db.transaction('Users','readwrite');
    const store = tx.objectStore('Users');
    // 获取数据
    const reqGet = store.get(1);
    reqGet.onsuccess = function (event) {
      console.log(this.result.userName);// 1ess
    }
}
```

#### delete
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);

request.onsuccess = function (event) {
    const db = e.target.result;
    const tx = db.transaction('Users','readwrite');
    const store = tx.objectStore('Users');
    // 删除数据
   const reqDelete = store.delete(1);

    reqDelete.onsuccess = function (event) {
      console.log('删除数据成功');    // 1ess
    }
}
```

### 使用游标
我们使用 get() 方法传入一个主键来获取数据，但是这样只能够获取到一条数据，如果我们想要获取多条数据了怎么办？我们可以使用游标，来获取一个区间内的数据。
要使用游标，我们需要先使用对象仓库的 openCursor() 方法，创建并打开。
openCursor() 方法接受两个参数: 第一个是范围，范围可以是一个 IDBKeyRange 对象。第二个参数是方向。
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);

request.onsuccess = function (event) {
    const db = e.target.result;
    const tx = db.transaction('Users','readwrite');
    const store = tx.objectStore('Users');
    const range = IDBKeyRange.bound(1,10);
    const req = store.openCursor(range, 'next');
    
    req.onsuccess = function (event) {
        const cursor = this.result;
        if(cursor){
            //通常将 cursor.value 添加到数组中
            cursor.continue();
        }else{
            console.log('检索结束');
        }
    }
}
```

### 使用索引
在上面代码中我们获取数据都是用的主键。但是在很多情况下我们并不知道我们需要数据的主键是什么，我们知道一个大概的条件，这个时候我们就需要用到索引来进行有条件查找。

#### 创建索引
使用对象仓库的 createIndex() 方法来创建一个索引。createIndex() 方法接收三个参数: 第一个参数 name 是索引名，不能重复。第二个参数 keyPath 是你要在存储对象上的那个属性上建立索引，可以是一个单个的 key 值，也可以是一个包含 key 值集合的数组。第三个参数 optionalParameters 是一个可选的对象参数{ unique, multiEntry }，unique: 用来指定索引值是否可以重复。multiEntry: 当第二个参数 keyPath 为一个数组时，如果 multiEntry 是 true，则会以数组中的每个元素建立一条索引。如果是 false，则以整个数组为 keyPath 值，添加一条索引。

``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);

request.onupgradeneeded = function (event) {
    const db = e.target.result;
    const store = db.createObjectStore('Users', {keyPath: 'userId', autoIncrement: false});
    const idx = store.createIndex('ageIndex','age',{unique: false})
}
```

#### 使用索引
在创建了一条索引之后我们就可以来使用它了。我们使用对象仓库上的 index 方法，通过传入一个索引名，来拿到一个索引对象。
``` javascript
const index = store.index('ageIndex');
```

然后我们就可以使用这个索引了。
``` javascript
const DBName = "IndexedDB";
const DBVersion = 1;
const request = indexedDB.open(DBName, DBVersion);

request.onsuccess = function (event) {
    const db = e.target.result;
    const tx = db.transaction('Users','readwrite');
    const store = tx.objectStore('Users');
    const index = store.index('ageIndex');

    const req = index.openCursor(IDBKeyRange.lowerBound(20), 'next');

    req.onsuccess = function (event) {
      const cursor = e.target.result;
        if(cursor){
            console.log(cursor.value.age);
            cursor.continue();
        }else{
            console.log('检索结束');
        }
    }
}
```