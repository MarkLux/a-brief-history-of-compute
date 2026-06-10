import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const ROOT = process.cwd();
const VALID_TEMPLATES = new Set([
  'history-timeline',
  'system-mechanism',
  'concept-comparison',
  'distributed-thinking',
  'cloud-native-design',
]);

function readYamlIfExists(filePath) {
  if (!fs.existsSync(filePath)) return undefined;
  return YAML.parse(fs.readFileSync(filePath, 'utf8'));
}

function readYamlDir(dirPath) {
  const entries = new Map();
  if (!fs.existsSync(dirPath)) return entries;
  for (const file of fs.readdirSync(dirPath).filter((name) => name.endsWith('.yaml')).sort()) {
    const value = YAML.parse(fs.readFileSync(path.join(dirPath, file), 'utf8'));
    entries.set(path.basename(file, '.yaml'), value);
  }
  return entries;
}

export function validateCourseData({ manifest, lessons, quizzes, practice, fileExists }) {
  const errors = [];
  const warnings = [];
  const seenLessonIds = new Set();

  if (!manifest?.course?.chapters?.length) {
    errors.push('Manifest must define course.chapters');
    return { errors, warnings };
  }

  for (const chapter of manifest.course.chapters) {
    if (!chapter.id) errors.push('Chapter is missing id');
    if (!chapter.title) errors.push(`Chapter ${chapter.id ?? '<unknown>'} is missing title`);
    if (!Array.isArray(chapter.lessons)) {
      errors.push(`Chapter ${chapter.id ?? '<unknown>'} lessons must be an array`);
      continue;
    }

    for (const manifestLesson of chapter.lessons) {
      const lessonId = manifestLesson.id;
      if (!lessonId) {
        errors.push(`Chapter ${chapter.id} contains a lesson without id`);
        continue;
      }
      if (seenLessonIds.has(lessonId)) {
        errors.push(`Duplicate lesson id: ${lessonId}`);
      }
      seenLessonIds.add(lessonId);

      if (!manifestLesson.source || !fileExists(manifestLesson.source)) {
        errors.push(`Lesson ${lessonId} source file does not exist: ${manifestLesson.source}`);
      }

      const lesson = lessons.get(lessonId);
      if (!lesson) {
        errors.push(`Missing lesson metadata: content/lessons/${lessonId}.yaml`);
        continue;
      }
      if (lesson.id !== lessonId) errors.push(`Lesson ${lessonId} metadata id mismatch: ${lesson.id}`);
      if (lesson.chapter_id !== chapter.id) errors.push(`Lesson ${lessonId} chapter_id must be ${chapter.id}`);
      if (lesson.source_md !== manifestLesson.source) errors.push(`Lesson ${lessonId} source_md must match manifest source`);
      if (!VALID_TEMPLATES.has(lesson.interaction_template)) errors.push(`Lesson ${lessonId} has invalid interaction_template: ${lesson.interaction_template}`);
      if (!Number.isInteger(lesson.estimated_minutes) || lesson.estimated_minutes <= 0) errors.push(`Lesson ${lessonId} estimated_minutes must be a positive integer`);
      if (!Array.isArray(lesson.concepts) || lesson.concepts.length === 0) errors.push(`Lesson ${lessonId} must define at least one concept`);

      const conceptIds = new Set();
      for (const concept of lesson.concepts ?? []) {
        if (!concept.id) errors.push(`Lesson ${lessonId} has a concept without id`);
        if (conceptIds.has(concept.id)) errors.push(`Lesson ${lessonId} has duplicate concept id: ${concept.id}`);
        conceptIds.add(concept.id);
        if (!concept.name) errors.push(`Lesson ${lessonId}:${concept.id} concept is missing name`);
        if (!concept.summary) errors.push(`Lesson ${lessonId}:${concept.id} concept is missing summary`);
      }

      if (!lesson.teacher_flow?.opening_question) errors.push(`Lesson ${lessonId} teacher_flow.opening_question is required`);
      if (!Array.isArray(lesson.teacher_flow?.lesson_points) || lesson.teacher_flow.lesson_points.length === 0) errors.push(`Lesson ${lessonId} teacher_flow.lesson_points must not be empty`);
      if (!lesson.teacher_flow?.closing_check) errors.push(`Lesson ${lessonId} teacher_flow.closing_check is required`);

      const quiz = quizzes.get(lessonId);
      if (!quiz) {
        warnings.push(`Missing quiz file: content/quizzes/${lessonId}.yaml`);
      } else {
        validateQuiz(lessonId, quiz, conceptIds, errors);
      }

      const practiceEntry = practice.get(lessonId);
      if (!practiceEntry) {
        warnings.push(`Missing practice file: content/practice/${lessonId}.yaml`);
      } else {
        validatePractice(lessonId, practiceEntry, errors);
      }
    }
  }

  for (const lessonId of lessons.keys()) {
    if (!seenLessonIds.has(lessonId)) errors.push(`Lesson metadata is not listed in manifest: ${lessonId}`);
  }

  return { errors, warnings };
}

