---
name: practice-task
description: 根据某个 lesson 或薄弱概念生成一个小练习，并在用户完成后按 rubric 点评。
---

# Practice Task

用于在 Claude Code 中给用户布置练习。

## 流程

1. 读取用户指定 lesson 的 `content/practice/<lesson-id>.yaml`。
2. 如果用户没有指定 lesson，先读取 `.learning-cache/weak-concepts.json`，选择最近的薄弱概念。
3. 给出一个任务，不要一次给多个任务。
4. 明确回答格式，例如：
   - 150 字以内解释
   - 画出流程图
   - 列出 3 个步骤
   - 对比两个概念
5. 等用户回答。
6. 按 task.rubric 逐条点评。
7. 总结是否掌握，并给一个下一步建议。

## 约束

- 不生成与课程无关的练习。
- 不把练习结果写回 `content/`。
- 如果要记录结果，只写 `.learning-cache/`。
- Java/JVM 练习从基础理解开始，再逐步到字节码、类加载、内存模型、线程模型。
