export type ModuleId = string
export type LessonId = string
export type VocabularyItemId = string
export type ExerciseId = string
export type OptionId = string

export interface BilingualText {
  en: string
  pt: string
}

export interface VocabularyItem {
  id: VocabularyItemId
  termEn: string
  translationPt: string
  explanationPt: string
  exampleEn: string
}

export interface AnswerOption {
  id: OptionId
  label: BilingualText
}

export type TrueFalseOptionId = 'true' | 'false'

export interface TrueFalseOption {
  id: TrueFalseOptionId
  label: BilingualText
}

export interface ExerciseFeedback {
  explanation: BilingualText
}

export interface BaseExercise {
  id: ExerciseId
  prompt: BilingualText
  feedback: ExerciseFeedback
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice'
  options: AnswerOption[]
  correctOptionId: OptionId
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false'
  options: [TrueFalseOption, TrueFalseOption]
  correctOptionId: TrueFalseOptionId
}

export type Exercise = MultipleChoiceExercise | TrueFalseExercise

export interface Lesson {
  id: LessonId
  moduleId: ModuleId
  title: BilingualText
  order: number
  explanation: BilingualText
  context: BilingualText
  vocabulary: VocabularyItem[]
  exercises: Exercise[]
}

export interface LearningModule {
  id: ModuleId
  title: BilingualText
  order: number
  lessons: Lesson[]
}

export interface LearningPath {
  modules: LearningModule[]
}
