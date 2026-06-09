# 交互式学习网站与 Claude Code 老师设计

日期：2026-06-09

## 背景

本仓库当前是一个以 Markdown 章节为核心的中文学习内容仓库，主题是“计算简史”。现有内容覆盖：

- Ch1 人机交互与操作系统基础
- Ch2 编程语言、面向对象、内存管理、线程并发
- Ch3 软件工程与分布式系统
- Ch4 云计算、容器与 Kubernetes
- Ch5 算法与数据结构（占位）

仓库目前没有网站框架、构建系统、后端服务或 CLI 工具。第一版目标是在不破坏现有 Markdown 内容的前提下，生成一个可以本地运行和发布的交互式学习网站，并在 Claude Code 中提供“老师带学”体验。

## 目标

第一版实现以下能力：

1. 覆盖 Ch1-Ch4 所有已有文章。
2. 每篇文章都有较深的交互学习体验，而不是简单文档展示。
3. 学习网站是静态站点，支持本地缓存学习进度。
4. 老师讲解发生在 Claude Code 中，而不是另做独立 CLI。
5. 网站和 Claude Code 老师共用同一套课程元数据。
6. 原始 Markdown 内容尽量保持稳定，不绑定具体前端框架。

## 非目标

第一版不实现：

- 用户账户系统
- 多设备进度同步
- 服务端数据库
- FastAPI 或其他后端服务
- 独立教学 CLI
- 在线 AI 聊天网页
- 复杂排行榜或社交学习功能

这些能力可以在后续版本中按需增加。

## 总体架构

系统由三部分组成：

```text
现有 Markdown 文章
        │
        ▼
content/*.yaml 课程元数据
        │
        ├──────────────► Astro 静态学习网站
        │                  - 文章页
        │                  - 概念地图
        │                  - 测验
        │                  - 练习
        │                  - localStorage 本地进度缓存
        │
        └──────────────► Claude Code 老师
                           - 读取本地 Markdown / YAML
                           - /teach-topic 带学
                           - /review-answer 点评
                           - /practice-task 出练习
                           - 写入本地学习缓存
```

推荐技术栈：

- 网站：Astro
- 样式：Tailwind CSS
- 交互组件：React Islands
- 概念图：D3.js 或 Cytoscape.js
- 内容元数据：YAML
- 网站学习进度：localStorage
- Claude Code 学习进度：本地 `.learning-cache/` 文件

## 项目目录设计

新增目录建议如下：

```text
a-brief-history-of-compute/
├── ch1/ ch2/ ch3/ ch4/ ch5/   # 原始 Markdown 教材
├── draw/                      # Excalidraw 图
├── content/                   # 课程元数据
│   ├── course-manifest.yaml
│   ├── lessons/
│   ├── quizzes/
│   └── practice/
├── src/                       # Astro 网站
│   ├── content/
│   ├── components/
│   ├── layouts/
│   └── pages/
├── .claude/                   # Claude Code 老师
│   ├── CLAUDE.md
│   └── skills/
│       ├── teach-topic/SKILL.md
│       ├── review-answer/SKILL.md
│       ├── practice-task/SKILL.md
│       └── generate-lesson-page/SKILL.md
├── .learning-cache/           # 本地学习缓存，不提交
├── package.json
├── astro.config.mjs
└── readme.md
```

`.learning-cache/` 和 `.superpowers/` 应加入 `.gitignore`。

## 课程内容系统

### 课程总纲

`content/course-manifest.yaml` 作为全局课程索引，描述章节顺序、文章顺序和源文件路径。

示例：

```yaml
courses:
  - id: a-brief-history-of-compute
    title: 计算简史
    chapters:
      - id: ch1
        title: 人机交互
        lessons:
          - id: ch1-01
            title: 人机交互历程：从纸带到操作系统
            source: ch1/01-人机交互历程_从纸带到操作系统.md
          - id: ch1-02
            title: 现代操作系统的雏形
            source: ch1/02-现代操作系统的雏形.md
```

### Lesson 元数据

每篇文章对应一个 lesson 文件，例如 `content/lessons/ch4-03.yaml`。

```yaml
id: ch4-03
title: Kubernetes 基础概念与设计
chapter_id: ch4
source_md: ch4/03-Kubernetes_基础概念与设计.md
level: intermediate
estimated_minutes: 45

prerequisites:
  - ch4-01
  - ch4-02

concepts:
  - id: pod
    name: Pod
    summary: Kubernetes 的最小调度单元
    tags: [core, scheduling]
  - id: controller
    name: Controller
    summary: 驱动实际状态向期望状态逼近的循环
    tags: [core, control-loop]

interaction_template: cloud-native-design

teacher_flow:
  opening_question: 为什么 Kubernetes 不直接让你管理容器，而是管理 Pod？
  lesson_points:
    - container 和 Pod 的关系
    - 声明式 API 如何运作
    - Controller 的控制循环
  closing_check: 用一句话向同学解释 Controller 模式
```

### 深度交互模板

每篇文章都按同一套深度学习结构呈现：

1. 导读问题
2. 概念地图
3. 分段阅读
4. 章节检查点
5. 交互测验
6. 实践任务
7. 复盘卡片

