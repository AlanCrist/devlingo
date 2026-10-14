import { describe, expect, it } from 'vitest'

import { createNotebookStorage } from '../../src/persistence/notebook-storage'

const createMemoryStorage = () => {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe('notebook storage', () => {
  it('round trips notebook state and handles malformed values safely', () => {
    const memory = createMemoryStorage()
    const storage = createNotebookStorage(memory)
    const state = { records: {} }

    storage.save(state)
    expect(storage.load()).toEqual(state)

    memory.setItem('devlingo.notebook', '{not-json')
    expect(storage.load()).toEqual({ records: {} })
  })
})
