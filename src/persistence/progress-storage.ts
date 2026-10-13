import type { LessonId } from '../domain/content-types'
import type {
  BestResult,
  LessonProgress,
  ProgressState,
} from '../domain/progress-types'

export const PROGRESS_STORAGE_KEY = 'devlingo.progress'
export const PROGRESS_SCHEMA_VERSION = 1

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface ProgressStorage {
  load(): ProgressState
  save(progress: ProgressState): void
  clear(): void
}

interface StoredProgress {
  version: typeof PROGRESS_SCHEMA_VERSION
  lessons: Record<LessonId, LessonProgress>
}

const emptyProgress = (): ProgressState => ({ lessons: {} })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isBestResult = (value: unknown): value is BestResult => {
  if (!isRecord(value)) return false
  const correctAnswerCount = value.correctAnswerCount
  const totalExerciseCount = value.totalExerciseCount
  return (
    Number.isInteger(correctAnswerCount) &&
    Number.isInteger(totalExerciseCount) &&
    Number(correctAnswerCount) >= 0 &&
    Number(totalExerciseCount) > 0 &&
    Number(correctAnswerCount) <= Number(totalExerciseCount)
  )
}

const isLessonProgress = (value: unknown): value is LessonProgress => {
  if (!isRecord(value) || typeof value.completed !== 'boolean') return false
  if (value.bestResult === undefined) return true
  return value.completed && isBestResult(value.bestResult)
}

const isStoredProgress = (value: unknown): value is StoredProgress => {
  if (!isRecord(value)) return false
  if (value.version !== PROGRESS_SCHEMA_VERSION || !isRecord(value.lessons)) {
    return false
  }
  return Object.values(value.lessons).every(isLessonProgress)
}

const readProgress = (storage: StorageLike): ProgressState => {
  try {
    const serialized = storage.getItem(PROGRESS_STORAGE_KEY)
    if (!serialized) return emptyProgress()

    const parsed: unknown = JSON.parse(serialized)
    if (!isStoredProgress(parsed)) return emptyProgress()

    return { lessons: parsed.lessons }
  } catch {
    return emptyProgress()
  }
}

const writeProgress = (storage: StorageLike, progress: ProgressState): void => {
  const storedProgress: StoredProgress = {
    version: PROGRESS_SCHEMA_VERSION,
    lessons: progress.lessons,
  }

  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(storedProgress))
  } catch {
    // Storage failures must not make progress appear valid or fabricate a score.
  }
}

export const createProgressStorage = (
  storage: StorageLike,
): ProgressStorage => ({
  load: () => readProgress(storage),
  save: (progress) => writeProgress(storage, progress),
  clear: () => {
    try {
      storage.removeItem(PROGRESS_STORAGE_KEY)
    } catch {
      // Clearing local progress is best-effort and remains behind this boundary.
    }
  },
})

export const createLocalStorageProgressStorage = (): ProgressStorage => {
  if (typeof window === 'undefined')
    return createProgressStorage(new UnavailableStorage())
  try {
    return createProgressStorage(window.localStorage)
  } catch {
    return createProgressStorage(new UnavailableStorage())
  }
}

class UnavailableStorage implements StorageLike {
  getItem(): string | null {
    return null
  }

  setItem(): void {}

  removeItem(): void {}
}
