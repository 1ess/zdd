---
title: 数据结构 From Zero To Hero(五)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog183.jpg
date: 2021/02/22
---

本篇，我们介绍另一种利用线性表创建的一种数据结构 —— 队列(Queues)。

队列在我们日常工作中也经常使用，例如打印机、操作系统等。

### Reversing a Queue
``` csharp
public void ReverseQueue<T>(Queue<T> q)
{
    var s = new Stack<T>();
    while (q.Count != 0)
    {
        s.Push(q.Dequeue());
    }
    while (s.Count != 0)
    {
        q.Enqueue(s.Pop());
    }
}
```

### 使用环形数组来构建队列
``` csharp
public class ArrayQueue<T>
{
    private class QueueOverFlowException : Exception
    {}

    private readonly T[] _queue;
    private int _count;

    private int _front;
    private int _rear;

    public ArrayQueue(int capacity)
    {
        _queue = new T[capacity];
    }

    public void Enqueue(T item)
    {
        if (_count == _queue.Length)
        {
            throw new QueueOverFlowException();
        }

        _queue[_rear] = item;
        _rear = (_rear + 1) % _queue.Length;
        _count++;
    }

    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException();
        }

        var item = _queue[_front];
        _queue[_front] = default(T);
        _front = (_front + 1) % _queue.Length;
        _count--;
        return item;
    }

    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException();
        }

        return _queue[_front];
    }

    public bool IsEmpty()
    {
        return _count == 0;
    }

    public bool IsFull()
    {
        return _count == _queue.Length;
    }

    public override string ToString()
    {
        return string.Format("[{0}]", string.Join(",", _queue));
    }

}
```

### 使用栈来构建队列
``` csharp
public class StackQueue<T>
{
    private class QueueOverFlowException : Exception
    { }

    private Stack<T> _pushStack;
    private Stack<T> _popStack;

    public void Enqueue(T item)
    {
        _pushStack.Push(item);
    }

    public T Dequeue()
    {
        if (IsEmpty())
        {
            throw new QueueOverFlowException();
        }

        PushStack2PopStack();

        return _popStack.Pop();
    }

    public T Peek()
    {
        if (IsEmpty())
        {
            throw new QueueOverFlowException();
        }

        PushStack2PopStack();

        return _popStack.Peek();
    }

    private void PushStack2PopStack()
    {
        if (_popStack.Count == 0)
        {
            while (_pushStack.Count != 0)
            {
                _popStack.Push(_pushStack.Pop());
            }
        }
    }

    public bool IsEmpty()
    {
        return _pushStack.Count == 0 && _popStack.Count == 0;
    }
}
```