import { useState } from 'react'
import type { Chapter } from '../../types'
import { LessonItem } from './LessonItem'

export function ChapterGroup({ chapter }: { chapter: Chapter }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-2 flex items-center justify-between text-left hover:bg-gray-100"
      >
        <span className="text-sm font-semibold text-gray-600">
          Ch{chapter.id} {chapter.title}
        </span>
        <span className="text-gray-400 text-xs">{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <div className="ml-3">
          {chapter.lessons.map(lesson => (
            <LessonItem key={lesson.id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  )
}
