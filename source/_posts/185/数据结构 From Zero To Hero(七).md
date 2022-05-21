---
title: 数据结构 From Zero To Hero(七)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog185.jpg
date: 2021/03/01
---

之前几篇，我们介绍的都是线性存储结构，从本篇开始，我们要来介绍计算机科学中两个非常重要的非线性存储结构，其中之一就是本篇的重点 —— 树(Tree)。

### 二叉树(Binary Tree)
类似于真实世界，计算机科学中的树也有不同种类，我们首先学习最简单的树 —— 二叉树。一旦我们学会二叉树之后我们就可以快速学习其他类型的树了。

![](https://cdn.0xfee1dead.cn/contentImg/tree/btree.png)

树的应用非常多，例如: 
1. 展示层级结构(File 和 Folder)
2. 数据库索引(Index)
3. 编译器(Syntax Tree)
4. 压缩(JPEG、MP3)
5. 自动补全

有一类特殊的二叉树称为二叉搜索树，他的特点是: 左子树的所有值小于该节点，右子树的所有值都大于该节点。

![](https://cdn.0xfee1dead.cn/contentImg/tree/bstree.png)

### Building a BinarySearchTree
``` csharp
public class BinarySearchTree<T> where T : IComparable
{
    private class Node<T>
    {
        public T Value { get; private set; }

        public Node<T> LeftChild { get; set; }

        public Node<T> RightChild { get; set; }

        public Node(T value)
        {
            Value = value;
        }
    }

    private Node<T> Root { get; set; }

    public void Insert(T value)
    {
        var node = new Node<T>(value);
        if (Root == null)
        {
            Root = node;
            return;
        }

        var current = Root;

        while (true)
        {
            if (current.Value.CompareTo(value) == 1)
            {
                if (current.LeftChild == null)
                {
                    current.LeftChild = node;
                    break;
                }
                current = current.LeftChild;
            }
            else
            {
                if (current.RightChild == null)
                {
                    current.RightChild = node;
                    break;
                }
                current = current.RightChild;
            }
        }
    }

    public bool Find(T value)
    {
        var current = Root;
        while (current != null)
        {
            if (current.Value.CompareTo(value) == 1)
            {
                current = current.LeftChild;
            }
            else if (current.Value.CompareTo(value) == -1)
            {
                current = current.RightChild;
            }
            else
            {
                return true;
            }
        }
        return false;
    }
}
```

### Traversing Trees
不同于线性结构，树的遍历分为两种方式:
- 广度优先(BREADTH FIRST): 以层次顺序遍历，先遍历同一层次，再遍历下一层次
- 深度优先(DEPTH FIRST): 以深度顺序遍历，又可分为前序、中序、后序三种方式

1. 前序遍历(Pre-Order): Root -> Left ->  Right
2. 中序遍历(In-Order): Left -> Root ->  Right
3. 前序遍历(Post-Order): Left ->  Right -> Root

注意: 前中后指的是何时访问 Root 元素。

### Recursion
在实现树的遍历代码之前，我们首先要介绍在计算机科学中极其常用的概念 —— 递归。

> “In order to understand recursion, one must first understand recursion.”

<img src="https://cdn.0xfee1dead.cn/contentImg/tree/recursion.svg" alt="recursion">

``` csharp
public int Factorial(int n) 
{
    //base case
    if (n == 0) 
    {
        return 1;
    }
    //recursion case
    return n * Factorial(n - 1);
}
```

### Depth First Traversal
``` csharp
public void TraversePreOrder()
{
    TraversePreOrder(Root);
}

private void TraversePreOrder(Node<T> root)
{
    if (root == null)
    {
        return;
    }
    Console.WriteLine(root.Value);
    TraversePreOrder(root.LeftChild);
    TraversePreOrder(root.RightChild);
}

public void TraverseInOrder()
{
    TraverseInOrder(Root);
}

private void TraverseInOrder(Node<T> root)
{
    if (root == null)
    {
        return;
    }
    TraverseInOrder(root.LeftChild);
    Console.WriteLine(root.Value);
    TraverseInOrder(root.RightChild);
}

public void TraversePostOrder()
{
    TraversePostOrder(Root);
}

private void TraversePostOrder(Node<T> root)
{
    if (root == null)
    {
        return;
    }
    TraversePostOrder(root.LeftChild);
    TraversePostOrder(root.RightChild);
    Console.WriteLine(root.Value);
}
```

### Equality Checking
``` csharp
public bool Equal(Tree<T> other)
{
    return Equal(Root, other.Root);
}

private bool Equal(Node<T> first, Node<T> second)
{
    if (first == null && second == null)
    {
        return true;
    }

    if (first != null && second != null)
    {
        return first.Value.Equals(second.Value)
        && Equal(first.LeftChild, second.LeftChild)
        && Equal(first.RightChild, second.RightChild);
    }
    return false;
}
```