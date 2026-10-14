# DevLingo Smart Notebook Technical Plan

## 1. Document Status

- **Specification:** 002-smart-notebook
- **Status:** Approved; implementation tasks pending approval
- **Product:** DevLingo
- **Related specification:** `spec.md`
- **Language:** English

This plan translates the approved functional specification into an implementation approach. It does not authorize implementation until the plan is approved.

## 2. Technical Objectives

The implementation shall:

1. Add the Smart Notebook without coupling it to lesson-progress rules.
2. Preserve the existing MVP behavior and its current persistence data.
3. Keep vocabulary records usable when external enrichment is unavailable.
4. Isolate browser APIs and network integrations behind small interfaces.
5. Make review priority, term matching, and record lifecycle deterministic and testable.
6. Preserve a simple client-side architecture appropriate for the current single-user application.

## 3. Existing Constraints and Baseline

The repository already uses:

- React and TypeScript.
- Vite.
- CSS Modules and shared CSS tokens.
- Local browser persistence behind a storage adapter.
- Vitest, React Testing Library, and Playwright.
- A feature-oriented structure under `src/features` and framework-independent rules under `src/domain`.

The plan extends these conventions instead of introducing a second application architecture.

## 4. Architecture Decisions

### 4.1 Feature Boundary

The notebook will be a peer feature of the existing learning path and lesson feature.

Proposed boundaries:

```text
App shell
├── Learning path feature
├── Lesson feature
└── Smart Notebook feature
      ├── Notebook list and filters
      ├── Record detail and editing
      └── Review session
```

The application shell owns top-level feature selection. Notebook-specific state and behavior stay inside notebook modules unless a rule is intentionally shared.

### 4.2 Domain Rules

Pure domain modules will own:

- record creation and field validation;
- record status transitions;
- practice-sentence slot limits;
- normalized term matching;
- review-stage transitions;
- review-priority calculation;
- notebook filtering and ordering;
- immutable handling of correction results.

Domain modules will not import React, access browser storage, call `fetch`, or call `window.speechSynthesis`.

### 4.3 Persistence Boundary

Notebook data will use a separate versioned storage key from lesson progress. This prevents a notebook schema change from invalidating the existing lesson-progress schema and keeps each domain's migration rules independent.

Proposed storage boundary:

```text
NotebookStorage
├── load(): NotebookState
├── save(state): void
└── clear(): void
```

The browser implementation will remain behind this interface. Missing, malformed, or unsupported data will produce an empty notebook and an observable non-fatal storage status, following the existing progress-storage pattern.

### 4.4 External Capability Boundaries

Language enrichment will not be called directly from React components. The feature will use capability interfaces:

```text
VocabularyEnrichmentProvider
  lookup(term, sourceSentence?) -> Promise<EnrichmentResult>

SentenceCorrectionProvider
  check(sentence, language) -> Promise<CorrectionResult>

PronunciationPlayer
  play(pronunciation) -> void
```

The UI will represent loading, success, unavailable, and error states. A failed lookup or correction must not prevent saving or editing a notebook record.

## 5. Technology Choices

### 5.1 Application and UI

Use the existing React, TypeScript, Vite, CSS Modules, and Vitest/Playwright stack. No new state-management library, router, UI component library, or server framework is needed for this feature.

Notebook navigation will initially be represented by application state rather than URL routing. A router may be introduced later only if the product adds deep links or multiple independent pages.

### 5.2 Persistence

Use versioned `localStorage` through a new notebook storage adapter. The notebook should use a dedicated key such as `devlingo.notebook` and schema version 1.

The storage adapter will serialize only domain data, not transient provider loading states, audio objects, or pending requests.

### 5.3 Pronunciation

Use provider-supplied pronunciation text and audio URLs when available. Use the browser Web Speech API's `SpeechSynthesis` as a local fallback for speaking the term. The fallback is wrapped in `PronunciationPlayer` so unsupported browsers can report an unavailable capability without affecting the rest of the feature.

