# Interactive Learning Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a no-backend Astro interactive learning website and Claude Code-native teacher workflow for the existing Ch1-Ch4 Markdown lessons.

**Architecture:** Existing Markdown remains the source material. Shared YAML course metadata feeds both the Astro static site and Claude Code teacher skills. Browser progress uses `localStorage`; Claude Code teacher progress uses local `.learning-cache/` files ignored by git.

**Tech Stack:** Astro, TypeScript, React islands, Tailwind CSS, Vitest, YAML, Markdown-It, Zod, Claude Code project skills.

---

## Scope Notes

This plan implements the first complete vertical slice of the approved spec:

- Static site only: no FastAPI, no server database, no account system.
- Ch1-Ch4 all existing Markdown articles are represented in the course manifest.
- Starter metadata, quizzes, and practice tasks are generated for every lesson from a deterministic template, then can be deepened manually in follow-up content-only tasks.
- Claude Code teacher skills read the same local files as the website and write only to `.learning-cache/`.
- Target learners have frontend development background. Java/JVM and backend concepts must start from basics and gradually deepen, using JS/V8/browser/runtime analogies where helpful.
- Implementation phase should not create commits unless the user explicitly asks. Each task ends with a verification checkpoint instead of `git commit`.

## File Structure Map

### Created or modified files

- Modify: `.gitignore` — ignore local learning/cache artifacts and visual brainstorm output.
- Create: `package.json` — npm scripts and dependencies for Astro, React, validation, and tests.
- Create: `astro.config.mjs` — Astro integrations.
- Create: `tsconfig.json` — TypeScript config.
- Create: `tailwind.config.mjs` — Tailwind content paths.
- Create: `vitest.config.ts` — Vitest jsdom/node test config.
- Create: `src/styles/global.css` — global typography and layout styles.
- Create: `src/layouts/BaseLayout.astro` — common HTML shell.
- Create: `src/lib/course.ts` — load and validate manifest, lessons, quizzes, practice tasks, and Markdown.
- Create: `src/lib/progress.ts` — localStorage progress read/write utilities.
- Create: `src/components/QuizPanel.tsx` — browser quiz component.
- Create: `src/components/ConceptMap.tsx` — interactive concept graph fallback-first component.
- Create: `src/components/PracticeTask.tsx` — practice task display and self-check UI.
- Create: `src/components/ReviewCard.tsx` — lesson review card and completion button.
- Create: `src/pages/index.astro` — homepage and learning path entry.
- Create: `src/pages/chapters/index.astro` — all chapters overview.
- Create: `src/pages/chapters/[chapter]/index.astro` — chapter detail pages.
- Create: `src/pages/chapters/[chapter]/lesson/[lesson].astro` — lesson page with Markdown, quiz, map, practice, and review.
- Create: `src/pages/progress.astro` — local progress page.
- Create: `src/pages/cards.astro` — concept card browser.
- Create: `src/pages/quiz.astro` — quiz index.
- Create: `src/pages/practice.astro` — practice task index.
- Create: `content/course-manifest.yaml` — canonical Ch1-Ch4 lesson list.
- Create: `content/lessons/*.yaml` — generated starter lesson metadata.
- Create: `content/quizzes/*.yaml` — generated starter quiz data.
- Create: `content/practice/*.yaml` — generated starter practice task data.
- Create: `scripts/generate-starter-content.mjs` — deterministic metadata generator.
- Create: `scripts/validate-content.mjs` — content validation CLI and exported validator.
- Create: `tests/content/validate-content.test.mjs` — validator tests.
- Create: `tests/lib/course.test.ts` — content loader tests.
- Create: `tests/lib/progress.test.ts` — localStorage progress tests.
- Create: `tests/components/QuizPanel.test.tsx` — quiz component tests.
- Create: `.claude/CLAUDE.md` — project teaching contract.
- Create: `.claude/skills/teach-topic/SKILL.md` — Claude Code lesson teaching workflow.
- Create: `.claude/skills/review-answer/SKILL.md` — answer review workflow.
- Create: `.claude/skills/practice-task/SKILL.md` — practice task workflow.
- Create: `.claude/skills/generate-lesson-page/SKILL.md` — lesson page/content generation workflow.
- Modify: `readme.md` — add local website and teacher usage notes.

---

## Task 1: Initialize Project Tooling

**Files:**
- Modify: `.gitignore`
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `tailwind.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Update `.gitignore` for generated/local artifacts**

Replace `.gitignore` with:

```gitignore
.idea/
node_modules/
dist/
.astro/
.learning-cache/
.superpowers/
.DS_Store
```

- [ ] **Step 2: Create `package.json`**

Create `package.json` with:

```json
{
  "name": "a-brief-history-of-compute",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "npm run validate:content && astro build",
    "preview": "astro preview",
    "validate:content": "node scripts/validate-content.mjs",
    "generate:content": "node scripts/generate-starter-content.mjs",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "astro check"
  },
  "dependencies": {
    "@astrojs/check": "latest",
    "@astrojs/react": "latest",
    "@astrojs/tailwind": "latest",
    "@vitejs/plugin-react": "latest",
    "astro": "latest",
    "d3": "latest",
    "gray-matter": "latest",
    "markdown-it": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "typescript": "latest",
    "yaml": "latest",
    "zod": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/d3": "latest",
    "@types/markdown-it": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: `package-lock.json` is created and npm exits with code 0.

- [ ] **Step 4: Create `astro.config.mjs`**

Create `astro.config.mjs` with:

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
```

- [ ] **Step 5: Create `tsconfig.json`**

Create `tsconfig.json` with:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src", "tests", "astro.config.mjs", "vitest.config.ts"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 6: Create `tailwind.config.mjs`**

Create `tailwind.config.mjs` with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        paper: '#f8f5ef',
        ink: '#1f2933',
        muted: '#667085',
        accent: '#9a6b3f',
        sage: '#67866f',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'Songti SC', 'serif'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 7: Create `vitest.config.ts`**

Create `vitest.config.ts` with:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    include: ['tests/**/*.{test,spec}.{ts,tsx,mjs}'],
  },
});
```

- [ ] **Step 8: Create global styles**

Create `src/styles/global.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --content-width: 72rem;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background: #f8f5ef;
  color: #1f2933;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

article {
  line-height: 1.82;
}

article h1,
article h2,
article h3,
article h4 {
  color: #111827;
  line-height: 1.35;
  scroll-margin-top: 6rem;
}

article h1 { font-size: 2.25rem; margin: 0 0 1.5rem; }
article h2 { font-size: 1.65rem; margin: 2.5rem 0 1rem; }
article h3 { font-size: 1.25rem; margin: 2rem 0 .75rem; }

article p {
  margin: 1rem 0;
}

article img {
  max-width: 100%;
  border-radius: 0.75rem;
  margin: 1.25rem auto;
}

article pre {
  overflow-x: auto;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #111827;
  color: #f9fafb;
}

.lesson-card {
  border: 1px solid rgba(154, 107, 63, 0.18);
  background: rgba(255, 255, 255, 0.72);
  border-radius: 1rem;
  box-shadow: 0 16px 40px rgba(31, 41, 51, 0.06);
}
```

- [ ] **Step 9: Create base layout**

Create `src/layouts/BaseLayout.astro` with:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = '计算简史交互式学习网站' } = Astro.props;
---
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
  </head>
  <body>
    <header class="border-b border-black/10 bg-white/75 backdrop-blur">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="/" class="text-lg font-bold text-ink">计算简史</a>
        <div class="flex gap-4 text-sm text-muted">
          <a class="hover:text-accent" href="/chapters">章节</a>
          <a class="hover:text-accent" href="/quiz">测验</a>
          <a class="hover:text-accent" href="/practice">练习</a>
          <a class="hover:text-accent" href="/cards">卡片</a>
          <a class="hover:text-accent" href="/progress">进度</a>
        </div>
      </nav>
    </header>
    <main class="mx-auto max-w-6xl px-5 py-8">
      <slot />
    </main>
  </body>
