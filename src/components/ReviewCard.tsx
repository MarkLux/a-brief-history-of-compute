import { useState } from 'react';
import type { Lesson } from '../lib/course';
import { markLessonComplete } from '../lib/progress';

interface Props {
  lesson: Lesson;
}

function coreTakeaway(lesson: Lesson): string {
  const firstConcept = lesson.concepts[0]?.name ?? '这节课的核心概念';
  return `如果你只能记住一句话：${firstConcept} 不是一个孤立名词，而是为了解决“${lesson.teacher_flow.opening_question}”背后的真实问题。`;
}

function recapSentences(lesson: Lesson): string[] {
  const concepts = lesson.concepts.slice(0, 3);
  return [
    `先抓主线：${lesson.teacher_flow.opening_question}`,
    `再抓机制：${concepts.map((concept) => concept.name).join(' → ')} 之间要能串起来。`,
    `最后抓表达：${lesson.teacher_flow.closing_check}`,
  ];
}

function confusionWarnings(lesson: Lesson): string[] {
  const first = lesson.concepts[0]?.name ?? '核心概念';
  const second = lesson.concepts[1]?.name ?? '相关概念';
  return [
    `不要只背“${first} 是什么”，要说清楚它为什么需要出现。`,
    `不要把“${first}”和“${second}”当成平级名词，试着说明它们如何协作。`,
    '如果解释时只能复述定义，还需要回到文章里的流程、例子或设计取舍。',
  ];
}

function nextActions(lesson: Lesson): string[] {
  return [
    '先重做本课错题，把错误原因写成一句话。',
    '再完成一个实践任务，不看参考答案先输出自己的版本。',
    `最后用 2 分钟回答：${lesson.teacher_flow.closing_check}`,
  ];
}

export default function ReviewCard({ lesson }: Props) {
  const [completed, setCompleted] = useState(false);
  const recaps = recapSentences(lesson);
  const warnings = confusionWarnings(lesson);
  const actions = nextActions(lesson);

  function completeLesson() {
    markLessonComplete(lesson.id);
    setCompleted(true);
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="review-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-accent">Review</p>
          <h2 id="review-title" className="text-2xl font-bold">你这节课要带走什么？</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            复盘不是再背一遍概念，而是确认你能把问题、机制和应用场景连起来。
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-sage px-4 py-2 text-sm font-semibold text-white"
          onClick={completeLesson}
        >
          {completed ? '已记录完成' : '标记本课完成'}
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-accent/20 bg-amber-50/70 p-4">
        <h3 className="font-bold text-amber-950">一句话带走</h3>
        <p className="mt-2 text-sm leading-6 text-amber-900">{coreTakeaway(lesson)}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-4">
          <h3 className="font-bold text-green-900">三句话复盘</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-green-800">
            {recaps.map((point) => <li key={point}>• {point}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-red-50 p-4">
          <h3 className="font-bold text-red-900">最容易混淆的点</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-red-800">
            {warnings.map((warning) => <li key={warning}>• {warning}</li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-blue-50 p-4">
          <h3 className="font-bold text-blue-900">下一步行动</h3>
          <ul className="mt-2 space-y-2 text-sm leading-6 text-blue-800">
            {actions.map((action) => <li key={action}>• {action}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
