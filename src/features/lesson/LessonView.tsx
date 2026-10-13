import type { Exercise, Lesson } from '../../domain/content-types'
import type { LessonResult } from '../../domain/lesson-results'
import type { LessonAttempt } from '../../domain/progress-types'
import styles from './LessonView.module.css'

interface LessonViewProps {
  lesson: Lesson
  attempt: LessonAttempt
  completionResult: LessonResult | null
  submissionMessage: string | null
  onBack: () => void
  onSelectAnswer: (optionId: string) => void
  onSubmitAnswer: () => void
  onNextExercise: () => void
  onRepeatLesson: () => void
}

const getOptionLabel = (exercise: Exercise, optionId: string) =>
  exercise.options.find((option) => option.id === optionId)?.label

export function LessonView({
  lesson,
  attempt,
  completionResult,
  submissionMessage,
  onBack,
  onSelectAnswer,
  onSubmitAnswer,
  onNextExercise,
  onRepeatLesson,
}: LessonViewProps) {
  const exercise = lesson.exercises[attempt.currentExerciseIndex]
  const submittedAnswer = attempt.submittedAnswers[exercise.id]
  const feedback =
    attempt.feedback?.exerciseId === exercise.id ? attempt.feedback : null
  const correctOption = getOptionLabel(exercise, exercise.correctOptionId)

  return (
    <section aria-labelledby="lesson-title">
      <button className={styles.backButton} type="button" onClick={onBack}>
        ← Back to learning path
      </button>

      <div className={styles.lessonHeader}>
        <p className={styles.lessonPosition}>
          Module {lesson.moduleId.replace('module-', '')} · Lesson{' '}
          {lesson.order}
        </p>
        <h2 id="lesson-title">{lesson.title.en}</h2>
        <p className={styles.supportText}>{lesson.title.pt}</p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.studyContent}>
          <section
            className={styles.contentCard}
            aria-labelledby="explanation-title"
          >
            <p className={styles.cardLabel}>Lesson explanation</p>
            <h3 id="explanation-title">{lesson.explanation.en}</h3>
            <p>{lesson.explanation.pt}</p>
          </section>

          <section
            className={styles.contentCard}
            aria-labelledby="context-title"
          >
            <p className={styles.cardLabel}>In context</p>
            <h3 id="context-title">{lesson.context.en}</h3>
            <p>{lesson.context.pt}</p>
          </section>

          <section
            className={styles.contentCard}
            aria-labelledby="vocabulary-title"
          >
            <p className={styles.cardLabel}>Vocabulary review</p>
            <h3 id="vocabulary-title">Key words for this lesson</h3>
            <dl className={styles.vocabularyList}>
              {lesson.vocabulary.map((item) => (
                <div className={styles.vocabularyItem} key={item.id}>
                  <dt>{item.termEn}</dt>
                  <dd>
                    <strong>{item.translationPt}</strong>
                    <span>{item.explanationPt}</span>
                    <em>“{item.exampleEn}”</em>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section
          className={styles.exerciseCard}
          aria-labelledby="exercise-title"
        >
          <div className={styles.exerciseHeader}>
            <p className={styles.cardLabel}>Practice</p>
            <span>
              Exercise {attempt.currentExerciseIndex + 1} of{' '}
              {lesson.exercises.length}
            </span>
          </div>
          <h3 id="exercise-title">{exercise.prompt.en}</h3>
          <p className={styles.supportText}>{exercise.prompt.pt}</p>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSubmitAnswer()
            }}
          >
            <fieldset
              className={styles.options}
              disabled={Boolean(submittedAnswer) || Boolean(completionResult)}
            >
              <legend className={styles.visuallyHidden}>
                Choose an answer
              </legend>
              {exercise.options.map((option) => (
                <label className={styles.option} key={option.id}>
                  <input
                    type="radio"
                    name={exercise.id}
                    value={option.id}
                    checked={attempt.selectedOptionId === option.id}
                    onChange={() => onSelectAnswer(option.id)}
                  />
                  <span>
                    <strong>{option.label.en}</strong>
                    <small>{option.label.pt}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            {submissionMessage && (
              <p className={styles.validationMessage} role="alert">
                {submissionMessage}
              </p>
            )}

            {!submittedAnswer && !completionResult && (
              <button className={styles.primaryButton} type="submit">
                Submit answer
              </button>
            )}
          </form>

          {feedback && (
            <div
              className={`${styles.feedback} ${feedback.isCorrect ? styles.correct : styles.incorrect}`}
              role="status"
              aria-live="polite"
            >
              <strong>
                {feedback.isCorrect ? 'Correct!' : 'Not quite yet.'}
              </strong>
              <p>{feedback.explanation.en}</p>
              <p>{feedback.explanation.pt}</p>
              {!feedback.isCorrect && correctOption && (
                <p>
                  <strong>Correct answer: </strong>
                  {correctOption.en} ({correctOption.pt})
                </p>
              )}
            </div>
          )}

          {feedback && !completionResult && (
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onNextExercise}
            >
              Next exercise
            </button>
          )}

          {completionResult && (
            <div className={styles.completion} role="status" aria-live="polite">
              <p className={styles.cardLabel}>Lesson completed</p>
              <h3>Great work!</h3>
              <p>
                Your result:{' '}
                <strong>{completionResult.displayedPercentage}%</strong>
              </p>
              <p>
                {completionResult.correctAnswerCount} of{' '}
                {completionResult.totalExerciseCount} answers correct.
              </p>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={onRepeatLesson}
              >
                Repeat lesson
              </button>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
