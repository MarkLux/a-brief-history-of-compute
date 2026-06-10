import { useState } from 'react';
import type { Concept } from '../lib/course';

interface Props {
  concepts: Concept[];
}

export default function ConceptMap({ concepts }: Props) {
  const [activeConceptId, setActiveConceptId] = useState(concepts[0]?.id ?? '');
  const activeConcept = concepts.find((concept) => concept.id === activeConceptId) ?? concepts[0];

  if (concepts.length === 0) {
    return (
      <section className="lesson-card p-5">
        <h2 className="text-2xl font-bold">概念地图</h2>
        <p className="mt-3 text-muted">本课暂未配置概念。</p>
      </section>
    );
  }

  return (
    <section className="lesson-card p-5" aria-labelledby="concept-map-title">
      <h2 id="concept-map-title" className="text-2xl font-bold">概念地图</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="rounded-xl border border-black/10 bg-paper p-4">
          <svg viewBox="0 0 640 260" role="img" aria-label="本课概念关系图" className="h-auto w-full">
            <line x1="160" y1="130" x2="320" y2="130" stroke="#9a6b3f" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="320" y1="130" x2="480" y2="130" stroke="#9a6b3f" strokeWidth="2" strokeDasharray="6 6" />
            {concepts.slice(0, 3).map((concept, index) => {
              const x = 160 + index * 160;
              const active = concept.id === activeConceptId;
              return (
                <g key={concept.id} onClick={() => setActiveConceptId(concept.id)} className="cursor-pointer">
                  <circle cx={x} cy="130" r="58" fill={active ? '#9a6b3f' : '#fffaf2'} stroke="#9a6b3f" strokeWidth="3" />
                  <text x={x} y="126" textAnchor="middle" fill={active ? '#ffffff' : '#1f2933'} fontSize="18" fontWeight="700">
                    {concept.name.length > 8 ? `${concept.name.slice(0, 8)}…` : concept.name}
                  </text>
                  <text x={x} y="150" textAnchor="middle" fill={active ? '#f8f5ef' : '#667085'} fontSize="12">
                    点击查看
                  </text>
                </g>
              );
            })}
          </svg>
          {concepts.length > 3 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {concepts.slice(3).map((concept) => (
                <button
                  type="button"
                  key={concept.id}
                  onClick={() => setActiveConceptId(concept.id)}
                  className="rounded-full border border-accent/30 px-3 py-1 text-sm text-accent"
                >
                  {concept.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl bg-white/80 p-4">
          <h3 className="text-xl font-bold">{activeConcept.name}</h3>
          <p className="mt-3 text-sm leading-7 text-muted">{activeConcept.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeConcept.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-sage/10 px-3 py-1 text-xs text-sage">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}