function validateQuiz(lessonId, quiz, conceptIds, errors) {
  if (quiz.lesson_id !== lessonId) errors.push(`Quiz ${lessonId} lesson_id mismatch: ${quiz.lesson_id}`);
  if (!Array.isArray(quiz.questions) || quiz.questions.length === 0) {
    errors.push(`Quiz ${lessonId} must contain at least one question`);
    return;
  }

  const questionIds = new Set();
  for (const question of quiz.questions) {
    if (!question.id) errors.push(`Quiz ${lessonId} has a question without id`);
    if (questionIds.has(question.id)) errors.push(`Quiz ${lessonId} has duplicate question id: ${question.id}`);
    questionIds.add(question.id);
    if (!question.question) errors.push(`Quiz ${lessonId}:${question.id} is missing question text`);
    if (!question.explanation) errors.push(`Quiz ${lessonId}:${question.id} is missing explanation`);

    if (question.type === 'single-choice') {
      if (!Array.isArray(question.options) || question.options.length < 2) {
        errors.push(`Quiz ${lessonId}:${question.id} single-choice question needs at least 2 options`);
      }
      const maxIndex = (question.options?.length ?? 0) - 1;
      if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > maxIndex) {
        errors.push(`Quiz ${lessonId}:${question.id} answer index ${question.answer} is outside options range 0-${maxIndex}`);
      }
    }

    if (question.source_anchor && conceptIds.size > 0 && !conceptIds.has(question.source_anchor)) {
      errors.push(`Quiz ${lessonId}:${question.id} references unknown concept source_anchor: ${question.source_anchor}`);
    }
  }
}

function validatePractice(lessonId, practiceEntry, errors) {
  if (practiceEntry.lesson_id !== lessonId) errors.push(`Practice ${lessonId} lesson_id mismatch: ${practiceEntry.lesson_id}`);
  if (!Array.isArray(practiceEntry.tasks) || practiceEntry.tasks.length === 0) {
    errors.push(`Practice ${lessonId} must contain at least one task`);
    return;
  }

  const taskIds = new Set();
  for (const task of practiceEntry.tasks) {
    if (!task.id) errors.push(`Practice ${lessonId} has a task without id`);
    if (taskIds.has(task.id)) errors.push(`Practice ${lessonId} has duplicate task id: ${task.id}`);
    taskIds.add(task.id);
    if (!task.type) errors.push(`Practice ${lessonId}:${task.id} is missing type`);
    if (!task.prompt) errors.push(`Practice ${lessonId}:${task.id} is missing prompt`);
    if (!Array.isArray(task.rubric) || task.rubric.length === 0) errors.push(`Practice ${lessonId}:${task.id} rubric must not be empty`);
    if (!Array.isArray(task.answer) || task.answer.length === 0) errors.push(`Practice ${lessonId}:${task.id} answer must not be empty`);
  }
}

export function loadCourseData(root = ROOT) {
  const manifest = readYamlIfExists(path.join(root, 'content/course-manifest.yaml'));
  return {
    manifest,
    lessons: readYamlDir(path.join(root, 'content/lessons')),
    quizzes: readYamlDir(path.join(root, 'content/quizzes')),
    practice: readYamlDir(path.join(root, 'content/practice')),
    fileExists: (relativePath) => fs.existsSync(path.join(root, relativePath)),
  };
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const result = validateCourseData(loadCourseData(ROOT));
  for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
  for (const error of result.errors) console.error(`Error: ${error}`);
  if (result.errors.length > 0) process.exit(1);
  console.log(`Content validation passed with ${result.warnings.length} warning(s).`);
}
