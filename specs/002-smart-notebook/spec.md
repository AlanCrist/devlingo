# DevLingo Smart Notebook Functional Specification

## 1. Document Status

- **Specification:** 002-smart-notebook
- **Status:** Approved scope; pending technical-plan approval
- **Product:** DevLingo
- **Language:** English
- **Audience:** Product, design, development, and testing contributors

This document defines the functional behavior of the personal Smart Notebook feature. It does not select technologies, external services, APIs, storage mechanisms, or implementation architecture.

## 2. Product Context

Developers frequently encounter unfamiliar English words and expressions while reading documentation, watching videos, working, or communicating. They need a low-friction way to save those items and return to them later with enough context to understand and use them.

The Smart Notebook is a personal vocabulary area where a user can save a word or expression, optionally record the sentence in which it appeared, study its meanings and pronunciation, create practice sentences, and review the item through a short sequence.

The initial scope focuses on general English used by software developers. It is not limited to programming terminology.

## 3. Goals

The feature shall enable a user to:

1. Quickly save a word or expression from any context.
2. Optionally preserve the original sentence where the item was found.
3. Keep separate records when the same term is encountered in different contexts.
4. Understand the main meanings of the saved term.
5. Listen to and inspect its pronunciation.
6. Write up to three practice sentences containing the term or a valid variation.
7. Receive simple correction feedback for practice sentences.
8. Review saved records in a sequence covering meaning, recognition, and production.
9. Prioritize records that have not been updated recently.
10. Mark records as learned, archive them, or permanently remove them.

## 4. Scope

### 4.1 In Scope

- A dedicated Smart Notebook area.
- Quick creation of a word or expression record.
- Optional source sentence.
- Multiple records for the same term when the context differs.
- Main meanings for each record.
- Textual pronunciation information and audio playback.
- Up to three user-authored practice sentences per record.
- Support for term variations in practice sentences.
- Error highlighting, correction suggestions, and brief explanations.
- Ordered review sessions.
- Review prioritization based on time since last update.
- Learned, archived, and permanently removed states.
- Personal, single-user behavior consistent with the current app scope.

### 4.2 Out of Scope for This Specification

- User accounts or cross-device synchronization.
- Social sharing or public vocabulary lists.
- Gamification, streaks, or rewards.
- A full grammar course.
- Automatic import from browser history or other applications.
- Selecting a specific technology or third-party language service.
- Defining how meanings, pronunciation, or sentence corrections are technically obtained.

## 5. User and Assumptions

### 5.1 Primary User

The primary user is a software developer learning general English used in professional development contexts.

### 5.2 Assumptions

1. The feature is primarily for personal use.
2. A user may encounter vocabulary in any context, not only inside DevLingo.
3. The user prefers a save action that can be completed in a few seconds.
4. The user may return later to complete meanings, practice sentences, or review.
5. A saved term can have more than one meaning.
6. A practice sentence may use an inflected, derived, or otherwise valid variation of the saved term.
7. Removing a record is permanent.

## 6. Domain Model

- **Notebook:** The user's collection of vocabulary records.
- **Term:** The word or expression the user wants to learn.
- **Notebook record:** One saved occurrence of a term, optionally associated with a source sentence. Records with the same term but different contexts remain separate.
- **Source sentence:** The optional sentence in which the user encountered the term.
- **Meaning:** A principal meaning or usage of the term, potentially including a Portuguese explanation.
- **Pronunciation:** Textual pronunciation information and playable audio for the term.
- **Practice sentence:** A sentence written by the user to practice using the term or a valid variation.
- **Review session:** A guided sequence for one notebook record.
- **Record status:** The lifecycle state of a record: active, learned, or archived.
- **Removed record:** A record permanently deleted from the notebook; it is not recoverable through the feature.
- **Last updated:** The most recent time the record or its learning content was changed.

## 7. Functional Requirements

### FR-001 — Provide a Smart Notebook area

The system shall provide a dedicated area where the user can view, create, search, and open notebook records.

The area shall be understandable as a personal collection of saved vocabulary.

### FR-002 — Create a record quickly

The system shall allow the user to create a record by entering a word or expression and confirming the action.

The source sentence shall be optional.

The system shall not require the user to complete meanings, pronunciation, or practice sentences before saving the record.

The system shall reject an empty term.

After a successful save, the record shall be available in the notebook.

### FR-003 — Preserve different contexts

The system shall allow multiple records for the same word or expression when the source context is different.

Each record shall preserve its own source sentence when one was provided.

The system shall not overwrite an existing contextual record merely because its term matches a newly saved term.

The notebook may group matching terms visually, but each contextual record shall remain independently accessible and reviewable.

### FR-004 — Display meanings

When the user opens a record, the system shall display the principal meanings available for the term.

The meanings shall support understanding of how the term may be used in English.