不同文章可以套用不同交互模板：

```yaml
interaction_templates:
  - history-timeline
  - system-mechanism
  - concept-comparison
  - distributed-thinking
  - cloud-native-design
```

示例映射：

- Ch1 早期人机交互：`history-timeline`
- Linux 文件系统、内存管理、进程管理：`system-mechanism`
- 面向对象：`concept-comparison`
- 分布式系统：`distributed-thinking`
- Kubernetes 相关文章：`cloud-native-design`

### 测验数据

测验题放在 `content/quizzes/*.yaml` 中，每篇文章至少 5-8 道题。

支持题型：

- 单选题
- 多选题
- 判断题
- 排序题
- 连线题
- 简答题
- 纠错题
- YAML / 伪代码填空题

示例：

```yaml
lesson_id: ch4-03
questions:
  - id: q01
    type: single-choice
    question: Pod 和容器的核心区别是什么？
    options:
      - Pod 是容器的升级版
      - Pod 是容器运行的沙箱
      - Pod 是调度的基本单位，一个 Pod 包含一或多个容器
      - Pod 是集群的网络入口
    answer: 2
    explanation: Pod 不是容器的替代品，而是 Kubernetes 的最小调度单位。
    source_anchor: pod
```

### 实践任务

实践任务放在 `content/practice/*.yaml` 中。

示例：

```yaml
lesson_id: ch4-03
tasks:
  - id: p01
    type: diagram
    prompt: 画出一组 Deployment 到底层 Pod 的控制链路。
    rubric:
      - Deployment 管理 ReplicaSet
      - ReplicaSet 保证 Pod 副本数
      - Pod 是实际运行容器的载体
      - Controller 不断比较期望状态和实际状态
```

## 网站体验设计

### 路由结构

```text
/                         首页
/chapters                 章节总览
/chapters/ch1             Ch1 章节页
/chapters/ch1/lesson/01   文章学习页
/practice                 练习聚合页
/quiz                     测验汇总页
/cards                    知识卡片盒
/progress                 本地学习进度页
```

### 文章学习页

每篇文章页面包含：

1. 面包屑导航
2. 导读问题
3. 原文分段内容
4. 可展开类比
5. 常见误区提示
6. 检查理解小问题
7. 侧边概念卡片
8. 交互式概念地图
9. 深度测验
10. 实践任务
11. 复盘卡片
12. 上一课 / 下一课

### 概念地图

概念地图由 lesson 的 `concepts` 和关系元数据生成。第一版支持：

- 节点点击展开解释
- 节点学习状态标记
- 简单缩放和拖拽
- 关联文章跳转

### 测验交互

测验在浏览器端完成，不依赖后端。

提交后显示：

- 正确答案
- 当前答案是否正确
- 错误选项为什么错
- 回看原文的定位链接
- 是否加入薄弱概念列表

### 知识卡片

知识卡片由每篇 lesson 的 concepts 与复盘内容生成。支持：

- 按章节筛选
- 按概念标签筛选
- 搜索关键词
- 标记易错
- 导出 Markdown

### 本地进度缓存

网站使用 localStorage 保存学习状态。

示例：

```json
{
  "completedLessons": ["ch1-01", "ch4-03"],
  "quizAttempts": {
    "ch4-03:q01": {
      "correct": true,
      "attempts": 2
    }
  },
  "weakConcepts": ["controller", "inode"]
}
```

## Claude Code 老师设计

### 入口

老师能力通过 repo 内的 Claude Code skills 提供：

```text
.claude/skills/
├── teach-topic/
│   ├── SKILL.md
│   └── templates/
├── review-answer/
│   ├── SKILL.md
│   └── templates/
├── practice-task/
│   ├── SKILL.md
│   └── templates/
└── generate-lesson-page/
    ├── SKILL.md
    └── templates/
```

建议使用方式：

```text
/teach-topic ch4-03
/teach-topic Kubernetes Controller
/review-answer "Pod 是 Kubernetes 中最小调度单元..."
/practice-task ch2-04
/generate-lesson-page ch1-03
```

### 教学流程

老师采用混合型教学法：

```text
讲解 → 提问 → 练习 → 点评 → 总结薄弱点
```

具体流程：

1. 定位课程
   - 根据用户输入查找 lesson
   - 读取对应 Markdown 和 YAML
   - 说明学习目标

2. 讲解
   - 以原文为依据
   - 不逐字复述
   - 先解释背景，再解释机制，再解释设计原因

3. 提问
   - 每讲一个核心概念后问一个短问题
   - 等用户回答后再继续
   - 不一次抛出多个问题

4. 练习
   - 从 practice 数据中选择任务
   - 或根据用户薄弱点生成临时任务

5. 点评
   - 指出答对部分
   - 纠正误区
   - 给出更好的表达
   - 必要时回到原文某一节

6. 总结
   - 总结本节学习内容
   - 标注已掌握、需复习、未理解
   - 可写入 `.learning-cache/`

### Claude Code 项目说明

`.claude/CLAUDE.md` 用于定义本项目的教师行为契约。它应该保持简洁，只放稳定规则：

