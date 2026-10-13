import type {
  Exercise,
  LearningPath,
  Lesson,
  LearningModule,
} from '../domain/content-types'

export interface ContentValidationResult {
  valid: boolean
  errors: string[]
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0

const hasBilingualText = (value: unknown): boolean => {
  if (typeof value !== 'object' || value === null) return false
  const text = value as Record<string, unknown>
  return isNonEmptyString(text.en) && isNonEmptyString(text.pt)
}

const addDuplicateErrors = (
  values: string[],
  label: string,
  errors: string[],
): void => {
  const seen = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`)
    seen.add(value)
  }
}

const validateExercise = (
  exercise: Exercise,
  lessonPath: string,
  errors: string[],
): void => {
  const exercisePath = `${lessonPath}.exercise:${exercise.id}`
  if (!isNonEmptyString(exercise.id))
    errors.push(`${exercisePath}: id is required`)
  if (!hasBilingualText(exercise.prompt))
    errors.push(`${exercisePath}: bilingual prompt is required`)
  if (!hasBilingualText(exercise.feedback.explanation)) {
    errors.push(`${exercisePath}: bilingual feedback explanation is required`)
  }

  const optionIds = exercise.options.map((option) => option.id)
  addDuplicateErrors(optionIds, 'option ID', errors)
  if (optionIds.length < 2)
    errors.push(`${exercisePath}: at least two options are required`)
  for (const option of exercise.options) {
    if (!isNonEmptyString(option.id))
      errors.push(`${exercisePath}: option ID is required`)
    if (!hasBilingualText(option.label))
      errors.push(`${exercisePath}: bilingual option label is required`)
  }

  if (!optionIds.includes(exercise.correctOptionId)) {
    errors.push(
      `${exercisePath}: correct answer must reference an available option`,
    )
  }

  if (exercise.type === 'true-false') {
    const trueFalseIds = optionIds.filter(
      (id) => id === 'true' || id === 'false',
    )
    if (
      exercise.options.length !== 2 ||
      trueFalseIds.length !== 2 ||
      !optionIds.includes('true') ||
      !optionIds.includes('false')
    ) {
      errors.push(
        `${exercisePath}: true-false exercises require exactly true and false options`,
      )
    }
  } else if (exercise.type === 'multiple-choice') {
    if (exercise.options.length < 3) {
      errors.push(
        `${exercisePath}: multiple-choice exercises require at least three options`,
      )
    }
  } else {
    errors.push(`${exercisePath}: unsupported exercise type`)
  }
}

const validateLesson = (
  lesson: Lesson,
  moduleId: string,
  lessonIds: Set<string>,
  exerciseIds: Set<string>,
  vocabularyIds: Set<string>,
  errors: string[],
): void => {
  const lessonPath = `lesson:${lesson.id}`
  if (!isNonEmptyString(lesson.id)) errors.push('Lesson ID is required')
  if (lessonIds.has(lesson.id)) errors.push(`Duplicate lesson ID: ${lesson.id}`)
  lessonIds.add(lesson.id)
  if (lesson.moduleId !== moduleId)
    errors.push(`${lessonPath}: module relationship is invalid`)
  if (!hasBilingualText(lesson.title))
    errors.push(`${lessonPath}: bilingual title is required`)
  if (!Number.isInteger(lesson.order) || lesson.order < 1)
    errors.push(`${lessonPath}: positive order is required`)
  if (!hasBilingualText(lesson.explanation))
    errors.push(`${lessonPath}: bilingual explanation is required`)
  if (!hasBilingualText(lesson.context))
    errors.push(`${lessonPath}: bilingual context is required`)
  if (lesson.vocabulary.length < 1)
    errors.push(`${lessonPath}: at least one vocabulary item is required`)
  for (const item of lesson.vocabulary) {
    if (vocabularyIds.has(item.id))
      errors.push(`Duplicate vocabulary ID: ${item.id}`)
    vocabularyIds.add(item.id)
    if (!isNonEmptyString(item.id))
      errors.push(`${lessonPath}: vocabulary ID is required`)
    if (!isNonEmptyString(item.termEn))
      errors.push(`${lessonPath}: vocabulary English term is required`)
    if (!isNonEmptyString(item.translationPt))
      errors.push(
        `${lessonPath}: vocabulary Portuguese translation is required`,
      )
    if (!isNonEmptyString(item.explanationPt))
      errors.push(`${lessonPath}: vocabulary explanation is required`)
    if (!isNonEmptyString(item.exampleEn))
      errors.push(`${lessonPath}: vocabulary English example is required`)
  }

  if (lesson.exercises.length !== 5)
    errors.push(`${lessonPath}: exactly five exercises are required`)
  const multipleChoiceCount = lesson.exercises.filter(
    (exercise) => exercise.type === 'multiple-choice',
  ).length
  const trueFalseCount = lesson.exercises.filter(
    (exercise) => exercise.type === 'true-false',
  ).length
  if (multipleChoiceCount !== 3)
    errors.push(
      `${lessonPath}: exactly three multiple-choice exercises are required`,
    )
  if (trueFalseCount !== 2)
    errors.push(`${lessonPath}: exactly two true-false exercises are required`)
  for (const exercise of lesson.exercises) {
    if (exerciseIds.has(exercise.id))
      errors.push(`Duplicate exercise ID: ${exercise.id}`)
    exerciseIds.add(exercise.id)
    validateExercise(exercise, lessonPath, errors)
  }
}

const validateModule = (
  currentModule: LearningModule,
  moduleIds: Set<string>,
  lessonIds: Set<string>,
  exerciseIds: Set<string>,
  vocabularyIds: Set<string>,
  errors: string[],
): void => {
  const modulePath = `module:${currentModule.id}`
  if (!isNonEmptyString(currentModule.id)) errors.push('Module ID is required')
  if (moduleIds.has(currentModule.id))
    errors.push(`Duplicate module ID: ${currentModule.id}`)
  moduleIds.add(currentModule.id)
  if (!hasBilingualText(currentModule.title))
    errors.push(`${modulePath}: bilingual title is required`)
  if (!Number.isInteger(currentModule.order) || currentModule.order < 1)
    errors.push(`${modulePath}: positive order is required`)
  if (currentModule.lessons.length !== 2)
    errors.push(`${modulePath}: exactly two lessons are required`)
  for (const lesson of currentModule.lessons) {
    validateLesson(
      lesson,
      currentModule.id,
      lessonIds,
      exerciseIds,
      vocabularyIds,
      errors,
    )
  }
}

export const validateLearningPath = (
  content: LearningPath,
): ContentValidationResult => {
  const errors: string[] = []
  if (!content || !Array.isArray(content.modules)) {
    return {
      valid: false,
      errors: ['Learning path must contain a modules array'],
    }
  }
  if (content.modules.length !== 3)
    errors.push('Learning path must contain exactly three modules')

  const moduleIds = new Set<string>()
  const lessonIds = new Set<string>()
  const exerciseIds = new Set<string>()
  const vocabularyIds = new Set<string>()
  for (const currentModule of content.modules) {
    validateModule(
      currentModule,
      moduleIds,
      lessonIds,
      exerciseIds,
      vocabularyIds,
      errors,
    )
  }
  addDuplicateErrors(
    content.modules.map((item) => item.order.toString()),
    'module order',
    errors,
  )
  for (const currentModule of content.modules) {
    addDuplicateErrors(
      currentModule.lessons.map((item) => item.order.toString()),
      `lesson order in ${currentModule.id}`,
      errors,
    )
  }
  return { valid: errors.length === 0, errors }
}

export const assertValidLearningPath = (content: LearningPath): void => {
  const result = validateLearningPath(content)
  if (!result.valid)
    throw new Error(`Invalid learning content:\n${result.errors.join('\n')}`)
}
