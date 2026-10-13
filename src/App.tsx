import { useState } from 'react'

import { learningPath } from './content/learning-path'
import {
  createLessonAttempt,
  restartLessonAttempt,
} from './domain/attempt-lifecycle'
import { selectAnswer, submitAnswer } from './domain/exercise-evaluation'
import {
  calculateLessonResult,
  completeLessonAttempt,
  selectBestResult,
} from './domain/lesson-results'
import type { Lesson } from './domain/content-types'
import type { LessonAttempt, ProgressState } from './domain/progress-types'
import { createLocalStorageProgressStorage } from './persistence/progress-storage'
import { LessonView } from './features/lesson/LessonView'
import { LearningPathView } from './features/learning-path/LearningPathView'
import styles from './App.module.css'

function App() {
  const [progressStorage] = useState(createLocalStorageProgressStorage)
  const [progress, setProgress] = useState<ProgressState>(() =>
    progressStorage.load(),
  )
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [attempt, setAttempt] = useState<LessonAttempt | null>(null)
  const [completionResult, setCompletionResult] =
    useState<ReturnType<typeof calculateLessonResult>>(null)
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null,
  )
  const openLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setAttempt(createLessonAttempt(lesson.id))
    setCompletionResult(null)
    setSubmissionMessage(null)
  }

  const returnToPath = () => {
    setSelectedLesson(null)
    setAttempt(null)
    setCompletionResult(null)
    setSubmissionMessage(null)
  }

  const handleSelectAnswer = (optionId: string) => {
    if (!selectedLesson || !attempt) return
    const currentExercise =
      selectedLesson.exercises[attempt.currentExerciseIndex]
    setAttempt(selectAnswer(attempt, currentExercise.id, optionId))
    setSubmissionMessage(null)
  }

  const handleSubmitAnswer = () => {
    if (!selectedLesson || !attempt) return
    const currentExercise =
      selectedLesson.exercises[attempt.currentExerciseIndex]
    const submission = submitAnswer(attempt, currentExercise)

    if (!submission.accepted) {
      setSubmissionMessage(
        submission.reason === 'answer-not-selected'
          ? 'Select an answer before submitting. / Selecione uma resposta antes de enviar.'
          : 'This answer was already submitted. / Esta resposta já foi enviada.',
      )
      return
    }

    setSubmissionMessage(null)
    const isLastExercise =
      attempt.currentExerciseIndex === selectedLesson.exercises.length - 1

    if (!isLastExercise) {
      setAttempt(submission.attempt)
      return
    }

    const completedAttempt = completeLessonAttempt(
      submission.attempt,
      selectedLesson.exercises.length,
    )
    if (!completedAttempt) return

    const result = calculateLessonResult(
      completedAttempt,
      selectedLesson.exercises.length,
    )
    if (!result) return

    const previousProgress = progress.lessons[selectedLesson.id]
    const bestResult = selectBestResult(result, previousProgress?.bestResult)
    const nextProgress: ProgressState = {
      lessons: {
        ...progress.lessons,
        [selectedLesson.id]: { completed: true, bestResult },
      },
    }

    setAttempt(completedAttempt)
    setCompletionResult(result)
    setProgress(nextProgress)
    progressStorage.save(nextProgress)
  }

  const handleNextExercise = () => {
    if (!selectedLesson || !attempt) return
    setAttempt({
      ...attempt,
      currentExerciseIndex: attempt.currentExerciseIndex + 1,
      selectedOptionId: undefined,
      feedback: undefined,
    })
    setSubmissionMessage(null)
  }

  const handleRepeatLesson = () => {
    if (!selectedLesson) return
    setAttempt(restartLessonAttempt(selectedLesson.id))
    setCompletionResult(null)
    setSubmissionMessage(null)
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Technical English for developers</p>
        <h1>DevLingo</h1>
        <p className={styles.tagline}>
          Build confidence for everyday software development communication.
        </p>
      </header>

      {selectedLesson && attempt ? (
        <LessonView
          lesson={selectedLesson}
          attempt={attempt}
          completionResult={completionResult}
          submissionMessage={submissionMessage}
          onBack={returnToPath}
          onSelectAnswer={handleSelectAnswer}
          onSubmitAnswer={handleSubmitAnswer}
          onNextExercise={handleNextExercise}
          onRepeatLesson={handleRepeatLesson}
        />
      ) : (
        <LearningPathView
          learningPath={learningPath}
          progress={progress}
          onSelectLesson={openLesson}
        />
      )}
    </main>
  )
}

export default App
