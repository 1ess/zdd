---
title: LeetCode-Two Sum
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog229.png
date: 2022-03-09
---

## 题目
***  
Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example: 
``` sh
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,

return [0, 1]
```

## 代码
***  
``` csharp
// solution 1
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var result = new int[2];
        for(var i = 0; i < nums.Length - 1; i++) {
            for (var j = i + 1; j < nums.Length; j++) {
                if (nums[i] + nums[j] = target) {
                    result[0] = i;
                    result[1] = j;
                    return result;
                }
            }
        }
        return result;
    }
}

// solution 2
public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var keyValuePair = new Dictionary<int, int>();
        var result = new int[2];
        for(var i=0; i < nums.Length; i++) {
            if(keyValuePair.ContainsKey(target-nums[i])) {
                result[0] = keyValuePair[target-nums[i]];
                result[1] = i;
                return result;
            }else if (!keyValuePair.ContainsKey(nums[i])) {
                keyValuePair.Add(nums[i], i);
            }
        }
        return result;
    }
}
```