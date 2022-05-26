---
title: Python(十)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog110.jpg
date: 2019/04/20
---

Python 既支持多进程，又支持多线程，本篇，我们看看如何编写这两种多任务程序。

## 多进程
***  
### fork()
Unix/Linux 操作系统提供了一个 fork() 系统调用，它非常特殊。普通的函数调用，调用一次，返回一次，但是 fork() 调用一次，返回两次，因为操作系统自动把当前进程(称为父进程)复制了一份(称为子进程)，然后，分别在父进程和子进程内返回。子进程永远返回 0，而父进程返回子进程的 ID。

Python 的 os 模块封装了常见的系统调用，其中就包括 fork，可以在 Python 程序中轻松创建子进程: 
``` python
import os

print('Process ({}) start...'.format(os.getpid()))
# Only works on Unix/Linux/Mac:
pid = os.fork()
if pid == 0:
    print('I am child process ({}) and my parent is {}.'.format(os.getpid(), os.getppid()))
else:
    print('I (%s) just created a child process (%s).' % (os.getpid(), pid))
```

### multiprocessing
Windows 没有 fork 调用，multiprocessing 模块就是跨平台版本的多进程模块。multiprocessing 模块提供了一个 Process 类来代表一个进程对象: 
``` python
from multiprocessing import Process
import os

# 子进程要执行的代码
def run_proc(name):
    print('Run child process {} ({})...'.format(name, os.getpid()))

if __name__=='__main__':
    print('Parent process {}.'.format(os.getpid()))
    p = Process(target=run_proc, args=('test',))
    print('Child process will start.')
    p.start()
    p.join()
    print('Child process end.')
```

创建子进程时，只需要传入一个执行函数和函数的参数，创建一个 Process 实例，用 start() 方法启动，join() 方法可以等待子进程结束后再继续往下运行，通常用于进程间的同步。

### Pool
如果要启动大量的子进程，可以用进程池的方式批量创建子进程: 
``` python
from multiprocessing import Pool
import os, time, random

def long_time_task(name):
    print('Run task %s (%s)...' % (name, os.getpid()))
    start = time.time()
    time.sleep(random.random() * 3)
    end = time.time()
    print('Task %s runs %0.2f seconds.' % (name, (end - start)))

if __name__=='__main__':
    print('Parent process %s.' % os.getpid())
    p = Pool(4)
    for i in range(5):
        p.apply_async(long_time_task, args=(i,))
    print('Waiting for all subprocesses done...')
    p.close()
    p.join()
    print('All subprocesses done.')
```

对 Pool 对象调用 join() 方法会等待所有子进程执行完毕，调用 join() 之前必须先调用 close()，调用 close() 之后就不能继续添加新的 Process 了。注意: Pool 的默认大小是 CPU 的核数。

### subprocess
``` python
import subprocess

print('$ nslookup www.python.org')
r = subprocess.call(['nslookup', 'www.python.org'])
print('Exit code:', r)
```

### 进程间通信
Process 之间肯定是需要通信的，操作系统提供了很多机制来实现进程间的通信。Python 的 multiprocessing 模块包装了底层的机制，提供了 Queue、Pipes 等多种方式来交换数据。
``` python
from multiprocessing import Process, Queue
import os, time, random

# 写数据进程执行的代码:
def write(q):
    print('Process to write: %s' % os.getpid())
    for value in ['A', 'B', 'C']:
        print('Put %s to queue...' % value)
        q.put(value)
        time.sleep(random.random())

# 读数据进程执行的代码:
def read(q):
    print('Process to read: %s' % os.getpid())
    while True:
        value = q.get(True)
        print('Get %s from queue.' % value)

if __name__=='__main__':
    # 父进程创建Queue，并传给各个子进程: 
    q = Queue()
    pw = Process(target=write, args=(q,))
    pr = Process(target=read, args=(q,))
    # 启动子进程pw，写入:
    pw.start()
    # 启动子进程pr，读取:
    pr.start()
    # 等待pw结束:
    pw.join()
    # pr进程里是死循环，无法等待其结束，只能强行终止:
    pr.terminate()
```

