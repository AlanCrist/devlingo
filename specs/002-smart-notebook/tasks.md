# DevLingo Smart Notebook Task Breakdown

## 1. Document Status

- **Specification:** 002-smart-notebook
- **Technical plan:** `plan.md`
- **Status:** Implemented; validation complete with Firefox environment limitation
- **Language:** English
- **Scope:** Approved Smart Notebook specification and technical plan only

This document decomposes the approved functional specification and technical plan into incremental implementation tasks. Implementation began after this task breakdown was approved.

Implementation has now been authorized and completed for the scoped feature. The task descriptions below remain the execution record; all implementation tasks were completed unless a validation note states otherwise.

## 2. Task Conventions

- `SN-TB` means Smart Notebook Task Breakdown.
- Dependencies identify tasks that must be completed first.
- Tests belong to the task that introduces the behavior they verify.
- Tasks may be parallelized only when they own separate responsibilities and files.
- No task may introduce behavior outside the approved specification.
- External provider integration must remain optional and must not block local notebook behavior.

## 3. Phase 1 — Implementation Inputs and Integration Spikes

### SN-TB-001 — Confirm provider and privacy inputs

**Objective:** Resolve implementation inputs that affect provider integration without changing product scope.

**Scope:**

- Verify browser access, response shape, and practical limits for the selected dictionary endpoint.
- Verify browser access, request limits, and correction quality for the selected LanguageTool endpoint.
- Document whether source and practice sentences may be sent to each provider.
- Confirm the browser support baseline for `SpeechSynthesis`.
- Record fallback behavior if either provider is unavailable or unsuitable.

**Dependencies:** None.

**Completion criteria:**

- Provider access and privacy findings are recorded.
- No secrets or credentials are required in browser code.
- The selected providers can be replaced without changing domain contracts.
- Any failed provider assumption is resolved by selecting a different adapter strategy or explicitly deferring that capability without blocking local notebook use.

**Traceability:** Plan sections 5.3–5.5, 8, and 13; Specification FR-005, FR-007, EC-007 through EC-009.

**Task status:** Proposed.

## 4. Phase 2 — Domain Contracts and Deterministic Rules

### SN-TB-002 — Define notebook domain types

**Objective:** Create framework-independent contracts for notebook records, enrichment, correction, and review state.

**Scope:**

- Define `NotebookState`, `NotebookRecord`, record status, meanings, pronunciation, practice sentences, corrections, and review metadata.
- Define provider result and capability-status types.
- Define stable record and child-item identifiers.
- Keep browser and provider response types outside the domain model.

**Dependencies:** None.

**Completion criteria:**

- Types represent all persisted fields required by the approved specification and plan.
- Practice sentence collections can represent zero through three items.
- Correction results preserve original text separately from corrected text.
- Types do not import React, browser APIs, or provider SDK types.
- Type checking passes.

**Traceability:** Specification Domain Model and FR-001 through FR-014; Plan sections 4, 6, and 9.

**Task status:** Proposed.

**Parallelization:** May run in parallel with SN-TB-001.

### SN-TB-003 — Implement notebook record and lifecycle rules

**Objective:** Implement pure rules for creating, editing, learning, archiving, restoring, and removing records.

**Scope:**

- Reject empty terms after normalization.
- Create records with optional source sentences.
- Preserve separate records for different contexts.
- Enforce the maximum of three practice sentences.
- Update timestamps for meaningful edits.
- Implement learned, archived, restored, and permanently removed transitions.
- Ensure removal cannot be undone through the domain API.

**Dependencies:** SN-TB-002.

**Completion criteria:**

- Rules have no UI, storage, or network dependencies.
- Unit tests cover valid creation, empty terms, duplicate terms, context separation, slot limits, lifecycle transitions, and permanent removal.
- Archived records retain their content when restored.
- Learned records remain available for later review.

**Traceability:** Specification FR-002, FR-003, FR-006, FR-010 through FR-012, FR-014; BR-001 through BR-004 and BR-010 through BR-014; EC-001 through EC-005 and EC-010 through EC-012.