</html>
```

- [ ] **Step 10: Verify tooling**

Run:

```bash
npm run test
```

Expected: Vitest exits successfully with a message equivalent to “No test files found” or “0 tests”.

- [ ] **Step 11: Verification checkpoint**

Run:

```bash
npm run test
```

Expected: Vitest exits successfully. Do NOT commit. All files remain in working tree for user review.

---

## Task 2: Add Course Manifest and Content Validation

**Files:**
- Create: `content/course-manifest.yaml`
- Create: `scripts/validate-content.mjs`
- Create: `tests/content/validate-content.test.mjs`

- [ ] **Step 1: Create `content/course-manifest.yaml`**

Create `content/course-manifest.yaml` with:

```yaml
course:
  id: a-brief-history-of-compute
  title: 计算简史
  description: 从操作系统、编程语言、软件工程到云计算的交互式学习路径。
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
        - id: ch1-03
          title: Linux 的设计哲学：文件系统
          source: ch1/03-Linux的设计哲学_文件系统.md
        - id: ch1-04
          title: Linux 的设计哲学：内存管理
          source: ch1/04-Linux的设计哲学_内存管理.md
        - id: ch1-05
          title: Linux 的设计哲学：进程管理
          source: ch1/05-Linux的设计哲学_进程管理.md
    - id: ch2
      title: 编程语言
      lessons:
        - id: ch2-01
          title: 高级语言的演进之路
          source: ch2/01-高级语言的演进之路.md
        - id: ch2-02
          title: 高级语言的自我修养：面向对象
          source: ch2/02-高级语言的自我修养_面向对象.md
        - id: ch2-03
          title: 高级语言的自我修养：内存管理
          source: ch2/03-高级语言的自我修养_内存管理.md
        - id: ch2-04
          title: 高级语言的自我修养：线程并发
          source: ch2/04-高级语言的自我修养_线程并发.md
    - id: ch3
      title: 软件工程
      lessons:
        - id: ch3-04
          title: 分布式系统
          source: ch3/04-分布式系统.md
    - id: ch4
      title: 云计算
      lessons:
        - id: ch4-01
          title: 楔子：从虚拟化到容器
          source: ch4/01-楔子_从虚拟化到容器.md
        - id: ch4-02
          title: 云计算的混沌时代
          source: ch4/02-云计算的混沌时代.md
        - id: ch4-03
          title: Kubernetes：基础概念与设计
          source: ch4/03-Kubernetes_基础概念与设计.md
        - id: ch4-04
          title: Kubernetes：基本实现分析
          source: ch4/04-Kubernetes_基本实现分析.md
        - id: ch4-05
          title: Kubernetes：运行机制与扩展
          source: ch4/05-Kubernetes_运行机制与扩展.md
```

- [ ] **Step 2: Write failing validator tests**

Create `tests/content/validate-content.test.mjs` with:

```js
import { describe, expect, it } from 'vitest';
import { validateCourseData } from '../../scripts/validate-content.mjs';

const validFiles = new Set([
  'ch1/01-人机交互历程_从纸带到操作系统.md',
  'content/lessons/ch1-01.yaml',
  'content/quizzes/ch1-01.yaml',
  'content/practice/ch1-01.yaml',
]);

const validManifest = {
  course: {
    id: 'demo',
    title: 'Demo',
    chapters: [
      {
        id: 'ch1',
        title: 'Chapter',
        lessons: [
          {
            id: 'ch1-01',
            title: 'Lesson',
            source: 'ch1/01-人机交互历程_从纸带到操作系统.md',
          },
        ],
      },
    ],
  },
};

const validLessons = new Map([
  [
    'ch1-01',
    {
      id: 'ch1-01',
      title: 'Lesson',
      chapter_id: 'ch1',
      source_md: 'ch1/01-人机交互历程_从纸带到操作系统.md',
      level: 'beginner',
      estimated_minutes: 30,
      concepts: [{ id: 'concept-a', name: 'Concept A', summary: 'A concept', tags: ['core'] }],
      interaction_template: 'history-timeline',
      teacher_flow: {
        opening_question: '为什么要学习这个问题？',
        lesson_points: ['背景', '机制'],
        closing_check: '请用一句话总结。',
      },
    },
  ],
]);

const validQuizzes = new Map([
  [
    'ch1-01',
    {
      lesson_id: 'ch1-01',
      questions: [
        {
          id: 'q01',
          type: 'single-choice',
          question: '哪个说法正确？',
          options: ['A', 'B', 'C'],
          answer: 1,
          explanation: 'B 正确。',
          source_anchor: 'concept-a',
        },
      ],
    },
  ],
]);

const validPractice = new Map([
  [
    'ch1-01',
    {
      lesson_id: 'ch1-01',
      tasks: [
        {
          id: 'p01',
          type: 'explain',
          prompt: '解释这个概念。',
          rubric: ['说清楚背景', '说清楚机制'],
        },
      ],
    },
  ],
]);

