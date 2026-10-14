import { describe, expect, it } from 'vitest'

import {
  createNotebookRecord,
  savePracticeSentence,
  setRecordStatus,
} from '../../src/domain/notebook-records'
import {
  getReviewPriority,
  orderForReview,
} from '../../src/domain/notebook-priority'
import { advanceReview, startReview } from '../../src/domain/notebook-review'
import { sentenceContainsTerm } from '../../src/domain/term-matching'

describe('smart notebook domain', () => {
  it('creates contextual records and rejects empty terms', () => {
    expect(createNotebookRecord('   ')).toBeNull()
    const first = createNotebookRecord('run into', 'I ran into an issue.')
    const second = createNotebookRecord(
      'run into',
      'You may run into problems.',
    )

    expect(first?.sourceSentence).toContain('issue')
    expect(second?.id).not.toBe(first?.id)
  })

  it('limits practice sentences and accepts explicit variations', () => {
    const record = createNotebookRecord('deploy')!
    const withVariations = { ...record, variations: ['deployed'] }
    expect(
      sentenceContainsTerm('We deployed the app.', 'deploy', ['deployed']),
    ).toBe(true)
    expect(sentenceContainsTerm('We fixed the app.', 'deploy')).toBe(false)
    const one = savePracticeSentence(
      withVariations,
      'We deploy daily.',
      undefined,
      '00000000-0000-4000-8000-000000000001',
    )!
    const two = savePracticeSentence(
      one,
      'We deployed yesterday.',
      undefined,
      '00000000-0000-4000-8000-000000000002',
    )!
    const three = savePracticeSentence(
      two,
      'We deploy safely.',
      undefined,
      '00000000-0000-4000-8000-000000000003',
    )!
    expect(
      savePracticeSentence(
        three,
        'We deploy again.',
        undefined,
        '00000000-0000-4000-8000-000000000004',
      ),
    ).toBeNull()
  })

  it('orders old active records before learned records and excludes archived records', () => {
    const now = new Date('2026-10-14T00:00:00.000Z')
    const old = createNotebookRecord(
      'old',
      undefined,
      '00000000-0000-4000-8000-000000000011',
      '2026-10-01T00:00:00.000Z',
    )!
    const learned = setRecordStatus(
      createNotebookRecord(
        'learned',
        undefined,
        '00000000-0000-4000-8000-000000000012',
        '2026-10-13T00:00:00.000Z',
      )!,
      'learned',
    )
    const archived = setRecordStatus(
      createNotebookRecord(
        'archived',
        undefined,
        '00000000-0000-4000-8000-000000000013',
        '2026-09-01T00:00:00.000Z',
      )!,
      'archived',
    )

    expect(getReviewPriority(old, now)).toBeGreaterThan(
      getReviewPriority(learned, now),
    )
    expect(
      orderForReview([learned, archived, old], now).map((item) => item.id),
    ).toEqual([
      '00000000-0000-4000-8000-000000000011',
      '00000000-0000-4000-8000-000000000012',
    ])
  })

  it('advances review through meaning, recognition, and production', () => {
    const record = createNotebookRecord(
      'follow up',
      'Please follow up tomorrow.',
    )!
    const session = startReview(record)
    expect(session.stage).toBe('meaning-recall')
    expect(session.recognitionSentence).toContain('follow up')
    expect(advanceReview(session).stage).toBe('recognition')
    expect(advanceReview(advanceReview(session)).stage).toBe('production')
  })
})
