---
title: Python(九)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog109.jpg
date: 2019/03/08
---

本篇，我们说说 Python 中的 IO 编程 —— 文件读写、StringIO 和 BytesIO 以及序列化。
IO 在计算机中指 Input/Output，也就是输入和输出。通常指的是磁盘、网络等。
IO 编程中，Stream(流)是一个很重要的概念，可以把流想象成一个水管，数据就是水管里的水，但是只能单向流动。Input Stream 就是数据从外面(磁盘、网络)流进内存，Output Stream 就是数据从内存流到外面去。

由于 CPU 和内存的速度远远高于外设的速度，所以，在 IO 编程中，就存在速度严重不匹配的问题。有两种办法: 
- 同步 IO
- 异步 IO

本篇的 IO 编程都是同步模式，异步 IO 由于复杂度太高，我们之后再说。

## 文件读写
***  
读写文件是最常见的 IO 操作。Python 内置了读写文件的函数。
读写文件前，我们先必须了解一下，在磁盘上读写文件的功能都是由操作系统提供的，现代操作系统不允许普通的程序直接操作磁盘，所以，读写文件就是请求操作系统打开一个文件对象(通常称为文件描述符)，然后，通过操作系统提供的接口从这个文件对象中读取数据(读文件)，或者把数据写入这个文件对象(写文件)。

### 读文件
要以读文件的模式打开一个文件对象，使用Python内置的open()函数，传入文件名和标示符: 
``` python
f = open('/Users/michael/test.txt', 'r')
```

标示符 'r' 表示读，这样，我们就成功地打开了一个文件。
如果文件不存在，open() 函数就会抛出一个 IOError(FileNotFoundError)的错误。

如果文件打开成功，接下来，调用 read() 方法可以一次读取文件的全部内容，Python 把内容读到内存: 
``` python
f.read()
# 'Hello, world!'
```

最后一步是调用 close() 方法关闭文件。文件使用完毕后必须关闭，因为文件对象会占用操作系统的资源，并且操作系统同一时间能打开的文件数量也是有限的: 
``` python
f.close()
```

由于文件读写时都有可能产生 IOError，一旦出错，后面的 f.close() 就不会调用。所以，为了保证无论是否出错都能正确地关闭文件，我们可以使用 try ... finally 来实现: 
``` python
try:
    f = open('/path/to/file', 'r')
    print(f.read())
finally:
    if f:
        f.close()
```

但是每次都这么写实在太繁琐，所以，Python 引入了 with 语句来自动帮我们调用 close() 方法: 
```python
with open('/path/to/file', 'r') as f:
    print(f.read())
```

调用 read() 会一次性读取文件的全部内容，如果文件有 10G，内存就爆了，所以，要保险起见，可以反复调用 read(size) 方法，每次最多读取 size 个字节的内容。另外，调用 readline() 可以每次读取一行内容，调用 readlines() 一次读取所有内容并按行返回 list。因此，要根据需要决定怎么调用。

### file-like Object
像 open() 函数返回的这种有个 read() 方法的对象，在 Python 中统称为 file-like Object。除了 file 外，还可以是内存的字节流，网络流，自定义流等等。file-like Object 不要求从特定类继承，只要写个 read() 方法就行。

StringIO 就是在内存中创建的 file-like Object，常用作临时缓冲。

### 二进制文件
前面讲的默认都是读取文本文件，并且是 UTF-8 编码的文本文件。要读取二进制文件，比如图片、视频等等，用 'rb' 模式打开文件即可: 
``` python
f = open('/Users/michael/test.jpg', 'rb')
f.read()
# b'\xff\xd8\xff\xe1\x00\x18Exif\x00\x00...' # 十六进制表示的字节
```

### 字符编码
要读取非 UTF-8 编码的文本文件，需要给 open() 函数传入 encoding 参数: 
``` python
f = open('/Users/michael/gbk.txt', 'r', encoding='gbk')
```