**Task status:** Proposed.

### SN-TB-004 — Implement term matching and review priority

**Objective:** Implement deterministic validation for term usage and ordering for review.

**Scope:**

- Normalize case, whitespace, and punctuation.
- Match exact terms and explicitly supplied variations.
- Support only documented local inflection rules, if retained after implementation review.
- Implement the approved age/status priority formula.
- Exclude archived records before scoring.
- Add stable tie-breaking.

**Dependencies:** SN-TB-002.

**Completion criteria:**

- Unit tests cover exact terms, phrases, punctuation, case differences, valid configured variations, and invalid unrelated words.
- Unit tests cover new, active, learned, and archived priority behavior.
- Priority results are deterministic for a supplied clock value.
- Opening a record alone does not change its priority timestamp.

**Traceability:** Specification FR-006, FR-009, FR-010, BR-007, BR-010, BR-011; Plan sections 7.2 and 7.3.

**Task status:** Proposed.

**Parallelization:** May run in parallel with SN-TB-003 after SN-TB-002.

### SN-TB-005 — Implement review-session rules

**Objective:** Implement the three-stage review state machine.

**Scope:**

- Implement `meaning-recall`, `recognition`, `production`, and `completed` stages.
- Select recognition sentences in the defined source/example/practice order.
- Represent unavailable recognition data without inventing a sentence.
- Accept production sentences using the term matcher.
- Update review metadata only after a completed review.

**Dependencies:** SN-TB-004.

**Completion criteria:**

- Unit tests prove the required stage order.
- Unit tests cover recognition-source selection and unavailable recognition data.
- Production rejects invalid term usage and accepts configured variations.
- Interrupted sessions are not marked completed.
- Completed sessions update review metadata exactly once.

**Traceability:** Specification FR-008, BR-013, BR-014, EC-013, and EC-014; Acceptance Criteria AC-008 through AC-011; Plan section 7.1.

**Task status:** Proposed.

## 5. Phase 3 — Persistence and Capability Adapters

### SN-TB-006 — Implement versioned notebook persistence

**Objective:** Persist notebook records independently from lesson progress.

**Scope:**

- Add a dedicated notebook storage key and schema version.
- Implement load, save, and clear operations behind `NotebookStorage`.
- Validate stored records and discard malformed or unsupported data safely.
- Preserve normalized enrichment and correction data without raw provider responses.
- Ensure storage failures do not fabricate successful persistence.

**Dependencies:** SN-TB-002 and SN-TB-003.

**Completion criteria:**

- Unit tests cover empty storage, round trips, malformed JSON, malformed records, unsupported versions, and storage exceptions.
- Existing lesson progress storage behavior remains unchanged.
- Notebook data survives normal reloads in the same browser profile.
- The domain and features do not call `localStorage` directly.

**Traceability:** Specification FR-001 through FR-014 and EC-014; Plan sections 4.3, 8.2, and 13.

**Task status:** Proposed.

### SN-TB-007 — Implement enrichment and correction contracts

**Objective:** Add provider interfaces and deterministic normalization without coupling the UI to external response shapes.

**Scope:**

- Define dictionary, correction, and pronunciation capability interfaces.
- Implement mocked or fixture-backed adapters for tests.
- Normalize complete, partial, malformed, unavailable, and rate-limited responses.
- Preserve explicit provider status values.
- Do not make live network requests from the automated test suite.

**Dependencies:** SN-TB-001 and SN-TB-002.

**Completion criteria:**

- Provider response types are isolated from domain and UI types.
- Unit tests cover successful, partial, malformed, unavailable, and failed responses.
- No API key or secret is present in source code.
- The notebook remains usable when all providers return unavailable.

**Traceability:** Specification FR-004, FR-005, FR-007, EC-007 through EC-009; Plan sections 4.4, 5, and 8.

**Task status:** Proposed.

**Parallelization:** May run in parallel with SN-TB-006 after SN-TB-001 and SN-TB-002.

