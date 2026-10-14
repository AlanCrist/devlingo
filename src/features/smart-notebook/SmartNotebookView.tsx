import { useEffect, useMemo, useRef, useState } from 'react'

import {
  applyEnrichment,
  createNotebookRecord,
  removeNotebookRecord,
  savePracticeSentence,
  setRecordStatus,
  updateNotebookRecord,
} from '../../domain/notebook-records'
import { orderForReview } from '../../domain/notebook-priority'
import {
  advanceReview,
  completeReview,
  startReview,
} from '../../domain/notebook-review'
import { sentenceContainsTerm } from '../../domain/term-matching'
import type {
  NotebookRecord,
  NotebookState,
  ReviewSession,
} from '../../domain/notebook-types'
import { DictionaryApiProvider } from '../../enrichment/dictionary-provider'
import { LanguageToolCorrectionProvider } from '../../enrichment/correction-provider'
import { BrowserPronunciationPlayer } from '../../enrichment/pronunciation-player'
import styles from './SmartNotebookView.module.css'

interface SmartNotebookViewProps {
  state: NotebookState
  onChange: (state: NotebookState) => void
}

type Filter = 'active' | 'learned' | 'archived'

const dictionaryProvider = new DictionaryApiProvider()
const correctionProvider = new LanguageToolCorrectionProvider()
const pronunciationPlayer = new BrowserPronunciationPlayer()

const replaceRecord = (
  state: NotebookState,
  record: NotebookRecord,
): NotebookState => ({
  records: { ...state.records, [record.id]: record },
})

