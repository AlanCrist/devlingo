import type { LearningPath, Lesson } from '../../domain/content-types'
import type { ProgressState } from '../../domain/progress-types'
import styles from './LearningPathView.module.css'

interface LearningPathViewProps {
  learningPath: LearningPath
  progress: ProgressState
  onSelectLesson: (lesson: Lesson) => void
}

export function LearningPathView({
  learningPath,
  progress,
  onSelectLesson,
}: LearningPathViewProps) {
  return (
    <section aria-labelledby="learning-path-title">
      <div className={styles.introduction}>
        <div>
          <p className={styles.sectionLabel}>Your learning path</p>
          <h2 id="learning-path-title">Learn technical English step by step</h2>
        </div>
        <p className={styles.supportingText}>
          English first, Portuguese support. Choose any lesson to begin.
        </p>
      </div>

      <div className={styles.moduleList}>
        {learningPath.modules.map((module) => (
          <section className={styles.module} key={module.id}>
            <div className={styles.moduleHeading}>
              <span className={styles.moduleNumber} aria-hidden="true">
                {String(module.order).padStart(2, '0')}
              </span>
              <div>
                <h3>{module.title.en}</h3>
                <p>{module.title.pt}</p>
              </div>
            </div>

            <ol className={styles.lessonList}>
              {module.lessons.map((lesson) => {
                const lessonProgress = progress.lessons[lesson.id]
                const bestPercentage = lessonProgress?.bestResult
                  ? Math.round(
                      (lessonProgress.bestResult.correctAnswerCount /
                        lessonProgress.bestResult.totalExerciseCount) *
                        100,
                    )
                  : null

                return (
                  <li className={styles.lessonItem} key={lesson.id}>
                    <button
                      className={styles.lessonButton}
                      type="button"
                      onClick={() => onSelectLesson(lesson)}
                    >
                      <span className={styles.lessonPosition}>
                        Lesson {lesson.order}
                      </span>
                      <span className={styles.lessonTitle}>
                        {lesson.title.en}
                      </span>
                      <span className={styles.lessonTitleSupport}>
                        {lesson.title.pt}
                      </span>
                      <span className={styles.lessonMeta}>
                        {lessonProgress?.completed
                          ? 'Completed'
                          : 'Not started'}
                        {bestPercentage !== null &&
                          ` · Best score: ${bestPercentage}%`}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </section>
  )
}
