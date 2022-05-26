---
title: Shell(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog137.jpg
date: 2020/01/18
---

Shell 通常指的是命令行界面的解析器，一般来说，这个词是指操作系统中提供访问内核所提供之服务的程序。
与之相对的是内核(Kernel)，内核不提供和用户的交互功能。

## CLI Shell
***  
常见的 Unix Shell 有: 
- sh: Bourne shell
- dash: Debian Almquist shell
- bash: Bourne Agine shell
- ksh: Korn shell
- zsh: Z shell
- csh: C shell
- fish: Friendly interactive shell

## Shell 语法
***  
### 首行语法
shell 文件一般以 sh 作为文件后缀，在文件首行，以 #! 开头，后跟所使用的 shell: 
``` sh
#! /usr/bin/bash
```

### 注释
shell 文件的注释以 # 开始: 
``` sh
# comment
```

### 变量
shell 变量分为两类: 
- 局部变量
- 环境变量

#### 局部变量
shell 给变量赋值，实际就是定义了变量。局部变量只在创建他们的 shell 脚本中使用，例如 A=13，就是定义了一个变量 A，如果我们想引用该变量，可以在字符串中使用 $A，如果不希望转义，则可以使用 \，如果想取消变量，我们可以使用 unset 操作: 
``` sh
unset NAME
```

#### 系统变量
系统变量可以再创建他们的 shell 以及派生的任意子进程中使用。
系统变量又分为: 
- 本地变量: 只有本用户可以使用，保存在当前用户 home 目录下的 .bash_profile 或 .bashrc 文件中
- 全局变量: 所有用户都可以使用，保存在 /etc/profile 或 /etc/bashrc 文件中

常见的系统变量: 
- $UID: 当前用户的 uid
- $USER: 当前用户
- $PWD: 当前路径
- $SHELL: 当前使用的 shell
- $PATH: 环境变量
- $0: 脚本名称
- ${N}: 第 N 个参数
- $$: 脚本本身进程 PID
- $?: 上一个命令执行结果，0 为成功

注意: 如果想修改 PATH 环境变量，使用 PATH=$PATH:新路径。

如果修改了系统变量，我们可以使用 source 操作使得修改生效: 
``` sh
source [file path]
```

### 算数运算
算数运算包括: 
- +
- -
- *
- /
- %
- **

#### 整数运算
##### expr
我们可以使用 expr 进行算数运算: 
``` sh
expr $INT1 + $INT2
```

需要注意，expr 乘法符号需要转义: 
``` sh
expr $INT1 \* $INT2
```

##### let
我们还可以使用 let 进行算数运算: 
``` sh
let sum=$INT+$INT2
echo $sum
```

let 语法的乘法运算符号不需要转义: 
``` sh
let multi=$INT*$INT2
echo $multi
```

##### (())
shell 中两个小括号也可以做运算: 
``` sh
sum=$(( 1 + 3 ))
echo $sum
```

#### 浮点数运算
浮点数运算需要使用管道操作: 
``` sh
echo "scale=2;100/3"|bc
```

### shell 格式化输出
echo 可以将内容输出到标准输出。语法为: 
``` sh
echo [-ne] [字符串]
```

命令选项: 
- n: 末尾不换行
- e: 解释转义字符

如果希望 echo 现实的内容带颜色显示，格式如下: 
``` sh
echo -e "\033[背景颜色;文字颜色m 输出的字符串 \033[属性"
```

文字颜色范围 30 - 37，背景颜色范围 40 - 47。属性为: 
- 0m: 关闭所有属性
- 1m: 设置高亮度
- 4m: 下划线
- 5m: 闪烁
- 7m: 反显
- 8m: 消隐

### shell 基本输入
read 命令等待用户的输入，默认接受键盘输入，回车代表输入结束。
命令选项有: 
- p: 打印信息
- t: 限定时间
- s: 不回显
- n: 限制输入最大字符个数

``` sh
read -p "Login: " account
echo -n -e "Password: "
read -s -t5 -n6 pwd

echo "$account: $pwd"
```