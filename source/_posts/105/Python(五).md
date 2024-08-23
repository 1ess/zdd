---
title: Python(五)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog105.jpg
date: 2019/02/19
---

本篇，我们说说 Python 中的面向对象编程的基本概念。

## 概念
***  
面向对象最重要的概念就是类(Class)和实例(Instance)。一个类(Class)能够创建一种新的类型(Type)，其中对象(Object)就是类的实例(Instance)。可以这样来类比: 你可以拥有类型 int 的变量，也就是说存储整数的变量是 int 类的实例(对象)。
注意: Python 中，即使是整数也会被视为对象(int 类的对象)，类似 C# 和 Java 中的装箱与拆箱。

对象可以使用属于它的普通变量来存储数据。这种从属于对象或类的变量叫作字段(Field)。对象还可以使用属于类的函数来实现某些功能，这种函数叫作类的方法(Method)。这两个术语很重要，它有助于我们区分函数与变量，哪些是独立的，哪些又是属于类或对象的。总之，字段与方法通称类的属性(Attribute)。

字段有两种类型 —— 它们属于某一类的各个实例或对象，或是从属于某一类本身。它们被分别称作实例变量(Instance Variables)与类变量(Class Variables)。

### self
类方法与普通函数只有一种特定的区别 —— 前者必须多加一个参数在参数列表开头，但是你不用在你调用这个功能时为这个参数赋值，Python 会为它提供。这种特定的变量引用的是对象本身，按照惯例，它被赋予 self 这一名称。

### 类
在Python中，定义类是通过 class 关键字: 
``` python
class Person:
    pass  # 一个空的代码块

p = Person()
print(p)
```
我们通过采用类的名称后跟一对括号的方法，给这个类创建一个对象。

### 方法
``` python
class Person:
    def say_hi(self):
        print('Hello, how are you?')

p = Person()
p.say_hi()
```

### \_\_init\_\_ 方法
在 Python 的类中，有不少方法的名称具有着特殊的意义。\_\_init\_\_ 方法会在类的对象被实例化(Instantiated)时立即运行。相当于其他语言中的构造方法。
``` python
class Person:
    def __init__(self, name):
        self.name = name

    def say_hi(self):
        print('Hello, my name is', self.name)

p = Person('Swaroop')
p.say_hi()
```

### 类变量与对象变量
字段(Field)有两种类型 —— 类变量与对象变量，它们根据究竟是类还是对象拥有这些变量来进行分类。

类变量(Class Variable)是共享的(Shared)—— 它们可以被属于该类的所有实例访问。该类变量只拥有一个副本，当任何一个对象对类变量作出改变时，发生的变动将在其它所有实例中都会得到体现。
对象变量(Object variable)由类的每一个独立的对象或实例所拥有。在这种情况下，每个对象都拥有属于它自己的字段的副本。
``` python
class Robot:
    """表示有一个带有名字的机器人。"""

    # 一个类变量，用来计数机器人的数量
    population = 0

    def __init__(self, name):
        """初始化数据"""
        self.name = name
        print("(Initializing {})".format(self.name))

        # 当有人被创建时，机器人
        # 将会增加人口数量
        Robot.population += 1

    def die(self):
        """我挂了。"""
        print("{} is being destroyed!".format(self.name))

        Robot.population -= 1

        if Robot.population == 0:
            print("{} was the last one.".format(self.name))
        else:
            print("There are still {:d} robots working.".format(
                Robot.population))

    def say_hi(self):
        """来自机器人的诚挚问候

        没问题，你做得到。"""
        print("Greetings, my masters call me {}.".format(self.name))

    @classmethod
    def how_many(cls):
        """打印出当前的人口数量"""
        print("We have {:d} robots.".format(cls.population))


droid1 = Robot("R2-D2")
droid1.say_hi()
Robot.how_many()

droid2 = Robot("C-3PO")
droid2.say_hi()
Robot.how_many()

print("\nRobots can do some work here.\n")

print("Robots have finished their work. So let's destroy them.")
droid1.die()
droid2.die()

Robot.how_many()
```

上例中，population 属于 Robot 类，因此它是一个类变量。name 变量属于一个对象(通过使用 self 分配)，因此它是一个对象变量。
因此，我们通过 Robot.population 而非 self.population 引用 population 类变量。我们对于 name 对象变量采用 self.name 标记法加以称呼。
注意: 当一个对象变量与一个类变量名称相同时，类变量将会被隐藏。如果访问实例属性不存在的话，会继续访问类属性。

除了 Robot.popluation，我们还可以使用 self.\_\_class\_\_.population，因为每个对象都通过 self.\_\_class\_\_ 属性来引用它的类。

how_many 实际上是一个属于类而非属于对象的方法。这就意味着我们可以将它定义为一个 classmethod(类方法) 或是一个 staticmethod(静态方法)。我们使用装饰器(Decorator)将 how_many 方法标记为类方法。

classmethod 和 staticmethod 方法区别是 classmethod 有一个名为 cls 参数，指向该类。

可以将装饰器想象为调用一个包装器(Wrapper)函数的快捷方式，因此启用 @classmethod 装饰器等价于调用: 
``` python
how_many = classmethod(how_many)
```

注意: Python 中所有类成员(包括数据成员)都是公开的，并且所有的方法都是虚方法(Virtual)。

