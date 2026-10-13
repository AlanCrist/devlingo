import { describe, expect, it } from 'vitest'

import { learningPath } from '../../src/content/learning-path'
import {
  evaluateExercise,
  selectAnswer,
  submitAnswer,
} from '../../src/domain/exercise-evaluation'
import type { LessonAttempt } from '../../src/domain/progress-types'

const lesson = learningPath.modules[0].lessons[0]
const multipleChoice = lesson.exercises[0]
const trueFalse = lesson.exercises[3]

const createAttempt = (): LessonAttempt => ({
  lessonId: lesson.id,
  currentExerciseIndex: 0,
  submittedAnswers: {},
  correctAnswerCount: 0,
  status: 'in-progress',
})

describe('exercise evaluation', () => {
  it('evaluates correct and incorrect multiple-choice answers', () => {
    expect(
      evaluateExercise(multipleChoice, multipleChoice.correctOptionId),
    ).toMatchObject({
      isCorrect: true,
      correctOptionId: 'a',
    })
    expect(evaluateExercise(multipleChoice, 'b')).toMatchObject({
      isCorrect: false,
      correctOptionId: 'a',
    })
  })

  it('evaluates true-false answers deterministically', () => {
    expect(evaluateExercise(trueFalse, 'true')).toMatchObject({
      isCorrect: true,
      correctOptionId: 'true',
    })
    expect(evaluateExercise(trueFalse, 'false')).toMatchObject({
      isCorrect: false,
      correctOptionId: 'true',
    })
  })

  it('rejects an answer without a selection', () => {
    const result = submitAnswer(createAttempt(), multipleChoice)

    expect(result).toEqual({
      accepted: false,
      reason: 'answer-not-selected',
      attempt: createAttempt(),
    })
  })

  it('uses the last selection made before submission', () => {
    const selected = selectAnswer(
      selectAnswer(createAttempt(), multipleChoice.id, 'b'),
      multipleChoice.id,
      'a',
    )
    const result = submitAnswer(selected, multipleChoice)

    expect(result.accepted).toBe(true)
    if (result.accepted) {
      expect(result.evaluation.isCorrect).toBe(true)
      expect(
        result.attempt.submittedAnswers[multipleChoice.id].selectedOptionId,
      ).toBe('a')
    }
  })

  it('keeps a submitted answer final for the current attempt', () => {
    const firstSubmission = submitAnswer(
      selectAnswer(createAttempt(), multipleChoice.id, 'a'),
      multipleChoice,
    )
    expect(firstSubmission.accepted).toBe(true)
    if (!firstSubmission.accepted) return

    const changed = selectAnswer(
      firstSubmission.attempt,
      multipleChoice.id,
      'b',
    )
    const secondSubmission = submitAnswer(changed, multipleChoice)

    expect(changed).toEqual(firstSubmission.attempt)
    expect(secondSubmission).toEqual({
      accepted: false,
      reason: 'answer-already-submitted',
      attempt: firstSubmission.attempt,
    })
  })
})
