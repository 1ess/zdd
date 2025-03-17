---
title: Git(二)
featured_image: https://cdn.zhangdd.tech/blogImg/Blog178.jpg
date: 2021/01/29
---

本篇，我们来介绍一下 Git 的历史记录的浏览查看以及分支的基本操作。

### Restore a Deleted File
``` sh
# 找到这个文件被删除之前的那个 commit
git log --oneline -- {filename}

# 使用该 commitId 恢复文件
git checkout {commitid} {filename}
```

### Blaming
``` sh
git blame -L {a,b} {filename}
```

其中，a 为起始行号，b 为终止行号。

### Tagging
``` sh
# 创建 Tag
git tag -a {tagname} -m {message} {commitid}

# 删除 Tag
git tag -d {tagname}

# 查看已创建的 Tag
git tag
```

### Branch
``` sh
# 创建分支
git branch {branchname}

# 查看分支
git branch

# 切换分支
git switch {branchname}

# 创建并切换分支
git switch -C {branchname}

# 分支重命名
git branch -m {oldbranchname} {newbranchname}

# 删除分支
git branch -d {branchname}

# 强制删除未合并分支
git branch -D {branchname}
```

### Compare the Branch
``` sh
# 比较 branch1 和 branch2 之前的区别
git diff {branchname1}..{branchname2}

# 比较当前分支与某 branch 的区别
git diff {branchname}
```

### Stashing
当我们在某一分支有未提交的修改，我们无法切换分支。我们可以使用 stash 命令暂存修改。
``` sh
# 创建 stash
git stash push -m {message}

# 查看 stash 列表
git stash list

# 应用某个 stash
git stash apply {stashindex}

# 删除 stash
git stash drop {stashindex}

# 清空 stash 列表
git stash clear
```

### Merging
合并有两种方式: 
1. Fast-forwarding merges
2. 3-way merges

一般情况，我们合并时会使用 --no-ff 参数禁用 Fast-forward 来使分支更加清晰。
为避免忘记使用该参数，我们也可以使用命令: 
``` sh
git config --global ff no
```

来禁用仓库的 Fast-forwarding merges。

### Rebase
变基有两种方式: 
1. Standard Rebase 标准变基
2. Interactive Rebase 交互式变基

一般情况下，我们在变基时会使用 -i 参数进行交互式变基，以便修改提交历史。
``` shell
# 合并前三条 commit
git rebase -i HEAD~3
```

命令执行后，会打开一个交互式编辑器，内容类似于: 
``` shell
# 默认情况，显示 pick 所有提交
pick a1b2c3d 修复了某个 bug
pick d4e5f6g 添加了新功能
pick h7i8j9k 更新了文档

# 将 pick 修改为 squash，即只保留第一个 commit 的 pick，如下: 
pick a1b2c3d 修复了某个 bug
squash d4e5f6g 添加了新功能
squash h7i8j9k 更新了文档
```

编辑合并后的 commit 信息: 
``` shell
# 退出后，需要编辑合并后的提交信息，默认情况下，它会列出所有被合并的 commit 信息:
修复了某个 bug
添加了新功能
更新了文档

# 可以修改为一个简洁的提交信息，例如: 
优化代码，修复 bug 并新增功能
```

### View the Merged Branch
``` sh
# 查看已合并到当前分支的所有分支
git branch --merged

# 查看未合并到当前分支的所有分支
git branch --no-merged
```

### Undoing a Faulty Merge
``` sh
git reset --hard {commitid}
```

reset 命令有三个可选参数: 
- soft: 只会改变本地仓库，不会改变工作区和暂存区
- mixed: 改变本地仓库和暂存区，不会改变工作区，这是默认选项
- hard: 同时改变本地仓库、暂存区和工作区

### 查看远程仓库信息
``` sh
git remote -v
```

### Fetching
我们使用 fetch 命令从远端拉取最新更新: 
``` sh
git fetch
```

拉取之后还需要 merge 操作，将本地文件与远端文件合并。

### Pulling
pull = fetch + merge: 
``` sh
git pull
```

### Pushing
``` sh
git push
```

### Sharing Tags
``` sh
# 推送 tag
git push origin {tagname}

# 删除 tag
git push origin --delete {tagname}
```

### Sharing Branches
``` sh
# 将本地分支推到远端
git push -u origin {branchname}

# 删除远端分支
git push -d origin {branchname}
```