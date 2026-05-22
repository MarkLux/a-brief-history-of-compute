import { useState } from 'react'
import type { QuizData } from '../../types'
import { MultipleChoice } from './MultipleChoice'
import { FillBlank } from './FillBlank'

interface Props {
  quiz: QuizData
  onComplete: (score: number) => void
}

export function QuizPanel({ quiz, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)

  const totalQuestions = quiz.questions.length
  const answeredCount = Object.keys(answers).length
  const correctCount = Object.values(answers).filter(Boolean).length

  function handleAnswer(questionId: string, correct: boolean) {
    setAnswers(prev => ({ ...prev, [questionId]: correct }))
  }

  function handleSubmit() {
    setSubmitted(true)
    const score = Math.round((correctCount / totalQuestions) * 100)
    onComplete(score)
  }

  return (
    <div className="mt-8 border-t-2 border-blue-100 pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="text-blue-500">✦</span>
        课后小测验
      </h3>
      <div className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500 mb-2">第 {idx + 1} 题</p>
            {q.type === 'multiple_choice' ? (
              <MultipleChoice question={q} onAnswer={(correct) => handleAnswer(q.id, correct)} />
            ) : (
              <FillBlank question={q} onAnswer={(correct) => handleAnswer(q.id, correct)} />
            )}
          </div>
        ))}
      </div>

      {answeredCount === totalQuestions && !submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          提交答案
        </button>
      )}

      {submitted && (
        <div className={`mt-4 p-4 rounded-lg ${correctCount === totalQuestions ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className="font-semibold">
            {correctCount === totalQuestions
              ? '🎉 全部正确！'
              : `答对 ${correctCount}/${totalQuestions} 题`}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {correctCount >= totalQuestions * 0.7
              ? '已标记为完成，可以进入下一节。'
              : '建议回顾本节内容后重新尝试。'}
          </p>
        </div>
      )}
    </div>
  )
}
