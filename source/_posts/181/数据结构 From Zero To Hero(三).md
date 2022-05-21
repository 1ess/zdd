---
title: 数据结构 From Zero To Hero(三)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog181.jpg
date: 2021/02/15
---

本篇，我们来介绍除了数组之外另一种线性结构 —— 链表(LinkedList)。

链表解决了数组存在的很多问题，当然也引入了新的问题。不同于数组，链表可以自动缩放。

每个链表元素称为节点(Node)，每个节点由两部分组成，分别称为数据域和指针域。我们把第一个节点称为头节点(HEAD)，最后一个节点称为尾节点(TAIL)。

链表还是之后两篇要学习的栈和队列的基础。我们一定要打好基础，现在让我们来自己构建一下链表的常用操作吧。

### 自己构建一个链表
``` csharp
// Node 节点
public class Node<T>
{
    public Node(T value)
    {
        Value = value;
    }

    public T Value { get; }
    public Node<T> Next { get; set; }
}

public class LinkedList<T>
{
    private Node<T> _first;
    private Node<T> _last;
    private int _size;
    
    public void AddFirst(T item)
    {
        var current = new Node<T>(item);
        if (IsEmpty())
        {
            _first = _last = current;
        }
        else
        {
            current.Next = _first;
            _first = current;
        }

        _size++;
    }

    public void AddLast(T item)
    {
        var current = new Node<T>(item);
        if (IsEmpty())
        {
            _first = _last = current;
        }
        else
        {
            _last.Next = current;
            _last = current;
        }

        _size++;
    }

    public void DeleteFirst()
    {
        if (IsEmpty())
        {
            throw new IndexOutOfRangeException();
        }

        if (_first == _last)
        {
            _first = _last = null;
        }
        else
        {
            var second = _first.Next;
            _first.Next = null;
            _first = second;
        }

        _size--;
    }

    public void DeleteLast()
    {
        if (IsEmpty())
        {
            throw new IndexOutOfRangeException();
        }

        if (_first == _last)
        {
            _first = _last = null;
        }
        else
        {
            var previous = GetPrevious(_last);
            if (previous == null) return;
            previous.Next = null;
            _last = previous;
        }

        _size--;
    }

    public bool Contains(T item)
    {
        return IndexOf(item) != -1;
    }

    public int IndexOf(T item)
    {
        var current = _first;
        var index = 0;
        while (current != null)
        {
            if (Equals(current.Value, item))
            {
                return index;
            }

            index++;
            current = current.Next;
        }

        return -1;
    }

    public T[] ToArray()
    {
        var array = new T[_size];
        var current = _first;
        var index = 0;
        while (current != null)
        {
            array[index++] = current.Value;
            current = current.Next;
        }

        return array;
    }

    public int Size()
    {
        return _size;
    }

    private bool IsEmpty()
    {
        return _first == null;
    }

    private Node<T> GetPrevious(Node<T> node)
    {
        var current = _first;
        while (current != null)
        {
            if (current.Next == node)
            {
                return current;
            }
            current = current.Next;
        }

        return null;
    }
}
```

### Types of Linked Listes
常见有两种链表: 
- 单向链表
- 双向链表
- 循环列表

我们刚才构建了自己的单向链表，并且知道了删除尾节点的时间复杂度为 O(n)，双向链表就可以解决这个问题。

### Reversing a Linked List
``` csharp
//        first        last 
// origin [10 -> 20 -> 30]
//         last         first
// reverse [10 <- 20 <- 30]

public void Reverse()
{
    var first = _first;
    var second = _first.Next;
    while(second != null)
    {
        var third = second.Next;
        second.Next = first;
        first = second;
        second = third;
    }

    _last = _first;
    _last.Next = null;
    _first = first;
}
```

### Kth Node from the End
``` csharp
// [10 -> 20 -> 30 -> 40 -> 50]
// K = 1 (50)
// K = 2 (40)
// K = 3 (30)

public T GetKthFromTheEnd(int k)
{
    if (IsEmpty())
    {
        throw new Exception("Linked List Can Not Be Null");
    }

    if (k <= 0 || k > _size)
    {
        throw new ArgumentOutOfRangeException();
    }

    var first = _first;
    var second = _first;
    var distance = k - 1;

    for (var i = 0; i < distance; i++)
    {
        second = second.Next;
    }

    while (second.Next != null)
    {
        second = second.Next;
        first = first.Next;
    }

    return first.Value;
}
```