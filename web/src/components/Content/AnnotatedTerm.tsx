import { useState, ReactNode } from 'react'
import type { Annotation } from '../../types'

interface Props {
  annotation: Annotation
  children: ReactNode
}

export function AnnotatedTerm({ annotation, children }: Props) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <span className="border-b border-dashed border-blue-400 text-blue-700 cursor-help">
        {children}
      </span>
      {showTooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-50 pointer-events-none">
          <span className="font-semibold text-blue-300 block mb-1">{annotation.term}</span>
          <span className="leading-relaxed">{annotation.explanation}</span>
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </span>
      )}
    </span>
  )
}
