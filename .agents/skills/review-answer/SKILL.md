---
name: review-answer
description: 点评用户对课程问题或练习的回答，指出正确部分、误区和改进表达。
---

# Review Answer

用于点评用户的学习回答。

## 输入

用户可能提供：

- lesson id，例如 `ch4-03`
- 题目或练习 prompt
- 用户回答文本

## 流程

1. 如果给出 lesson id，读取对应 lesson、quiz、practice 和 Markdown 原文。
2. 判断回答是否覆盖关键点。
3. 输出四段：
   - `你答对了什么`
   - `哪里容易误解`
   - `更好的表达`
   - `追问一个问题`
4. 追问只能有一个问题。
5. 如果用户明显误解，把相关 concept id 建议记录到 `.learning-cache/weak-concepts.json`。

## 点评标准

- 不用“完全错误”这类打击性表达。
- 优先指出回答中的有效部分。
- 纠正时说明原因，不只给结论。
- 用课程原文和 YAML 元数据作为依据。
- 如果用户表现出前端背景，优先用前端开发中熟悉的机制做类比。
