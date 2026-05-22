import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useMarkdown } from '../hooks/useMarkdown'
import { useCourseData } from '../hooks/useCourseData'
import { useProgressContext } from '../components/ProgressContext'
import { MarkdownRenderer } from '../components/Content/MarkdownRenderer'
import { QuizPanel } from '../components/Quiz/QuizPanel'
import { getLessonById, getAllLessons } from '../data/course-outline'

export function LessonPage() {
  const { id } = useParams<{ id: string }>()
  const { content, loading, error } = useMarkdown(id)
  const { annotations, quiz } = useCourseData(id)
  const { markInProgress, markCompleted, state } = useProgressContext()

  const lesson = getLessonById(id || '')
  const allLessons = getAllLessons()
  const currentIdx = allLessons.findIndex(l => l.id === id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  useEffect(() => {
    if (id && state.lessons[id]?.status !== 'completed') {
      markInProgress(id)
    }
  }, [id, markInProgress, state])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-lg">加载中...</div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">
          <p className="text-lg font-medium">加载失败</p>
          <p className="text-sm mt-1">{error || '未找到该课程'}</p>
        </div>
      </div>
    )
  }

  function handleQuizComplete(score: number) {
    if (id && score >= 70) {
      markCompleted(id, score)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link to="/" className="hover:text-blue-500">首页</Link>
        <span className="mx-2">/</span>
        <span>Ch{lesson.chapter}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{lesson.id} {lesson.title}</span>
      </div>

      {/* Status badge */}
      {state.lessons[id!]?.status === 'completed' && (
        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mb-4">
          ✓ 已完成
        </div>
      )}

      {/* Markdown Content */}
      <MarkdownRenderer
        content={content}
        lessonId={id!}
        annotations={annotations?.annotations}
      />

      {/* Quiz */}
      {quiz && quiz.questions.length > 0 && (
        <QuizPanel quiz={quiz} onComplete={handleQuizComplete} />
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
        {prevLesson ? (
          <Link
            to={`/lesson/${prevLesson.id}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ← {prevLesson.id} {prevLesson.title}
          </Link>
        ) : <span />}
        {nextLesson ? (
          <Link
            to={`/lesson/${nextLesson.id}`}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {nextLesson.id} {nextLesson.title} →
          </Link>
        ) : <span />}
      </div>
    </div>
  )
}
