import { Link } from 'react-router-dom'
import { chapters } from '../data/course-outline'
import { useProgressContext } from '../components/ProgressContext'

export function HomePage() {
  const { state, getCompletionStats } = useProgressContext()
  const stats = getCompletionStats()

  const phases = [
    { name: '操作系统', lessons: ['1.1', '1.2', '1.3', '1.4', '1.5'], color: 'blue' },
    { name: '后端语言', lessons: ['2.1', '2.2', '2.3', '2.4'], color: 'purple' },
    { name: '分布式系统', lessons: ['3.4'], color: 'orange' },
    { name: '容器技术', lessons: ['4.1', '4.2'], color: 'teal' },
    { name: 'Kubernetes', lessons: ['4.3', '4.4', '4.5'], color: 'green' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">计算简史</h1>
      <p className="text-lg text-gray-500 mb-8">交互式学习课件 — 从操作系统到云原生的完整知识脉络</p>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">学习进度</span>
          <span className="text-2xl font-bold text-blue-600">{stats.percentage}%</span>
        </div>
        <div className="w-full bg-white rounded-full h-3 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          已完成 {stats.completed} 节 · 学习中 {stats.inProgress} 节 · 共 {stats.total} 节
        </p>
      </div>

      {/* Phase Cards */}
      <div className="space-y-4">
        {phases.map((phase, idx) => {
          const completedInPhase = phase.lessons.filter(id => state.lessons[id]?.status === 'completed').length
          const phasePercent = Math.round((completedInPhase / phase.lessons.length) * 100)

          return (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">
                  阶段 {idx + 1}: {phase.name}
                </h3>
                <span className="text-sm text-gray-500">{completedInPhase}/{phase.lessons.length}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${phasePercent}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {phase.lessons.map(id => {
                  const lesson = chapters.flatMap(c => c.lessons).find(l => l.id === id)!
                  const status = state.lessons[id]?.status || 'not_started'
                  const statusStyle = {
                    not_started: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                    in_progress: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                    completed: 'bg-green-100 text-green-800 hover:bg-green-200',
                  }[status]

                  return (
                    <Link
                      key={id}
                      to={`/lesson/${id}`}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${statusStyle}`}
                    >
                      {id} {lesson.title}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Start */}
      {stats.completed === 0 && (
        <div className="mt-8 text-center">
          <Link
            to="/lesson/1.1"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            开始学习第一课 →
          </Link>
        </div>
      )}
    </div>
  )
}
