---
title: 数据结构 From Zero To Hero(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog180.jpg
date: 2021/02/12
---

本篇，我们来介绍最基础、最简单的一种线性结构 —— 数组(Array)。

数组用来保存一系列的数据，这些数据都是按顺序存储在内存中。

我们知道，在很多语言中，数组大小都是初始固定、无法修改的，现在我们使用 C# 来构建一个动态数组，可以自动扩展大小。

### 自己构建一个数组
``` csharp
class Array<T>
{
    private T[] _array;
    private int _count;
    public Array(int length)
    {
        _array = new T[length];
    }

    public void Insert(T item)
    {
        var length = _array.Length;
        if (_count >= length)
        {
            var tempArray = new T[length * 2];
            for (var i = 0; i < length; i++)
            {
                tempArray[i] = _array[i];
            }

            _array = tempArray;
            
        }
        _array[_count++] = item;
    }

    public void RemoveAt(int index)
    {
        if (index < 0 || index >= _count)
        {
            throw new IndexOutOfRangeException();
        }

        for (var i = index; i < _count - 1; i++)
        {
            _array[i] = _array[i + 1];
        }
        _array[_count--] = default(T);
    }

    public int IndexOf(T item)
    {
        for (var i = 0; i < _count; i++)
        {
            if (Equals(item, _array[i]))
                return i;
        }

        return -1;
    }

    public bool Contains(T item)
    {
        for (var i = 0; i < _count; i++)
        {
            if (Equals(item, _array[i]))
                return true;
        }

        return false;
    }

    public T[] ToArray()
    {
        var temp = new T[_count];
        for (var i = 0; i < _count; i++)
        {
            temp[i] = _array[i];
        }
        return temp;
    }

    public int Size()
    {
        return _count;
    }
}
```