describe('validateCourseData', () => {
  it('accepts a complete course data set', () => {
    const result = validateCourseData({
      manifest: validManifest,
      lessons: validLessons,
      quizzes: validQuizzes,
      practice: validPractice,
      fileExists: (path) => validFiles.has(path),
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it('reports duplicate lesson ids', () => {
    const manifest = structuredClone(validManifest);
    manifest.course.chapters[0].lessons.push({ ...manifest.course.chapters[0].lessons[0] });

    const result = validateCourseData({
      manifest,
      lessons: validLessons,
      quizzes: validQuizzes,
      practice: validPractice,
      fileExists: (path) => validFiles.has(path),
    });

    expect(result.errors).toContain('Duplicate lesson id: ch1-01');
  });

  it('reports invalid quiz answer index', () => {
    const quizzes = new Map(validQuizzes);
    quizzes.set('ch1-01', {
      lesson_id: 'ch1-01',
      questions: [{ ...validQuizzes.get('ch1-01').questions[0], answer: 9 }],
    });

    const result = validateCourseData({
      manifest: validManifest,
      lessons: validLessons,
      quizzes,
      practice: validPractice,
      fileExists: (path) => validFiles.has(path),
    });

    expect(result.errors).toContain('Quiz ch1-01:q01 answer index 9 is outside options range 0-2');
  });
});
```

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
npm run test -- tests/content/validate-content.test.mjs
```

Expected: FAIL with module import error for `scripts/validate-content.mjs`.

- [ ] **Step 4: Create `scripts/validate-content.mjs`**

Create `scripts/validate-content.mjs` with:

```js
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const ROOT = process.cwd();
const VALID_TEMPLATES = new Set([
  'history-timeline',
  'system-mechanism',
  'concept-comparison',
  'distributed-thinking',
  'cloud-native-design',
]);

function readYamlIfExists(filePath) {
  if (!fs.existsSync(filePath)) return undefined;
  return YAML.parse(fs.readFileSync(filePath, 'utf8'));
}

function readYamlDir(dirPath) {
  const entries = new Map();
  if (!fs.existsSync(dirPath)) return entries;
  for (const file of fs.readdirSync(dirPath).filter((name) => name.endsWith('.yaml')).sort()) {
    const value = YAML.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
    entries.set(path.basename(file, '.yaml'), value);
  }
  return entries;
}

export function validateCourseData({ manifest, lessons, quizzes, practice, fileExists }) {
  const errors = [];
  const warnings = [];
  const seenLessonIds = new Set();

  if (!manifest?.course?.chapters?.length) {
    errors.push('Manifest must define course.chapters');
    return { errors, warnings };
  }

  for (const chapter of manifest.course.chapters) {
    if (!chapter.id) errors.push('Chapter is missing id');
    if (!chapter.title) errors.push(`Chapter ${chapter.id ?? '<unknown>'} is missing title`);
    if (!Array.isArray(chapter.lessons)) {
      errors.push(`Chapter ${chapter.id ?? '<unknown>'} lessons must be an array`);
      continue;
    }

    for (const manifestLesson of chapter.lessons) {
      const lessonId = manifestLesson.id;
      if (!lessonId) {
        errors.push(`Chapter ${chapter.id} contains a lesson without id`);
        continue;
      }
      if (seenLessonIds.has(lessonId)) {
        errors.push(`Duplicate lesson id: ${lessonId}`);
      }
      seenLessonIds.add(lessonId);

      if (!manifestLesson.source || !fileExists(manifestLesson.source)) {
        errors.push(`Lesson ${lessonId} source file does not exist: ${manifestLesson.source}`);
      }

      const lesson = lessons.get(lessonId);
      if (!lesson) {
        errors.push(`Missing lesson metadata: content/lessons/${lessonId}.yaml`);
        continue;
      }
      if (lesson.id !== lessonId) errors.push(`Lesson ${lessonId} metadata id mismatch: ${lesson.id}`);
      if (lesson.chapter_id !== chapter.id) errors.push(`Lesson ${lessonId} chapter_id must be ${chapter.id}`);
      if (lesson.source_md !== manifestLesson.source) errors.push(`Lesson ${lessonId} source_md must match manifest source`);
      if (!VALID_TEMPLATES.has(lesson.interaction_template)) errors.push(`Lesson ${lessonId} has invalid interaction_template: ${lesson.interaction_template}`);
      if (!Number.isInteger(lesson.estimated_minutes) || lesson.estimated_minutes <= 0) errors.push(`Lesson ${lessonId} estimated_minutes must be a positive integer`);
      if (!Array.isArray(lesson.concepts) || lesson.concepts.length === 0) errors.push(`Lesson ${lessonId} must define at least one concept`);

      const conceptIds = new Set();
      for (const concept of lesson.concepts ?? []) {
        if (!concept.id) errors.push(`Lesson ${lessonId} has a concept without id`);
        if (conceptIds.has(concept.id)) errors.push(`Lesson ${lessonId} has duplicate concept id: ${concept.id}`);
        conceptIds.add(concept.id);
        if (!concept.name) errors.push(`Lesson ${lessonId}:${concept.id} concept is missing name`);
        if (!concept.summary) errors.push(`Lesson ${lessonId}:${concept.id} concept is missing summary`);
      }

      if (!lesson.teacher_flow?.opening_question) errors.push(`Lesson ${lessonId} teacher_flow.opening_question is required`);
      if (!Array.isArray(lesson.teacher_flow?.lesson_points) || lesson.teacher_flow.lesson_points.length === 0) errors.push(`Lesson ${lessonId} teacher_flow.lesson_points must not be empty`);
      if (!lesson.teacher_flow?.closing_check) errors.push(`Lesson ${lessonId} teacher_flow.closing_check is required`);

      const quiz = quizzes.get(lessonId);
      if (!quiz) {
        warnings.push(`Missing quiz file: content/quizzes/${lessonId}.yaml`);
      } else {
        validateQuiz(lessonId, quiz, conceptIds, errors);
      }

      const practiceEntry = practice.get(lessonId);
      if (!practiceEntry) {
        warnings.push(`Missing practice file: content/practice/${lessonId}.yaml`);
      } else {
        validatePractice(lessonId, practiceEntry, errors);
      }
    }
  }

  for (const lessonId of lessons.keys()) {
    if (!seenLessonIds.has(lessonId)) errors.push(`Lesson metadata is not listed in manifest: ${lessonId}`);
  }

  return { errors, warnings };
}

function validateQuiz(lessonId, quiz, conceptIds, errors) {
  if (quiz.lesson_id !== lessonId) errors.push(`Quiz ${lessonId} lesson_id mismatch: ${quiz.lesson_id}`);
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push(`Quiz ${lessonId} must contain at least one question`);
    return;
  }

  const questionIds = new Set();
  for (const question of quiz.questions) {
    if (!question.id) errors.push(`Quiz ${lessonId} has a question without id`);
    if (questionIds.has(question.id)) errors.push(`Quiz ${lessonId} has duplicate question id: ${question.id}`);
    questionIds.add(question.id);
    if (!question.question) errors.push(`Quiz ${lessonId}:${question.id} is missing question text`);
    if (!question.explanation) errors.push(`Quiz ${lessonId}:${question.id} is missing explanation`);

    if (question.type === 'single-choice') {
      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`Quiz ${lessonId}:${question.id} single-choice question needs at least 2 options`);
      }
      const maxIndex = (question.options?.length ?? 0) - 1;
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > maxIndex) {
        errors.push(`Quiz ${lessonId}:${question.id} answer index ${question.answer} is outside options range 0-${maxIndex}`);
      }
    }

    if (question.source_anchor && conceptIds.size > 0 && !conceptIds.has(question.source_anchor)) {
      errors.push(`Quiz ${lessonId}:${question.id} references unknown concept source_anchor: ${question.source_anchor}`);
    }
  }
}

function validatePractice(lessonId, practiceEntry, errors) {
  if (practiceEntry.lesson_id !== lessonId) errors.push(`Practice ${lessonId} lesson_id mismatch: ${practiceEntry.lesson_id}`);
  if (!Array.isArray(practiceEntry.tasks) || practiceEntry.tasks.length === 0) {
    errors.push(`Practice ${lessonId} must contain at least one task`);
    return;
  }

  const taskIds = new Set();
  for (const task of practiceEntry.tasks) {
    if (!task.id) errors.push(`Practice ${lessonId} has a task without id`);
    if (taskIds.has(task.id)) errors.push(`Practice ${lessonId} has duplicate task id: ${task.id}`);
    taskIds.add(task.id);
    if (!task.type) errors.push(`Practice ${lessonId}:${task.id} is missing type`);
    if (!task.prompt) errors.push(`Practice ${lessonId}:${task.id} is missing prompt`);
    if (!Array.isArray(task.rubric) || task.rubric.length === 0) errors.push(`Practice ${lessonId}:${task.id} rubric must not be empty`);
  }
}

export function loadCourseData(root = ROOT) {
  const manifest = readYamlIfExists(path.join(root, 'content/course-manifest.yaml'));
  return {
    manifest,
    lessons: readYamlDir(path.join(root, 'content/lessons')),
    quizzes: readYamlDir(path.join(root, 'content/quizzes')),
    practice: readYamlDir(path.join(root, 'content/practice')),
    fileExists: (relativePath) => fs.existsSync(path.join(root, relativePath)),
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const result = validateCourseData(loadCourseData(ROOT));
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  for (const error of result.errors) console.error(`Error: ${error}`);
  if (result.errors.length > 0) process.exit(1);
  console.log(`Content validation passed with ${result.warnings.length} warning(s).`);
}
```

- [ ] **Step 5: Run tests and verify pass**

Run:

```bash
npm run test -- tests/content/validate-content.test.mjs
```

Expected: PASS for all 3 tests.

- [ ] **Step 6: Run content validation and verify expected warnings**

Run:

```bash
npm run validate:content
```

Expected: FAIL because lesson, quiz, and practice YAML files do not exist yet. The output should include errors like `Missing lesson metadata: content/lessons/ch1-01.yaml`.

- [ ] **Step 7: Verification checkpoint**

Run:

```bash
npm run test -- tests/content/validate-content.test.mjs
npm run validate:content
```

Expected: Tests pass. Content validation prints expected warnings. Do NOT commit.

---

## Task 3: Generate Starter Lesson, Quiz, and Practice Content

**Files:**
- Create: `scripts/generate-starter-content.mjs`
- Create generated files under `content/lessons/`, `content/quizzes/`, `content/practice/`

- [ ] **Step 1: Create starter content generator**

Create `scripts/generate-starter-content.mjs` with:

```js
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, 'content/course-manifest.yaml');
const manifest = YAML.parse(fs.readFileSync(manifestPath, 'utf8'));

const TEMPLATE_BY_CHAPTER = {
  ch1: 'system-mechanism',
  ch2: 'concept-comparison',
  ch3: 'distributed-thinking',
  ch4: 'cloud-native-design',
};

const LEVEL_BY_CHAPTER = {
  ch1: 'beginner',
  ch2: 'intermediate',
  ch3: 'intermediate',
  ch4: 'intermediate',
};

const CONCEPTS_BY_LESSON = {
  'ch1-01': ['人机交互', '批处理', '操作系统'],
  'ch1-02': ['分时系统', '终端', '资源抽象'],
  'ch1-03': ['文件系统', 'inode', '一切皆文件'],
  'ch1-04': ['虚拟内存', '分页', '地址空间'],
  'ch1-05': ['进程', '调度', '上下文切换'],
  'ch2-01': ['高级语言', '编译器', '运行时'],
  'ch2-02': ['从 JavaScript 对象到类', '封装', '多态'],
  'ch2-03': ['从 V8 GC 到 JVM GC', '堆内存', '对象生命周期'],
  'ch2-04': ['从浏览器事件循环到线程', '并发', '同步'], 
  'ch3-04': ['分布式系统', '一致性', '容错'],
  'ch4-01': ['虚拟化', '容器', '隔离'],
  'ch4-02': ['云计算', '资源池化', '弹性'],
  'ch4-03': ['Pod', 'Controller', '声明式 API'],
  'ch4-04': ['调度器', 'apiserver', 'etcd'],
  'ch4-05': ['控制循环', '扩展机制', 'Operator'],
};

function slugifyConcept(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[：:，,。/\\]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeYaml(relativePath, value) {
  const fullPath = path.join(ROOT, relativePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, `${YAML.stringify(value, { lineWidth: 0 })}`, 'utf8');
}

function lessonMetadata(chapter, lesson, index) {
  const conceptNames = CONCEPTS_BY_LESSON[lesson.id] ?? ['核心问题', '关键机制', '设计取舍'];
  const concepts = conceptNames.map((name) => ({
    id: slugifyConcept(name),
    name,
    summary: `${name} 是《${lesson.title}》中的关键概念，需要理解它解决的问题、工作机制和设计取舍。`,
    tags: ['core'],
  }));

  return {
    id: lesson.id,
    title: lesson.title,
    chapter_id: chapter.id,
    source_md: lesson.source,
    level: LEVEL_BY_CHAPTER[chapter.id] ?? 'intermediate',
    estimated_minutes: chapter.id === 'ch1' ? 35 : 45,
    prerequisites: index === 0 ? [] : [chapter.lessons[index - 1].id],
    concepts,
    interaction_template: TEMPLATE_BY_CHAPTER[chapter.id] ?? 'system-mechanism',
    teacher_flow: {
      opening_question: `学习《${lesson.title}》之前，先想一想：这篇文章试图解决计算系统中的哪个核心矛盾？`,
      lesson_points: concepts.map((concept) => `${concept.name}：${concept.summary}`),
      closing_check: `请不用背术语，用自己的话解释《${lesson.title}》最重要的一个设计思想。`,
    },
  };
}

function quizMetadata(lesson) {
  const conceptNames = CONCEPTS_BY_LESSON[lesson.id] ?? ['核心问题', '关键机制', '设计取舍'];
  const conceptIds = conceptNames.map(slugifyConcept);
  const first = conceptNames[0];
  const second = conceptNames[1] ?? conceptNames[0];
  const third = conceptNames[2] ?? conceptNames[0];

  return {
    lesson_id: lesson.id,
    questions: [
      {
        id: 'q01',
        type: 'single-choice',
        question: `《${lesson.title}》最适合先理解的问题是什么？`,
        options: [
          '记住文中出现的所有名词',
          `理解 ${first} 要解决的具体问题`,
          '跳过历史背景直接看结论',
          '只关注实现细节，不关注设计动机',
        ],
        answer: 1,
        explanation: `学习技术概念时，先理解 ${first} 解决的问题，再理解机制和细节，才能避免死记硬背。`,
        source_anchor: conceptIds[0],
      },
      {
        id: 'q02',
        type: 'single-choice',
        question: `下面哪种学习方式最能帮助理解 ${second}？`,
        options: [
          '只背定义',
          '只看代码而不看背景',
          '把它放回文章的历史和系统上下文中理解',
          '只比较中文翻译是否准确',
        ],
        answer: 2,
        explanation: `${second} 不是孤立名词，需要结合文章中的上下文、问题背景和设计取舍理解。`,
        source_anchor: conceptIds[1] ?? conceptIds[0],
      },
      {
        id: 'q03',
        type: 'single-choice',
        question: `如果要检查自己是否真正理解 ${third}，最有效的问题是哪个？`,
        options: [
          `能否用自己的话解释 ${third} 为什么存在`,
          `能否背出 ${third} 的英文拼写`,
          `能否记住 ${third} 在文章第几段出现`,
          '能否跳过它继续读下一章',
        ],
        answer: 0,
        explanation: `真正理解一个概念，意味着能说明它为什么存在、解决什么问题，以及和其他概念如何关联。`,
        source_anchor: conceptIds[2] ?? conceptIds[0],
      },
      {
        id: 'q04',
        type: 'single-choice',
        question: `学习《${lesson.title}》后，复盘时应该优先记录什么？`,
        options: [
          '所有出现过的专有名词',
          '文章的字数和图片数量',
          '一个核心问题、三个关键概念、两个易错点',
          '下一篇文章的标题',
        ],
        answer: 2,
        explanation: '复盘卡片的目标是帮助长期记忆和迁移应用，因此应记录核心问题、关键概念和易错点。',
        source_anchor: conceptIds[0],
      },
      {
        id: 'q05',
        type: 'single-choice',
        question: `Claude Code 老师带学《${lesson.title}》时，最重要的互动方式是什么？`,
        options: [
          '一次性输出整篇文章摘要',
          '讲解后提问，等待回答，再根据回答点评',
          '只给最终答案，不解释原因',
          '只生成网页，不进行对话',
        ],
        answer: 1,
        explanation: '本项目的老师模式采用“讲解 → 提问 → 练习 → 点评 → 总结薄弱点”的混合教学法。',
        source_anchor: conceptIds[0],
      },
    ],
  };
}

function practiceMetadata(lesson) {
  const conceptNames = CONCEPTS_BY_LESSON[lesson.id] ?? ['核心问题', '关键机制', '设计取舍'];
  return {
    lesson_id: lesson.id,
    tasks: [
      {
        id: 'p01',
        type: 'explain',
        prompt: `请用 150 字以内解释《${lesson.title}》中“${conceptNames[0]}”解决了什么问题。`,
        rubric: [
          '指出它要解决的具体问题',
          '说明它和上下文中其他概念的关系',
          '避免只复述定义',
        ],
      },
      {
        id: 'p02',
        type: 'compare',
        prompt: `请比较“${conceptNames[0]}”和“${conceptNames[1] ?? conceptNames[0]}”的区别与联系。`,
        rubric: [
          '分别说明两个概念的作用',
          '说明二者如何协作或互相影响',
          '给出一个来自文章语境的例子',
        ],
      },
    ],
  };
}

for (const chapter of manifest.course.chapters) {
  chapter.lessons.forEach((lesson, index) => {
    writeYaml(`content/lessons/${lesson.id}.yaml`, lessonMetadata(chapter, lesson, index));
    writeYaml(`content/quizzes/${lesson.id}.yaml`, quizMetadata(lesson));
    writeYaml(`content/practice/${lesson.id}.yaml`, practiceMetadata(lesson));
  });
}

console.log('Generated starter lesson, quiz, and practice content for Ch1-Ch4.');
```

- [ ] **Step 2: Generate starter content**

Run:

```bash
npm run generate:content
```

Expected: `content/lessons/`, `content/quizzes/`, and `content/practice/` each contain 15 YAML files.

- [ ] **Step 3: Validate generated content**

Run:

```bash
npm run validate:content
```

Expected: `Content validation passed with 0 warning(s).`

- [ ] **Step 4: Run validator tests**

Run:

```bash
npm run test -- tests/content/validate-content.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Verification checkpoint**

Run:

```bash
npm run validate:content
```

Expected: `Content validation passed with 0 warning(s).` Do NOT commit.

---

## Task 4: Implement Course Loading Library

**Files:**
- Create: `src/lib/course.ts`
- Create: `tests/lib/course.test.ts`

- [ ] **Step 1: Write failing course loader tests**

Create `tests/lib/course.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { getAllLessons, getChapter, getLessonBundle, getLessonRouteParts } from '../../src/lib/course';

describe('course loader', () => {
  it('loads all existing Ch1-Ch4 lessons', () => {
    const lessons = getAllLessons();
    expect(lessons).toHaveLength(15);
    expect(lessons.map((lesson) => lesson.id)).toContain('ch4-03');
  });

  it('resolves chapter metadata', () => {
    const chapter = getChapter('ch4');
    expect(chapter?.title).toBe('云计算');
    expect(chapter?.lessons).toHaveLength(5);
  });

  it('loads a complete lesson bundle', () => {
    const bundle = getLessonBundle('ch4-03');
    expect(bundle.lesson.title).toBe('Kubernetes：基础概念与设计');
    expect(bundle.quiz.questions).toHaveLength(5);
    expect(bundle.practice.tasks).toHaveLength(2);
    expect(bundle.markdown.html).toContain('<');
  });

  it('creates stable route parts from lesson id', () => {
    expect(getLessonRouteParts('ch4-03')).toEqual({ chapter: 'ch4', lesson: '03' });
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test -- tests/lib/course.test.ts
```

Expected: FAIL with import error for `src/lib/course`.

- [ ] **Step 3: Create `src/lib/course.ts`**

Create `src/lib/course.ts` with:

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import YAML from 'yaml';
import { z } from 'zod';

const ROOT = process.cwd();
const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

const ManifestLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessons: z.array(ManifestLessonSchema),
});

const ManifestSchema = z.object({
  course: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    chapters: z.array(ChapterSchema),
  }),
});

const ConceptSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
});

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  chapter_id: z.string(),
  source_md: z.string(),
  level: z.string(),
  estimated_minutes: z.number(),
  prerequisites: z.array(z.string()).default([]),
  concepts: z.array(ConceptSchema),
  interaction_template: z.string(),
  teacher_flow: z.object({
    opening_question: z.string(),
    lesson_points: z.array(z.string()),
    closing_check: z.string(),
  }),
});

const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.string(),
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.number().optional(),
  explanation: z.string(),
  source_anchor: z.string().optional(),
});

const QuizSchema = z.object({
  lesson_id: z.string(),
  questions: z.array(QuizQuestionSchema),
});

const PracticeTaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  prompt: z.string(),
  rubric: z.array(z.string()),
});

const PracticeSchema = z.object({
  lesson_id: z.string(),
  tasks: z.array(PracticeTaskSchema),
});

export type CourseManifest = z.infer<typeof ManifestSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type ManifestLesson = z.infer<typeof ManifestLessonSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Practice = z.infer<typeof PracticeSchema>;
export type PracticeTask = z.infer<typeof PracticeTaskSchema>;

export interface RenderedMarkdown {
  raw: string;
  html: string;
  headings: Array<{ depth: number; text: string; slug: string }>;
}

export interface LessonBundle {
  manifestLesson: ManifestLesson;
  lesson: Lesson;
  quiz: Quiz;
  practice: Practice;
  markdown: RenderedMarkdown;
  previousLesson?: ManifestLesson;
  nextLesson?: ManifestLesson;
}

function readYaml<T>(relativePath: string, schema: z.ZodType<T>): T {
  const fullPath = path.join(ROOT, relativePath);
  const parsed = YAML.parse(fs.readFileSync(fullPath, 'utf8'));
  return schema.parse(parsed);
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[：:，,。/\\()（）]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(rawMarkdown: string): RenderedMarkdown['headings'] {
  return rawMarkdown
    .split('\n')
    .map((line) => /^(#{2,4})\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => ({
      depth: match[1].length,
      text: match[2].trim(),
      slug: slugifyHeading(match[2]),
    }));
}

export function getCourseManifest(): CourseManifest {
  return readYaml('content/course-manifest.yaml', ManifestSchema);
}

export function getChapters(): Chapter[] {
  return getCourseManifest().course.chapters;
}

export function getChapter(chapterId: string): Chapter | undefined {
  return getChapters().find((chapter) => chapter.id === chapterId);
}

export function getAllLessons(): ManifestLesson[] {
  return getChapters().flatMap((chapter) => chapter.lessons);
}

export function getLessonRouteParts(lessonId: string): { chapter: string; lesson: string } {
  const [chapter, lesson] = lessonId.split('-');
  return { chapter, lesson };
}

export function getLessonMetadata(lessonId: string): Lesson {
  return readYaml(`content/lessons/${lessonId}.yaml`, LessonSchema);
}

export function getQuiz(lessonId: string): Quiz {
  return readYaml(`content/quizzes/${lessonId}.yaml`, QuizSchema);
}

export function getPractice(lessonId: string): Practice {
  return readYaml(`content/practice/${lessonId}.yaml`, PracticeSchema);
}

export function renderLessonMarkdown(sourceMd: string): RenderedMarkdown {
  const fullPath = path.join(ROOT, sourceMd);
  const rawFile = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(rawFile);
  return {
    raw: parsed.content,
    html: md.render(parsed.content),
    headings: extractHeadings(parsed.content),
  };
}

export function getLessonBundle(lessonId: string): LessonBundle {
  const manifestLessons = getAllLessons();
  const manifestLesson = manifestLessons.find((item) => item.id === lessonId);
  if (!manifestLesson) throw new Error(`Unknown lesson id: ${lessonId}`);

  const index = manifestLessons.findIndex((item) => item.id === lessonId);
  const lesson = getLessonMetadata(lessonId);
  return {
    manifestLesson,
    lesson,
    quiz: getQuiz(lessonId),
    practice: getPractice(lessonId),
    markdown: renderLessonMarkdown(manifestLesson.source),
    previousLesson: index > 0 ? manifestLessons[index - 1] : undefined,
    nextLesson: index < manifestLessons.length - 1 ? manifestLessons[index + 1] : undefined,
  };
}
```

- [ ] **Step 4: Run tests and verify pass**

Run:

```bash
npm run test -- tests/lib/course.test.ts
```

Expected: PASS for all 4 tests.

- [ ] **Step 5: Verification checkpoint**

Run:

```bash
npm run test -- tests/lib/course.test.ts
```

Expected: PASS for all course loader tests. Do NOT commit.

---

## Task 5: Implement Local Progress Storage

**Files:**
- Create: `src/lib/progress.ts`
- Create: `tests/lib/progress.test.ts`

- [ ] **Step 1: Write failing progress tests**

Create `tests/lib/progress.test.ts` with:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { addWeakConcept, getProgress, markLessonComplete, recordQuizAttempt, resetProgress } from '../../src/lib/progress';

describe('progress storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty progress', () => {
    expect(getProgress()).toEqual({ completedLessons: [], quizAttempts: {}, weakConcepts: [] });
  });

  it('marks a lesson complete once', () => {
    markLessonComplete('ch4-03');
    markLessonComplete('ch4-03');
    expect(getProgress().completedLessons).toEqual(['ch4-03']);
  });

  it('records quiz attempts', () => {
    recordQuizAttempt('ch4-03', 'q01', true);
    recordQuizAttempt('ch4-03', 'q01', false);
    expect(getProgress().quizAttempts['ch4-03:q01']).toEqual({ correct: false, attempts: 2 });
  });

  it('tracks weak concepts without duplicates', () => {
    addWeakConcept('controller');
    addWeakConcept('controller');
    expect(getProgress().weakConcepts).toEqual(['controller']);
  });

  it('resets progress', () => {
    markLessonComplete('ch1-01');
    resetProgress();
    expect(getProgress()).toEqual({ completedLessons: [], quizAttempts: {}, weakConcepts: [] });
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test -- tests/lib/progress.test.ts
```

Expected: FAIL with import error for `src/lib/progress`.

- [ ] **Step 3: Create `src/lib/progress.ts`**

Create `src/lib/progress.ts` with:

```ts
export interface QuizAttempt {
  correct: boolean;
  attempts: number;
}

export interface LearningProgress {
  completedLessons: string[];
  quizAttempts: Record<string, QuizAttempt>;
  weakConcepts: string[];
}

const STORAGE_KEY = 'abhoc-learning-progress';

export const EMPTY_PROGRESS: LearningProgress = {
  completedLessons: [],
  quizAttempts: {},
  weakConcepts: [],
};

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeProgress(value: unknown): LearningProgress {
  if (!value || typeof value !== 'object') return { ...EMPTY_PROGRESS };
  const candidate = value as Partial<LearningProgress>;
  return {
    completedLessons: Array.isArray(candidate.completedLessons) ? [...new Set(candidate.completedLessons)] : [],
    quizAttempts: candidate.quizAttempts && typeof candidate.quizAttempts === 'object' ? candidate.quizAttempts : {},
    weakConcepts: Array.isArray(candidate.weakConcepts) ? [...new Set(candidate.weakConcepts)] : [],
  };
}

export function getProgress(): LearningProgress {
  if (!canUseLocalStorage()) return { ...EMPTY_PROGRESS };
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...EMPTY_PROGRESS };
  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(progress: LearningProgress): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
}

export function markLessonComplete(lessonId: string): LearningProgress {
  const progress = getProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  saveProgress(progress);
  return progress;
}

export function recordQuizAttempt(lessonId: string, questionId: string, correct: boolean): LearningProgress {
  const progress = getProgress();
  const key = `${lessonId}:${questionId}`;
  const current = progress.quizAttempts[key] ?? { correct: false, attempts: 0 };
  progress.quizAttempts[key] = {
    correct,
    attempts: current.attempts + 1,
  };
  saveProgress(progress);
  return progress;
}

export function addWeakConcept(conceptId: string): LearningProgress {
  const progress = getProgress();
  if (!progress.weakConcepts.includes(conceptId)) {
    progress.weakConcepts.push(conceptId);
  }
  saveProgress(progress);
  return progress;
}

export function resetProgress(): void {
  if (!canUseLocalStorage()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}
```

- [ ] **Step 4: Run tests and verify pass**

Run:

```bash
npm run test -- tests/lib/progress.test.ts
```

Expected: PASS for all 5 tests.

- [ ] **Step 5: Verification checkpoint**

Run:

```bash
npm run test -- tests/lib/progress.test.ts
```

Expected: PASS for all progress storage tests. Do NOT commit.

---

## Task 6: Build Quiz React Component

**Files:**
- Create: `src/components/QuizPanel.tsx`
- Create: `tests/components/QuizPanel.test.tsx`

- [ ] **Step 1: Write failing component tests**

Create `tests/components/QuizPanel.test.tsx` with:

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import QuizPanel from '../../src/components/QuizPanel';

const quiz = {
  lesson_id: 'ch4-03',
  questions: [
    {
      id: 'q01',
      type: 'single-choice',
      question: 'Pod 和容器的关系是什么？',
      options: ['Pod 是容器别名', 'Pod 是调度单位，可包含容器'],
      answer: 1,
      explanation: 'Pod 是 Kubernetes 的调度单位。',
      source_anchor: 'pod',
    },
  ],
};

describe('QuizPanel', () => {
  beforeEach(() => localStorage.clear());

  it('renders questions and options', () => {
    render(<QuizPanel quiz={quiz} />);
    expect(screen.getByText('Pod 和容器的关系是什么？')).toBeInTheDocument();
    expect(screen.getByText('Pod 是调度单位，可包含容器')).toBeInTheDocument();
  });

  it('shows explanation after submitting an answer', () => {
    render(<QuizPanel quiz={quiz} />);
    fireEvent.click(screen.getByLabelText('Pod 是调度单位，可包含容器'));
    fireEvent.click(screen.getByRole('button', { name: '提交答案' }));
    expect(screen.getByText('回答正确')).toBeInTheDocument();
    expect(screen.getByText('Pod 是 Kubernetes 的调度单位。')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests and verify failure**

Run:

```bash
npm run test -- tests/components/QuizPanel.test.tsx
```

Expected: FAIL with import error for `QuizPanel`.

- [ ] **Step 3: Create `src/components/QuizPanel.tsx`**

Create `src/components/QuizPanel.tsx` with:

```tsx
import { useState } from 'react';
import type { Quiz } from '../lib/course';
import { addWeakConcept, recordQuizAttempt } from '../lib/progress';

interface Props {
  quiz: Quiz;
}

interface SubmittedAnswer {
  selected: number;
  correct: boolean;
}

export default function QuizPanel({ quiz }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, SubmittedAnswer>>({});

  function submit(questionId: string) {
    const question = quiz.questions.find((item) => item.id === questionId);
    if (!question || typeof question.answer !== 'number') return;
    const selectedAnswer = selected[questionId];
    if (typeof selectedAnswer !== 'number') return;
    const correct = selectedAnswer === question.answer;
    setSubmitted((current) => ({ ...current, [questionId]: { selected: selectedAnswer, correct } }));
    recordQuizAttempt(quiz.lesson_id, questionId, correct);
    if (!correct && question.source_anchor) addWeakConcept(question.source_anchor);
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="quiz-title">
      <h2 id="quiz-title" className="mb-4 text-2xl font-bold">检查测验</h2>
      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const submittedAnswer = submitted[question.id];
          return (
            <div key={question.id} className="rounded-xl border border-black/10 bg-white/70 p-4">
              <p className="mb-3 font-semibold">第 {index + 1} 题：{question.question}</p>
              {question.type === 'single-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-paper/60 px-3 py-2 hover:border-accent">
                      <input
                        type="radio"
                        name={question.id}
                        checked={selected[question.id] === optionIndex}
                        onChange={() => setSelected((current) => ({ ...current, [question.id]: optionIndex }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={typeof selected[question.id] !== 'number'}
                onClick={() => submit(question.id)}
              >
                提交答案
              </button>
              {submittedAnswer && (
                <div className={`mt-3 rounded-lg p-3 text-sm ${submittedAnswer.correct ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                  <p className="font-semibold">{submittedAnswer.correct ? '回答正确' : '回答需要复习'}</p>
                  <p className="mt-1">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests and verify pass**

Run:

```bash
npm run test -- tests/components/QuizPanel.test.tsx
```

Expected: PASS for both tests.

- [ ] **Step 5: Verification checkpoint**

Run:

```bash
npm run test -- tests/components/QuizPanel.test.tsx
```

Expected: PASS for both QuizPanel tests. Do NOT commit.

---

## Task 7: Add Concept Map, Practice, and Review Components

**Files:**
- Create: `src/components/ConceptMap.tsx`
- Create: `src/components/PracticeTask.tsx`
- Create: `src/components/ReviewCard.tsx`

- [ ] **Step 1: Create `src/components/ConceptMap.tsx`**

Create `src/components/ConceptMap.tsx` with:

```tsx
import { useState } from 'react';
import type { Concept } from '../lib/course';

interface Props {
  concepts: Concept[];
}

export default function ConceptMap({ concepts }: Props) {
  const [activeConceptId, setActiveConceptId] = useState(concepts[0]?.id ?? '');
  const activeConcept = concepts.find((concept) => concept.id === activeConceptId) ?? concepts[0];

  if (concepts.length === 0) {
    return (
      <section className="lesson-card p-5">
        <h2 className="text-2xl font-bold">概念地图</h2>
        <p className="mt-3 text-muted">本课暂未配置概念。</p>
      </section>
    );
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="concept-map-title">
      <h2 id="concept-map-title" className="text-2xl font-bold">概念地图</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-xl border border-black/10 bg-paper p-4">
          <svg viewBox="0 0 640 260" role="img" aria-label="本课概念关系图" className="h-auto w-full">
            <line x1="160" y1="130" x2="320" y2="130" stroke="#9a6b3f" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="320" y1="130" x2="480" y2="130" stroke="#9a6b3f" strokeWidth="2" strokeDasharray="6 6" />
            {concepts.slice(0, 3).map((concept, index) => {
              const x = 160 + index * 160;
              const active = concept.id === activeConceptId;
              return (
                <g key={concept.id} onClick={() => setActiveConceptId(concept.id)} className="cursor-pointer">
                  <circle cx={x} cy="130" r="58" fill={active ? '#9a6b3f' : '#fffaf2'} stroke="#9a6b3f" strokeWidth="3" />
                  <text x={x} y="126" textAnchor="middle" fill={active ? '#ffffff' : '#1f2933'} fontSize="18" fontWeight="700">
                    {concept.name.length > 8 ? `${concept.name.slice(0, 8)}…` : concept.name}
                  </text>
                  <text x={x} y="150" textAnchor="middle" fill={active ? '#f8f5ef' : '#667085'} fontSize="12">
                    点击查看
                  </text>
                </g>
              );
            })}
          </svg>
          {concepts.length > 3 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {concepts.slice(3).map((concept) => (
                <button
                  type="button"
                  key={concept.id}
                  onClick={() => setActiveConceptId(concept.id)}
                  className="rounded-full border border-accent/30 px-3 py-1 text-sm text-accent"
                >
                  {concept.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white/80 p-4">
          <h3 className="text-xl font-bold">{activeConcept.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{activeConcept.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeConcept.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-sage/10 px-3 py-1 text-xs text-sage">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/PracticeTask.tsx`**

Create `src/components/PracticeTask.tsx` with:

```tsx
import { useState } from 'react';
import type { Practice } from '../lib/course';

interface Props {
  practice: Practice;
}

export default function PracticeTask({ practice }: Props) {
  const [visibleRubrics, setVisibleRubrics] = useState<Record<string, boolean>>({});

  return (
    <section className="lesson-card p-5" aria-labelledby="practice-title">
      <h2 id="practice-title" className="text-2xl font-bold">实践任务</h2>
      <div className="mt-4 space-y-4">
        {practice.tasks.map((task, index) => (
          <div key={task.id} className="rounded-xl border border-black/10 bg-white/75 p-4">
            <div className="mb-2 text-sm font-semibold text-accent">任务 {index + 1} · {task.type}</div>
            <p className="leading-7">{task.prompt}</p>
            <button
              type="button"
              className="mt-3 rounded-lg border border-accent px-3 py-2 text-sm font-semibold text-accent"
              onClick={() => setVisibleRubrics((current) => ({ ...current, [task.id]: !current[task.id] }))}
            >
              {visibleRubrics[task.id] ? '隐藏自查标准' : '查看自查标准'}
            </button>
            {visibleRubrics[task.id] && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {task.rubric.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/components/ReviewCard.tsx`**

Create `src/components/ReviewCard.tsx` with:

```tsx
import { useState } from 'react';
import type { Lesson } from '../lib/course';
import { markLessonComplete } from '../lib/progress';

interface Props {
  lesson: Lesson;
}

export default function ReviewCard({ lesson }: Props) {
  const [completed, setCompleted] = useState(false);

  function completeLesson() {
    markLessonComplete(lesson.id);
    setCompleted(true);
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="review-title">
      <h2 id="review-title" className="text-2xl font-bold">复盘卡片</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-4">
          <h3 className="font-bold text-green-900">核心问题</h3>
          <p className="mt-2 text-sm leading-6 text-green-800">{lesson.teacher_flow.opening_question}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-4">
          <h3 className="font-bold text-amber-900">关键概念</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-800">
            {lesson.concepts.slice(0, 3).map((concept) => <li key={concept.id}>{concept.name}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <h3 className="font-bold text-blue-900">结束检查</h3>
          <p className="mt-2 text-sm leading-6 text-blue-800">{lesson.teacher_flow.closing_check}</p>
        </div>
      </div>
      <button
        type="button"
        className="mt-5 rounded-lg bg-sage px-4 py-2 text-sm font-semibold text-white"
        onClick={completeLesson}
      >
        {completed ? '已记录完成' : '标记本课完成'}
      </button>
    </section>
  );
}
```

- [ ] **Step 4: Run component tests and typecheck**

Run:

```bash
npm run test -- tests/components/QuizPanel.test.tsx
npm run typecheck
```

Expected: QuizPanel tests PASS and Astro typecheck exits with code 0.

- [ ] **Step 5: Verification checkpoint**

Run:

```bash
npm run test -- tests/components/QuizPanel.test.tsx
npm run typecheck
```

Expected: QuizPanel tests PASS and typecheck exits with code 0. Do NOT commit.

---

## Task 8: Build Static Site Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/chapters/index.astro`
- Create: `src/pages/chapters/[chapter]/index.astro`
- Create: `src/pages/chapters/[chapter]/lesson/[lesson].astro`
- Create: `src/pages/progress.astro`
- Create: `src/pages/cards.astro`
- Create: `src/pages/quiz.astro`
- Create: `src/pages/practice.astro`

- [ ] **Step 1: Create homepage**

Create `src/pages/index.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getAllLessons, getChapters, getCourseManifest, getLessonRouteParts } from '../lib/course';

const manifest = getCourseManifest();
const chapters = getChapters();
const firstLesson = getAllLessons()[0];
const firstRoute = getLessonRouteParts(firstLesson.id);
---
<BaseLayout title="计算简史 · 交互式学习">
  <section class="rounded-3xl bg-white/75 p-8 shadow-xl shadow-black/5">
    <p class="text-sm font-semibold text-accent">Interactive Learning</p>
    <h1 class="mt-3 text-4xl font-bold text-ink md:text-5xl">{manifest.course.title}</h1>
    <p class="mt-4 max-w-3xl text-lg leading-8 text-muted">{manifest.course.description}</p>
    <div class="mt-6 flex flex-wrap gap-3">
      <a class="rounded-xl bg-ink px-5 py-3 font-semibold text-white" href={`/chapters/${firstRoute.chapter}/lesson/${firstRoute.lesson}`}>开始学习</a>
      <a class="rounded-xl border border-accent px-5 py-3 font-semibold text-accent" href="/chapters">浏览章节</a>
    </div>
  </section>

  <section class="mt-8 grid gap-4 md:grid-cols-4">
    {chapters.map((chapter) => (
      <a class="lesson-card p-5 hover:border-accent" href={`/chapters/${chapter.id}`}>
        <p class="text-sm font-semibold text-accent">{chapter.id.toUpperCase()}</p>
        <h2 class="mt-2 text-xl font-bold">{chapter.title}</h2>
        <p class="mt-3 text-sm text-muted">{chapter.lessons.length} 篇课程</p>
      </a>
    ))}
  </section>
</BaseLayout>
```

- [ ] **Step 2: Create chapters index**

Create `src/pages/chapters/index.astro` with:

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getChapters, getLessonRouteParts } from '../../lib/course';
const chapters = getChapters();
---
<BaseLayout title="章节总览 · 计算简史">
  <h1 class="text-3xl font-bold">章节总览</h1>
  <div class="mt-6 space-y-6">
    {chapters.map((chapter) => (
      <section class="lesson-card p-5">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-accent">{chapter.id.toUpperCase()}</p>
            <h2 class="text-2xl font-bold">{chapter.title}</h2>
          </div>
          <a class="text-sm font-semibold text-accent" href={`/chapters/${chapter.id}`}>进入章节 →</a>
        </div>
        <ol class="mt-4 grid gap-3 md:grid-cols-2">
          {chapter.lessons.map((lesson) => {
            const route = getLessonRouteParts(lesson.id);
            return (
              <li>
                <a class="block rounded-xl bg-paper px-4 py-3 hover:bg-white" href={`/chapters/${route.chapter}/lesson/${route.lesson}`}>
                  <span class="text-sm text-muted">{lesson.id}</span>
                  <span class="ml-2 font-semibold">{lesson.title}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 3: Create chapter detail route**

Create `src/pages/chapters/[chapter]/index.astro` with:

```astro
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import { getChapter, getChapters, getLessonRouteParts } from '../../../lib/course';

export function getStaticPaths() {
  return getChapters().map((chapter) => ({ params: { chapter: chapter.id } }));
}

const chapter = getChapter(Astro.params.chapter ?? '');
if (!chapter) throw new Error(`Unknown chapter: ${Astro.params.chapter}`);
---
<BaseLayout title={`${chapter.title} · 计算简史`}>
  <a class="text-sm text-accent" href="/chapters">← 返回章节总览</a>
  <h1 class="mt-3 text-3xl font-bold">{chapter.title}</h1>
  <div class="mt-6 grid gap-4 md:grid-cols-2">
    {chapter.lessons.map((lesson) => {
      const route = getLessonRouteParts(lesson.id);
      return (
        <a class="lesson-card p-5 hover:border-accent" href={`/chapters/${route.chapter}/lesson/${route.lesson}`}>
          <p class="text-sm font-semibold text-accent">{lesson.id}</p>
          <h2 class="mt-2 text-xl font-bold">{lesson.title}</h2>
          <p class="mt-3 text-sm text-muted">进入交互式学习页 →</p>
        </a>
      );
    })}
  </div>
</BaseLayout>
```

- [ ] **Step 4: Create lesson page route**

Create `src/pages/chapters/[chapter]/lesson/[lesson].astro` with:

```astro
---
import BaseLayout from '../../../../layouts/BaseLayout.astro';
import ConceptMap from '../../../../components/ConceptMap';
import PracticeTask from '../../../../components/PracticeTask';
import QuizPanel from '../../../../components/QuizPanel';
import ReviewCard from '../../../../components/ReviewCard';
import { getAllLessons, getLessonBundle, getLessonRouteParts } from '../../../../lib/course';

export function getStaticPaths() {
  return getAllLessons().map((lesson) => {
    const route = getLessonRouteParts(lesson.id);
    return { params: route };
  });
}

const lessonId = `${Astro.params.chapter}-${Astro.params.lesson}`;
const bundle = getLessonBundle(lessonId);
const previousRoute = bundle.previousLesson ? getLessonRouteParts(bundle.previousLesson.id) : undefined;
const nextRoute = bundle.nextLesson ? getLessonRouteParts(bundle.nextLesson.id) : undefined;
---
<BaseLayout title={`${bundle.lesson.title} · 计算简史`}>
  <div class="grid gap-6 lg:grid-cols-[1fr_18rem]">
    <div>
      <a class="text-sm text-accent" href={`/chapters/${bundle.lesson.chapter_id}`}>← 返回章节</a>
      <section class="mt-4 lesson-card p-6">
        <p class="text-sm font-semibold text-accent">{bundle.lesson.id} · {bundle.lesson.estimated_minutes} 分钟</p>
        <h1 class="mt-2 text-3xl font-bold">{bundle.lesson.title}</h1>
        <div class="mt-5 rounded-xl bg-amber-50 p-4 text-amber-950">
          <p class="font-bold">导读问题</p>
          <p class="mt-2">{bundle.lesson.teacher_flow.opening_question}</p>
        </div>
      </section>

      <article class="mt-6 lesson-card p-6" set:html={bundle.markdown.html} />

      <div class="mt-6 space-y-6">
        <ConceptMap concepts={bundle.lesson.concepts} client:load />
        <QuizPanel quiz={bundle.quiz} client:load />
        <PracticeTask practice={bundle.practice} client:load />
        <ReviewCard lesson={bundle.lesson} client:load />
      </div>

      <nav class="mt-8 flex justify-between gap-4 text-sm font-semibold text-accent">
        {previousRoute ? <a href={`/chapters/${previousRoute.chapter}/lesson/${previousRoute.lesson}`}>← {bundle.previousLesson?.title}</a> : <span />}
        {nextRoute ? <a href={`/chapters/${nextRoute.chapter}/lesson/${nextRoute.lesson}`}>{bundle.nextLesson?.title} →</a> : <span />}
      </nav>
    </div>

    <aside class="lesson-card h-max p-5 lg:sticky lg:top-6">
      <h2 class="font-bold">本课概念</h2>
      <div class="mt-3 flex flex-wrap gap-2">
        {bundle.lesson.concepts.map((concept) => <span class="rounded-full bg-paper px-3 py-1 text-sm text-accent">{concept.name}</span>)}
      </div>
      <h2 class="mt-6 font-bold">文章小节</h2>
      <ol class="mt-3 space-y-2 text-sm text-muted">
        {bundle.markdown.headings.slice(0, 8).map((heading) => <li>{heading.text}</li>)}
      </ol>
    </aside>
  </div>
</BaseLayout>
```

- [ ] **Step 5: Create progress page**

Create `src/pages/progress.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="本地学习进度 · 计算简史">
  <section class="lesson-card p-6">
    <h1 class="text-3xl font-bold">本地学习进度</h1>
    <p class="mt-3 text-muted">进度保存在当前浏览器的 localStorage 中，不会上传到服务器。</p>
    <div id="progress-root" class="mt-6 rounded-xl bg-paper p-4 text-sm text-muted">正在读取本地进度...</div>
  </section>
  <script>
    const root = document.querySelector('#progress-root');
    const raw = localStorage.getItem('abhoc-learning-progress');
    if (root) {
      if (!raw) {
        root.textContent = '还没有学习记录。完成测验或标记课程完成后，这里会显示进度。';
      } else {
        const progress = JSON.parse(raw);
        root.innerHTML = `
          <p>已完成课程：${progress.completedLessons?.length ?? 0}</p>
          <p>测验记录：${Object.keys(progress.quizAttempts ?? {}).length}</p>
          <p>薄弱概念：${(progress.weakConcepts ?? []).join('、') || '暂无'}</p>
        `;
      }
    }
  </script>
</BaseLayout>
```

- [ ] **Step 6: Create index pages for cards, quiz, and practice**

Create `src/pages/cards.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getAllLessons, getLessonMetadata, getLessonRouteParts } from '../lib/course';
const cards = getAllLessons().flatMap((manifestLesson) => {
  const lesson = getLessonMetadata(manifestLesson.id);
  const route = getLessonRouteParts(lesson.id);
  return lesson.concepts.map((concept) => ({ lesson, route, concept }));
});
---
<BaseLayout title="知识卡片 · 计算简史">
  <h1 class="text-3xl font-bold">知识卡片</h1>
  <div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {cards.map(({ lesson, route, concept }) => (
      <a class="lesson-card p-5 hover:border-accent" href={`/chapters/${route.chapter}/lesson/${route.lesson}`}>
        <p class="text-sm text-accent">{lesson.title}</p>
        <h2 class="mt-2 text-xl font-bold">{concept.name}</h2>
        <p class="mt-3 text-sm leading-6 text-muted">{concept.summary}</p>
      </a>
    ))}
  </div>
</BaseLayout>
```

Create `src/pages/quiz.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getAllLessons, getLessonRouteParts, getQuiz } from '../lib/course';
const rows = getAllLessons().map((lesson) => ({ lesson, route: getLessonRouteParts(lesson.id), quiz: getQuiz(lesson.id) }));
---
<BaseLayout title="测验汇总 · 计算简史">
  <h1 class="text-3xl font-bold">测验汇总</h1>
  <div class="mt-6 space-y-3">
    {rows.map(({ lesson, route, quiz }) => (
      <a class="lesson-card block p-5 hover:border-accent" href={`/chapters/${route.chapter}/lesson/${route.lesson}`}>
        <p class="text-sm text-accent">{lesson.id}</p>
        <h2 class="font-bold">{lesson.title}</h2>
        <p class="mt-2 text-sm text-muted">{quiz.questions.length} 道检查题</p>
      </a>
    ))}
  </div>
</BaseLayout>
```

Create `src/pages/practice.astro` with:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { getAllLessons, getLessonRouteParts, getPractice } from '../lib/course';
const rows = getAllLessons().map((lesson) => ({ lesson, route: getLessonRouteParts(lesson.id), practice: getPractice(lesson.id) }));
---
<BaseLayout title="实践任务 · 计算简史">
  <h1 class="text-3xl font-bold">实践任务</h1>
  <div class="mt-6 space-y-3">
    {rows.map(({ lesson, route, practice }) => (
      <a class="lesson-card block p-5 hover:border-accent" href={`/chapters/${route.chapter}/lesson/${route.lesson}`}>
        <p class="text-sm text-accent">{lesson.id}</p>
        <h2 class="font-bold">{lesson.title}</h2>
        <p class="mt-2 text-sm text-muted">{practice.tasks.length} 个练习任务</p>
      </a>
    ))}
  </div>
</BaseLayout>
```

- [ ] **Step 7: Build site**

Run:

```bash
npm run build
```

Expected: content validation passes and Astro builds `dist/` successfully.

- [ ] **Step 8: Verification checkpoint**

Run:

```bash
npm run build
```

Expected: content validation passes and Astro builds `dist/` successfully. Do NOT commit.

---

## Task 9: Add Claude Code Teacher Skills

**Files:**
- Create: `.claude/CLAUDE.md`
- Create: `.claude/skills/teach-topic/SKILL.md`
- Create: `.claude/skills/review-answer/SKILL.md`
- Create: `.claude/skills/practice-task/SKILL.md`
- Create: `.claude/skills/generate-lesson-page/SKILL.md`

- [ ] **Step 1: Create `.claude/CLAUDE.md`**

Create `.claude/CLAUDE.md` with:

```markdown
# 计算简史学习项目指导

本项目是一个中文计算机基础与后端学习仓库。Claude 在本仓库中工作时，应同时服务两件事：维护交互式学习网站，以及作为 Claude Code 内的老师带领用户学习。

## 教学行为

当用户要求讲解、学习、复习或练习某个主题时：

1. 使用中文。
2. 优先读取 `content/course-manifest.yaml`、`content/lessons/*.yaml`、`content/quizzes/*.yaml`、`content/practice/*.yaml` 和对应 Markdown 原文。
3. 使用“讲解 → 提问 → 练习 → 点评 → 总结薄弱点”的混合型教学法。
4. 每次只问一个问题，等待用户回答后再继续。
5. 不逐字复述原文，要解释背景、机制和设计取舍。
6. 用户回答错误时，先指出答对部分，再用引导性问题帮助修正。
7. 学习状态只能写入 `.learning-cache/`，不要写入课程源文件。

## 网站内容规则

写网站内容时保持以下结构：导读问题、概念地图、分段阅读、检查测验、实践任务、复盘卡片。

## 本地缓存规则

`.learning-cache/` 是个人本地学习记录，不应提交到 git。
```

- [ ] **Step 2: Create teach-topic skill**

Create `.claude/skills/teach-topic/SKILL.md` with:

```markdown
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
```

- [ ] **Step 3: Create review-answer skill**

Create `.claude/skills/review-answer/SKILL.md` with:

```markdown
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
```

- [ ] **Step 4: Create practice-task skill**

Create `.claude/skills/practice-task/SKILL.md` with:

```markdown
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
```

- [ ] **Step 5: Create generate-lesson-page skill**

Create `.claude/skills/generate-lesson-page/SKILL.md` with:

```markdown
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
```

- [ ] **Step 6: Verify skill files are valid Markdown and ignored cache is configured**

Run:

```bash
git check-ignore .learning-cache/progress.json
```

Expected: output contains `.learning-cache/progress.json`.

- [ ] **Step 7: Verification checkpoint**

Run:

```bash
git check-ignore .learning-cache/progress.json
```

Expected: output contains `.learning-cache/progress.json`. Do NOT commit.

---

## Task 10: Update README and Verify End-to-End Build

**Files:**
- Modify: `readme.md`

- [ ] **Step 1: Append local learning website docs to `readme.md`**

Append this section to the end of `readme.md`:

```markdown

## 交互式学习网站

本仓库可以作为交互式学习网站在本地运行。网站使用 Astro 生成静态页面，不需要后端服务。

### 本地运行

```bash
npm install
npm run generate:content
npm run validate:content
npm run dev
```

打开 Astro 输出的本地地址即可学习。

### 构建

```bash
npm run build
```

构建会先运行内容校验，确保课程 manifest、lesson、quiz 和 practice 数据一致。

### 本地学习进度

网站学习进度保存在浏览器 `localStorage` 中。Claude Code 老师的学习记录保存在 `.learning-cache/` 中。`.learning-cache/` 是个人本地缓存，不应提交到 git。

### Claude Code 老师

在 Claude Code 中可以使用项目技能进行带学：

```text
/teach-topic ch4-03
/review-answer "你的回答"
/practice-task ch2-04
/generate-lesson-page ch1-03
```

老师模式使用“讲解 → 提问 → 练习 → 点评 → 总结薄弱点”的学习流程。
```

- [ ] **Step 2: Run full validation and tests**

Run:

```bash
npm run validate:content
npm run test
npm run typecheck
npm run build
```

Expected:

- `npm run validate:content` prints `Content validation passed with 0 warning(s).`
- `npm run test` passes all tests.
- `npm run typecheck` exits with code 0.
- `npm run build` creates `dist/`.

- [ ] **Step 3: Start local dev server for manual check**

Run:

```bash
npm run dev
```

Expected: Astro prints a local URL such as `http://localhost:4321/`.

Open the URL and manually verify:

- Homepage renders.
- `/chapters` renders.
- `/chapters/ch4/lesson/03` renders Markdown, concept map, quiz, practice, and review card.
- Selecting a quiz answer and submitting shows explanation.
- Clicking “标记本课完成” updates `/progress` after refresh.

Stop the dev server with `Ctrl+C`.

- [ ] **Step 4: Verification checkpoint**

Run:

```bash
git status --short
```

Expected: implementation files are present as working tree changes for user review. Do NOT commit.

---

## Task 11: Final Verification and Cleanup

**Files:**
- No new files expected.

- [ ] **Step 1: Check git status**

Run:

```bash
git status --short
```

Expected: no untracked implementation files except local-only `.superpowers/` if the visual brainstorming server is still running. `.learning-cache/` must not appear.

- [ ] **Step 2: Run final commands**

Run:

```bash
npm run validate:content
npm run test
npm run typecheck
npm run build
```

Expected: all commands pass.

- [ ] **Step 3: Confirm generated routes exist**

Run:

```bash
test -f dist/index.html
test -f dist/chapters/index.html
test -f dist/chapters/ch4/lesson/03/index.html
```

Expected: all three commands exit with code 0.

- [ ] **Step 4: Summarize implementation**

Prepare a final summary that includes:

- Astro static site added.
- Ch1-Ch4 manifest and generated starter interaction metadata added.
- Local progress via localStorage added.
- Claude Code teacher skills added.
- `.learning-cache/` ignored.
- Verification command results.

- [ ] **Step 5: Leave implementation uncommitted for review**

Do not commit implementation changes. Report the final `git status --short` output and ask the user whether they want to review, revise, or commit in a later step.

---

## Self-Review

### Spec coverage

- Ch1-Ch4 coverage: Task 2 manifest lists all 15 existing lessons; Task 3 generates lesson, quiz, and practice files for each.
- Static Astro site: Tasks 1, 4, 7, 8 build the site and pages.
- Deep interaction template: Tasks 3, 6, 7, 8 implement guide questions, concepts, quizzes, practice, and review cards.
- No backend: No task creates backend service or server database.
- localStorage progress: Task 5 implements progress storage and Task 8 exposes progress page.
- Claude Code teacher: Task 9 creates project instruction and skills.
- Local `.learning-cache/`: Tasks 1 and 9 define and ignore local teacher cache.
- Validation/testing: Tasks 2, 4, 5, 6, 10, 11 provide validation, tests, typecheck, build, and manual checks.

### Placeholder scan

The plan intentionally contains no TBD markers, unfinished file references, or steps that ask an implementer to invent missing behavior. Starter content is generated by a deterministic script, not left as open-ended manual work.

### Type consistency

The shared types are defined in `src/lib/course.ts`. Components import `Quiz`, `Practice`, `Lesson`, and `Concept` from that file. Progress helpers use the `abhoc-learning-progress` key consistently across `src/lib/progress.ts`, `QuizPanel.tsx`, `ReviewCard.tsx`, and `src/pages/progress.astro`.