遇到有些编码不规范的文件，你可能会遇到 UnicodeDecodeError，因为在文本文件中可能夹杂了一些非法编码的字符。遇到这种情况，open() 函数还接收一个 errors 参数: 
``` python
f = open('/Users/michael/gbk.txt', 'r', encoding='gbk', errors='ignore')
```

### 写文件
写文件和读文件是一样的，唯一区别是调用 open() 函数时，传入标识符'w'或者'wb'表示写文本文件或写二进制文件，你可以反复调用 write() 来写入文件，但是务必要调用 f.close() 来关闭文件。当我们写文件时，操作系统往往不会立刻把数据写入磁盘，而是放到内存缓存起来，空闲的时候再慢慢写入。只有调用 close() 方法时，操作系统才保证把没有写入的数据全部写入磁盘。忘记调用 close() 的后果是数据可能只写了一部分到磁盘，剩下的丢失了。所以，还是用 with 语句来得保险: 
``` python
with open('/Users/michael/test.txt', 'w') as f:
    f.write('Hello, world!')
```

要写入特定编码的文本文件，请给 open() 函数传入 encoding 参数，将字符串自动转换成指定编码。
以 'w' 模式写入文件时，如果文件已存在，会直接覆盖(相当于删掉后新写入一个文件)。如果我们希望追加到文件末尾怎么办？可以传入 'a' 以追加(append)模式写入。

## StringIO
***  
很多时候，数据读写不一定是文件，也可以在内存中读写。StringIO 顾名思义就是在内存中读写 str。
要把 str 写入 StringIO，我们需要先创建一个 StringIO，然后，像文件一样写入即可: 
``` python
from io import StringIO
f = StringIO()
f.write('hello')
print(f.getvalue())
# hello
```

getvalue() 方法用于获得写入后的 str。
要读取 StringIO，可以用一个 str 初始化 StringIO，然后，像读文件一样读取: 
``` python
from io import StringIO
f = StringIO('Hello!\nHi!\nGoodbye!')
f.read()
# Hello!\nHi!\nGoodbye!
f.close()
```

## BytesIO
***  
StringIO 操作的只能是 str，如果要操作二进制数据，就需要使用 BytesIO。
``` python
from io import BytesIO
f = BytesIO()
f.write('中文'.encode('utf-8'))
# 6
print(f.getvalue())
# b'\xe4\xb8\xad\xe6\x96\x87'

from io import BytesIO
f = BytesIO(b'\xe4\xb8\xad\xe6\x96\x87')
f.read()
# b'\xe4\xb8\xad\xe6\x96\x87'
```

## 操作文件和目录
***  
Python 内置的 os 模块也可以直接调用操作系统提供的接口函数。
``` python
import os
os.name # 操作系统类型
'posix'
```

如果是 posix，说明系统是 Linux、Unix 或 macOS，如果是 nt，就是 Windows 系统。

要获取详细的系统信息，可以调用 uname() 函数: 
``` python
os.uname()
# posix.uname_result(sysname='Darwin', nodename='bogon', release='18.2.0', version='Darwin Kernel Version 18.2.0: Mon Nov 12 20:24:46 PST 2018; root:xnu-4903.231.4~2/RELEASE_X86_64', machine='x86_64')
```

注意: uname() 函数在 Windows 上不提供。

### 环境变量
在操作系统中定义的环境变量，全部保存在 os.environ 这个变量中，可以直接查看: 
``` python
os.environ
# environ({'VERSIONER_PYTHON_PREFER_32_BIT': 'no', 'TERM_PROGRAM_VERSION': '326', 'LOGNAME': 'michael', 'USER': 'michael', 'PATH': '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:/usr/local/mysql/bin', ...})
```

要获取某个环境变量的值，可以调用 os.environ.get('key'): 
``` python
os.environ.get('PATH')
# '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/share/dotnet:~/.dotnet/tools:/Library/Frameworks/Mono.framework/Versions/Current/Commands'
```

