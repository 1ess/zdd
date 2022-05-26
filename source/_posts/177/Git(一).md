---
title: Git(一)
featured_image: https://cdn-fawn.vercel.app/blogImg/Blog177.jpg
date: 2021/01/25
---

版本控制是软件开发中必不可少的工具，本篇，我们来介绍目前最流行的版本控制系统 —— Git。

## Configuring Git
***  
第一次使用时，我们需要进行一些配置。例如: 
- Name
- Email
- Default Editor
- Line Ending

我们可以在三个不同层级进行配置: 
- SYSTEM: All users
- GLOBAL: All repositories of the current user
- LOCAL: The current repository

``` sh
git config --global user.name "1ess"
git config --global user.email "pipelining@qq.com"
git config --global core.editor "code --wait"
git config --global diff.tool vscode
git config --global difftool.vscode.cmd "code --wait --diff $LOCAL $REMOTE"

# Windows
git config --global core.autocrlf true

# Unix/Linux
git config --global core.autocrlf input
```

我们也可以使用如下命令
``` sh
git config --global -e 
```

在编辑器中编辑配置。

## Cheat Sheet
### Initializing a Repository
``` sh
git init
# Initialized empty Git repository in ~/Project/.git/
```

### Staging Files
``` sh
git add file1.txt file2.txt
git add *.txt
git add .
```

### Committing Changes
``` sh
git commit -m "Initial Commit."
```

### Committing Best Practices
**As you reach a state you want to record, THEN make a commit.**
例如，当你正在进行 Bug fix，突然发现一个 Typo，不应一次提交所有更改，应该是有两次单独提交。并且每次的提交消息要明确，因为他会显示在提交历史中。

### Remove Files
``` sh
git rm file1.txt
git rm *.txt
git rm .
```

git rm 与 rm 命令不同之处在于: 
- git rm: 直接在工作区和暂存区移除文件
- rm: 只在工作区移除，如果希望暂存区也移除，需要使用 git add 命令

简单来说，git rm 相当于 rm + git add。

### Renaming or Moving Files
与移除类似，Git 也提供一个命令执行重命名文件: 
``` sh
git mv file1.txt main.js
```

### Ignoring Files
我们使用 .gitignore 文件来忽略我们不希望 Git 来管理的文件或文件夹。
需要注意，如果 Git 已经管理某些文件或文件夹，我们再添加到 .gitignore 中就不起作用了，我们只需要先在暂存区移除不希望管理的文件或文件夹即可。
``` sh
git rm --cached -r logs/
```

### Viewing the Staged & Unstaged Changes
我们可以使用如下命令来比较最新一次提交和当前暂存区的变化: 
``` sh
git diff --staged
```

如果不带参数则比较工作区与暂存区的变化: 
``` sh
git diff
```

### View the History
``` sh
git log
git log --oneline
```

### View a Commit
``` sh
git show {commitId}
```

### Unstaging Files
``` sh
# 恢复暂存区的文件
git restore --staged file1.txt

# 恢复工作区文件，即取消本次未添加到暂存区的工作区的修改
git restore file2.txt
```

restore 命令依据的是下一个环境进行恢复，暂存区的下一个环境为上一次提交，工作区的下一个环境为暂存区。