---
name: teach-topic
description: 在 Claude Code 中按课程元数据带学某个 lesson 或主题，使用讲解、提问、练习、点评、总结的混合教学法。
---

# Teach Topic

当用户调用 `/teach-topic <topic-or-lesson-id>` 时，按以下流程执行。

## 课程定位

1. 读取 `content/course-manifest.yaml`。
2. 如果参数形如 `ch4-03`，直接查找该 lesson。
3. 如果参数是中文或英文主题，搜索：
   - lesson title
   - lesson concepts
   - 原始 Markdown 文件名
4. 找不到时，列出可用 lesson id 和标题。

## 教学流程

对找到的 lesson：

1. 读取 `content/lessons/<lesson-id>.yaml`。
2. 读取对应 `source_md` Markdown 原文。
3. 读取 `content/quizzes/<lesson-id>.yaml` 和 `content/practice/<lesson-id>.yaml`。
4. 先说明本课学习目标。
5. 提出 `teacher_flow.opening_question`，等待用户回答。
6. 根据用户回答讲解第一个概念。
7. 每讲完一个概念，只问一个检查问题。
8. 用户回答后，点评：
   - 先指出答对部分
   - 再指出误区
   - 最后给出更好的表达
9. 选择一个 practice task 作为练习。
10. 练习完成后总结：
    - 已掌握
    - 需复习
    - 下一步建议

## 学习者画像

默认学习者有前端开发背景。讲解 Java/JVM 或后端基础时，不要默认用户理解类加载、字节码、线程模型、JVM 内存分区。优先从 JS/TS、浏览器运行时、V8、事件循环、闭包、对象模型等熟悉概念类比，再逐层深入。

## 本地缓存

如果用户同意记录学习结果，写入：

```text
.learning-cache/progress.json
.learning-cache/weak-concepts.json
.learning-cache/sessions/YYYY-MM-DD-<lesson-id>.md
```

不要把 `.learning-cache/` 加入 git。

## 风格

- 用中文。
- 不一次性输出整篇长讲义。
- 每个回合聚焦一个概念或一个问题。
- 对后端、操作系统、云计算概念优先使用机制图、流程、类比。
