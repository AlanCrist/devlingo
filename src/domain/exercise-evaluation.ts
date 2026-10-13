import type {
  Exercise,
  ExerciseFeedback,
  ExerciseId,
  OptionId,
} from './content-types'
import type { LessonAttempt } from './progress-types'

export type SubmissionRejection =
  'answer-not-selected' | 'answer-already-submitted'

export interface ExerciseEvaluation {
  exerciseId: ExerciseId
  selectedOptionId: OptionId
  correctOptionId: OptionId
  isCorrect: boolean
  feedback: ExerciseFeedback
}

export type AnswerSubmission =
  | {
      accepted: true
      evaluation: ExerciseEvaluation
      attempt: LessonAttempt
    }
  | {
      accepted: false
      reason: SubmissionRejection
      attempt: LessonAttempt
    }

export const selectAnswer = (
  attempt: LessonAttempt,
  exerciseId: ExerciseId,
  selectedOptionId: OptionId,
): LessonAttempt => {
  if (attempt.submittedAnswers[exerciseId]) return attempt

  return {
    ...attempt,
    selectedOptionId,
  }
}

export const evaluateExercise = (
  exercise: Exercise,
  selectedOptionId?: OptionId,
): ExerciseEvaluation | null => {
  if (!selectedOptionId) return null

  return {
    exerciseId: exercise.id,
    selectedOptionId,
    correctOptionId: exercise.correctOptionId,
    isCorrect: selectedOptionId === exercise.correctOptionId,
    feedback: exercise.feedback,
  }
}

export const submitAnswer = (
  attempt: LessonAttempt,
  exercise: Exercise,
): AnswerSubmission => {
  if (attempt.submittedAnswers[exercise.id]) {
    return {
      accepted: false,
      reason: 'answer-already-submitted',
      attempt,
    }
  }

  const evaluation = evaluateExercise(exercise, attempt.selectedOptionId)
  if (!evaluation) {
    return {
      accepted: false,
      reason: 'answer-not-selected',
      attempt,
    }
  }

  return {
    accepted: true,
    evaluation,
    attempt: {
      ...attempt,
      submittedAnswers: {
        ...attempt.submittedAnswers,
        [exercise.id]: {
          exerciseId: exercise.id,
          selectedOptionId: evaluation.selectedOptionId,
          isCorrect: evaluation.isCorrect,
        },
      },
      correctAnswerCount:
        attempt.correctAnswerCount + (evaluation.isCorrect ? 1 : 0),
      feedback: {
        exerciseId: exercise.id,
        isCorrect: evaluation.isCorrect,
        correctOptionId: evaluation.correctOptionId,
        explanation: evaluation.feedback.explanation,
      },
    },
  }
}
