---
title: LeetCode-Longest Palindromic Substring
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog234.png
date: 2022-03-13
---

## 题目
***  
Given a string s, return the longest palindromic substring in s.

Example: 
``` sh
Input: s = "babad"
Output: "bab"
Note: "aba" is also a valid answer.

Input: s = "cbbd"
Output: "bb"

Input: s = "a"
Output: "a"

Input: s = "ac"
Output: "a"
```

Constraints:
- 1 <= s.length <= 1000
- s consist of only digits and English letters (lower-case and/or upper-case)

## 代码
***  
``` csharp
// solution 1
public class Solution {
    public string LongestPalindrome(string s)
    {
        var n = s.Length;
        if (n < 2)
        {
            return s;
        }
        
        // 初始化
        var dp = new bool[n][];
        for (var i = 0; i < dp.Length; i++)
        {
            dp[i] = new bool[n];
        }
    
        for (var i = 0; i < n; i++)
        {
                
            dp[i][i] = true;
        }
    
        var left = 0;
        var maxLength = 1;
    
        // 根据转移方程递推顺序确定循环方式以及次数
        for (var j = 1; j < n; j++) 
        {
            for (var i = 0; i < j; i++) 
            {
                var l = j - i + 1;
                if (s[i] == s[j] && (l < 3 || dp[i+1][j-1])) 
                {
                    dp[i][j] = true;
                    if (maxLength < l) 
                    {
                        maxLength = l;
                        left = i;
                    }
                } else {
                    dp[i][j] = false;
                }
            }
        }
        return s.Substring(left, maxLength);
    }
}
```