export function SmartNotebookView({ state, onChange }: SmartNotebookViewProps) {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null)
  const [review, setReview] = useState<ReviewSession | null>(null)
  const [filter, setFilter] = useState<Filter>('active')
  const [search, setSearch] = useState('')
  const stateRef = useRef(state)
  stateRef.current = state
  const records = Object.values(state.records)
  const selectedRecord = selectedRecordId
    ? state.records[selectedRecordId]
    : undefined

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const filtered = records.filter(
      (record) =>
        record.status === filter &&
        (!query || record.term.toLocaleLowerCase().includes(query)),
    )
    return filter === 'archived'
      ? filtered.sort((left, right) =>
          right.updatedAt.localeCompare(left.updatedAt),
        )
      : orderForReview(filtered)
  }, [filter, records, search])

  const update = (record: NotebookRecord) => {
    const nextState = replaceRecord(stateRef.current, record)
    stateRef.current = nextState
    onChange(nextState)
  }

  const handleCreate = (term: string, sourceSentence: string) => {
    const record = createNotebookRecord(term, sourceSentence)
    if (!record) return false
    update(record)
    setSelectedRecordId(record.id)
    setFilter('active')
    return true
  }

  const handleRemove = (record: NotebookRecord) => {
    const nextState = removeNotebookRecord(stateRef.current, record.id)
    stateRef.current = nextState
    onChange(nextState)
    setSelectedRecordId(null)
    setReview(null)
  }

  if (review && selectedRecord) {
    return (
      <ReviewPanel
        record={selectedRecord}
        session={review}
        onChange={setReview}
        onComplete={(completed) => {
          update(completed)
          setReview(null)
        }}
        onBack={() => setReview(null)}
      />
    )
  }

  if (selectedRecord) {
    return (
      <RecordPanel
        record={selectedRecord}
        onChange={update}
        onEnrich={(enrichment) => {
          const current = stateRef.current.records[selectedRecord.id]
          if (current) update(applyEnrichment(current, enrichment))
        }}
        onBack={() => setSelectedRecordId(null)}
        onRemove={() => handleRemove(selectedRecord)}
        onStartReview={() => setReview(startReview(selectedRecord))}
      />
    )
  }

  return (
    <section aria-labelledby="notebook-title">
      <div className={styles.introduction}>
        <div>
          <p className={styles.sectionLabel}>Personal vocabulary</p>
          <h2 id="notebook-title">Smart Notebook</h2>
        </div>
        <p className={styles.supportingText}>
          Save words now, understand them later, and practice using them.
        </p>
      </div>

      <QuickAdd onCreate={handleCreate} />

      <div className={styles.toolbar}>
        <label>
          <span className={styles.visuallyHidden}>Search notebook</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a word or expression"
          />
        </label>
        <div className={styles.filters} aria-label="Notebook filters">
          {(['active', 'learned', 'archived'] as Filter[]).map((value) => (
            <button
              className={filter === value ? styles.filterActive : styles.filter}
              key={value}
              type="button"
              onClick={() => setFilter(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {visibleRecords.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>No {filter} records yet</h3>
          <p>
            Use the form above to save a word or expression you want to learn.
          </p>
        </div>
      ) : (
        <div className={styles.recordList}>
          {visibleRecords.map((record) => (
            <button
              className={styles.recordCard}
              key={record.id}
              type="button"
              onClick={() => setSelectedRecordId(record.id)}
            >
              <span className={styles.recordTerm}>{record.term}</span>
              <span className={styles.recordContext}>
                {record.sourceSentence || 'No source sentence added yet.'}
              </span>
              <span className={styles.recordMeta}>
                {record.practiceSentences.length}/3 practice sentences ·{' '}
                {record.meanings.length
                  ? `${record.meanings.length} meanings`
                  : 'Meaning pending'}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function QuickAdd({
  onCreate,
}: {
  onCreate: (term: string, sentence: string) => boolean
}) {
  const [term, setTerm] = useState('')
  const [sentence, setSentence] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!onCreate(term, sentence)) {
      setMessage('Enter a word or expression before saving.')
      return
    }
    setTerm('')
    setSentence('')
    setMessage(null)
  }

  return (
    <form className={styles.quickAdd} onSubmit={submit}>
      <div>
        <label htmlFor="notebook-term">Word or expression</label>
        <input
          id="notebook-term"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="e.g. run into"
        />
      </div>
      <div>
        <label htmlFor="notebook-context">Source sentence (optional)</label>
        <input
          id="notebook-context"
          value={sentence}
          onChange={(event) => setSentence(event.target.value)}
          placeholder="Where did you find it?"
        />
      </div>
      <button className={styles.primaryButton} type="submit">
        Save term
      </button>
      {message && <p className={styles.validationMessage}>{message}</p>}
    </form>
  )
}

function RecordPanel({
  record,
  onChange,
  onEnrich,
  onBack,
  onRemove,
  onStartReview,
}: {
  record: NotebookRecord
  onChange: (record: NotebookRecord) => void
  onEnrich: (
    enrichment: Awaited<ReturnType<typeof dictionaryProvider.lookup>>,
  ) => void
  onBack: () => void
  onRemove: () => void
  onStartReview: () => void
}) {
  const [term, setTerm] = useState(record.term)
  const [source, setSource] = useState(record.sourceSentence ?? '')
  const [loading, setLoading] = useState(false)
  const [enrichmentMessage, setEnrichmentMessage] = useState<string | null>(
    null,
  )
  const [practiceText, setPracticeText] = useState('')
  const [correctionLoading, setCorrectionLoading] = useState(false)
  const [draftCorrection, setDraftCorrection] = useState<string | null>(null)
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current || record.meanings.length) return
    requested.current = true
    setLoading(true)
    void dictionaryProvider.lookup(record.term).then((enrichment) => {
      onEnrich(enrichment)
      setEnrichmentMessage(
        enrichment.status === 'unavailable'
          ? 'Meanings are currently unavailable. You can still save and practice this record.'
          : null,
      )
      setLoading(false)
    })
    // The request intentionally runs once when a record is opened.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id])

  const saveDetails = () => {
    const updated = updateNotebookRecord(record, {
      term,
      sourceSentence: source,
    })
    if (updated) onChange(updated)
  }

  const submitPractice = async () => {
    if (!sentenceContainsTerm(practiceText, record.term, record.variations)) {
      setDraftCorrection(
        'Use the saved term or one of its valid variations in the sentence.',
      )
      return
    }
    setCorrectionLoading(true)
    const correction = await correctionProvider.check(practiceText, 'en-US')
    const updated = savePracticeSentence(
      record,
      practiceText,
      correction.result,
    )
    if (updated) {
      onChange(updated)
      setPracticeText('')
      setDraftCorrection(null)
    }
    setCorrectionLoading(false)
  }

  const changeStatus = (status: 'active' | 'learned' | 'archived') =>
    onChange(setRecordStatus(record, status))

  return (
    <section aria-labelledby="record-title">
      <button className={styles.backButton} type="button" onClick={onBack}>
        ← Back to notebook
      </button>
      <div className={styles.detailHeader}>
        <div>
          <p className={styles.sectionLabel}>Notebook record</p>
          <h2 id="record-title">{record.term}</h2>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            type="button"
            onClick={onStartReview}
          >
            Start review
          </button>
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              changeStatus(record.status === 'learned' ? 'active' : 'learned')
            }
          >
            {record.status === 'learned' ? 'Mark active' : 'Mark learned'}
          </button>
          {record.status === 'archived' ? (
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => changeStatus('active')}
            >
              Restore
            </button>
          ) : (
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => changeStatus('archived')}
            >
              Archive
            </button>
          )}
          <button
            className={styles.dangerButton}
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Remove this record permanently? This cannot be undone.',
                )
              )
                onRemove()
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <div className={styles.detailGrid}>
        <div className={styles.card}>
          <h3>Context</h3>
          <label htmlFor="record-term">Term</label>
          <input
            id="record-term"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <label htmlFor="record-source">Source sentence</label>
          <textarea
            id="record-source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
          />
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={saveDetails}
          >
            Save context
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeading}>
            <h3>Meaning and pronunciation</h3>
            {loading && <span className={styles.muted}>Loading…</span>}
          </div>
          {enrichmentMessage && (
            <p className={styles.warning}>{enrichmentMessage}</p>
          )}
          {record.meanings.length ? (
            <ol className={styles.meanings}>
              {record.meanings.map((meaning) => (
                <li key={meaning.id}>
                  <strong>{meaning.partOfSpeech ?? 'Usage'}</strong>{' '}
                  {meaning.definitionEn}
                  {meaning.explanationPt && (
                    <small>{meaning.explanationPt}</small>
                  )}
                  {meaning.exampleEn && <em>{meaning.exampleEn}</em>}
                </li>
              ))}
            </ol>
          ) : (
            <p className={styles.muted}>No meanings available yet.</p>
          )}
          {record.pronunciation?.phoneticText && (
            <p>Pronunciation: {record.pronunciation.phoneticText}</p>
          )}
          <button
            className={styles.secondaryButton}
            type="button"
            onClick={() =>
              pronunciationPlayer.play(record.term, record.pronunciation)
            }
          >
            🔊 Play pronunciation
          </button>
        </div>

        <div className={styles.card}>
          <h3>Practice sentences</h3>
          <p className={styles.muted}>
            Write up to three sentences using this term or a valid variation.
          </p>
          <div className={styles.practiceList}>
            {record.practiceSentences.map((sentence) => (
              <div className={styles.practiceItem} key={sentence.id}>
                <p>{sentence.text}</p>
                {sentence.correction?.status === 'has-suggestions' && (
                  <div className={styles.warning}>
                    <strong>Suggestion:</strong>{' '}
                    {sentence.correction.correctedText}
                    {sentence.correction.matches.map((match) => (
                      <small key={`${sentence.id}-${match.offset}`}>
                        {match.message}
                      </small>
                    ))}
                  </div>
                )}
                {sentence.correction?.status === 'correct' && (
                  <p className={styles.success}>No correction was found.</p>
                )}
              </div>
            ))}
          </div>
          {record.practiceSentences.length < 3 && (
            <div className={styles.practiceComposer}>
              <textarea
                value={practiceText}
                onChange={(event) => setPracticeText(event.target.value)}
                placeholder="Write your sentence in English"
              />
              <button
                className={styles.primaryButton}
                type="button"
                disabled={correctionLoading}
                onClick={() => void submitPractice()}
              >
                {correctionLoading ? 'Checking…' : 'Check and save'}
              </button>
              {draftCorrection && (
                <p className={styles.validationMessage}>{draftCorrection}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ReviewPanel({
  record,
  session,
  onChange,
  onComplete,
  onBack,
}: {
  record: NotebookRecord
  session: ReviewSession
  onChange: (session: ReviewSession) => void
  onComplete: (record: NotebookRecord) => void
  onBack: () => void
}) {
  const [production, setProduction] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const next = () => onChange(advanceReview(session))

  const submitProduction = async () => {
    if (!sentenceContainsTerm(production, record.term, record.variations)) {
      setMessage('Use the saved term or one of its valid variations.')
      return
    }
    setChecking(true)
    const correction = await correctionProvider.check(production, 'en-US')
    const updated = savePracticeSentence(record, production, correction.result)
    if (updated) {
      onComplete(completeReview(updated))
    } else {
      onComplete(completeReview(record))
    }
    setChecking(false)
  }

  return (
    <section aria-labelledby="review-title">
      <button className={styles.backButton} type="button" onClick={onBack}>
        ← Exit review
      </button>
      <div className={styles.reviewCard}>
        <p className={styles.sectionLabel}>Review · {record.term}</p>
        <h2 id="review-title">
          {session.stage === 'meaning-recall' && '1. Remember the meaning'}
          {session.stage === 'recognition' && '2. Recognize the term'}
          {session.stage === 'production' && '3. Produce a sentence'}
        </h2>
        {session.stage === 'meaning-recall' && (
          <>
            <p>Think of the meaning before revealing the principal meanings.</p>
            <ol className={styles.meanings}>
              {record.meanings.map((meaning) => (
                <li key={meaning.id}>{meaning.definitionEn}</li>
              ))}
            </ol>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={next}
            >
              I’m ready
            </button>
          </>
        )}
        {session.stage === 'recognition' && (
          <>
            {session.recognitionSentence ? (
              <blockquote>{session.recognitionSentence}</blockquote>
            ) : (
              <p className={styles.warning}>
                Add a source or practice sentence to enable recognition.
              </p>
            )}
            <p>
              What does <strong>{record.term}</strong> mean in this sentence?
            </p>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={next}
            >
              Continue to production
            </button>
          </>
        )}
        {session.stage === 'production' && (
          <>
            <p>
              Write a new sentence using <strong>{record.term}</strong> or a
              valid variation.
            </p>
            <textarea
              value={production}
              onChange={(event) => setProduction(event.target.value)}
            />
            <button
              className={styles.primaryButton}
              type="button"
              disabled={checking}
              onClick={() => void submitProduction()}
            >
              {checking ? 'Checking…' : 'Submit sentence'}
            </button>
            {message && <p className={styles.validationMessage}>{message}</p>}
          </>
        )}
      </div>
    </section>
  )
}
