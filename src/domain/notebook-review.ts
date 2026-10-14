import type {
  NotebookRecord,
  ReviewSession,
  ReviewStage,
} from './notebook-types'

const stages: ReviewStage[] = [
  'meaning-recall',
  'recognition',
  'production',
  'completed',
]

export const selectRecognitionSentence = (
  record: NotebookRecord,
): string | undefined =>
  record.sourceSentence ||
  record.recognitionExamples[0] ||
  record.practiceSentences[0]?.text

export const startReview = (record: NotebookRecord): ReviewSession => ({
  recordId: record.id,
  stage: 'meaning-recall',
  recognitionSentence: selectRecognitionSentence(record),
})

export const advanceReview = (session: ReviewSession): ReviewSession => {
  const index = stages.indexOf(session.stage)
  const nextStage = stages[Math.min(index + 1, stages.length - 1)]
  return { ...session, stage: nextStage }
}

export const completeReview = (
  record: NotebookRecord,
  completedAt = new Date().toISOString(),
): NotebookRecord => ({
  ...record,
  review: {
    lastReviewedAt: completedAt,
    reviewCount: record.review.reviewCount + 1,
    lastReviewStagesCompleted: 3,
  },
  updatedAt: completedAt,
})
