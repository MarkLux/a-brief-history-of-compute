export interface Lesson {
  id: string
  title: string
  file: string
  chapter: number
  dependencies: string[]
}

export interface Chapter {
  id: number
  title: string
  phase: string
  lessons: Lesson[]
}

export interface LessonProgress {
  status: 'not_started' | 'in_progress' | 'completed'
  startedAt?: string
  completedAt?: string
  quizScore?: number
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>
  currentLesson: string | null
  lastVisit: string | null
}

export interface Annotation {
  term: string
  pattern: string
  explanation: string
  relatedLessons?: string[]
}

export interface AnnotationData {
  lessonId: string
  annotations: Annotation[]
}

export interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'fill_blank'
  question: string
  options?: string[]
  correctIndex?: number
  answer?: string
  acceptableAnswers?: string[]
  explanation: string
}

export interface QuizData {
  lessonId: string
  questions: QuizQuestion[]
}