The system shall allow the record to contain more than one meaning when the term is polysemous.

The system shall not force the user to select only one meaning when multiple principal meanings are available.

### FR-005 — Display and play pronunciation

The system shall display textual pronunciation information when available.

The system shall provide an action to play pronunciation audio when available.

The system shall communicate when pronunciation text or audio is unavailable rather than presenting fabricated information.

### FR-006 — Manage practice sentences

The system shall allow the user to store up to three practice sentences for each record.

Practice sentences may be partially filled; the user is not required to create all three.

Each submitted practice sentence shall contain the saved term or a valid variation of it.

The system shall provide a clear validation message when a sentence does not use the term or a valid variation.

The user shall be able to edit or replace a previously saved practice sentence.

### FR-007 — Correct practice sentences

After the user submits a practice sentence for correction, the system shall, when correction information is available:

- identify or highlight the error;
- suggest a corrected version;
- explain briefly why the correction is suggested.

The system shall preserve the user's original sentence alongside the correction result until the user edits or replaces it.

The system shall distinguish a correction result from the user's saved sentence so that the user can review both.

If correction is unavailable, the system shall communicate that the sentence could not be checked and shall not claim that it is correct.

### FR-008 — Review a record in sequence

The system shall provide a guided review session for an active or learned record.

The review shall contain these stages in order:

1. **Meaning recall:** prompt the user to remember or identify the meaning.
2. **Recognition:** show the term in a sentence and ask the user to recognize its use or meaning.
3. **Production:** ask the user to create a new sentence using the term or a valid variation.

The system shall communicate the current stage and allow the user to continue through the sequence.

The production stage shall use the same simple correction behavior defined in FR-007 when the user submits a sentence.

Completing a review shall update the record's last-updated time and review metadata defined during technical planning.

### FR-009 — Prioritize records

The system shall provide a notebook ordering that gives higher priority to records that have not been updated recently.

New records without a review history shall be eligible for high priority.

Learned records shall remain eligible for future review but shall have reduced priority compared with active records of similar age.

Archived records shall not appear in the normal review-priority queue.

The exact priority calculation is intentionally deferred to technical planning, provided that it respects these functional rules.

### FR-010 — Mark a record as learned

The system shall allow the user to mark a record as learned.

Marking a record as learned shall reduce its review priority but shall not remove it from the notebook or prevent future review.

The user shall be able to access and review a learned record later.

### FR-011 — Archive a record

The system shall allow the user to archive a record that the user wants to preserve but does not want included in normal review.

Archived records shall remain viewable in an archive area or equivalent filtered view.

The system shall allow the user to restore an archived record to the normal notebook.

Restoring a record shall not erase its source sentence, practice sentences, meanings, or history.

### FR-012 — Permanently remove a record

The system shall allow the user to permanently remove a record.

The system shall communicate the permanent nature of the action before it is finalized.

After confirmation, the record and its associated source sentence, practice sentences, and review data shall no longer be available through the notebook.

The feature shall not provide recovery of a permanently removed record.

### FR-013 — Search and filter records

The system shall allow the user to find records by term.

The system shall provide at least a way to distinguish active, learned, and archived records.

When multiple records have the same term, the user shall be able to identify their different contexts.

### FR-014 — Update record data

The system shall allow the user to edit the term, source sentence, and user-authored practice sentences after creation.

Editing a record shall update its last-updated time.

Editing shall not implicitly mark an archived record as active unless the user explicitly restores it.

## 8. Business Rules

- **BR-001:** A record must contain a non-empty word or expression.
- **BR-002:** A source sentence is optional at capture time.
- **BR-003:** The same term may have multiple records when the contexts differ.
- **BR-004:** Contextual records are reviewed separately.
- **BR-005:** A record may contain multiple principal meanings.
- **BR-006:** A record may contain zero, one, two, or three practice sentences.
- **BR-007:** A practice sentence must contain the saved term or a valid variation.
- **BR-008:** A practice sentence may be submitted before all other practice-sentence slots are filled.
- **BR-009:** Correction feedback must not be represented as the user's original sentence.
- **BR-010:** Learned records remain available for later review with reduced priority.
- **BR-011:** Archived records are preserved but excluded from normal review prioritization.
- **BR-012:** Removed records are permanently deleted and are not recoverable.
- **BR-013:** A review session follows meaning recall, recognition, then production.
- **BR-014:** Completing a review or editing a record updates its last-updated time.
- **BR-015:** The notebook is personal and does not require social or collaborative behavior.

## 9. Main User Flows

### 9.1 Quickly Save a Term

1. The user opens the Smart Notebook.
2. The user enters a word or expression.
3. The user optionally enters the source sentence.
4. The user confirms the save action.
5. The system validates that the term is not empty.
6. The system creates a notebook record.
7. The record appears in the notebook with high review eligibility.

### 9.2 Study a Record

