import { describe, expect, it } from 'vitest'

import {
  createLessonAttempt,
  discardIncompleteAttempt,
  restartLessonAttempt,
} from '../../src/domain/attempt-lifecycle'
import type {
  LessonAttempt,
  ProgressState,
} from '../../src/domain/progress-types'

describe('lesson attempt lifecycle', () => {
  it('starts every attempt at the first exercise with no answers', () => {
    expect(createLessonAttempt('lesson-1')).toEqual({
      lessonId: 'lesson-1',
      currentExerciseIndex: 0,
      submittedAnswers: {},
      correctAnswerCount: 0,
      status: 'in-progress',
    })
  })

  it('discards an incomplete attempt instead of restoring its answers', () => {
    const interrupted: LessonAttempt = {
      ...createLessonAttempt('lesson-1'),
      currentExerciseIndex: 2,
      submittedAnswers: {
        'exercise-1': {
          exerciseId: 'exercise-1',
          selectedOptionId: 'a',
          isCorrect: true,
        },
      },
      correctAnswerCount: 1,
    }

    expect(discardIncompleteAttempt(interrupted)).toBeUndefined()
    expect(restartLessonAttempt('lesson-1')).toEqual(
      createLessonAttempt('lesson-1'),
    )
  })

  it('does not change completed progress when an incomplete attempt is restarted', () => {
    const progress: ProgressState = {
      lessons: {
        'lesson-1': {
          completed: true,
          bestResult: { correctAnswerCount: 4, totalExerciseCount: 5 },
        },
      },
    }

    const beforeRestart = structuredClone(progress)
    restartLessonAttempt('lesson-1')

    expect(progress).toEqual(beforeRestart)
  })
})
