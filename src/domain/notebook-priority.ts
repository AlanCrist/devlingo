import type { NotebookRecord } from './notebook-types'

const DAY_MS = 24 * 60 * 60 * 1000

const statusWeight: Record<NotebookRecord['status'], number> = {
  active: 1,
  learned: 0.35,
  archived: 0,
}

export const getLastActivityAt = (record: NotebookRecord): string =>
  record.review.lastReviewedAt &&
  record.review.lastReviewedAt > record.updatedAt
    ? record.review.lastReviewedAt
    : record.updatedAt

export const getReviewPriority = (
  record: NotebookRecord,
  now = new Date(),
): number => {
  if (record.status === 'archived') return 0
  const elapsed = Math.max(
    0,
    now.getTime() - new Date(getLastActivityAt(record)).getTime(),
  )
  const ageDays = Math.floor(elapsed / DAY_MS)
  return statusWeight[record.status] * (1 + ageDays)
}

export const orderForReview = (
  records: NotebookRecord[],
  now = new Date(),
): NotebookRecord[] =>
  records
    .filter((record) => record.status !== 'archived')
    .slice()
    .sort((left, right) => {
      const priorityDifference =
        getReviewPriority(right, now) - getReviewPriority(left, now)
      if (priorityDifference !== 0) return priorityDifference
      const dateDifference =
        new Date(getLastActivityAt(left)).getTime() -
        new Date(getLastActivityAt(right)).getTime()
      return dateDifference || left.id.localeCompare(right.id)
    })
