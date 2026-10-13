import { describe, expect, it } from 'vitest'

import {
  calculateLessonResult,
  completeLessonAttempt,
  displayPercentage,
  selectBestResult,
} from '../../src/domain/lesson-results'
import type { LessonAttempt } from '../../src/domain/progress-types'

const createAttempt = (
  correctAnswers: boolean[],
  status: LessonAttempt['status'] = 'in-progress',
): LessonAttempt => ({
  lessonId: 'lesson-1',
  currentExerciseIndex: 0,
  submittedAnswers: Object.fromEntries(
    correctAnswers.map((isCorrect, index) => [
      `exercise-${index + 1}`,
      {
        exerciseId: `exercise-${index + 1}`,
        selectedOptionId: 'answer',
        isCorrect,
      },
    ]),
  ),
  correctAnswerCount: correctAnswers.filter(Boolean).length,
  status,
})

describe('lesson results', () => {
  it('does not complete an attempt until every exercise is answered', () => {
    const incomplete = createAttempt([true, false])

    expect(completeLessonAttempt(incomplete, 5)).toBeNull()
    expect(calculateLessonResult(incomplete, 5)).toBeNull()
  })

  it('completes an attempt and calculates exact result values', () => {
    const completed = completeLessonAttempt(
      createAttempt([true, false, true, false, true]),
      5,
    )

    expect(completed).not.toBeNull()
    if (!completed) return

    expect(calculateLessonResult(completed, 5)).toEqual({
      correctAnswerCount: 3,
      totalExerciseCount: 5,
      exactAccuracy: 0.6,
      displayedPercentage: 60,
    })
  })

  it('supports valid zero and perfect results', () => {
    const zero = completeLessonAttempt(createAttempt([false, false, false]), 3)
    const perfect = completeLessonAttempt(createAttempt([true, true, true]), 3)

    expect(zero && calculateLessonResult(zero, 3)?.displayedPercentage).toBe(0)
    expect(
      perfect && calculateLessonResult(perfect, 3)?.displayedPercentage,
    ).toBe(100)
  })

  it('preserves or replaces the best result using exact proportions', () => {
    const stored = { correctAnswerCount: 3, totalExerciseCount: 7 }
    const lower = { correctAnswerCount: 2, totalExerciseCount: 5 }
    const equal = { correctAnswerCount: 6, totalExerciseCount: 14 }
    const higher = { correctAnswerCount: 13, totalExerciseCount: 30 }

    expect(selectBestResult(lower, stored)).toBe(stored)
    expect(selectBestResult(equal, stored)).toBe(equal)
    expect(selectBestResult(higher, stored)).toBe(higher)
  })

  it('rounds only the displayed percentage, never the comparison value', () => {
    const stored = { correctAnswerCount: 3, totalExerciseCount: 7 }
    const higherWithSameDisplay = {
      correctAnswerCount: 13,
      totalExerciseCount: 30,
    }

    expect(displayPercentage(stored)).toBe(43)
    expect(displayPercentage(higherWithSameDisplay)).toBe(43)
    expect(selectBestResult(higherWithSameDisplay, stored)).toBe(
      higherWithSameDisplay,
    )
  })
})
