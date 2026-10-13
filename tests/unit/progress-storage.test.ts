import { describe, expect, it } from 'vitest'

import {
  PROGRESS_SCHEMA_VERSION,
  PROGRESS_STORAGE_KEY,
  createProgressStorage,
} from '../../src/persistence/progress-storage'
import type { StorageLike } from '../../src/persistence/progress-storage'
import type { ProgressState } from '../../src/domain/progress-types'

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    this.values.delete(key)
  }
}

const progress: ProgressState = {
  lessons: {
    'lesson-1': {
      completed: true,
      bestResult: { correctAnswerCount: 4, totalExerciseCount: 5 },
    },
    'lesson-2': { completed: false },
  },
}

describe('versioned progress storage', () => {
  it('returns empty progress when storage has no data', () => {
    const storage = createProgressStorage(new MemoryStorage())

    expect(storage.load()).toEqual({ lessons: {} })
  })

  it('preserves completion and exact best-result data in a round trip', () => {
    const backingStorage = new MemoryStorage()
    const storage = createProgressStorage(backingStorage)

    storage.save(progress)

    expect(storage.load()).toEqual(progress)
    expect(backingStorage.getItem(PROGRESS_STORAGE_KEY)).toContain(
      `"version":${PROGRESS_SCHEMA_VERSION}`,
    )
    expect(backingStorage.getItem(PROGRESS_STORAGE_KEY)).toContain(
      '"correctAnswerCount":4',
    )
    expect(backingStorage.getItem(PROGRESS_STORAGE_KEY)).toContain(
      '"totalExerciseCount":5',
    )
  })

  it('does not persist incomplete attempt answers', () => {
    const backingStorage = new MemoryStorage()
    const storage = createProgressStorage(backingStorage)

    storage.save(progress)

    expect(backingStorage.getItem(PROGRESS_STORAGE_KEY)).not.toContain(
      'submittedAnswers',
    )
    expect(backingStorage.getItem(PROGRESS_STORAGE_KEY)).not.toContain(
      'in-progress',
    )
  })

  it('treats malformed and unsupported data as unavailable progress', () => {
    const backingStorage = new MemoryStorage()
    const storage = createProgressStorage(backingStorage)

    backingStorage.setItem(PROGRESS_STORAGE_KEY, '{not-json')
    expect(storage.load()).toEqual({ lessons: {} })

    backingStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: PROGRESS_SCHEMA_VERSION + 1,
        lessons: progress.lessons,
      }),
    )
    expect(storage.load()).toEqual({ lessons: {} })

    backingStorage.setItem(
      PROGRESS_STORAGE_KEY,
      JSON.stringify({
        version: PROGRESS_SCHEMA_VERSION,
        lessons: {
          'lesson-1': {
            completed: true,
            bestResult: { correctAnswerCount: 6, totalExerciseCount: 5 },
          },
        },
      }),
    )
    expect(storage.load()).toEqual({ lessons: {} })
  })

  it('supports clearing progress', () => {
    const backingStorage = new MemoryStorage()
    const storage = createProgressStorage(backingStorage)
    storage.save(progress)

    storage.clear()

    expect(storage.load()).toEqual({ lessons: {} })
  })
})