### SN-TB-008 — Implement pronunciation playback

**Objective:** Support provider audio and browser speech fallback through `PronunciationPlayer`.

**Scope:**

- Play provider audio when available.
- Fall back to browser speech synthesis when supported.
- Expose unavailable and playback-error states.
- Keep audio controls accessible and cancelable where browser behavior allows.

**Dependencies:** SN-TB-001, SN-TB-007.

**Completion criteria:**

- Unit tests cover provider audio, speech fallback, unsupported browser capability, and playback failure.
- The player is not called directly by domain rules.
- The UI can disable or explain unavailable audio without blocking record study.

**Traceability:** Specification FR-005, EC-008, AC-004 and AC-005; Plan sections 5.3 and 13.

**Task status:** Proposed.

## 6. Phase 4 — Notebook User Interface

### SN-TB-009 — Add Smart Notebook entry point and list

**Objective:** Make the notebook reachable from the existing app shell and implement the list experience.

**Scope:**

- Add notebook navigation without breaking learning-path and lesson flows.
- Render quick-add form for term and optional source sentence.
- Render records ordered by priority.
- Add search by term.
- Add active, learned, and archived filters.
- Render empty, malformed-data, and unavailable-provider states.

**Dependencies:** SN-TB-003, SN-TB-004, SN-TB-006.

**Completion criteria:**

- Integration tests cover navigation, quick save, list update, search, filtering, and persistence restoration.
- Empty terms are rejected in the UI with an understandable message.
- Different contexts for the same term are distinguishable.
- Existing MVP lesson navigation remains functional.

**Traceability:** Specification FR-001, FR-002, FR-003, FR-009, FR-013; Acceptance Criteria AC-001 through AC-003 and AC-015; Plan section 10.1 and 10.2.

**Task status:** Proposed.

### SN-TB-010 — Add record detail and editing

**Objective:** Implement the record study and editing experience.

**Scope:**

- Display term, source sentence, meanings, pronunciation text, and available examples.
- Add audio playback control.
- Add up to three practice-sentence slots.
- Validate term usage and show correction results separately from user text.
- Add edit, learned, archive/restore, and permanent-remove actions.
- Add explicit removal confirmation.

**Dependencies:** SN-TB-005, SN-TB-007, SN-TB-008, SN-TB-009.

**Completion criteria:**

- Integration tests cover the full record-detail behavior.
- The UI supports zero, one, two, and three practice sentences.
- Invalid term usage is rejected without losing the user's draft.
- Correction errors and unavailable states are visible without fabricating correctness.
- Learned and archived records preserve data as specified.
- Removal cancellation leaves the record unchanged; confirmed removal removes it permanently.

**Traceability:** Specification FR-004 through FR-007, FR-010 through FR-012, FR-014; Acceptance Criteria AC-004 through AC-009 and AC-012 through AC-014; Plan section 10.3.

**Task status:** Proposed.

### SN-TB-011 — Add the three-stage review interface

**Objective:** Implement the user-facing review sequence for one contextual record.

**Scope:**

- Render one review stage at a time.
- Show stage progress and clear next actions.
- Implement meaning recall, recognition, and production interactions.
- Integrate correction feedback into production.
- Complete the review and update priority metadata.
- Handle unavailable recognition examples with a path back to record editing.

**Dependencies:** SN-TB-005, SN-TB-009, SN-TB-010.

**Completion criteria:**

- Integration tests verify the exact stage order.
- The production stage accepts valid variations and rejects invalid sentences.
- A completed review updates ordering after returning to the notebook.
- Leaving before completion does not record a completed review.
- Multiple records with the same term are selected and reviewed separately.

**Traceability:** Specification FR-008, FR-009, FR-013; Acceptance Criteria AC-010 and AC-011; Plan sections 7.1, 7.3, and 10.4.

**Task status:** Proposed.

## 7. Phase 5 — Live Provider Integration and Quality Validation

### SN-TB-012 — Integrate the selected dictionary provider

