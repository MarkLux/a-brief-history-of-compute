import { useState } from 'react'
import type { QuizQuestion } from '../../types'

interface Props {
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
}

export function MultipleChoice({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  function handleSelect(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    onAnswer(idx === question.correctIndex)
  }

  return (
    <div>
      <p className="text-gray-800 mb-3">{question.question}</p>
      <div className="space-y-2">
        {question.options?.map((opt, idx) => {
          let className = 'w-full text-left px-4 py-2 rounded-lg border text-sm transition '
          if (!answered) {
            className += selected === idx
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
          } else if (idx === question.correctIndex) {
            className += 'border-green-400 bg-green-50 text-green-800'
          } else if (idx === selected) {
            className += 'border-red-400 bg-red-50 text-red-800'
          } else {
            className += 'border-gray-200 opacity-50'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={className}
              disabled={answered}
            >
              <span className="font-mono mr-2 text-gray-400">{String.fromCharCode(65 + idx)}.</span>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && (
        <p className="mt-3 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          💡 {question.explanation}
        </p>
      )}
    </div>
  )
}
