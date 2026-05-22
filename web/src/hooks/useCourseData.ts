import { useState, useEffect } from 'react'
import type { AnnotationData, QuizData } from '../types'

export function useCourseData(lessonId: string | undefined) {
  const [annotations, setAnnotations] = useState<AnnotationData | null>(null)
  const [quiz, setQuiz] = useState<QuizData | null>(null)

  useEffect(() => {
    if (!lessonId) return

    // Load annotations
    import(`../data/annotations/${lessonId}.json`)
      .then(mod => setAnnotations(mod.default))
      .catch(() => setAnnotations(null))

    // Load quiz
    import(`../data/quizzes/${lessonId}.json`)
      .then(mod => setQuiz(mod.default))
      .catch(() => setQuiz(null))
  }, [lessonId])

  return { annotations, quiz }
}
