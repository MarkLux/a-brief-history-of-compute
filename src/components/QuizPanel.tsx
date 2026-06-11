import { useState } from 'react';
import type { Quiz } from '../lib/course';
import { addWeakConcept, recordQuizAttempt } from '../lib/progress';

interface Props {
  quiz: Quiz;
}

interface SubmittedAnswer {
  selected: number;
  correct: boolean;
}

export default function QuizPanel({ quiz }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, SubmittedAnswer>>({});

  function submit(questionId: string) {
    const question = quiz.questions.find((item) => item.id === questionId);
    if (!question || typeof question.answer !== 'number') return;
    const selectedAnswer = selected[questionId];
    if (typeof selectedAnswer !== 'number') return;
    const correct = selectedAnswer === question.answer;
    setSubmitted((current) => ({ ...current, [questionId]: { selected: selectedAnswer, correct } }));
    recordQuizAttempt(quiz.lesson_id, questionId, correct);
    if (!correct && question.source_anchor) addWeakConcept(question.source_anchor);
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="quiz-title">
      <h2 id="quiz-title" className="mb-4 text-2xl font-bold">检查测验</h2>
      <div className="space-y-6">
        {quiz.questions.map((question, index) => {
          const submittedAnswer = submitted[question.id];
          return (
            <div key={question.id} className="rounded-xl border border-black/10 bg-white/70 p-4">
              <div className="mb-3 font-semibold">
                <span className="text-accent">第 {index + 1} 题</span>
                <p className="mt-1">{question.question}</p>
              </div>
              {question.type === 'single-choice' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label key={option} className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-paper/60 px-3 py-2 hover:border-accent">
                      <input
                        type="radio"
                        name={question.id}
                        checked={selected[question.id] === optionIndex}
                        onChange={() => setSelected((current) => ({ ...current, [question.id]: optionIndex }))}
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="mt-3 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                disabled={typeof selected[question.id] !== 'number'}
                onClick={() => submit(question.id)}
              >
                提交答案
              </button>
              {submittedAnswer && (
                <div className={`mt-3 rounded-lg p-3 text-sm ${submittedAnswer.correct ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'}`}>
                  <p className="font-semibold">{submittedAnswer.correct ? '回答正确' : '回答需要复习'}</p>
                  <p className="mt-1">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}