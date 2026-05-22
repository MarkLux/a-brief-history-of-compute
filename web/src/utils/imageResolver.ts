import { getLessonById } from '../data/course-outline'

export function resolveImagePath(src: string | undefined, lessonId: string): string {
  if (!src) return ''
  // Already absolute or external
  if (src.startsWith('http') || src.startsWith('/')) return src

  const lesson = getLessonById(lessonId)
  if (!lesson) return src

  const dir = lesson.file.substring(0, lesson.file.lastIndexOf('/'))
  return `/content/${dir}/${src}`
}
