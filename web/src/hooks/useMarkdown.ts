import { useState, useEffect } from 'react'
import { getLessonById } from '../data/course-outline'

export function useMarkdown(lessonId: string | undefined) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!lessonId) {
      setContent('')
      setLoading(false)
      return
    }

    const lesson = getLessonById(lessonId)
    if (!lesson) {
      setError(`Lesson ${lessonId} not found`)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    fetch(`/content/${lesson.file}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`)
        return res.text()
      })
      .then(text => {
        setContent(text)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [lessonId])

  return { content, loading, error }
}