1. The user opens a notebook record.
2. The system displays the term, source sentence when available, principal meanings, and pronunciation.
3. The user may play the pronunciation audio.
4. The user adds or edits up to three practice sentences.
5. The system validates each sentence's use of the term or a valid variation.
6. The system provides correction feedback when requested or submitted.
7. The system preserves the user's sentence and the correction result separately.

### 9.3 Complete a Review Session

1. The user starts a review for a selected record.
2. The system presents the meaning-recall stage.
3. The user continues to the recognition stage.
4. The system presents the term in a sentence and asks the user to recognize its use or meaning.
5. The user continues to the production stage.
6. The user submits a new sentence using the term or a valid variation.
7. The system provides correction feedback when available.
8. The system completes the review and updates review timing and priority data.

### 9.4 Archive and Restore a Record

1. The user selects archive for a record.
2. The system removes the record from the normal review-priority view.
3. The record remains available in the archive.
4. The user selects restore.
5. The system returns the record to the normal notebook without losing its data.

### 9.5 Permanently Remove a Record

1. The user selects remove for a record.
2. The system warns that removal is permanent.
3. The user confirms the action.
4. The system permanently deletes the record and its associated data.
5. The system removes the record from notebook and review views.

## 10. Edge Cases and Expected Behavior

### EC-001 — Empty term

The system shall not create a record and shall ask the user to enter a word or expression.

### EC-002 — Same term, same context

The specification does not require automatic deduplication. The product may warn about a possible duplicate during planning, but it shall not silently overwrite an existing record.

### EC-003 — Same term, different context

The system shall create or preserve separate contextual records and shall make the context distinguishable to the user.

### EC-004 — No source sentence

The record shall remain valid and studyable without a source sentence.

### EC-005 — Fewer than three practice sentences

The record shall remain valid and reviewable with zero, one, or two practice sentences.

### EC-006 — Invalid term variation

The system shall explain that the submitted sentence must use the term or a valid variation and shall allow the user to edit and resubmit it.

### EC-007 — Meaning data unavailable

The system shall preserve the record and communicate that meanings are unavailable or incomplete. It shall not display invented meanings as verified information.

### EC-008 — Pronunciation audio unavailable

The system shall preserve textual pronunciation when available and communicate that audio is unavailable.

### EC-009 — Correction unavailable

The system shall preserve the user's sentence and clearly communicate that it could not provide correction feedback.

### EC-010 — Learned record review

The system shall allow the user to review a learned record when selected directly or when its reduced-priority schedule selects it.

### EC-011 — Archived record review

The system shall exclude an archived record from normal review priority until the user restores it.

### EC-012 — Removal cancellation

If the user cancels the permanent-removal confirmation, the record and all associated data shall remain unchanged.

### EC-013 — Multiple records in a review queue

The system shall review each contextual record separately, even when records share the same term.

### EC-014 — Interrupted review

If the user leaves a review before completion, the system shall not falsely report the review as completed. The behavior for resuming or restarting an interrupted review shall be defined during technical planning, provided that record data is not silently lost.

## 11. Acceptance Criteria

- **AC-001:** A user can save a non-empty word or expression in a few seconds without entering any additional data.
- **AC-002:** A user can optionally save the sentence where the term was found.
- **AC-003:** Two records with the same term and different contexts remain separately accessible.
- **AC-004:** Opening a record shows its available principal meanings and pronunciation information.
- **AC-005:** Available pronunciation audio can be played from the record.
- **AC-006:** A user can save between zero and three practice sentences per record.
- **AC-007:** A practice sentence using a valid term variation is accepted.
- **AC-008:** A practice sentence that does not use the term or a valid variation is rejected with an understandable message.
- **AC-009:** Correction feedback highlights an error, suggests a correction, and briefly explains the reason when correction is available.
- **AC-010:** A review session presents meaning recall, recognition, and production in that order.
- **AC-011:** Completing a review makes the record less urgent only according to the defined priority rules; it does not remove the record.
- **AC-012:** Marking a record as learned reduces its review priority without preventing later review.
- **AC-013:** Archiving removes a record from normal review while preserving it for later restoration.
- **AC-014:** Permanent removal requires confirmation and leaves no recoverable record in the feature.
- **AC-015:** Search or filtering allows the user to find records and distinguish their lifecycle states.

## 12. Open Decisions for Technical Planning

The following decisions are intentionally not made by this functional specification:

1. How meanings and contextual explanations are obtained.
2. How pronunciation text and audio are obtained.
3. How sentence correction and valid term variations are determined.
4. Whether any external language service is used.
5. The exact review-priority formula.
6. The exact persistence model and data migration strategy.
7. How an interrupted review is resumed or restarted.
8. The visual layout and interaction details of the notebook and review sequence.

These decisions belong to the technical plan and user-interface design, and must not expand the approved functional scope without a specification change.
