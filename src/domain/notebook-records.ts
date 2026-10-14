import type {
  CorrectionResult,
  EnrichmentResult,
  NotebookRecord,
  NotebookRecordStatus,
  PracticeSentence,
} from './notebook-types'

export const MAX_PRACTICE_SENTENCES = 3

const nowIso = () => new Date().toISOString()

export const normalizeTerm = (value: string): string =>
  value.trim().replace(/\s+/g, ' ')

export const createNotebookRecord = (
  term: string,
  sourceSentence?: string,
  id = crypto.randomUUID(),
  timestamp = nowIso(),
): NotebookRecord | null => {
  const normalizedTerm = normalizeTerm(term)
  if (!normalizedTerm) return null

  const normalizedSource = sourceSentence?.trim()
  return {
    id,
    term: normalizedTerm,
    ...(normalizedSource ? { sourceSentence: normalizedSource } : {}),
    status: 'active',
    meanings: [],
    variations: [],
    recognitionExamples: [],
    practiceSentences: [],
    review: { reviewCount: 0, lastReviewStagesCompleted: 0 },
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export const updateNotebookRecord = (
  record: NotebookRecord,
  changes: { term?: string; sourceSentence?: string },
  timestamp = nowIso(),
): NotebookRecord | null => {
  const term = normalizeTerm(changes.term ?? record.term)
  if (!term) return null
  const sourceSentence = changes.sourceSentence?.trim()
  return {
    ...record,
    term,
    ...(sourceSentence ? { sourceSentence } : { sourceSentence: undefined }),
    updatedAt: timestamp,
  }
}

export const applyEnrichment = (
  record: NotebookRecord,
  enrichment: EnrichmentResult,
  timestamp = nowIso(),
): NotebookRecord => ({
  ...record,
  meanings: enrichment.meanings,
  pronunciation: enrichment.pronunciation,
  variations: enrichment.variations,
  recognitionExamples: enrichment.recognitionExamples,
  updatedAt: timestamp,
})

export const savePracticeSentence = (
  record: NotebookRecord,
  text: string,
  correction?: CorrectionResult,
  sentenceId = crypto.randomUUID(),
  timestamp = nowIso(),
): NotebookRecord | null => {
  const normalizedText = text.trim()
  if (!normalizedText) return null

  const existing = record.practiceSentences.find(
    (item) => item.id === sentenceId,
  )
  if (!existing && record.practiceSentences.length >= MAX_PRACTICE_SENTENCES) {
    return null
  }

  const sentence: PracticeSentence = {
    id: sentenceId,
    text: normalizedText,
    ...(correction ? { correction } : {}),
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
  const practiceSentences = existing
    ? record.practiceSentences.map((item) =>
        item.id === sentenceId ? sentence : item,
      )
    : [...record.practiceSentences, sentence]

  return { ...record, practiceSentences, updatedAt: timestamp }
}

export const setRecordStatus = (
  record: NotebookRecord,
  status: NotebookRecordStatus,
  timestamp = nowIso(),
): NotebookRecord => ({ ...record, status, updatedAt: timestamp })

export const removeNotebookRecord = (
  state: { records: Record<string, NotebookRecord> },
  recordId: string,
) => {
  const records = { ...state.records }
  delete records[recordId]
  return { ...state, records }
}
