---
title: LeetCode-Longest Substring Without Repeating Characters
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog232.png
date: 2022-03-11
---

## 题目
***  
Given a string, find the length of the longest substring without repeating characters.

Example: 
``` sh
Input: "abcabcbb"
Output: 3 
Explanation: The answer is "abc", with the length of 3. 

Input: "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Input: "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3. 
             Note that the answer must be a substring, "pwke" is a subsequence and not a substring.
```

## 代码
***  
``` csharp
// solution 1
public class Solution {
    public int LengthOfLongestSubstring(string s) {
        var set = new HashSet<char>();
        var n = s.Length;
        var ans = 0;
        var l = -1;
        for (var i = 0; i < n; i++) {
            if (set.Contains(s[i])) {
                while (set.Contains(s[i])) {
                    set.Remove(s[++l]);
                }
            }
            set.Add(s[i]);
            ans = Math.Max(ans, i - l);
        }
        return ans;
    }
}
```