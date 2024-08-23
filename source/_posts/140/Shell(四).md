---
title: Shell(四)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog140.jpg
date: 2020/02/09
---

本篇，我们来讲讲 Shell 中的几个比较重要的流程控制语句 —— if 语句、for 语句、while 语句和 case 语句。

## if 语句
***  
### 单 if 语句
if 语句格式: 
``` sh
if [ condition ]; then  # condition 为 true 或 false
    {commands}
fi
```

### if-else 语句
if-else 语句格式: 
``` sh
if [ condition ]; then  # condition 为 true 或 false
    {commands}
else 
    {commands}
fi
```

### if-elif-else 语句
if-elif-else 语句格式: 
``` sh
if [ condition ]; then  # condition 为 true 或 false
    {commands}
elif [ condition ]; then 
    {commands}
else 
    {commands}
fi
```

### if 高级用法
之前我们说过两个小括号可以用作运算，在 if 语句中可以用作 if 的条件: 
``` sh
if (( 100%3 == 1)); then
    echo "calc result success"
fi
```

## for 循环语句
***  
Shell 中希望执行循环语句有两种方式: 
- for
- while

我们先看一下 for 循环语句。

基本语法为: 
``` sh
for i in var1 var2 var3 ...
    do
        {commands}
done
```

在 for 循环中，我们也经常使用 seq 命令，基本语法为: 
``` sh
seq {起始值} {步长} {终止值}
```

在循环语句中，我们常常有一些控制操作，常见命令有: 
- sleep
- continue
- break

sleep 用于休眠，语法为: 
``` sh
sleep N # 休眠 N 秒
```

continue 和 break 的用法与在其他编程语言类似。

## while 循环语句
***  
while 循环的基本语法为: 
``` sh
while [ condition ]
    do
        {commands}
done
```

## case 语句
***  
与 if 语句类似，case 语句根据不同条件执行不同语句，基本语法为: 
``` sh
case i in
VAR1)
    {commands}
VAR2)
    {commands}
...

esac
```