### 5.4 Meaning Enrichment

Introduce a dictionary provider adapter that normalizes external responses into the application-owned `EnrichmentResult` shape. The first implementation should use a public English dictionary endpoint only if a browser-side proof confirms acceptable CORS behavior, response shape, and usage limits.

The provider must be replaceable. No provider response type may leak into domain types or React components.

The normalized result should support:

- principal definitions;
- part of speech when available;
- English examples when available;
- phonetic text when available;
- pronunciation audio when available;
- explicit term variations when the provider supplies them.

Portuguese support should be represented as optional data. The feature must not fabricate a Portuguese translation when the selected provider does not supply one.

### 5.5 Sentence Correction

Introduce a correction provider adapter. The initial candidate is the public LanguageTool HTTP proofreading endpoint, subject to a small integration spike that verifies browser access, request limits, privacy implications, and the quality of feedback for the intended use.

The adapter must normalize matches into:

- source text;
- character offset and length;
- suggested replacements;
- short explanation;
- provider status.

The UI will highlight matches using offsets and will preserve the user's original sentence separately from the suggested correction.

No API key or secret may be placed in client code. If the selected endpoint requires a proxy, credentials, or a server-side component, that is a scope and architecture change requiring a new approval.

## 6. Domain Model

### 6.1 Notebook State

```text
NotebookState
  records: RecordId -> NotebookRecord
```

### 6.2 Notebook Record

```text
NotebookRecord
  id: string
  term: string
  sourceSentence?: string
  status: "active" | "learned" | "archived"
  meanings: Meaning[]
  pronunciation?: Pronunciation
  variations: string[]
  practiceSentences: PracticeSentence[]
  review: ReviewMetadata
  createdAt: string
  updatedAt: string
```

### 6.3 Enrichment Data

```text
Meaning
  id: string
  partOfSpeech?: string
  definitionEn: string
  explanationPt?: string
  exampleEn?: string

Pronunciation
  phoneticText?: string
  audioUrl?: string

EnrichmentResult
  meanings: Meaning[]
  pronunciation?: Pronunciation
  variations: string[]
  recognitionExamples: string[]
  status: "complete" | "partial" | "unavailable"
```

### 6.4 Practice Sentence and Correction

```text
PracticeSentence
  id: string
  text: string
  correction?: CorrectionResult
  createdAt: string
  updatedAt: string

CorrectionResult
  originalText: string
  correctedText?: string
  matches: CorrectionMatch[]
  status: "correct" | "has-suggestions" | "unavailable"

CorrectionMatch
  offset: number
  length: number
  message: string
  replacements: string[]
```

Correction data is a snapshot associated with the submitted sentence. Editing the sentence invalidates the previous correction result until the new text is checked.

### 6.5 Review Metadata

```text
ReviewMetadata
  lastReviewedAt?: string
  reviewCount: number
  lastReviewStagesCompleted: number
```

The data model may store additional implementation fields if needed, but the feature must preserve the distinction between record editing and review completion.

## 7. Review and Priority Rules

### 7.1 Review Stages

Use a discriminated review state:

```text
ReviewSession
  recordId: string
  stage: "meaning-recall" | "recognition" | "production" | "completed"
  recognitionSentence?: string
  productionText?: string
```

Meaning recall is a reveal/check interaction rather than a free-form answer in the first implementation. Recognition uses a source sentence first, then a provider example, then a saved practice sentence. If no sentence is available, the UI must explain that recognition is unavailable and offer the user a path to add a sentence; it must not display an invented example.

Production submits a new sentence through the same term-matching and correction flow used by record practice.

### 7.2 Term Matching

The first deterministic matcher will:

1. normalize case, whitespace, and surrounding punctuation;
2. match the exact term as a token or phrase;
3. match explicitly provided variations;
4. support common inflection variations only when they are supplied by enrichment data or an explicit local rule.