### 操作文件和目录
操作文件和目录的函数一部分放在 os 模块中，一部分放在 os.path 模块中，这一点要注意一下。查看、创建和删除目录可以这么调用: 
``` python
os.path.abspath('.')
# '/Users/michael'

os.path.join('/Users/michael', 'testdir')
'/Users/michael/testdir'

# 创建一个目录:
os.mkdir('/Users/michael/testdir')
# 删掉一个目录:
os.rmdir('/Users/michael/testdir')
```

把两个路径合成一个时，不要直接拼字符串，而要通过 os.path.join() 函数，这样可以正确处理不同操作系统的路径分隔符。同样的道理，要拆分路径时，也不要直接去拆字符串，而要通过 os.path.split() 函数，这样可以把一个路径拆分为两部分，后一部分总是最后级别的目录或文件名。
os.path.splitext() 可以直接让你得到文件扩展名: 
``` python
os.path.splitext('/path/to/file.txt')
# ('/path/to/file', '.txt')
```

文件操作使用下面的函数: 
``` python
# 对文件重命名:
os.rename('test.txt', 'test.py')
# 删掉文件:
os.remove('test.py')
```

复制文件的函数在os模块中不存在，shutil模块提供了copyfile()的函数，你还可以在shutil模块中找到很多实用函数，它们可以看做是os模块的补充。

我们可以利用 Python 的特性来过滤文件，列出当前目录下的所有目录: 
``` python
[x for x in os.listdir('.') if os.path.isdir(x)]
```

列出所有的 .py 文件: 
``` python
[x for x in os.listdir('.') if os.path.isfile(x) and os.path.splitext(x)[1]=='.py']
```

## 序列化
***  
我们把变量从内存中变成可存储或传输的过程称之为序列化，在 Python 中叫 pickling，在其他语言中也被称之为 serialization 等。序列化之后，就可以把序列化后的内容写入磁盘，或者通过网络传输到别的机器上。反过来，把变量内容从序列化的对象重新读到内存里称之为反序列化，即 unpickling。
Python 提供了 pickle 模块来实现序列化。

序列化操作: 
``` python
import pickle
d = dict(name='Bob', age=20, score=88)
pickle.dumps(d)
# b'\x80\x03}q\x00(X\x03\x00\x00\x00ageq\x01K\x14X\x05\x00\x00\x00scoreq\x02KXX\x04\x00\x00\x00nameq\x03X\x03\x00\x00\x00Bobq\x04u.'
```

pickle.dumps() 方法把任意对象序列化成一个 bytes，然后，就可以把这个 bytes 写入文件。或者用另一个方法 pickle.dump() 直接把对象序列化后写入一个 file-like Object: 
``` python
f = open('dump.txt', 'wb')
pickle.dump(d, f)
f.close()
```

当我们要把对象从磁盘读到内存时，可以先把内容读到一个 bytes，然后用 pickle.loads() 方法反序列化出对象，也可以直接用 pickle.load() 方法从一个 file-like Object 中直接反序列化出对象: 
``` python
f = open('dump.txt', 'rb')
d = pickle.load(f)
f.close()
d
# {'age': 20, 'score': 88, 'name': 'Bob'}
```

### JSON
如果我们要在不同的编程语言之间传递对象，就必须把对象序列化为标准格式，比如 JSON。
Python 内置的 json 模块提供了非常完善的 Python 对象到 JSON 格式的转换。
``` python
import json
d = dict(name='Bob', age=20, score=88)
json.dumps(d)
# '{"age": 20, "score": 88, "name": "Bob"}'
```

dumps() 方法返回一个 str，内容就是标准的 JSON。 类似的，dump() 方法可以直接把 JSON 写入一个 file-like Object。

要把 JSON 反序列化为 Python 对象，用 loads() 或者对应的 load() 方法，前者把 JSON 的字符串反序列化，后者从 file-like Object 中读取字符串并反序列化: 
``` python
json_str = '{"age": 20, "score": 88, "name": "Bob"}'
json.loads(json_str)
# {'age': 20, 'score': 88, 'name': 'Bob'}
```