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
          answer: ['背景是为了说明问题来源', '机制需要说明过程和关键角色'],
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
