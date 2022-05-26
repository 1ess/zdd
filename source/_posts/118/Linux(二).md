---
title: Linux(二)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog118.jpg
date: 2019/06/06
---

上一篇中，我们说了一些 Linux 的历史，讲解了一些 shell 的基本命令。本篇，我们在来说一下在 Linux 下，如何根据条件查找文件以及打包压缩指令。

## 查找指令
***  
### 命令查找
我们可以使用 which 或者 whereis 命令查找命令所在路径。

``` sh
which mkdir
# /usr/bin/mkdir

whereis mkdir
# mkdir: /usr/bin/mkdir /usr/share/man/man1/mkdir.1.gz /usr/share/man/man1p/mkdir.1p.gz /usr/share/man/man2/mkdir.2.gz /usr/share/man/man3p/mkdir.3p.gz
```

### 文件查找
我们使用 find 命令来查找文件。
find 命令用于精确查找，磁盘搜索，IO 读写，CPU 开销大。

#### 查找后输出到标准输出
格式: 
``` sh
find [目标路径] [选项] [关键字]
```

常见选项: 
- name: 按文件名查找文件
- iname: 按文件名忽略大小写查找文件
- size: 按文件大小查找文件，+1M 表示大于 1M 的文件，-1M 表示小于 1M 的文件
- type: 按文件类型查找文件
- mtime: 按文件修改时间查找文件，-n 表示 n 天以内，+n 表示 n 天以前

``` sh
find ./ -name '*.conf'
```

注意: 
- 使用 -size 时要注意，-1M 如果没找到以 M 为单位的目标，就会四舍五入到下一个单位 -1k。比如 2.1kb 文件 不匹配 -1M
- 使用 -mtime 时要注意，+2 表示 2 天以前，不包括第二天，-2 表示 2 天以内，也不包括第二天。比如今天是 22 号，+2 表示查找到 19 号的数据，-2 表示查找 21， 22 号 2 天的数据

#### 查找后执行指令
我们使用 find 命令来查找文件之后，执行一些操作。
格式: 
``` sh
find [目标路径] [选项] [关键字] [动作]
```

常见动作: 
- exec: 对查找到的文件直接执行命令
- ok: 对查找到的文件询问式执行命令
- delete: 删除查找到的文件
- ls: 列出查找到的文件
- print: 打印查找到的文件(默认选项)

注意: -exec 和 -ok 后的命令以 " &#92;;" 结束，{} 作为查找到文件占位符。

## 压缩打包指令
***  
### 压缩工具
- zip: 兼容类 Unix 和 Windows 系统，可以压缩多个文件或目录，解压缩使用 unzip
- gzip: 压缩单个文件，解压缩使用 gunzip

#### zip
格式: 
``` sh
zip [压缩后文件] [需要压缩的文件]
```

常用参数: 
- r: 递归压缩

#### unzip
格式: 
``` sh
unzip [需要解缩的文件] -d [解缩的文件路径]
```

常用参数: 
- d: 解缩的文件存储路径

### 打包工具
#### tar
tar 可以将多个文件打包成一个并压缩。与 zip 不同的是，tar 可以指定压缩格式为 gzip 等。
格式: 
``` sh
tar [选项] [打包后的文件] [需要打包的文件]
```

常用参数: 
- c: 打包
- v: 显示详细信息
- z: 压缩使用 gzip 格式
- f: 指定包名
- x: 解包
- C: 指定解压路径
- t: 列出包内容

``` sh
# 打包
tar -cvzf ./xx.tar.gz ./*

# 解包
tar -xzvf ./xx.tar.gz -C ./tmp/
```