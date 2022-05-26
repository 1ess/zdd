---
title: LeetCode-Regular Expression Matching
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog235.png
date: 2022-03-14
---

## 题目
***  
Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:

- '.' Matches any single character.​​​​
- '*' Matches zero or more of the preceding element.

The matching should cover the entire input string (not partial).

Example: 
``` sh
Input: s = "aa", p = "a"
Output: false
Explanation: "a" does not match the entire string "aa".

Input: s = "aa", p = "a*"
Output: true
Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".

Input: s = "ab", p = ".*"
Output: true
Explanation: ".*" means "zero or more (*) of any character (.)".
```

Constraints:
- 1 <= s.length <= 20
- 1 <= p.length <= 30
- s contains only lowercase English letters.
- p contains only lowercase English letters, '.', and '*'.
- It is guaranteed for each appearance of the character '*', there will be a previous valid character to match.

## 代码
***  
``` csharp
// solution 1
public class Solution {
    public bool IsMatch(string s, string p) {
        var m = s.Length;
        var n = p.Length;
        var dp = new bool[m+1][];
        for (var i = 0; i <= m; i++)
        {
            dp[i] = new bool[n+1];
        }

        dp[0][0] = true;
        dp[0][1] = false;

        for (var j = 2; j <= n; j ++){
            dp[0][j] = dp[0][j-2] && p[j-1] == '*';
        }

        for (var i = 0; i < m; i++)
        {
            for (var j = 0; j < n; j++)
            {
                if (p[j] != '*') {
                    dp[i+1][j+1] = dp[i][j] && Match(s, p, i, j);
                } else {
                    dp[i+1][j+1] = dp[i+1][j-1] || (dp[i][j+1] && Match(s, p, i, j-1));
                }
            }
        }

        return dp[m][n];
    }

    public bool Match(string s, string p, int i, int j) {
        return s[i] == p[j] || p[j] == '.';
    }
}
```