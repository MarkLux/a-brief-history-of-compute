import { useState, useCallback, useEffect } from 'react'
import type { ProgressState, LessonProgress } from '../types'
import { getAllLessons } from '../data/course-outline'

const STORAGE_KEY = 'compute-history-progress'

function getInitialState(): ProgressState {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  const lessons: Record<string, LessonProgress> = {}
  getAllLessons().forEach(l => {
    lessons[l.id] = { status: 'not_started' }
  })
  return { lessons, currentLesson: null, lastVisit: null }
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(getInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const markInProgress = useCallback((lessonId: string) => {
    setState(prev => {
      if (prev.lessons[lessonId]?.status === 'completed') return prev
      return {
        ...prev,
        currentLesson: lessonId,
        lastVisit: new Date().toISOString().slice(0, 10),
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...prev.lessons[lessonId],
            status: 'in_progress',
            startedAt: prev.lessons[lessonId]?.startedAt || new Date().toISOString().slice(0, 10),
          }
        }
      }
    })
  }, [])

  const markCompleted = useCallback((lessonId: string, quizScore?: number) => {
    setState(prev => ({
      ...prev,
      lessons: {
        ...prev.lessons,
        [lessonId]: {
          status: 'completed',
          startedAt: prev.lessons[lessonId]?.startedAt || new Date().toISOString().slice(0, 10),
          completedAt: new Date().toISOString().slice(0, 10),
          quizScore,
        }
      }
    }))
  }, [])

  const resetProgress = useCallback(() => {
    const lessons: Record<string, LessonProgress> = {}
    getAllLessons().forEach(l => {
      lessons[l.id] = { status: 'not_started' }
    })
    setState({ lessons, currentLesson: null, lastVisit: null })
  }, [])

  const getCompletionStats = useCallback(() => {
    const all = Object.values(state.lessons)
    const completed = all.filter(l => l.status === 'completed').length
    const inProgress = all.filter(l => l.status === 'in_progress').length
    return { total: all.length, completed, inProgress, percentage: Math.round((completed / all.length) * 100) }
  }, [state])

  return { state, markInProgress, markCompleted, resetProgress, getCompletionStats }
}
