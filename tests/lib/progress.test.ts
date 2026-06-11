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
