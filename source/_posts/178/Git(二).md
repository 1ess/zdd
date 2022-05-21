---
title: Git(二)
featured_image: https://cdn.0xfee1dead.cn/blogImg/Blog178.jpg
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