The matcher must not claim that an arbitrary semantically related word is a valid variation. This keeps validation predictable and prevents false positives.

### 7.3 Priority

Use a deterministic score based on age and status:

```text
ageDays = max(0, floor((now - lastActivityAt) / oneDay))
statusWeight = active: 1.0, learned: 0.35, archived: 0
priority = statusWeight * (1 + ageDays)
```

For a never-reviewed record, `lastActivityAt` is `createdAt`. Archived records are excluded before scoring. Ties are broken by oldest `updatedAt`, then stable record ID.

`lastActivityAt` is the most recent of creation, meaningful record edit, or completed review. Merely opening a record does not reset priority.

This formula is intentionally simple, explainable, and replaceable through a pure domain function.

## 8. Provider and Failure Handling

### 8.1 Lookup Lifecycle

When a record is opened, the UI may request enrichment if the record has missing or stale enrichment data. The record is saved independently of the request.

Provider responses are normalized before being stored. A partial result may update only the fields it supplies, preserving user-authored fields.

### 8.2 Failure States

- Network failure: preserve the record and show an unavailable state.
- Invalid provider response: discard the response and show unavailable state.
- Rate limit: show a retryable unavailable state without blocking editing.
- Missing pronunciation: show text when available and disable or hide audio playback.
- Missing correction: preserve the sentence and indicate that it was not checked.
- Storage failure: keep the current in-memory interaction usable and communicate that persistence may not have completed.

No failure state may fabricate a meaning, correction, pronunciation, or successful save.

## 9. Proposed Repository Structure

```text
src/
├── domain/
│   ├── notebook-types.ts
│   ├── notebook-records.ts
│   ├── notebook-priority.ts
│   ├── notebook-review.ts
│   └── term-matching.ts
├── features/
│   └── smart-notebook/
│       ├── SmartNotebookView.tsx
│       ├── SmartNotebookView.module.css
│       ├── NotebookList.tsx
│       ├── NotebookRecordView.tsx
│       ├── NotebookReview.tsx
│       └── notebook-ui-types.ts
├── enrichment/
│   ├── enrichment-types.ts
│   ├── dictionary-provider.ts
│   ├── correction-provider.ts
│   └── pronunciation-player.ts
└── persistence/
    └── notebook-storage.ts

tests/
├── unit/
│   ├── notebook-records.test.ts
│   ├── notebook-priority.test.ts
│   ├── notebook-review.test.ts
│   ├── term-matching.test.ts
│   └── notebook-storage.test.ts
├── integration/
│   └── smart-notebook.test.tsx
└── e2e/
    └── smart-notebook.spec.ts
```

Names may be adjusted to match repository conventions, but the domain, feature, provider, and persistence boundaries should remain recognizable.

## 10. UI and Interaction Plan

### 10.1 Application Entry

Add a notebook entry point to the existing application shell. The learning-path and lesson flows must remain reachable and unchanged.

### 10.2 Notebook List

The list should provide:

- quick-add form with term and optional source sentence;
- search by term;
- filters for active, learned, and archived records;
- priority-oriented ordering for active records;
- context previews for duplicate terms;
- clear empty, loading, and unavailable states.

### 10.3 Record View

The record view should provide:

- term and source context;
- meanings and pronunciation;
- audio action with accessible label;
- three practice-sentence slots;
- correction result separated from original text;
- start-review action;
- learned, archive/restore, edit, and remove actions.

Permanent removal must use an explicit confirmation step.

### 10.4 Review View

The review view should show one stage at a time, identify the current stage, and provide a clear next action. It should not expose later production controls before the user reaches the production stage.

## 11. Testing Strategy

### 11.1 Unit Tests

Cover:

