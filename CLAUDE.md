# CLAUDE.md

## 项目概述

本仓库是《计算简史》(A Brief History of Compute)，一个中文技术写作项目，以杂谈方式讲述计算机技术的发展历史和核心原理。

## 内容结构

- `ch1/` - 人机交互（操作系统基础）
- `ch2/` - 编程语言（从汇编到现代语言）
- `ch3/` - 软件工程（分布式系统等）
- `ch4/` - 云计算（虚拟化、容器、Kubernetes）
- `draw/` - Excalidraw 绘图源文件
- `web/` - 交互式学习课件（Vite + React）
- `.learn/` - 学习进度跟踪（由 AGENTS.md 学习系统使用）

## 文章格式

- 所有文章为 Markdown 格式
- 命名规则: `NN-标题.md`
- 图片存放在各章节的 `img/` 子目录中
- 使用 H1 作为文章标题，H3 作为主要章节标题，H4 作为子标题

## 教学系统

本仓库配置了 `AGENTS.md`，定义了一个交互式学习引导系统。当用户希望学习本仓库的内容时，Claude Code 应按照 AGENTS.md 的规范提供教学服务。

### 关键入口

- 学习者输入 `开始学习` / `start` 启动学习流程
- 进度保存在 `.learn/progress.json`
- 学习计划保存在 `.learn/plan.md`
- Web课件: `cd web && npm run dev` → http://localhost:5173

## 注意事项

- 文章使用中文撰写，技术术语保留英文
- 部分章节尚未完成（ch3 的 01-03，ch4 的 06，整个 ch5）
- 图片是理解内容的重要组成部分，教学时应提示学习者查看
