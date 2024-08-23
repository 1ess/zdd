---
title: Python(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog102.jpg
date: 2019/02/04
---

上篇我们说了 Python 中的一些基本数据类型，本篇我们来说说 Python 内置数据结构。

Python 中有四种内置的数据结构 —— 列表(List)、元组(Tuple)、字典(Dictionary)和集合(Set)。

## 列表(List)
***  
列表 是一种用于保存一系列有序项目的集合。使用方括号将数据元素包裹表示，我们可以添加或删除项目，所以说列表是一种可变的(Mutable)数据类型。
需要注意: Python 中的 list 里面的元素的数据类型也可以不同。

### 初始化
常用的列表创建方式有两种: 字面量语法与 list() 内置函数。内置函数 list(iterable) 可以把任何一个可迭代对象转换为列表。
``` python
# 字面量语法
shoplist = ['apple', 'mango', 'carrot', 'banana']
# ['apple', 'mango', 'carrot', 'banana']

# list 函数
list('foo')
# ['f', 'o', 'o']
```

### len() 函数
``` python
print('I have', len(shoplist), 'items to purchase.')
# 4
```

### 索引
用索引来访问 list 中每一个位置的元素，与之前说过的语言一样，索引是从 0 开始的: 
``` python
print('The first item I will buy is', shoplist[0])
# The first item I will buy is apple
```

当索引超出了范围时，Python 会报一个 IndexError 错误。

如果要取最后一个元素，除了计算索引位置外，还可以用 -1 做索引，直接获取最后一个元素: 
``` python
print('The last item I will buy is', shoplist[-1])
# banana
```
以此类推，可以获取倒数第 2 个、倒数第 3 个，并且也要注意越界问题。

### extend() 函数
我们可以使用扩展函数来扩展数组: 
``` python
list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c', 'd']
list1.extend(list2)
print(list1)
# [1, 2, 3, 4, 5, 'a', 'b', 'c', 'd']
```

### append() 函数
list 是一个可变的有序表，所以，可以往 list 中追加元素到末尾: 
``` python
print('\nI also have to buy rice.')
shoplist.append('rice')
print('My shopping list is now', shoplist)
# My shopping list is now ['apple', 'mango', 'carrot', 'banana', 'rice']

list1 = [1, 2, 3, 4, 5]
list2 = ['a', 'b', 'c', 'd']
list1.append(list2)
print(list1)
# [1, 2, 3, 4, 5, ['a', 'b', 'c', 'd']]
```
注意: append() 函数与 extend() 函数的区别。

### insert() 函数
也可以往 list 中追加元素到任意位置: 
``` python
print('\nI have to buy coco first.')
shoplist.insert(0, 'coco')
print('My shopping list is now', shoplist)
# My shopping list is now ['coco', 'apple', 'mango', 'carrot', 'banana', 'rice']
```

### pop() 函数
要删除 list 末尾的元素，用 pop() 方法: 
``` python
old = shoplist.pop()
print('I bought the ', old)
# rich
```

要删除指定位置的元素，用 pop(i) 方法，其中 i 是索引位置: 
``` python
old = shoplist.pop(0)
print('I bought the ', old)
# coco
```

注意: 我们还可以使用 del 来删除数据元素: 
``` python
del shoplist[0]
# coco
```

### remove() 函数
remove() 函数可以移除某一元素: 
``` python
list1 = ['a', 'b', 'c', 'd']
list1.remove('c')
print(list1)
# ['a', 'b', 'd']
```

### clear() 函数
clear() 函数可以清空列表: 
``` python
list1 = [1, 2, 3, 4]
list1.clear()
print(list1)
# []
```

### 赋值
要把某个元素替换成别的元素，可以直接赋值给对应的索引位置: 
``` python
shoplist[0] = orange
# ['orange', 'apple', 'mango', 'carrot', 'banana', 'rice']
```

### sort() 函数
我们对列表使用 sort 方法进行排序，在这里要着重理解到这一方法影响到的是列表本身，而不会返回一个修改过的列表 —— 这与修改字符串的方式并不相同。同时，这也是我们所说的，列表是可变的(Mutable)而字符串是不可变的(Immutable)。
``` python
shoplist.sort()
print('Sorted shopping list is', shoplist)
# Sorted shopping list is ['apple', 'banana', 'carrot', 'mango', 'orange', 'rice']
```

我们可以传递 reverse=True 使得按字母顺序反序排序: 
``` python
shoplist.sort()
print('Sorted shopping list is', shoplist)
# Sorted shopping list is ['rice', 'orange', 'mango', 'carrot', 'banana', 'apple']
```

### reverse() 函数
我们使用 reverse() 函数反转列表: 
``` python
shoplist.reverse()
print('Reverse shopping list is', shoplist)
# Reverse shopping list is ['banana', 'carrot', 'mango', 'apple']
```

### copy() 函数
copy() 函数对列表执行深拷贝: 
``` python
list1 = ['a', 'b', 'c', 'd']
list2 = list2.copy()

list2[0] = 'e'

print(list1)
# ['a', 'b', 'c', 'd']

print(list2)
# ['e', 'b', 'c', 'd']
```

### 列表推导式
列表推导式将 for 循环与创建新元素代码合并成一行，并自动附加新元素: 
``` python
squares = [value ** 2 for value in range(1, 11)]
print(squares)
# [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]

items = [x ** 2 for x in range(1, 11) if x % 2 == 0]
# [4, 16, 36, 64, 100]
```
基本语法是: 指定一个左方括号，并定义一个表达式，用于生成你要存储到列表中的值，如: value ** 2，接下来编写一个 for 循环，用于给表达式提供值，还可以提供一个可选条件，再加上右方括号。

## 元组(Tuple)
***  
元组(Tuple)用于将多个对象保存到一起。你可以将它们近似地看作列表，但是元组不能提供列表类能够提供给你的广泛的功能。元组的一大特征类似于字符串，它们是不可变的，也就是说，你不能编辑或更改元组。使用小括号将数据元素包裹表示，尽管括号是一个可选选项。
不可变的 tuple 有什么意义？因为 tuple 不可变，所以代码更安全。如果可能，能用 tuple 代替 list 就尽量用 tuple。

### 初始化
``` python
zoo = ('python', 'elephant', 'penguin')
# ('python', 'elephant', 'penguin')
new_zoo = 'monkey', 'camel', zoo
# ('monkey', 'camel', ('python', 'elephant', 'penguin'))
```

一个只拥有一个项目的元组并不像这样简单。你必须在第一个(也是唯一一个)项目的后面加上一个逗号来指定它，如此一来 Python 才可以识别出在这个表达式想表达的究竟是一个元组还是只是一个被括号所环绕的对象: 
``` python
singleton = (2, )
```

### len() 函数
``` python
print('Number of animals in the zoo is', len(zoo))
# Number of animals in the zoo is 3

print('Number of cages in the new zoo is', len(new_zoo))
# Number of cages in the new zoo is 3
```

### 索引
``` python
print('Animals brought from old zoo are', new_zoo[2])
#Animals brought from old zoo are ('python', 'elephant', 'penguin')

print('Last animal brought from old zoo is', new_zoo[2][2])
# Last animal brought from old zoo is penguin
```

### 元组推导式(No)
列表有自己的列表推导式。而元组和列表那么像，是不是也有自己的推导式呢? 
``` python
results = (n * 100 for n in range(10) if n % 2 == 0) >>> results <generator object 
# <genexpr> at 0x10e94e2e0>
```

上面的表达式并没有生成元组，而是返回了一个生成器（generator）对象。因此它是生成器推导式，而非元组推导式。
虽然无法通过推导式直接拿到元组，但生成器仍然是一种可迭代类型，所以我们还是可以对它调用tuple()函数，获得元组: 
``` python
results = tuple((n * 100 for n in range(10) if n % 2 == 0)) 
# results (0, 200, 400, 600, 800)
```

## 字典(Dictionary)
***  
字典在其他语言中也称为 map，使用键-值(key-value)存储。
要注意的是你只能使用不可变的对象(如字符串)作为字典的键值，但是你可以使用可变或不可变的对象作为字典中的值。基本上这段话也可以翻译为你只能使用简单对象作为键值。

在字典中，你可以通过使用符号构成 d = {key : value1 , key2 : value2} 这样的形式，来成对地指定键值与值。在这里要注意到成对的键值与值之间使用冒号分隔，而每一对键值与值则使用逗号进行区分，它们全都由一对花括号括起。

### 初始化
``` python
ab = {
    'Swaroop': 'swaroop@swaroopch.com',
    'Larry': 'larry@wall.org',
    'Matsumoto': 'matz@ruby-lang.org',
    'Spammer': 'spammer@hotmail.com'
}
```

### len() 函数
len() 函数用来获取键值对数目: 
``` python
print('\nThere are {} contacts in the address-book\n'.format(len(ab)))
# There are 3 contacts in the address-book
```

### 查找与赋值
``` python
print("Swaroop's address is", ab['Swaroop'])
# Swaroop's address is swaroop@swaroopch.com

# 添加一对键值—值配对
ab['Guido'] = 'guido@python.org'
```

注意: 如果 key 不存在，Python 会报一个 KeyError 错误。

要避免 key 不存在的错误，有两种办法，
一是通过 in 判断 key 是否存在: 
``` python
if 'Guido' in ab:
    print("Guido's address is", ab['Guido'])
    # Guido's address is guido@python.org
```

二是通过 dict 提供的 get() 方法，如果 key 不存在，可以返回 None，或者自己指定的 value: 
``` python
ab.get('Bob')
# None

ab.get('Bob', 'Name is not exist')
# 'Name is not exist'
```

### pop() 函数
要删除一个 key，用 pop(key) 方法，对应的 value 也会从 dict 中删除: 
``` python
ab.pop('Spammer')
# spammer@hotmail.com
```

同 list 一样，也可以使用 del 删除一对键值对: 
``` python
s = del ab['Spammer']
# spammer@hotmail.com
```

###  遍历
当我们直接遍历一个字典对象时，会逐个拿到字典所有的 key。如果你想在遍历字典时同时获取 key 和 value，需要使用字典的 items() 方法: 
``` python
# 遍历获取字典所有的 key 
for key in movie: 
    ... 
    print(key, movie[key]) 

# 一次获取字典的所有 key: value 键值对 
for key, value in movie.items(): 
    ... 
    print(key, value)
```

### 字典推导式
与列表推导式类似，字典也可以使用推导式: 
``` python
items = ['a', 'b', 'c']
dic = {x: 0 for x in items}
# {'a': 0, 'b': 0, 'c': 0}
```

## 序列
***  
列表、元组和字符串可以看作序列(Sequence)的某种表现形式。序列的主要功能是资格测试(也就是 in 与 not in 表达式)和索引操作(Indexing Operations)，它们能够允许我们直接获取序列中的特定项目。

上面所提到的序列的三种形态 —— 列表、元组与字符串，同样拥有一种切片(Slicing)运算符，它能够允许我们序列中的某段切片 —— 也就是序列之中的一部分。

使用切片操作来生成一份序列的副本。
``` python
shoplist = ['apple', 'mango', 'carrot', 'banana']

# Slicing on a list #
print('Item 1 to 3 is', shoplist[1:3])
# Item 1 to 3 is ['mango', 'carrot']
print('Item 2 to end is', shoplist[2:])
# Item 2 to end is ['carrot', 'banana']
print('Item 1 to -1 is', shoplist[1:-1])
# Item 1 to -1 is ['mango', 'carrot']
print('Item start to end is', shoplist[:])
# Item start to end is ['apple', 'mango', 'carrot', 'banana']
```
``` python
name = 'swaroop'

# 从某一字符串中切片 #
print('characters 1 to 3 is', name[1:3])
# characters 1 to 3 is wa
print('characters 2 to end is', name[2:])
# characters 2 to end is aroop
print('characters 1 to -1 is', name[1:-1])
# characters 1 to -1 is waroo
print('characters start to end is', name[:])
# characters start to end is swaroop
```

在切片操作中，第一个数字(冒号前面的那位)指的是切片开始的位置，第二个数字(冒号后面的那位)指的是切片结束的位置。如果第一位数字没有指定，Python 将会从序列的起始处开始操作。如果第二个数字留空，Python 将会在序列的末尾结束操作。要注意的是切片操作会在开始处返回 start，并在 end 前面的位置结束工作。也就是说，序列切片将包括起始位置，但不包括结束位置。

你同样可以在切片操作中提供第三个参数，这一参数将被视为切片的步长(Step)(在默认情况下，步长大小为 1): 
``` python
shoplist = ['apple', 'mango', 'carrot', 'banana']
shoplist[::1]
# ['apple', 'mango', 'carrot', 'banana']
shoplist[::2]
# ['apple', 'carrot']
```

## 集合(Set)
***  
集合(Set)是简单对象的无序集合(Collection)。当集合中的项目存在与否比起次序或其出现次数更加重要时，我们就会使用集合。

### 初始化
要创建一个 set，需要提供一个 list 作为输入集合: 
``` python
bri = set(['brazil', 'russia', 'india'])
# {'russia', 'brazil', 'india'}
```

重复元素在set中自动被过滤: 
``` python
bri = set(['brazil', 'russia', 'india', 'brazil'])
# {'russia', 'brazil', 'india'}
```

### add(key) 函数
通过 add(key) 方法可以添加元素到 set 中，可以重复添加，但不会有效果: 
``` python
bric.add('china')
# {'russia', 'brazil', 'india', 'china'}
```

### remove(key) 函数
通过 remove(key) 方法可以删除元素: 
``` python
bric.remvoe('china')
# {'russia', 'brazil', 'india'}
```

### 集合操作
set 可以看成数学意义上的无序和无重复元素的集合，因此，两个 set 可以做数学意义上的交集、并集等操作: 
``` python
s1 = set([1, 2, 3])
s2 = set([2, 3, 4])

s1 & s2
# {2, 3}

s1 | s2
# {1, 2, 3, 4}
```

注意: set 不可以放入可变对象。因为无法判断两个可变对象是否相等，也就无法保证 set 内部"不会有重复元素"。

## 字符串
***  
早些时候我们已经详细讨论过了字符串，我们在介绍一些常用函数。

### startswith() 函数
``` python
name = 'Swaroop'

if name.startswith('Swa'):
    print('Yes, the string starts with "Swa"')
    # Yes, the string starts with "Swa"
```

### find() 函数
``` python
if name.find('war') != -1:
    print('Yes, it contains the string "war"')
    # Yes, it contains the string "war"
```

### join() 函数
``` python
delimiter = '_*_'
mylist = ['Brazil', 'Russia', 'India', 'China']
print(delimiter.join(mylist))
# Brazil_*_Russia_*_India_*_China
```

### title() 函数
title() 函数以首字母大写方式显示每个单词: 
``` python
name = 'ada lovelace'
print(name.title())
# Ada Lovelace
```

### lower() 和 upper() 函数
lower() 函数使得字符串全部转为小写字母，upper() 函数使得字符串全部转为大写字母: 
``` python
name = 'Ada Lovelace'
print(name.lower())
# ada lovelace

print(name.upper())
# ADA LOVELACE
```

### strip() 函数
strip() 函数可以删除字符串两侧的空白: 
``` python
favorite_language = '  python  '
print(favorite_language.strip())
# 'python'

print(favorite_language.lstrip())
# 'python  '

print(favorite_language.rstrip())
# '  python'
```

### split() 函数
split() 函数可以根据指定字符串将源串分割为数组: 
``` python
country = 'Brazil Russia India China'
print(country.split(' '))
# ['Brazil', 'Russia', 'India', 'China']
```

### index() 函数
index() 函数可以查找字符串所在索引位置: 
``` python
country = 'Brazil Russia India China'
print(country.index('a'))
# 2
```

### replace() 函数
replace() 函数可以替换字符串: 
``` python
country = 'Brazil Russia India China'
new_country = country.replace('India', 'USA')
print(new_country)
# Brazil Russia USA China
```