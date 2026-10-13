import type { BestResult, LessonAttempt } from './progress-types'

export interface LessonResult extends BestResult {
  exactAccuracy: number
  displayedPercentage: number
}

export const calculateLessonResult = (
  attempt: LessonAttempt,
  totalExerciseCount: number,
): LessonResult | null => {
  const submittedAnswers = Object.values(attempt.submittedAnswers)
  if (
    totalExerciseCount < 1 ||
    submittedAnswers.length !== totalExerciseCount ||
    attempt.status !== 'completed'
  ) {
    return null
  }

  const correctAnswerCount = submittedAnswers.filter(
    (answer) => answer.isCorrect,
  ).length
  const exactAccuracy = correctAnswerCount / totalExerciseCount

  return {
    correctAnswerCount,
    totalExerciseCount,
    exactAccuracy,
    displayedPercentage: Math.round(exactAccuracy * 100),
  }
}

export const completeLessonAttempt = (
  attempt: LessonAttempt,
  totalExerciseCount: number,
): LessonAttempt | null => {
  if (
    totalExerciseCount < 1 ||
    Object.keys(attempt.submittedAnswers).length !== totalExerciseCount
  ) {
    return null
  }

  return {
    ...attempt,
    status: 'completed',
    correctAnswerCount: Object.values(attempt.submittedAnswers).filter(
      (answer) => answer.isCorrect,
    ).length,
  }
}

const isAtLeastAsAccurate = (
  candidate: BestResult,
  stored: BestResult,
): boolean =>
  candidate.correctAnswerCount * stored.totalExerciseCount >=
  stored.correctAnswerCount * candidate.totalExerciseCount

export const selectBestResult = (
  candidate: BestResult,
  stored?: BestResult,
): BestResult => {
  if (!stored || isAtLeastAsAccurate(candidate, stored)) return candidate
  return stored
}

export const displayPercentage = (result: BestResult): number =>
  Math.round((result.correctAnswerCount / result.totalExerciseCount) * 100)
