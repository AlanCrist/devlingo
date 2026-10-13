import type { LessonAttempt } from './progress-types'

export const createLessonAttempt = (lessonId: string): LessonAttempt => ({
  lessonId,
  currentExerciseIndex: 0,
  submittedAnswers: {},
  correctAnswerCount: 0,
  status: 'in-progress',
})

export const restartLessonAttempt = (lessonId: string): LessonAttempt =>
  createLessonAttempt(lessonId)

export const discardIncompleteAttempt = (
  attempt: LessonAttempt,
): LessonAttempt | undefined => {
  if (attempt.status === 'in-progress') return undefined
  return attempt
}
