import { useState } from 'react'
import type { QuizQuestion } from '../../types'

interface Props {
  question: QuizQuestion
  onAnswer: (correct: boolean) => void
}

export function FillBlank({ question, onAnswer }: Props) {
  const [input, setInput] = useState('')
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect] = useState(false)

  function handleSubmit() {
    if (!input.trim() || answered) return
    const acceptable = question.acceptableAnswers || [question.answer || '']
    const isCorrect = acceptable.some(a => a.toLowerCase() === input.trim().toLowerCase())
    setCorrect(isCorrect)
    setAnswered(true)
    onAnswer(isCorrect)
  }

  return (
    <div>
      <p className="text-gray-800 mb-3">{question.question}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          disabled={answered}
          placeholder="输入你的答案..."
          className={`flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 ${
            answered
              ? correct
                ? 'border-green-400 bg-green-50'
                : 'border-red-400 bg-red-50'
              : 'border-gray-200'
          }`}
        />
        {!answered && (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
          >
            确认
          </button>
        )}
      </div>
      {answered && !correct && (
        <p className="mt-2 text-sm text-gray-600">
          正确答案: <span className="font-semibold text-green-700">{question.answer}</span>
        </p>
      )}
      {answered && (
        <p className="mt-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
          💡 {question.explanation}
        </p>
      )}
    </div>
  )
}
