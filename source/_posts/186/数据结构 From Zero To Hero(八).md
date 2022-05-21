---
title: 数据结构 From Zero To Hero(八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog186.jpg
date: 2021/03/03
---

本篇，我们要来介绍计算机科学中第二个非常重要的非线性存储结构 —— 图(Graph)。

### What are Graphs
我们使用图来表示互相关联的对象，例如网络中的路由器或社交平台上的用户。与树一样，图也是由节点和边组成。如果边有方向，我们称之为有向图。有向图的每条边可以有权重。如果边没有方向，我们称之为无向图。
我们有两种方式实现图，一种为邻接矩阵(Adjacency Matrix)，另一种为邻接链表(Adjacency List)。

### Building a Graph
我们使用邻接链表构建一个有向图: 
``` csharp
public class Graph<T>
{
    private class Node
    {
        public T Label { get; set; }

        public Node(T label)
        {
            Label = label;
        }
    }

    private Dictionary<T, Node> nodes = new Dictionary<T, Node>();

    private Dictionary<Node, List<Node>> adjacencyList = new Dictionary<Node, List<Node>>();

    public void AddNode(T label)
    {
        var node = new Node(label);
        if (!nodes.Keys.Contains(label))
        {
            nodes.Add(label, node);
        }
        adjacencyList.Add(node, new List<Node>());
    }

    public void RemoveNode(T label)
    {
        var result = nodes.TryGetValue(label, out var node);
        if (!result)
        {
            return;
        }

        foreach (var source in adjacencyList.Keys)
        {
            adjacencyList[source].Remove(node);
        }
        adjacencyList.Remove(node);
        nodes.Remove(label);
    }

    public void AddEdge(T from, T to)
    {
        var fromResult = nodes.TryGetValue(from, out var fromNode);
        if (!fromResult)
        {
            throw new ArgumentException();
        }

        var toResult = nodes.TryGetValue(to, out var toNode);
        if (!toResult)
        {
            throw new ArgumentException();
        }

        var edgeResult = adjacencyList.TryGetValue(fromNode, out var edges);
        if (edgeResult)
        {
            edges.Add(toNode);
        }
    }

    public void RemoveEdge(T from, T to)
    {
        var fromResult = nodes.TryGetValue(from, out var fromNode);
        
        var toResult = nodes.TryGetValue(to, out var toNode);
        if (!toResult || !fromResult)
        {
            return;
        }

        adjacencyList[fromNode].Remove(toNode);
    }
}
```

### Traversal Algorithm
``` csharp
public void Traverse(T root)
{
    var result = nodes.TryGetValue(root, out var node);
    if (!result)
    {
        return;
    }
    Traverse(node, new HashSet<Node>());
}

private void Traverse(Node root, HashSet<Node> visited)
{
    Console.WriteLine(root);
    visited.Add(root);
    foreach (var node in adjacencyList[root])
    {
        if (!visited.Contains(node))
        {
            Traverse(node, visited);
        }
    }
}
```