- 使用中文讲解
- 用混合型教学法
- 每次只问一个问题
- 以仓库内 Markdown 和 YAML 为课程来源
- 不把本地学习缓存提交到 git
- 写网站内容时保持 explanation / question / practice / review 结构

不应该把完整课程内容放进 `.claude/CLAUDE.md`。

### 本地学习缓存

Claude Code 老师使用 `.learning-cache/` 记录本地学习状态。

```text
.learning-cache/
├── progress.json
├── weak-concepts.json
└── sessions/
    └── 2026-06-09-ch4-03.md
```

示例：

```json
{
  "completedLessons": ["ch4-03"],
  "weakConcepts": [
    {
      "conceptId": "controller",
      "lessonId": "ch4-03",
      "reason": "无法清楚区分期望状态和实际状态",
      "lastReviewedAt": "2026-06-09T10:00:00Z"
    }
  ]
}
```

该目录只用于本地缓存，应加入 `.gitignore`。

## 错误处理

### 内容加载错误

| 场景 | 处理 |
|---|---|
| Markdown 源文件缺失 | 构建时报错并给出文件路径 |
| lesson 元数据缺字段 | 内容校验脚本报错 |
| quiz 答案索引无效 | 内容校验脚本报错 |
| 概念引用不存在 | 内容校验脚本报错 |
| 某篇文章未配置 quiz | 网站展示“本课测验待补充”，但构建给出警告 |

### 网站运行错误

| 场景 | 处理 |
|---|---|
| localStorage 不可用 | 降级为只读学习，无进度记录 |
| 测验题数据损坏 | 隐藏该题并在控制台输出错误 |
| 概念地图渲染失败 | 显示概念列表作为降级方案 |

### Claude Code 老师错误

| 场景 | 处理 |
|---|---|
| 找不到 lesson | 列出当前支持的 lesson ID |
| 找不到测验 | 使用原文临时生成检查问题 |
| 用户连续答错 | 降低难度并改为讲解模式 |
| 用户岔开话题 | 完成当前环节后询问是否回到课程 |
| 缓存写入失败 | 不阻塞教学，提示本次不会保存进度 |

## 测试策略

### 内容校验

提供内容校验脚本，检查：

- 所有 lesson ID 唯一
- 所有 source_md 文件存在
- 所有 quiz 答案有效
- 所有 concept ID 在同一 lesson 内唯一
- 所有 practice task 有 rubric
- manifest 中列出的 lesson 都有 lesson 文件

### 网站测试

第一版至少验证：

- `astro build` 成功
- 每篇 Ch1-Ch4 文章能生成页面
- 首页、章节页、文章页无 404
- 测验提交逻辑可用
- localStorage 读写正常
- 概念地图渲染失败时有降级展示

### Claude Code 老师测试

手工验证以下场景：

- `/teach-topic ch4-03` 能找到正确课程
- 老师能按“讲解 → 提问 → 练习 → 点评 → 总结”进行
- 用户答错时老师能引导而不是直接跳过
- 老师能读取 `.learning-cache/` 的薄弱概念
- 老师不会把 `.learning-cache/` 作为应提交文件

## 实施顺序建议

1. 初始化 Astro 项目和基础页面结构。
2. 添加 `.gitignore` 规则，忽略 `.learning-cache/` 和 `.superpowers/`。
3. 建立 `content/course-manifest.yaml`。
4. 为 Ch1-Ch4 所有已有文章生成基础 lesson 元数据。
5. 实现文章页面渲染。
6. 实现本地进度 localStorage。
7. 实现测验组件和内容校验脚本。
8. 实现概念卡片和概念地图。
9. 添加 `.claude/CLAUDE.md` 教师行为契约。
10. 添加 `teach-topic`、`review-answer`、`practice-task`、`generate-lesson-page` 技能。
11. 为 Ch1-Ch4 补齐基础测验和实践任务。
12. 运行构建与手工教学流程验证。

## 风险与取舍

### 风险：全量覆盖导致内容质量不均

缓解方式：所有文章先有基础深度模板，重点章节后续再添加定制化动画和模拟器。

### 风险：没有后端导致跨设备进度无法同步

这是第一版明确取舍。当前目标是本地学习体验，localStorage 和 `.learning-cache/` 足够。

### 风险：Claude Code skills 依赖本地环境

这是有意设计。老师体验目标就是在 Claude Code 内完成，不面向普通网页用户。

### 风险：YAML 元数据维护成本高

通过内容校验脚本和生成脚本降低维护成本。后续可从 Markdown heading 自动提取基础元数据。

## 成功标准

第一版完成后，应满足：

1. 用户能打开本地网站浏览 Ch1-Ch4 所有已有文章。
2. 每篇文章至少有导读问题、概念列表、测验、实践任务、复盘卡片。
3. 网站能在浏览器本地保存学习进度。
4. 用户能在 Claude Code 中使用老师技能带学某篇文章。
5. 老师能按混合型教学法进行讲解、提问、练习、点评和总结。
6. 本地学习缓存不会被提交到 git。
7. 网站构建通过，内容校验通过。
