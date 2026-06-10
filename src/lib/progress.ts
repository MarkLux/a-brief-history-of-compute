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

function emptyProgress(): LearningProgress {
  return {
    completedLessons: [],
    quizAttempts: {},
    weakConcepts: [],
  };
}

function getStorage(): Storage | undefined {
  if (typeof globalThis !== 'undefined' && 'localStorage' in globalThis) {
    return globalThis.localStorage;
  }
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    return window.localStorage;
  }
  return undefined;
}

function normalizeProgress(value: unknown): LearningProgress {
  if (!value || typeof value !== 'object') return emptyProgress();
  const candidate = value as Partial<LearningProgress>;
  return {
    completedLessons: Array.isArray(candidate.completedLessons) ? [...new Set(candidate.completedLessons)] : [],
    quizAttempts: candidate.quizAttempts && typeof candidate.quizAttempts === 'object' ? candidate.quizAttempts : {},
    weakConcepts: Array.isArray(candidate.weakConcepts) ? [...new Set(candidate.weakConcepts)] : [],
  };
}

export function getProgress(): LearningProgress {
  const storage = getStorage();
  if (!storage) return emptyProgress();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return emptyProgress();
  try {
    return normalizeProgress(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress: LearningProgress): void {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
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
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(emptyProgress()));
  } catch {
    // swallow cleanup errors
  }
}
