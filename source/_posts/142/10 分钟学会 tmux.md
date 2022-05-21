---
title: 10 分钟学会 tmux
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog142.jpg
date: 2020/02/22
---

Tmux 是一个终端复用器(terminal multiplexer)，用户可以通过 tmux 在一个终端内管理多个分离的 session、window 及 pane，对于同时使用多个命令行，或多个任务时非常方便。

### 安装
``` sh
# Ubuntu 或 Debian
$ sudo apt install tmux

# CentOS 或 Fedora
$ sudo yum install tmux

# Mac
$ brew install tmux
```

## 使用
***  
### 前缀键
tmux 中所有快捷键都要通过前缀键唤起。默认的前缀键是 Ctrl-b，即先按下 Ctrl-b，快捷键才会生效。

### session、window 及 pane 的关系
<img src="https://cdn.0xfee1dead.cn/contentImg/tmux/tmux.svg" alt="tmux">

### session 管理
#### 新建会话
我们使用命令: 
``` sh
tmux new -s [session-name]
```

来新建一个 session。

#### 分离会话
我们在 tmux 中使用快捷键 Ctrl-b d 来分离当前会话，退回到默认终端界面。

#### 会话列表
我们使用命令: 
``` sh
tmux ls
```

列出所有会话列表。也可以使用快捷键 Ctrl-b s，来快速查看并切换会话。

除了 Ctrl-b s，我们还可以使用命令: 
``` sh
tmux switch -t [session-name]
```

从当前会话切换到指定会话。

#### 关闭会话
我们使用命令: 
``` sh
tmux kill-session -t [session-name]
```

来关闭会话。

#### 重新返回会话
我们使用命令: 
``` sh
tmux a -t [session-name]
```

来重新返回该会话。

#### 重命名会话
我们使用快捷键 Ctrl-b $ 来重命名该会话。

### window 管理
#### 新建 window
我们使用快捷键 Ctrl-b c 在该会话新建一个 window。

#### 删除 window
我们使用快捷键 Ctrl-b & 删除该 window。

#### window 列表
我们使用快捷键 Ctrl-b w 列出该 session 所有的 window。

#### 重命名 window
我们使用快捷键 Ctrl-b , 可以重命名该 window。

### pane 管理
#### 新建 pane
我们使用快捷键 Ctrl-b % 和 Ctrl-b " 在左右和上下方向新建 pane。

#### 关闭 pane
我们在选定的 pane 上使用快捷键 Ctrl-b x 可以关闭该 pane。

#### 切换 pane
我们使用快捷键 Ctrl-b 加方向键来切换 pane。

#### 布局 pane
我们使用快捷键 Ctrl-b { 和 Ctrl-b } 可以重新布局 pane。

### 其他
#### 重新加载 tmux 配置
我们使用命令: 
``` sh
tmux source-file ~/.tmux.conf
```

来重新加载 tmux 配置。

.tmux.conf 中常用的配置为: 
``` sh
# Use Alt-arrow keys without prefix key to switch panes
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# reload config file
bind r source-file ~/.tmux.conf
```

#### pane 显示时间
我们使用快捷键 Ctrl-b t 可以在 pane 中间显示一个时钟。

#### 最大化 pane
我们使用快捷键 Ctrl-b z 可以最大化当前 pane，在使用一次则还原为原大小。

#### 调整 pane 大小
我们使用快捷键 Ctrl-b Alt-方向键可以调整当前 pane 大小。