**Objective:** Connect the normalized enrichment adapter to the selected dictionary service after the integration spike.

**Scope:**

- Implement the approved provider request and response mapping.
- Store normalized meanings, examples, pronunciation text, audio, and explicit variations.
- Apply timeout, cancellation, and failure handling.
- Avoid sending unnecessary user text when a term-only lookup is sufficient.

**Dependencies:** SN-TB-001, SN-TB-007, SN-TB-010.

**Completion criteria:**

- Manual verification confirms successful lookup, partial data, unavailable data, and retry behavior.
- Automated tests use mocked responses, not live requests.
- No raw provider payload is persisted.
- Provider limitations are visible in the user experience without breaking local records.

**Traceability:** Specification FR-004, FR-005, EC-007, and EC-008; Plan sections 5.4 and 8.1.

**Task status:** Proposed.

### SN-TB-013 — Integrate the selected correction provider

**Objective:** Connect sentence correction through the approved correction adapter.

**Scope:**

- Send only the text and language data permitted by the approved privacy decision.
- Map offsets, messages, and replacement suggestions.
- Handle timeout, rate limit, provider errors, and unavailable responses.
- Ensure edited text invalidates stale correction data.

**Dependencies:** SN-TB-001, SN-TB-007, SN-TB-010, SN-TB-011.

**Completion criteria:**

- Manual verification confirms error highlighting, suggestions, explanation, and no-error behavior.
- Automated tests use fixtures for all provider statuses.
- The interface explicitly communicates when a sentence was not checked.
- No provider credential is exposed in client code.

**Traceability:** Specification FR-007, EC-009, AC-009; Plan sections 5.5 and 8.1.

**Task status:** Proposed.

### SN-TB-014 — Complete accessibility, responsive, and end-to-end validation

**Objective:** Verify the full Smart Notebook experience and preserve the MVP quality baseline.

**Scope:**

- Add Playwright coverage for save, study, correction, review, lifecycle, persistence, and removal flows.
- Verify keyboard navigation, focus, labels, status announcements, and confirmation semantics.
- Verify desktop and mobile-sized layouts.
- Run lint, typecheck, unit, integration, content, build, and E2E quality checks.
- Fix only issues within the approved specification and plan.

**Dependencies:** SN-TB-008 through SN-TB-013.

**Completion criteria:**

- Smart Notebook E2E flows pass with deterministic provider fixtures.
- Existing MVP E2E flows still pass.
- Accessibility and responsive checks pass for the notebook entry, list, detail, and review views.
- The complete quality gate passes.
- Any known limitation is documented without silently expanding scope.

**Traceability:** Specification AC-001 through AC-015; Plan sections 11 and 12.

**Task status:** Proposed.

## 8. Suggested Parallelization

After SN-TB-001 and SN-TB-002:

- SN-TB-003, SN-TB-004, and SN-TB-007 may proceed in parallel when file ownership is separated.

After the domain and persistence foundations:

- SN-TB-009 and the provider integration spike follow-up may proceed in parallel.
- SN-TB-010 begins after the list and provider contracts are available.

The review interface, live correction integration, and final E2E validation remain dependent on the record-detail behavior.

## 9. Out-of-Scope Guardrails

These tasks must not add:

- accounts or authentication;
- cloud synchronization;
- browser extensions or automatic imports;
- gamification or streaks;
- social sharing;
- a general grammar course;
- a backend or proxy unless separately approved as a scope change;
- raw provider-response storage;
- a new state-management or routing framework without a new plan approval.

## 10. Implementation Validation Note

- Domain rules, persistence, UI, provider adapters, pronunciation fallback, and tests were implemented.
- Unit tests, integration tests, linting, formatting, type checking, and production build pass.
- The Smart Notebook E2E flow passes in Chromium and WebKit with deterministic provider fixtures.
- Firefox E2E execution is currently limited by the local browser environment: Firefox reports `Target crashed` while creating a page before the application loads. Chromium and WebKit complete the same existing MVP flows successfully.