## 多线程
***  
高级语言通常都内置多线程的支持，Python 也不例外，并且，Python 的线程是真正的 Posix Thread，而不是模拟出来的线程。
Python 的标准库提供了两个模块: _thread 和 threading，_thread 是低级模块，threading 是高级模块，对 _thread 进行了封装。绝大多数情况下，我们只需要使用 threading 这个高级模块。
``` python
import time, threading

# 新线程执行的代码:
def loop():
    print('thread %s is running...' % threading.current_thread().name)
    n = 0
    while n < 5:
        n = n + 1
        print('thread %s >>> %s' % (threading.current_thread().name, n))
        time.sleep(1)
    print('thread %s ended.' % threading.current_thread().name)

print('thread %s is running...' % threading.current_thread().name)
t = threading.Thread(target=loop, name='LoopThread')
t.start()
t.join()
print('thread %s ended.' % threading.current_thread().name)
```

由于任何进程默认就会启动一个线程，我们把该线程称为主线程，主线程又可以启动新的线程，Python 的 threading 模块有个 current_thread() 函数，它永远返回当前线程的实例。主线程实例的名字叫 MainThread，子线程的名字在创建时指定，如果不起名字 Python 就自动给线程命名为 Thread-1，Thread-2 等。

### Lock
多线程和多进程最大的不同在于，多进程中，同一个变量，各自有一份拷贝存在于每个进程中，互不影响，而多线程中，所有变量都由所有线程共享，所以，任何一个变量都可以被任何一个线程修改。
``` python
import time, threading

# 假定这是你的银行存款:
balance = 0

def change_it(n):
    # 先存后取，结果应该为0:
    global balance
    balance = balance + n
    balance = balance - n

def run_thread(n):
    for i in range(100000):
        change_it(n)

t1 = threading.Thread(target=run_thread, args=(5,))
t2 = threading.Thread(target=run_thread, args=(8,))
t1.start()
t2.start()
t1.join()
t2.join()
print(balance)
```

两个线程同时一存一取，就可能导致余额不对，如果我们要确保 balance 计算正确，就要给 change_it() 上一把锁，当某个线程开始执行 change_it() 时，我们说，该线程因为获得了锁，因此其他线程不能同时执行 change_it()，只能等待，直到锁被释放后，获得该锁以后才能改。创建一个锁就是通过 threading.Lock() 来实现: 
``` python
balance = 0
lock = threading.Lock()

def run_thread(n):
    for i in range(100000):
        # 先要获取锁:
        lock.acquire()
        try:
            # 放心地改吧:
            change_it(n)
        finally:
            # 改完了一定要释放锁:
            lock.release()
```

当多个线程同时执行 lock.acquire() 时，只有一个线程能成功地获取锁，然后继续执行代码，其他线程就继续等待直到获得锁为止。
获得锁的线程用完后一定要释放锁，否则那些苦苦等待锁的线程将永远等待下去，成为死线程。所以我们用 try...finally 来确保锁一定会被释放。

Python 的线程虽然是真正的线程，但解释器执行代码时，有一个 GIL 锁: Global Interpreter Lock，任何 Python 线程执行前，必须先获得 GIL 锁，然后，每执行 100 条字节码，解释器就自动释放 GIL 锁，让别的线程有机会执行。这个 GIL 全局锁实际上把所有线程的执行代码都给上了锁，所以，多线程在 Python 中只能交替执行，即使 100 个线程跑在 100 核 CPU 上，也只能用到 1 个核。

GIL 是 Python 解释器设计的历史遗留问题，通常我们用的解释器是官方实现的 CPython，要真正利用多核，除非重写一个不带 GIL 的解释器。

