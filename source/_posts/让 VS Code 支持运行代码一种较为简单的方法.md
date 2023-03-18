---
title: 在5分钟内让VS Code可以运行代码
categories: 工具
tags:
  - 编程
  - 工具
abbrlink: 748f9323
date: 2022-12-07 08:00:29
update: 2023-01-03 15:41:15
---

相比于网上的其他教程，我更倾向于使用 [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner) 。它易于上手 ~~*（看下面那么水的方法就知道）*~~、通用性强，适合小白使用。

<!-- more -->

## 安装运行环境

### C/C++ 建议使用 MinGW

1. 到 ~~[SourceForge](http://sourceforge.net/projects/mingw-w64/files/mingw-w64/)~~ [Github](https://github.com/niXman/mingw-builds-binaries/releases) 上下载最新的 MinGW-W64
2. 放到没有中文、空格的目录
3. 将 mingw-w64\bin 添加到 Path
4. 回到 VSCode，安装 [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
5. 随便写个 Hello World
6. 按下 Ctrl+Alt+N

### Go/Python

1. 到官网下载合适的安装包并安装
2. 确认已经添加到 Path
3. 回到 VSCode，安装 [Code Runner](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
4. 随便写个 Hello World
5. 按下 Ctrl+Alt+N

~~*不水了不水了*~~ 

## 解决不能输入的问题

很多情况下我们还要多次输入测试数据（尤其是 OIer ），但……根本输不进去。解决方法是：

1. Ctrl+, 并搜索 Code Runner
2. 找到 **Code-runner: Run ln Terminal** ，打开它
