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
    expect(bundle.quiz.questions.length).toBeGreaterThanOrEqual(5);
    expect(bundle.practice.tasks.length).toBeGreaterThanOrEqual(2);
    expect(bundle.practice.tasks[0].answer.length).toBeGreaterThan(0);
    expect(bundle.markdown.html).toContain('<');
  });

  it('creates stable route parts from lesson id', () => {
    expect(getLessonRouteParts('ch4-03')).toEqual({ chapter: 'ch4', lesson: '03' });
  });
});