- empty-term rejection;
- creation with and without source sentence;
- separate records for separate contexts;
- practice-sentence limit of three;
- exact and configured variation matching;
- lifecycle transitions;
- permanent removal;
- priority ordering and learned weighting;
- review stage transitions;
- source/example/practice sentence selection;
- malformed notebook-state rejection;
- correction-result preservation and invalidation after edits.

### 11.2 Provider Tests

Provider adapters will be tested with mocked `fetch` responses and browser capability mocks. Tests must cover valid, partial, malformed, network-error, and rate-limit responses without making live network calls.

The integration spike for any public endpoint should be a separate manual or opt-in check and must not be required for the normal test suite.

### 11.3 Integration Tests

Cover:

- opening the notebook from the app shell;
- quick save and list update;
- duplicate-term contexts;
- record editing and persistence;
- filtering active, learned, and archived records;
- practice sentence validation;
- correction display;
- review sequence;
- graceful enrichment failure;
- permanent removal confirmation.

### 11.4 End-to-End Tests

Add a Playwright flow that:

1. opens the notebook;
2. saves a term with an optional source sentence;
3. opens the record;
4. adds a valid practice sentence;
5. rejects an invalid sentence;
6. starts and completes the three-stage review;
7. marks the record learned and verifies reduced-priority labeling;
8. archives and restores the record;
9. confirms permanent removal.

External provider calls should be intercepted or replaced with deterministic fixtures in E2E tests.

### 11.5 Accessibility and Responsive Checks

Verify keyboard operation, labels, focus behavior, status announcements for correction/loading states, audio-button labels, confirmation-dialog semantics, and usability at the existing desktop and mobile breakpoints.

## 12. Implementation Sequence

1. Add framework-independent notebook types and invariants.
2. Add deterministic record, lifecycle, matching, priority, and review domain rules.
3. Add versioned notebook persistence and malformed-data handling.
4. Add the app-shell entry point and static notebook list with quick capture.
5. Add record detail, editing, practice-sentence validation, and lifecycle actions.
6. Add provider interfaces and mocked adapters.
7. Add the first dictionary and correction provider integrations after the browser-access and privacy spike passes.
8. Add pronunciation playback with provider audio and browser speech fallback.
9. Add the three-stage review session.
10. Add unit, integration, and E2E coverage.
11. Apply responsive and accessibility refinements.
12. Run the complete quality gate and manually verify provider-unavailable behavior.

## 13. Risks and Mitigations

### External API availability

Public services may change, rate-limit requests, reject browser origins, or become unavailable. Keep providers behind interfaces, cache normalized results, and make enrichment optional to basic notebook use.

### Privacy of user sentences

Source and practice sentences may contain proprietary development context. Do not send text to an external provider without an explicit product decision and clear UI indication. A provider integration must document what is sent and provide an unavailable path.

### Browser speech differences

Speech voices vary by operating system and browser. Treat speech synthesis as a best-effort fallback and keep provider audio as the preferred option when available.

### Ambiguous term variations

Inflection and derivation rules can produce false positives. Prefer exact matches and provider/local explicit variations over broad linguistic heuristics.

### Data growth

Local storage is sufficient for the current personal scope, but large enrichment payloads may exceed browser limits. Store only normalized fields and avoid saving raw provider responses.

### Destructive removal

Permanent deletion cannot be recovered. Require explicit confirmation and make the consequence visible before the final action.

## 14. Validation Gate Before Implementation

Before implementation begins, the following must be approved:

- this technical plan;
- the decision to use separate notebook persistence;
- the provider-boundary and failure strategy;
- the initial review-priority formula;
- the privacy rule for sending user sentences to external services;
- the implementation sequence.

No implementation task should begin until this plan is approved. After approval, a separate task document may decompose the plan into executable work items.

## 15. Technical References

- MDN, SpeechSynthesis Web API: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- LanguageTool HTTP API documentation: https://languagetool.org/http-api/
- LanguageTool public HTTP API documentation: https://dev.languagetool.org/public-http-api.html
