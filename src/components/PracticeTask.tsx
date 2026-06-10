import { useState } from 'react';
import type { Practice } from '../lib/course';

interface Props {
  practice: Practice;
}

export default function PracticeTask({ practice }: Props) {
  const [visibleRubrics, setVisibleRubrics] = useState<Record<string, boolean>>({});
  const [visibleAnswers, setVisibleAnswers] = useState<Record<string, boolean>>({});

  return (
    <section className="lesson-card p-5" aria-labelledby="practice-title">
      <h2 id="practice-title" className="text-2xl font-bold">实践任务</h2>
      <div className="mt-4 space-y-4">
        {practice.tasks.map((task, index) => (
          <div key={task.id} className="rounded-xl border border-black/10 bg-white/75 p-4">
            <div className="mb-2 text-sm font-semibold text-accent">任务 {index + 1} · {task.type}</div>
            <p className="leading-7">{task.prompt}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg border border-accent px-3 py-2 text-sm font-semibold text-accent"
                onClick={() => setVisibleRubrics((cur) => ({ ...cur, [task.id]: !cur[task.id] }))}
              >
                {visibleRubrics[task.id] ? '隐藏自查标准' : '查看自查标准'}
              </button>
              <button
                type="button"
                className="rounded-lg border border-sage bg-sage/10 px-3 py-2 text-sm font-semibold text-sage"
                onClick={() => setVisibleAnswers((cur) => ({ ...cur, [task.id]: !cur[task.id] }))}
              >
                {visibleAnswers[task.id] ? '隐藏参考答案' : '查看参考答案'}
              </button>
            </div>
            {visibleRubrics[task.id] && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {task.rubric.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
            {visibleAnswers[task.id] && (
              <div className="mt-3 rounded-lg bg-green-50/80 p-4 text-sm text-green-900">
                <p className="mb-2 font-semibold">参考答案要点：</p>
                <ul className="list-disc space-y-1 pl-4">
                  {task.answer.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}