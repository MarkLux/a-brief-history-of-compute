import { NavLink } from 'react-router-dom'
import { chapters } from '../../data/course-outline'
import { useProgressContext } from '../ProgressContext'
import { ProgressBar } from '../Progress/ProgressBar'
import { ChapterGroup } from './ChapterGroup'

export function Sidebar() {
  const { getCompletionStats } = useProgressContext()
  const stats = getCompletionStats()

  return (
    <aside className="w-72 h-screen overflow-y-auto border-r border-gray-200 bg-gray-50 flex flex-col shrink-0">
      <NavLink to="/" className="block px-5 py-4 border-b border-gray-200 hover:bg-gray-100">
        <h1 className="text-lg font-bold text-gray-800">计算简史</h1>
        <p className="text-xs text-gray-500 mt-1">交互式学习课件</p>
      </NavLink>

      <div className="px-5 py-3 border-b border-gray-200">
        <ProgressBar percentage={stats.percentage} />
        <p className="text-xs text-gray-500 mt-1">
          已完成 {stats.completed}/{stats.total} · {stats.percentage}%
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {chapters.map(chapter => (
          <ChapterGroup key={chapter.id} chapter={chapter} />
        ))}
      </nav>
    </aside>
  )
}
