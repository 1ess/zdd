---
title: 数据结构 From Zero To Hero(六)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog184.jpg
date: 2021/02/27
---

本篇，我们介绍一种用于超快检索的数据结构 —— 哈希表(Hash Tables)或者称为字典(Dictionary)。

几乎所有的编程语言都有对应的实现，例如 Java 中的 HashMap、JavaScript 中的 Object、C# 中的 Dictionary。

### First Non-repeated Character
``` csharp
private static char FirstNonRepeatedCharacter(string input)
{
    var map = new Dictionary<char, int>();
    foreach (var ch in input)
    {
        var count = map.Keys.Contains(ch) ? map[ch] : 0;
        map[ch] = count++;
    }

    foreach (var item in input)
    {
        if (map[item] == 1)
        {
            return item;
        }
    }

    return default(char);
}
```

### Hash Collision
哈希函数会使用哈希算法根据输入计算出哈希表的 Value 实际存储的索引，可能发生不同输入计算出同一索引值的情况，这种我们就称之为哈希碰撞。

<img src="https://cdn.0xfee1dead.cn/contentImg/hashtable/hash_collision.png" width="400px" alt="">

比较常用的有两种方式解决哈希碰撞: 
1. Chaining
2. Open Addressing

### 自己构建一个哈希表
``` csharp
class HashTable<T1, T2>
{
    private class Entry
    {
        public Entry(T1 key, T2 value)
        {
            Key = key;
            Value = value;
        }
        public T1 Key;
        public T2 Value;
    }

    private LinkedList<Entry>[] enties;

    public HashTable(int capacity)
    {
        enties = new LinkedList<Entry>[capacity];
    }

    public void Put(T1 key, T2 value)
    {
        var entry = GetEntry(key);
        if (entry != null)
        {
            entry.Value = value;
            return;
        }

        GetOrCreateBucket(key).AddLast(new Entry(key, value));
    }

    public T2 Get(T1 key)
    {
        var entry = GetEntry(key);
        return entry == null ? default(T2) : entry.Value;
    }

    public void Remove(T1 key)
    {
        var entry = GetEntry(key);
        if (entry != null)
        {
            var bucket = GetBucket(key);
            bucket.Remove(entry);
        }
    }

    private LinkedList<Entry> GetBucket(T1 key)
    {
        return enties[Hash(key)];
    }

    private LinkedList<Entry> GetOrCreateBucket(T1 key)
    {
        var index = Hash(key);
        if (enties[index] == null)
        {
            enties[index] = new LinkedList<Entry>();
        }
        return enties[index];
    }

    private Entry GetEntry(T1 key)
    {
        var index = Hash(key);
        var bucket = enties[index];
        if (bucket != null)
        {
            foreach (var entry in bucket)
            {
                if (entry.Key.Equals(key))
                {
                    return entry;
                }
            }
        }
        return null;
    }

    private int Hash(T1 key)
    {
        return Math.Abs(key.GetHashCode() % enties.Length);
    }
}
```