---
title: LeetCode-Add Two Numbers
featured_image: https://cdn.zhangdd.tech/blogImg/Blog230.png
date: 2022-03-10
---

## 题目
***  
You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contain a single digit. Add the two numbers and return it as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.

Example: 
``` sh
Input: (2 -> 4 -> 3) + (5 -> 6 -> 4)

Output: 7 -> 0 -> 8

Explanation: 342 + 465 = 807.
```

## 代码
***  
``` csharp
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     public int val;
 *     public ListNode next;
 *     public ListNode(int val=0, ListNode next=null) {
 *         this.val = val;
 *         this.next = next;
 *     }
 * }
 */
// solution 1
public class Solution {
    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {
        ListNode head = null;
        ListNode tail = null;
        var carry = 0;
        while(l1 != null || l2 != null || carry != 0) {
            
            var val1 = l1 == null ? 0 : l1.val;
            var val2 = l2 == null ? 0 : l2.val;
            var sum = val1 + val2 + carry;
            carry = sum/10;
            sum %= 10;
            
            if (head == null) {
                head = tail = new ListNode(sum);
            }else {
                tail.next = new ListNode(sum);
                tail = tail.next;
            }

            if (l1 != null) {
                l1 = l1.next;
            }
            
            if (l2 != null) {
                l2 = l2.next;
            }
        } 
        
        return head;
    }
}

// solution 2
public ListNode AddTwoNumbers(ListNode l1, ListNode l2)
{
    var head = new ListNode();
    var p = head;
    var curry = 0;
    while (l1 != null || l2 != null)
    {
        var val1 = l1 != null ? l1.val : 0;
        var val2 = l2 != null ? l2.val : 0;
        var sum = val2 + val1 + curry;
        p.next = new ListNode(sum % 10);
        p = p.next;
        curry = sum / 10;
        if (l1 != null)
        {
            l1 = l1.next;
        }
        if (l2 != null)
        {
            l2 = l2.next;
        }
    }
    if (curry != 0)
    {
        p.next = new ListNode(curry);
    }
    return head.next;
}

// solution 3
public ListNode AddTwoNumbers(ListNode l1, ListNode l2)
{
    var head = new ListNode();
    var sum = l1.val + l2.val;
    head.val = sum % 10;
    head.val = sum % 10;
    if (l1.next != null || l2.next != null || sum/10 != 0)
    {
        head.next = AddTwoNumbers(
            l1.next == null ? new ListNode(sum / 10) : new ListNode(l1.next.val + sum / 10, l1.next.next),
            l2.next ?? new ListNode());
    }
    return head;
}
```