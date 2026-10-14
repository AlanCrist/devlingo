import type { NotebookRecord, NotebookState } from '../domain/notebook-types'

export const NOTEBOOK_STORAGE_KEY = 'devlingo.notebook'
export const NOTEBOOK_SCHEMA_VERSION = 1

export interface NotebookStorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface NotebookStorage {
  load(): NotebookState
  save(state: NotebookState): void
  clear(): void
}

interface StoredNotebook {
  version: typeof NOTEBOOK_SCHEMA_VERSION
  records: Record<string, NotebookRecord>
}

const emptyState = (): NotebookState => ({ records: {} })
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isNotebookRecord = (value: unknown): value is NotebookRecord => {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.term === 'string' &&
    ['active', 'learned', 'archived'].includes(String(value.status)) &&
    Array.isArray(value.meanings) &&
    Array.isArray(value.variations) &&
    Array.isArray(value.practiceSentences) &&
    isRecord(value.review) &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

const isStoredNotebook = (value: unknown): value is StoredNotebook =>
  isRecord(value) &&
  value.version === NOTEBOOK_SCHEMA_VERSION &&
  isRecord(value.records) &&
  Object.values(value.records).every(isNotebookRecord)

export const createNotebookStorage = (
  storage: NotebookStorageLike,
): NotebookStorage => ({
  load: () => {
    try {
      const serialized = storage.getItem(NOTEBOOK_STORAGE_KEY)
      if (!serialized) return emptyState()
      const parsed: unknown = JSON.parse(serialized)
      return isStoredNotebook(parsed)
        ? { records: parsed.records }
        : emptyState()
    } catch {
      return emptyState()
    }
  },
  save: (state) => {
    try {
      storage.setItem(
        NOTEBOOK_STORAGE_KEY,
        JSON.stringify({
          version: NOTEBOOK_SCHEMA_VERSION,
          records: state.records,
        }),
      )
    } catch {
      // Local persistence is best effort and never fabricates success.
    }
  },
  clear: () => {
    try {
      storage.removeItem(NOTEBOOK_STORAGE_KEY)
    } catch {
      // Clearing local notebook data is best effort.
    }
  },
})

export const createLocalStorageNotebookStorage = (): NotebookStorage => {
  if (typeof window === 'undefined')
    return createNotebookStorage(new UnavailableStorage())
  try {
    return createNotebookStorage(window.localStorage)
  } catch {
    return createNotebookStorage(new UnavailableStorage())
  }
}

class UnavailableStorage implements NotebookStorageLike {
  getItem(): string | null {
    return null
  }
  setItem(): void {}
  removeItem(): void {}
}
