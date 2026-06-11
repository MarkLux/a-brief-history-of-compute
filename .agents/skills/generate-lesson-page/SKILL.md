---
name: generate-lesson-page
description: 根据 Markdown 原文生成或改进 lesson、quiz、practice 元数据，供 Astro 学习网站使用。
---

# Generate Lesson Page

用于把已有 Markdown 文章转成网站可用的交互学习数据。

## 流程

1. 读取 `content/course-manifest.yaml` 找到 lesson。
2. 读取原始 Markdown。
3. 更新或创建：
   - `content/lessons/<lesson-id>.yaml`
   - `content/quizzes/<lesson-id>.yaml`
   - `content/practice/<lesson-id>.yaml`
4. 每篇 lesson 保持：
   - 3 个以上 concepts
   - 5 道以上 quiz questions
   - 2 个以上 practice tasks
   - teacher_flow opening_question、lesson_points、closing_check
5. 修改后运行 `npm run validate:content`。

## 内容质量标准

- quiz 不能只考名词定义，要考理解。
- practice 必须能让用户输出解释、对比、流程或设计判断。
- explanation 要说明为什么正确，错误选项为什么容易误解。
- 不改动原始 Markdown，除非用户明确要求。
- 面向有前端背景的学习者。Java/JVM 内容应从基础逐渐深入，优先使用 JS/V8/浏览器运行时类比。
