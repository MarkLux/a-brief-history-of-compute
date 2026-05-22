import type { Chapter } from '../types'

export const chapters: Chapter[] = [
  {
    id: 1,
    title: '人机交互（操作系统）',
    phase: '阶段一：操作系统',
    lessons: [
      { id: '1.1', title: '从纸带到操作系统', file: 'ch1/01-人机交互历程_从纸带到操作系统.md', chapter: 1, dependencies: [] },
      { id: '1.2', title: '现代操作系统的雏形', file: 'ch1/02-现代操作系统的雏形.md', chapter: 1, dependencies: ['1.1'] },
      { id: '1.3', title: 'Linux文件系统', file: 'ch1/03-Linux的设计哲学_文件系统.md', chapter: 1, dependencies: ['1.2'] },
      { id: '1.4', title: 'Linux内存管理', file: 'ch1/04-Linux的设计哲学_内存管理.md', chapter: 1, dependencies: ['1.2'] },
      { id: '1.5', title: 'Linux进程管理', file: 'ch1/05-Linux的设计哲学_进程管理.md', chapter: 1, dependencies: ['1.2', '1.4'] },
    ]
  },
  {
    id: 2,
    title: '编程语言',
    phase: '阶段二：后端语言',
    lessons: [
      { id: '2.1', title: '高级语言的演进之路', file: 'ch2/01-高级语言的演进之路.md', chapter: 2, dependencies: ['1.1', '1.2'] },
      { id: '2.2', title: '面向对象', file: 'ch2/02-高级语言的自我修养_面向对象.md', chapter: 2, dependencies: ['2.1'] },
      { id: '2.3', title: '内存管理', file: 'ch2/03-高级语言的自我修养_内存管理.md', chapter: 2, dependencies: ['2.1', '1.4'] },
      { id: '2.4', title: '线程并发', file: 'ch2/04-高级语言的自我修养_线程并发.md', chapter: 2, dependencies: ['2.1', '1.5'] },
    ]
  },
  {
    id: 3,
    title: '软件工程',
    phase: '阶段三/四：中间件 & 分布式系统',
    lessons: [
      { id: '3.4', title: '分布式系统', file: 'ch3/04-分布式系统.md', chapter: 3, dependencies: ['2.4'] },
    ]
  },
  {
    id: 4,
    title: '云计算',
    phase: '阶段五/六：容器 & Kubernetes',
    lessons: [
      { id: '4.1', title: '从虚拟化到容器', file: 'ch4/01-楔子_从虚拟化到容器.md', chapter: 4, dependencies: ['1.3', '1.4', '1.5'] },
      { id: '4.2', title: '云计算的混沌时代', file: 'ch4/02-云计算的混沌时代.md', chapter: 4, dependencies: ['4.1'] },
      { id: '4.3', title: 'Kubernetes基础概念', file: 'ch4/03-Kubernetes_基础概念与设计.md', chapter: 4, dependencies: ['4.2'] },
      { id: '4.4', title: 'Kubernetes实现分析', file: 'ch4/04-Kubernetes_基本实现分析.md', chapter: 4, dependencies: ['4.3', '3.4'] },
      { id: '4.5', title: 'Kubernetes运行机制', file: 'ch4/05-Kubernetes_运行机制与扩展.md', chapter: 4, dependencies: ['4.4'] },
    ]
  },
]

export function getAllLessons() {
  return chapters.flatMap(ch => ch.lessons)
}

export function getLessonById(id: string) {
  return getAllLessons().find(l => l.id === id)
}

export function getChapterForLesson(lessonId: string) {
  return chapters.find(ch => ch.lessons.some(l => l.id === lessonId))
}