Python 虽然不能利用多线程实现多核任务，但可以通过多进程实现多核任务。多个 Python 进程有各自独立的 GIL 锁，互不影响。

## ThreadLocal
***  
在多线程环境下，每个线程都有自己的数据。一个线程使用自己的局部变量比使用全局变量好，因为局部变量只有线程自己能看见，不会影响其他线程，而全局变量的修改必须加锁。
但是局部变量也有问题，就是在函数调用的时候，传递起来很麻烦: 
``` python
def process_student(name):
    std = Student(name)
    # std是局部变量，但是每个函数都要用它，因此必须传进去: 
    do_task_1(std)
    do_task_2(std)

def do_task_1(std):
    do_subtask_1(std)
    do_subtask_2(std)

def do_task_2(std):
    do_subtask_2(std)
    do_subtask_2(std)
```

为了解决这个问题，ThreadLocal 应运而生: 
``` python
import threading

# 创建全局ThreadLocal对象:
local_school = threading.local()

def process_student():
    # 获取当前线程关联的student:
    std = local_school.student
    print('Hello, %s (in %s)' % (std, threading.current_thread().name))

def process_thread(name):
    # 绑定ThreadLocal的student:
    local_school.student = name
    process_student()

t1 = threading.Thread(target= process_thread, args=('Alice',), name='Thread-A')
t2 = threading.Thread(target= process_thread, args=('Bob',), name='Thread-B')
t1.start()
t2.start()
t1.join()
t2.join()
```

全局变量 local_school 就是一个 ThreadLocal 对象，每个 Thread 对它都可以读写 student 属性，但互不影响。

## 进程 vs. 线程
***  
多进程模式最大的优点就是稳定性高，因为一个子进程崩溃了，不会影响主进程和其他子进程。(当然主进程挂了所有进程就全挂了，但是 Master 进程只负责分配任务，挂掉的概率低)著名的 Apache 最早就是采用多进程模式。
多进程模式的缺点是创建进程的代价大，在 Unix/Linux 系统下，用 fork 调用还行，在 Windows 下创建进程开销巨大。另外，操作系统能同时运行的进程数也是有限的，在内存和 CPU 的限制下，如果有几千个进程同时运行，操作系统连调度都会成问题。而且，多线程模式致命的缺点就是任何一个线程挂掉都可能直接造成整个进程崩溃，因为所有线程共享进程的内存。
在 Windows 下，多线程的效率比多进程要高，所以微软的 IIS 服务器默认采用多线程模式。由于多线程存在稳定性的问题，IIS 的稳定性就不如 Apache。为了缓解这个问题，IIS 和 Apache 现在又有多进程+多线程的混合模式。

## 计算密集型 vs. IO 密集型
***  
我们可以把任务分为计算密集型和 IO 密集型。
计算密集型任务的特点是要进行大量的计算，消耗 CPU 资源，比如计算圆周率、对视频进行高清解码等等，全靠 CPU 的运算能力。计算密集型任务由于主要消耗 CPU 资源，因此，代码运行效率至关重要。Python 这样的脚本语言运行效率很低，完全不适合计算密集型任务。

第二种任务的类型是 IO 密集型，涉及到网络、磁盘 IO 的任务都是 IO 密集型任务，这类任务的特点是 CPU 消耗很少，任务的大部分时间都在等待 IO 操作完成(因为 IO 的速度远远低于 CPU 和内存的速度)。对于 IO 密集型任务，任务越多，CPU 效率越高，但也有一个限度。常见的大部分任务都是 IO 密集型任务，比如 Web 应用。

## 异步 IO
***  
现代操作系统对 IO 操作已经做了巨大的改进，最大的特点就是支持异步 IO。如果充分利用操作系统提供的异步 IO 支持，就可以用单进程单线程模型来执行多任务，这种全新的模型称为事件驱动模型。

对应到 Python 语言，单线程的异步编程模型称为协程，有了协程的支持，就可以基于事件驱动编写高效的多任务程序。