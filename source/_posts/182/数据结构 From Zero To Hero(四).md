---
title: 数据结构 From Zero To Hero(四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog182.jpg
date: 2021/02/19
---

本篇，我们介绍一种利用线性表创建的一种数据结构 —— 栈(Stacks)。

只要我们遇到回滚或者反转之类的问题，我们就可以使用栈来解决。

### Reversing a String
``` csharp
public string ReverseString(string input)
{
    if (input == null)
    {
        throw new ArgumentNullException();
    }

    var stack = new Stack<char>();
    foreach (var ch in input)
    {   
        stack.Push(ch);
    }

    var sb = new StringBuilder();
    while (stack.Count != 0)
    {
        sb.Append(stack.Pop());
    }

    return sb.ToString();
}
```

### Balanced Expressions
``` csharp
private readonly List<char> _leftBracketList = new List<char> { '<', '(', '[', '{' };
private readonly List<char> _rightBracketList = new List<char> { '>', ')', ']', '}' };

private bool IsLeftBracket(char ch)
{
    return _leftBracketList.Contains(ch);
}

private bool IsRightBracket(char ch)
{
    return _rightBracketList.Contains(ch);
}

private bool BracketsMatch(char left, char right)
{
    return _leftBracketList.IndexOf(left) == _rightBracketList.IndexOf(right);
}

public bool BalancedExpressions(string expression)
{
    var stack = new Stack<char>();
    foreach (var ch in expression)
    {
        if (IsLeftBracket(ch))
        {
            stack.Push(ch);
        }
        else if (IsRightBracket(ch))
        {
            if (stack.Count == 0) return false;
            var top = stack.Pop();
            if (!BracketsMatch(top, ch))
            {
                return false;
            }
        }
    }

    return stack.Count == 0;
}
```

### 自己构建一个栈
``` csharp
public class Stack<T>
{
    private readonly T[] _stack;
    private int _size;
    public Stack(int capacity)
    {
        _stack = new T[capacity];
    }

    public void Push(T item)
    {
        if (_size == _stack.Length)
        {
            throw new StackOverflowException();
        }

        _stack[_size++] = item;
    }

    public T Pop()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException();
        }
        return _stack[--_size];
    }

    public T Peek()
    {
        if (IsEmpty())
        {
            throw new InvalidOperationException();
        }
        return _stack[_size - 1];
    }

    public bool IsEmpty()
    {
        return _size == 0;
    }

    public override string ToString()
    {
        var t = new T[_size];
        Array.Copy(_stack, t, _size);

        return $"[{string.Join(", ", t)}]";
    }
}
```