---
title: Linux(八)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog124.jpg
date: 2019/08/14
---

本篇，我们在来说一下在 Linux 下，有关正则和文本处理的相关知识。

## 正则表达式
***  
之前我们讲过正则，我们来回顾下。

### 基本语法
一个正则表达式通常被称为一个模式(pattern)，为用来描述或者匹配一系列符合某个句法规则的字符串。

#### 选择
| 竖直分隔符表示选择，例如 boy|girl 可以匹配 boy 或者 girl。

#### 数量限定
数量限定符号有 
- *: 出现 0 次或多次
- +: 出现 1 次或多次
- ?: 出现 0 次或 1 次

如果在一个模式中不加数量限定符则表示出现一次且仅出现一次。

如果要表示其他次数可以使用: 
- {m}: 出现 m 次
- {m,}: 至少出现 m 次
- {m,n}: 出现 m 到 n 次
- {,n}: 出现 0 到 n 次

#### 范围和优先级
() 圆括号可以用来定义模式字符串的范围和优先级，这可以简单的理解为是否将括号内的模式串作为一个整体。

#### 语法
| 字符   | 描述                                                                                                                                                                  |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| .      | 匹配除换行符之外的任意字符                                                                                                                                            |
| \w     | 匹配字母，数字，下划线或汉字                                                                                                                                            |
| \s     | 匹配任意空白字符                                                                                                                                                      |
| \d     | 匹配数字                                                                                                                                                              |
| \      | 将下一个字符标记为一个特殊字符、或一个原义字符                                                                                                                         |
| ^      | 匹配输入字符串的开始位置                                                                                                                                              |
| $      | 匹配输入字符串的结束位置                                                                                                                                              |
| ?      | 当该字符紧跟在任何一个其他限制符(*,+,?,{n},{n,},{n,m})后面时，匹配模式是非贪婪的。非贪婪模式尽可能少的匹配所搜索的字符串，而默认的贪婪模式则尽可能多的匹配所搜索的字符串 |
| [xyz]  | 字符集合(character class)，匹配所包含的任意一个字符                                                                                                                    |
| [^xyz] | 排除型(negate)字符集合，匹配未列出的任意字符                                                                                                                           |

#### 基本正则(BRE) 和 扩展正则(ERE)
基本正则只支持 * 数量限定，如果不使用扩展正则，想使用其他数量限定，则必须使用 \ 来转义。基本正则不支持 \w，\d 等，需要使用 [a-zA-Z0-9_-] 和 [0-9] 代替。

## sed
***  
sed(stream editor)，流编辑器，用程序的方式来编辑文本。一次处理一行，行是 sed 处理的基本单位。

### 模式空间和缓冲空间
- 模式空间: 处理文件中一行内容的临时缓冲区，处理完这一行会将这一行输出标准输出并清空缓冲区
- 缓存空间: 另一个缓冲区，不会自动清空也不会主动打印，是 sed 的辅助空间

### 查找
格式为: 
``` sh
sed [options] {sed-commands} {input-file}
```

例如: 
``` sh
# source.txt
101,Ian Bicking,Mozilla
102,Hakim El Hattab,Whim
103,Paul Irish,Google
104,Addy Osmani,Google
105,Chris Wanstrath,Github
106,Mattt Thompson,Heroku
107,Ask Solem Hoel,VMware

# -n 表示取消默认输出，p 表示打印行
$sed -n 'p' source.txt

# 只打印第三行
$sed -n '3p' source.txt
# 103,Paul Irish,Google

# 打印 1 到 3 行
$sed -n '1,3p' source.txt
# 101,Ian Bicking,Mozilla
# 102,Hakim El Hattab,Whim
# 103,Paul Irish,Google

# 寻找包含 Paul 的行
$sed -n '/Paul/p' source.txt
# 103,Paul Irish,Google

# 从第一行开始到第五行, 从找到开始打印到第五行
$sed -n '/Paul/,5p' source.txt
# 103,Paul Irish,Google
# 104,Addy Osmani,Google
# 105,Chris Wanstrath,Github

# 从匹配 Paul 行打印达匹配 Addy 的行
$sed -n '/Paul/,/Addy/p' source.txt
# 103,Paul Irish,Google
# 104,Addy Osmani,Google
```

注意: 
- -n 选项会抑制默认的打印
- 其中的地址范围可以是行号或者正则
- 默认的模式匹配不支持扩展正则，只支持基本正则。如果想支持扩展正则，需要使用 -r 选项
- $ 代表最后一行行号

### 删除
格式与查找相同: 
``` sh
sed [options] {sed-commands} {input-file}
```

例如:
``` sh
# 删除所有行
$sed 'd' source.txt 

# 只删除第二行
$sed '2d' source.txt

# 删除第一到第四行
$sed '1,4d' source.txt

# 删除空行
$sed '/^$/d' source.txt

# 删除评论行
$sed '/^#/d' source.txt
```

注意: 
- 删除并不会影响源文件，如果也想修改源文件，可以使用 -i 参数或重定向
- Mac 下需要使用 -i "" 来影响源文件

