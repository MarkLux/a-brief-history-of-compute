import { NavLink } from 'react-router-dom'
import type { Lesson } from '../../types'
import { useProgressContext } from '../ProgressContext'

export function LessonItem({ lesson }: { lesson: Lesson }) {
  const { state } = useProgressContext()
  const progress = state.lessons[lesson.id]
  const status = progress?.status || 'not_started'

  const statusColors = {
    not_started: 'bg-gray-300',
    in_progress: 'bg-yellow-400',
    completed: 'bg-green-500',
  }

  return (
    <NavLink
      to={`/lesson/${lesson.id}`}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-1.5 text-sm rounded-l-md mx-1 ${
          isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-100'
        }`
      }
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${statusColors[status]}`} />
      <span className="truncate">{lesson.id} {lesson.title}</span>
    </NavLink>
  )
}
