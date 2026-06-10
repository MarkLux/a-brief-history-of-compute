import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import YAML from 'yaml';
import { z } from 'zod';

const ROOT = process.cwd();

const ManifestLessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  source: z.string(),
});

const ChapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessons: z.array(ManifestLessonSchema),
});

const ManifestSchema = z.object({
  course: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    chapters: z.array(ChapterSchema),
  }),
});

const ConceptSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
});

const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  chapter_id: z.string(),
  source_md: z.string(),
  level: z.string(),
  estimated_minutes: z.number(),
  prerequisites: z.array(z.string()).default([]),
  concepts: z.array(ConceptSchema),
  interaction_template: z.string(),
  teacher_flow: z.object({
    opening_question: z.string(),
    lesson_points: z.array(z.string()),
    closing_check: z.string(),
  }),
});

const QuizQuestionSchema = z.object({
  id: z.string(),
  type: z.string(),
  question: z.string(),
  options: z.array(z.string()).optional(),
  answer: z.number().optional(),
  explanation: z.string(),
  source_anchor: z.string().optional(),
});

const QuizSchema = z.object({
  lesson_id: z.string(),
  questions: z.array(QuizQuestionSchema),
});

const PracticeTaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  prompt: z.string(),
  rubric: z.array(z.string()),
  answer: z.array(z.string()),
});

const PracticeSchema = z.object({
  lesson_id: z.string(),
  tasks: z.array(PracticeTaskSchema),
});

export type CourseManifest = z.infer<typeof ManifestSchema>;
export type Chapter = z.infer<typeof ChapterSchema>;
export type ManifestLesson = z.infer<typeof ManifestLessonSchema>;
export type Lesson = z.infer<typeof LessonSchema>;
export type Concept = z.infer<typeof ConceptSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Practice = z.infer<typeof PracticeSchema>;
export type PracticeTask = z.infer<typeof PracticeTaskSchema>;

export interface RenderedMarkdown {
  raw: string;
  html: string;
  headings: Array<{ depth: number; text: string; slug: string }>;
}

export interface LessonBundle {
  manifestLesson: ManifestLesson;
  lesson: Lesson;
  quiz: Quiz;
  practice: Practice;
  markdown: RenderedMarkdown;
  previousLesson?: ManifestLesson;
  nextLesson?: ManifestLesson;
}

function readYaml<T>(relativePath: string, schema: z.ZodType<T>): T {
  const fullPath = path.join(ROOT, relativePath);
  const parsed = YAML.parse(fs.readFileSync(fullPath, 'utf8'));
  return schema.parse(parsed);
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[：:，,。/\\()（）]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractHeadings(rawMarkdown: string): RenderedMarkdown['headings'] {
  const seen = new Map<string, number>();
  return rawMarkdown
    .split('\n')
    .map((line) => /^(#{2,4})\s+(.+)$/.exec(line))
    .filter((match): match is RegExpExecArray => Boolean(match))
    .map((match) => {
      const baseSlug = slugifyHeading(match[2]);
      const count = seen.get(baseSlug) ?? 0;
      seen.set(baseSlug, count + 1);
      return {
        depth: match[1].length,
        text: match[2].trim(),
        slug: count === 0 ? baseSlug : `${baseSlug}-${count + 1}`,
      };
    });
}

function isExternalUrl(src: string): boolean {
  return /^(https?:)?\/\//.test(src) || src.startsWith('data:');
}

function publicImageSrc(sourceMd: string, originalSrc: string): string {
  if (isExternalUrl(originalSrc) || originalSrc.startsWith('/')) return originalSrc;
  const [srcWithoutHash, hash = ''] = originalSrc.split('#');
  const [srcPath, query = ''] = srcWithoutHash.split('?');
  const resolved = path.normalize(path.join(path.dirname(sourceMd), srcPath));
  const suffix = `${query ? `?${query}` : ''}${hash ? `#${hash}` : ''}`;
  return `/chapter-assets/${resolved}${suffix}`;
}

function renderMarkdown(sourceMd: string, rawMarkdown: string, headings: RenderedMarkdown['headings']): string {
  const renderer = new MarkdownIt({ html: true, linkify: true, typographer: true });
  const headingQueue = [...headings];
  const defaultHeadingOpen = renderer.renderer.rules.heading_open;
  const defaultImage = renderer.renderer.rules.image;

  renderer.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    if (['h2', 'h3', 'h4'].includes(tokens[idx].tag)) {
      const heading = headingQueue.shift();
      if (heading) tokens[idx].attrSet('id', heading.slug);
    }
    return defaultHeadingOpen ? defaultHeadingOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
  };

  renderer.renderer.rules.image = (tokens, idx, options, env, self) => {
    const src = tokens[idx].attrGet('src');
    if (src) tokens[idx].attrSet('src', publicImageSrc(sourceMd, src));
    return defaultImage ? defaultImage(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options);
  };

  return renderer.render(rawMarkdown);
}

export function getCourseManifest(): CourseManifest {
  return readYaml('content/course-manifest.yaml', ManifestSchema);
}

export function getChapters(): Chapter[] {
  return getCourseManifest().course.chapters;
}

export function getChapter(chapterId: string): Chapter | undefined {
  return getChapters().find((chapter) => chapter.id === chapterId);
}

export function getAllLessons(): ManifestLesson[] {
  return getChapters().flatMap((chapter) => chapter.lessons);
}

export function getLessonRouteParts(lessonId: string): { chapter: string; lesson: string } {
  const [chapter, lesson] = lessonId.split('-');
  return { chapter, lesson };
}

export function getLessonMetadata(lessonId: string): Lesson {
  return readYaml(`content/lessons/${lessonId}.yaml`, LessonSchema);
}

export function getQuiz(lessonId: string): Quiz {
  return readYaml(`content/quizzes/${lessonId}.yaml`, QuizSchema);
}

export function getPractice(lessonId: string): Practice {
  return readYaml(`content/practice/${lessonId}.yaml`, PracticeSchema);
}

export function renderLessonMarkdown(sourceMd: string): RenderedMarkdown {
  const fullPath = path.join(ROOT, sourceMd);
  const rawFile = fs.readFileSync(fullPath, 'utf8');
  const parsed = matter(rawFile);
  const headings = extractHeadings(parsed.content);
  return {
    raw: parsed.content,
    html: renderMarkdown(sourceMd, parsed.content, headings),
    headings,
  };
}

export function getLessonBundle(lessonId: string): LessonBundle {
  const manifestLessons = getAllLessons();
  const manifestLesson = manifestLessons.find((item) => item.id === lessonId);
  if (!manifestLesson) throw new Error(`Unknown lesson id: ${lessonId}`);

  const index = manifestLessons.findIndex((item) => item.id === lessonId);
  const lesson = getLessonMetadata(lessonId);
  return {
    manifestLesson,
    lesson,
    quiz: getQuiz(lessonId),
    practice: getPractice(lessonId),
    markdown: renderLessonMarkdown(manifestLesson.source),
    previousLesson: index > 0 ? manifestLessons[index - 1] : undefined,
    nextLesson: index < manifestLessons.length - 1 ? manifestLessons[index + 1] : undefined,
  };
}
