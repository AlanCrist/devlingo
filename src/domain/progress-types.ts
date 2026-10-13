import type {
  BilingualText,
  ExerciseId,
  LessonId,
  OptionId,
} from './content-types'

export interface SubmittedAnswer {
  exerciseId: ExerciseId
  selectedOptionId: OptionId
  isCorrect: boolean
}

export interface AttemptFeedback {
  exerciseId: ExerciseId
  isCorrect: boolean
  correctOptionId: OptionId
  explanation: BilingualText
}

export type LessonAttemptStatus = 'in-progress' | 'completed'

export interface LessonAttempt {
  lessonId: LessonId
  currentExerciseIndex: number
  selectedOptionId?: OptionId
  submittedAnswers: Record<ExerciseId, SubmittedAnswer>
  correctAnswerCount: number
  feedback?: AttemptFeedback
  status: LessonAttemptStatus
}

export interface BestResult {
  correctAnswerCount: number
  totalExerciseCount: number
}

export interface LessonProgress {
  completed: boolean
  bestResult?: BestResult
}

export interface ProgressState {
  lessons: Record<LessonId, LessonProgress>
}