### 替换(substitute)
替换格式为: 
``` sh
sed '[address-range|pattern-range]s/original-string/replacement-string/[substitute-flags]' inputfile
```

例如: 
``` sh
# 替换 Google 为 Github
$sed 's/Google/Github/' source.txt
# 101,Ian Bicking,Mozilla
# 102,Hakim El Hattab,Whim
# 103,Paul Irish,Github
# 104,Addy Osmani,Github
# 105,Chris Wanstrath,Github
# 106,Mattt Thompson,Heroku
# 107,Ask Solem Hoel,VMware

# 替换匹配 Addy 的行里面的 Google 为 Github
$sed '/Addy/s/Google/Github/' source.txt
# 101,Ian Bicking,Mozilla
# 102,Hakim El Hattab,Whim
# 103,Paul Irish,Google
# 104,Addy Osmani,Github
# 105,Chris Wanstrath,Github
# 106,Mattt Thompson,Heroku
# 107,Ask Solem Hoel,VMware

# 替换第一行中的首个匹配项
$sed '1s/a/A/' source.txt|head -1
# 101,IAn Bicking,Mozilla

# g 可以替换每行的全部符合
$sed 's/a/A/g' source.txt|head -1
# 101,IAn Bicking,MozillA

# 可以直接指定想要替换的第 N 个匹配项,这里是第一行第二个
$sed '1s/a/A/2' source.txt|head -1
```

### 提取
括号括起来的正则表达式所匹配的字符串会可以当成变量来使用，sed 中使用的是 \1，\2。
``` sh
sed -rn '/bash$/s/(\w+):.*/\1/p' passwd
```

注意: -r 选项可以使用扩展正则表达式，如果不使用扩展，则应写成如下形式: 
``` sh
sed -rn '/bash$/s/\([a-zA-Z0-9_-]\+\):.*/\1/p' passwd
```

### 插入
在第 5 行之上插入，使用 i: 
``` sh
sed -i '5 i hello world' source.txt
```

### 追加
在第 10 行之下追加，使用 a: 
``` sh
sed -i '10 a hello world' source.txt
```

### 更改
更改第 5 行的内容，使用 c: 
``` sh
sed -i '5 c hello world' source.txt
```

## awk
***  
awk 是贝尔实验室 1977 年开发的用于处理文本文件的一个应用程序，它依次处理文件的每一行，并读取里面的每一个字段。对于日志等每行格式相同的文本文件，awk 可能是最方便的工具。
之所以叫 awk 是因为其取了三位创始人 Alfred Aho，Peter Weinberger 和 Brian Kernighan 名字的首字母。
awk 其实不仅仅是工具软件，还是一种编程语言，接下来我们分几个方面介绍一下基本使用。

### 基本用法
awk 的基本格式: 
``` sh
awk -Fs '/pattern/ {action}' input-file
#or
awk -Fs '{action}' intput-file
# -F 表示设置分隔符,不指定就是默认为空字符

# 示例
awk '{print $0}' god.txt
```

awk 默认会根据 -F 表示设置分隔符(空格和制表符)，将每一行分成若干字段，依次用 $1、$2、$3 代表第一个字段、第二个字段、第三个字段等，而 $0 表示的是当前行。
``` sh
echo 'This is a demo for awk.' | awk '{print $3}'
# a
```

我们还可以使用 -F 参数来指定分割符: 
``` sh
awk -F ':' '{print $1}' /etc/passwd
```

### 变量
除了 $ + 数字 表示某个字段，awk 还提供其他一些变量。

#### NF
变量 NF 表示当前行有多少个字段，因此 $NF 就代表最后一个字段，$(NF-1) 代表倒数第二个字段。
``` sh
awk -F ':' '{print $1, $NF}' /etc/passwd
```
命令里面可以使用逗号，表示输出的时候，两个部分之间使用空格分隔。

#### NR
变量 NR 表示当前处理的是第几行: 
``` sh
awk -F ':' '{print NR "." $1 $NF}' /etc/passwd
```

### 函数
awk 还提供了一些内置函数，方便对原始数据的处理，常见函数有: 
- toupper()
- tolower()
- length()
- substr()
- sqrt()
- rand()
- match()
- index()

### 条件
awk 允许指定输出条件，只输出符合条件的行，格式为: 
``` sh
awk '条件 动作' [文件名]

# 示例
awk -F ':' '$1 == "root" {print $0}' /etc/passwd

awk -F ':' 'NR % 2 == 1 {print $1}' /etc/passwd
```

注意: 条件可以是正则表达式，格式为 /正则/。awk 允许运算符 ~，用来测试正则表达式是否可以与某一字符串匹配。

### if 语句
awk 提供了 if 结构，用于编写复杂的条件: 
``` sh
awk -F ':' '{if ($1 > "m") print $1}' /etc/passwd
```

if 结构还可以指定 else 部分: 
``` sh
awk -F ':' '{if ($1 > "m") print $1; else print "---"}' /etc/passwd
```

## grep
***  
grep(globally search a regular expression and print) 会对匹配一个或多个正则表达式的文本进行搜索，并只输出匹配(或者不匹配)的行。

### 常用参数
- i: 忽略大小写
- n: 输出行号
- v: 反向选择