### 继承和多态
面向对象编程的一大优点是对代码的重用(Reuse)，重用的一种实现方法就是通过继承(Inheritance)机制。
新类会被称作基类(Base Class)或是超类(Superclass)。被继承的类会被称作派生类(Derived Classes)或是子类(Subclass)。
``` python
class SchoolMember:
    '''代表任何学校里的成员。'''
    def __init__(self, name, age):
        self.name = name
        self.age = age
        print('(Initialized SchoolMember: {})'.format(self.name))

    def tell(self):
        '''告诉我有关我的细节。'''
        print('Name:"{}" Age:"{}"'.format(self.name, self.age), end=" ")


class Teacher(SchoolMember):
    '''代表一位老师。'''
    def __init__(self, name, age, salary):
        SchoolMember.__init__(self, name, age)
        self.salary = salary
        print('(Initialized Teacher: {})'.format(self.name))

    def tell(self):
        SchoolMember.tell(self)
        print('Salary: "{:d}"'.format(self.salary))


class Student(SchoolMember):
    '''代表一位学生。'''
    def __init__(self, name, age, marks):
        SchoolMember.__init__(self, name, age)
        self.marks = marks
        print('(Initialized Student: {})'.format(self.name))

    def tell(self):
        SchoolMember.tell(self)
        print('Marks: "{:d}"'.format(self.marks))

t = Teacher('Mrs. Shrividya', 40, 30000)
s = Student('Swaroop', 25, 75)

# 打印一行空白行
print()

members = [t, s]
for member in members:
    # 对全体师生工作
    member.tell()
```

要想使用继承，在定义类时我们需要在类后面跟一个包含基类名称的元组。然后，我们会注意到基类的 \_\_init\_\_ 方法是通过 self 变量被显式调用的，因此我们可以初始化对象的基类部分。Python 不会自动调用基类的构造函数，你必须自己显式地调用它。

相反，如果我们没有在一个子类中定义一个 \_\_init\_\_ 方法，Python 将会自动调用基类的构造函数。

上例中，我们发现被调用的是子类型的 tell 方法，而不是 SchoolMember 的 tell 方法。理解这一问题的一种思路是 Python 总会从当前的实际类型中开始寻找方法，也就是多态。

end 参数用在超类的 tell() 方法的 print 函数中，目的是打印一行并允许下一次打印在同一行继续。这是一个让 print 能够不在打印的末尾打印出 \n (新行换行符)符号的小窍门。

## 获取对象信息
***  
当我们拿到一个对象的引用时，如何知道这个对象是什么类型、有哪些方法呢？

### type()
基本类型都可以用 type() 判断: 
``` python
type(123)
# <class 'int'>
type('str')
# <class 'str'>
type(None)
# <type(None) 'NoneType'>
```

如果一个变量指向函数或者类，也可以用 type() 判断: 
``` python
type(abs)
# <class 'builtin_function_or_method'>
type(fn)
# <class 'function'>
type(p)
# <class '__main__.Person'>
```

type() 函数返回的是什么类型呢？它返回对应的 Class 类型: 
``` python
type(123)==type(456)
# True
type(123)==int
# True
type('abc')==type('123')
# True
type('abc')==str
# True

import types
type(fn)==types.FunctionType
# True
type(abs)==types.BuiltinFunctionType
# True
type(lambda x: x)==types.LambdaType
# True
type((x for x in range(10)))==types.GeneratorType
# True
```

### isinstance()
对于继承关系来说，使用 type() 就很不方便。我们要判断 class 的类型，可以使用 isinstance() 函数。
继承关系如下: 
object -> Animal -> Dog -> Husky
``` python
a = Animal()
d = Dog()
h = Husky()

isinstance(h, Husky)
# True
isinstance(h, Dog)
# True
isinstance(d, Husky)
# False
```

能用 type() 判断的基本类型也可以用 isinstance() 判断: 
``` python
isinstance('a', str)
# True
isinstance(b'a', bytes)
# True
```

并且还可以判断一个变量是否是某些类型中的一种: 
``` python
isinstance([1, 2, 3], (list, tuple))
# True
isinstance((1, 2, 3), (list, tuple))
# True
```

### dir()
如果要获得一个对象的所有属性和方法，可以使用 dir() 函数，它返回一个包含字符串的 list。
``` python
dir('ABC')
# ['__add__', '__class__',..., '__subclasshook__', 'capitalize', 'casefold',..., 'zfill']
```

类似 \_\_xxx\_\_ 的属性和方法在 Python 中都是有特殊用途的，比如 \_\_len\_\_ 方法返回长度。在 Python 中，如果你调用 len() 函数试图获取一个对象的长度，实际上，在 len() 函数内部，它自动去调用该对象的 \_\_len\_\_() 方法: 
``` python
len('ABC')
# 3
'ABC'.__len__()
# 3
```

我们自己写的类，如果也想用 len(myObj) 的话，就自己写一个 \_\_len\_\_() 方法: 
``` python
class MyDog(object):
     def __len__(self):
         return 100

dog = MyDog()
len(dog)
# 100
```

通过 getattr()、setattr() 以及 hasattr() 方法，我们可以直接操作一个对象的状态: 
``` python
hasattr(obj, 'x') # 有属性'x'吗？
# True
obj.x
# 9
hasattr(obj, 'y') # 有属性'y'吗？
# False
setattr(obj, 'y', 19) # 设置一个属性'y'
hasattr(obj, 'y') # 有属性'y'吗？
# True
getattr(obj, 'y') # 获取属性'y'
# 19
obj.y # 获取属性'y'
# 19
```

注意: 如果试图获取不存在的属性，会抛出 AttributeError 的错误。可以传入一个default参数，如果属性不存在，就返回默认值: 
``` python
getattr(obj, 'z', 404) # 获取属性'z'，如果不存在，返回默认值404
# 404
```