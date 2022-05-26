---
title: LeetCode-Median of Two Sorted Arrays
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog233.png
date: 2022-03-12
---

## 题目
***  
There are two sorted arrays nums1 and nums2 of size m and n respectively.

Find the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).

You may assume nums1 and nums2 cannot be both empty.

Example: 
``` sh
nums1 = [1, 3]
nums2 = [2]

The median is 2.0

nums1 = [1, 2]
nums2 = [3, 4]

The median is (2 + 3)/2 = 2.5
```

## 代码
***  
``` csharp
// solution 1
public class Solution {
    public double FindMedianSortedArrays(int[] nums1, int[] nums2)
    {
        var m = nums1.Length;
        var n = nums2.Length;
        if (m > n)
        {
            (nums1, nums2) = (nums2, nums1);
            // return FindMedianSortedArrays(nums2, nums1);
        }
        // 左侧元素个数
        var lc = (m + n + 1) / 2;
        // 在 nums1 的[0, m]区间寻找合适的分割位置
        // 满足 nums1[i-1] <= nums2[j] && nums1[j-1] <= nums2[i]
        var l = 0;
        var r = m;
        while (l < r)
        {
            var i = (l + r + 1) / 2;
            var j = lc - i;
            if (nums1[i - 1] > nums2[j])
            {
                r = i - 1; //[l, i-1]
            }
            else
            {
                l = i; //[i, r]
            }
        }
        {
            var i = l;
            var j = lc - l;
            var m1 = i == 0 ? int.MinValue : nums1[i - 1];
            var n1 = j == 0 ? int.MinValue : nums2[j - 1];
            var m2 = i == m ? int.MaxValue : nums1[i];
            var n2 = j == n ? int.MaxValue : nums2[j];
            if ((m + n) % 2 == 1)
            {
                return Math.Max(m1, n1);
            }
            return (Math.Max(m1, n1) + Math.Min(m2, n2)) / 2.0;
        }
    }
}
```