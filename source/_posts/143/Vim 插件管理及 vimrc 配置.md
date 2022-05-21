---
title: Vim 插件管理及 vimrc 配置
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog143.jpg
date: 2020/03/04
---

当没有插件管理器时，Vim 用户必须手动下载 tarball 包形式的插件，并将它们解压到 ~/.vim 目录中。所有插件文件分散在单个目录中，用户无法找到哪个文件属于哪个插件。此外，他们无法找到他们应该删除哪个文件来卸载插件，这时 Vim 插件管理器就可以派上用场。插件管理器将安装插件的文件保存在单独的目录中，因此管理所有插件变得非常容易。

本篇，我介绍一个自己正在使用的 Vim 插件管理器 —— Vim-Plug。

## Vim-Plug
***  
### 安装
``` sh
$ curl -fLo ~/.vim/autoload/plug.vim --create-dirs \ 
 https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

### 用法
要安装插件，首先要在 Vim 配置文件中声明它们。一般 Vim 的配置文件是 ~/.vimrc。在配置文件中声明插件时，列表应该以 call plug#begin(PLUGIN_DIRECTORY) 开始，并以 call plug#end() 结束。
例如: 
``` sh
call plug#begin()
Plug 'itchyny/lightline.vim'
call plug#end()
```

在进行插件的安装、卸载和更新操作时，首先要使用: 
``` sh
:source .vimrc
```

我们可以在 .vimrc 中配置如下命令: 
``` sh
autocmd! bufwritepost .vimrc source %
```

使得 .vimrc 文件的自动刷新。

#### 安装插件
保存之后再通过输入以下命令进行插件安装: 
``` sh
:PlugInstall
```

#### 更新插件
我们可以使用如下命令进行插件更新: 
``` sh
:PlugUpdate
```

#### 删除插件
删除一个插件删除或注释掉你以前在你的 vim 配置文件中添加的 plug 命令，然后进行保存再使用如下命令: 
``` sh
:PlugClean
```

该命令将删除 vim 配置文件中所有未声明的插件。

#### 升级 Vim-Plug
要升级 vim-plug 本身，可以使用如下命令: 
``` sh
:PlugUpgrade
```

## .vimrc 配置

最后分享一下自己的 [.vimrc 文件](https://github.com/1ess/Dotfile/blob/master/.vimrc)配置。