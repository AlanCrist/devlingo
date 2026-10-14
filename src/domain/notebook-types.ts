export type NotebookRecordStatus = 'active' | 'learned' | 'archived'

export interface Meaning {
  id: string
  partOfSpeech?: string
  definitionEn: string
  explanationPt?: string
  exampleEn?: string
}

export interface Pronunciation {
  phoneticText?: string
  audioUrl?: string
}

export interface CorrectionMatch {
  offset: number
  length: number
  message: string
  replacements: string[]
}

export interface CorrectionResult {
  originalText: string
  correctedText?: string
  matches: CorrectionMatch[]
  status: 'correct' | 'has-suggestions' | 'unavailable'
}

export interface PracticeSentence {
  id: string
  text: string
  correction?: CorrectionResult
  createdAt: string
  updatedAt: string
}

export interface ReviewMetadata {
  lastReviewedAt?: string
  reviewCount: number
  lastReviewStagesCompleted: number
}

export interface NotebookRecord {
  id: string
  term: string
  sourceSentence?: string
  status: NotebookRecordStatus
  meanings: Meaning[]
  pronunciation?: Pronunciation
  variations: string[]
  recognitionExamples: string[]
  practiceSentences: PracticeSentence[]
  review: ReviewMetadata
  createdAt: string
  updatedAt: string
}

export interface NotebookState {
  records: Record<string, NotebookRecord>
}

export type EnrichmentStatus = 'complete' | 'partial' | 'unavailable'

export interface EnrichmentResult {
  meanings: Meaning[]
  pronunciation?: Pronunciation
  variations: string[]
  recognitionExamples: string[]
  status: EnrichmentStatus
}

export interface CorrectionProviderResult {
  result: CorrectionResult
  status: 'complete' | 'unavailable'
}

export interface VocabularyEnrichmentProvider {
  lookup(term: string, sourceSentence?: string): Promise<EnrichmentResult>
}

export interface SentenceCorrectionProvider {
  check(sentence: string, language: string): Promise<CorrectionProviderResult>
}

export interface PronunciationPlayer {
  play(term: string, pronunciation?: Pronunciation): Promise<boolean> | boolean
}

export type ReviewStage =
  'meaning-recall' | 'recognition' | 'production' | 'completed'

export interface ReviewSession {
  recordId: string
  stage: ReviewStage
  recognitionSentence?: string
  productionText?: string
}
