# DevLingo MVP Task Breakdown

## 1. Document Status

- **Specification:** 001-mvp
- **Technical plan:** MVP Technical Plan
- **Status:** Proposed implementation task breakdown
- **Language:** English
- **Scope:** Approved DevLingo MVP only

This document decomposes the approved specification and technical plan into incremental implementation tasks. Each task has a single primary outcome, explicit boundaries, and verifiable completion criteria.

## 2. Task Conventions

- `TB` means Task Breakdown.
- Dependencies identify tasks that must be completed first.
- A task may start only when all listed dependencies are complete.
- Tests belong to the task that introduces the behavior they verify.
- Parallel tasks must not edit the same responsibility or files at the same time.
- No task may introduce functionality listed as out of scope in the specification.

## 3. Pre-Implementation Decisions

The following decisions are required before the dependent implementation tasks begin. They do not expand the approved product scope.

### TB-001 — Confirm implementation inputs

**Objective:** Confirm the remaining implementation parameters from the approved specification and plan.

**Scope:**

- Confirm the exact number of exercises per lesson.
- Confirm the initial supported modern-browser test matrix.
- Confirm the repository target for static deployment.
- Confirm the supported Node.js LTS version compatible with the selected toolchain.

**Implementation decisions recorded:**

- Each lesson contains exactly five exercises: three multiple-choice exercises and two true/false exercises.
- The end-to-end browser matrix is Chromium, Firefox, and WebKit.
- Chromium may be used for fast local verification during development; the complete Chromium, Firefox, and WebKit matrix is mandatory for the quality gate.
- The initial static deployment target is GitHub Pages.
- The implementation runtime is Node.js `24.21.0`.
- Compatibility basis: the selected Vite baseline requires Node.js `20.19+` or `22.12+`; the selected Vitest baseline is Vitest `5.x`, which requires Vite `6.4+` and Node.js `22.12+`. Node.js `24.21.0` satisfies both requirements and belongs to the currently supported Node.js 24 LTS line at the time of this decision.

**Verification sources:**

- Vite Getting Started: https://vite.dev/guide/
- Vitest Getting Started: https://vitest.dev/guide/
- Vitest 5 migration prerequisites: https://vitest.dev/guide/migration.html
- Node.js release status: https://nodejs.org/en/about/previous-releases

**Dependencies:** None.

**Completion criteria:**

- The decisions are recorded in this task document.
- The exact exercise distribution is recorded as three multiple-choice and two true/false exercises per lesson.
- The E2E browser matrix is recorded as Chromium, Firefox, and WebKit, with the complete matrix required by the quality gate.
- GitHub Pages is recorded as the initial deployment target.
- Node.js `24.21.0` is recorded with a compatibility justification for the selected Vite and Vitest baselines.
- No decision changes the approved functional scope.
- All dependent tasks have an explicit input for each item they require.

**Traceability:** Plan sections 3, 10, and 11; Specification Future Decisions 1, 6, and 8.

**Task status:** Completed. Later task statuses are tracked in their respective task sections.

## 4. Phase 1 — Project Bootstrap and Quality Baseline

### TB-002 — Bootstrap the TypeScript and Vite project

**Objective:** Create the minimal runnable React and TypeScript application shell.

**Scope:**

- Initialize the Vite React TypeScript project.
- Configure strict TypeScript checking.
- Add the application entry point and minimal root component.
- Add development, build, and type-check scripts.
- Pin the supported runtime and create the dependency lockfile.

**Dependencies:** TB-001.

**Completion criteria:**

- The development server starts successfully.
- The production build completes successfully.
- Type checking completes without errors.
- No product feature beyond the application shell is implemented.

**Traceability:** Plan sections 3 and 10; Specification Technical and Quality Goals 1 and 7.

**Task status:** Completed.

### TB-003 — Configure linting, formatting, and test runners

**Objective:** Establish repeatable quality checks before feature implementation.

**Scope:**

- Configure ESLint.
- Configure Prettier.
- Configure Vitest.
- Configure React Testing Library test setup.
- Add scripts for linting, formatting checks, unit tests, and integration tests.

**Dependencies:** TB-002.

**Completion criteria:**

- Lint, format check, unit test, and integration test commands run successfully.
- A minimal test proves the test environment is wired correctly.
- Tool configuration does not require application-specific business logic.

**Traceability:** Plan sections 3.2 and 10; Specification NFR-006 and NFR-007.

**Task status:** Completed.

### TB-004 — Create the initial style foundation

**Objective:** Establish the minimal visual baseline used by later feature tasks.

**Scope:**

- Add global reset and base typography.
- Define a small set of design tokens for color, spacing, focus, and feedback states.
- Configure CSS Modules for feature-level styles.
- Define responsive layout constraints for desktop and mobile-sized viewports.

**Dependencies:** TB-002.

**Completion criteria:**

- Global styles load from the application shell.
- CSS Modules can be imported by a feature component.
- Keyboard focus is visibly distinguishable.
- The style foundation contains no feature-specific content or navigation behavior.

**Traceability:** Plan sections 4.2 and 9; Specification NFR-001, NFR-002, and NFR-003.

**Task status:** Completed.

**Parallelization:** May run in parallel with TB-003 and TB-005 after TB-002, provided each task owns separate configuration or style files.

## 5. Phase 2 — Domain Contracts and Content Foundation

### TB-005 — Define domain and content types

**Objective:** Define the typed contracts for learning content, exercises, attempts, and progress.

**Scope:**

- Define module, lesson, vocabulary, bilingual text, and exercise types.
- Define multiple-choice and true/false discriminated variants.
- Define in-memory lesson-attempt state.
- Define framework-independent progress and best-result types.
- Define stable identifiers and ordering fields.

**Dependencies:** TB-002.

**Completion criteria:**

- Types represent all content required by the specification.
- Unsupported exercise types cannot be silently accepted by the type model.
- Progress types do not expose browser-storage concerns.
- Type-checking passes.

**Traceability:** Specification Domain Model, FR-001 through FR-013; Plan sections 4 and 6.

**Task status:** Completed.

**Parallelization:** May run in parallel with TB-003 and TB-004 after TB-002.

### TB-006 — Define and validate the static content structure

**Objective:** Create the six-lesson content structure and automated structural validation.

**Scope:**

- Create exactly three modules with two lessons each.
- Add stable IDs and explicit order values.
- Add bilingual lesson explanations, contexts, vocabulary, and exercises.
- Implement structural validation for required fields, IDs, relationships, exercise types, option counts, and one correct answer.
- Add content-validation tests.

**Dependencies:** TB-001, TB-005.

**Completion criteria:**

- The content contains exactly three modules and six lessons.
- Every lesson contains the required instructional, vocabulary, and exercise structures.
- Every exercise passes automated structural validation.
- Invalid fixtures fail validation for missing fields, duplicate IDs, invalid options, and missing or ambiguous correct answers.
- The validation command runs independently from the UI.

**Traceability:** Specification BR-001, BR-002, BR-012, BR-013, EC-011, and EC-014; Acceptance Criteria 1, 3, and 22; Plan sections 6 and 8.2.

**Task status:** Completed.

### TB-007 — Perform the pedagogical content review

**Objective:** Confirm that the initial content is suitable for the target learner and technically accurate.

**Scope:**

- Review English correctness and naturalness.
- Review Portuguese translations and explanations.
- Confirm suitability for basic or intermediate learners.
- Confirm technical accuracy and technology independence.
- Confirm that each exercise has an unambiguous intended answer.
- Record corrections and apply them to the static content.

**Dependencies:** TB-006.

**Completion criteria:**

- All six lessons have documented manual review approval.
- All identified content corrections are applied.
- The automated structural validator still passes after corrections.
- No runtime AI or content administration feature is introduced.

**Traceability:** Specification FR-003, FR-004, FR-007, BR-014, BR-015, NFR-009, and EC-014; Acceptance Criteria 3, 9, 10, and 17; Plan section 8.3.

**Manual review record:** All six lessons were reviewed for English naturalness, Portuguese support, beginner/intermediate suitability, technical accuracy, technology independence, terminology consistency, and unambiguous exercise answers. No corrections were required after review.

**Task status:** Completed.

## 6. Phase 3 — Domain Behavior and Persistence

### TB-008 — Implement deterministic exercise evaluation

**Objective:** Implement pure rules for selecting, submitting, and evaluating exercise answers.

**Scope:**

- Evaluate multiple-choice answers.
- Evaluate true/false answers.
- Reject submission without a selected answer.
- Allow selection changes before submission.
- Make a submitted answer final within the current attempt.
- Return correct/incorrect state, correct answer, and feedback data.

**Dependencies:** TB-005.

**Completion criteria:**

- Evaluation functions have no React or browser-storage dependencies.
- Unit tests cover correct and incorrect answers for both exercise types.
- Unit tests cover unselected answers, changed pre-submission answers, and post-submission immutability.
- Results are deterministic for the same content and answer.

**Traceability:** Specification FR-005, FR-006, FR-007, BR-016, EC-003, EC-004, and EC-005; Acceptance Criteria 4 through 9; Plan sections 4.2 and 8.1.

**Task status:** Completed.

### TB-009 — Implement lesson completion and exact result rules

**Objective:** Implement pure rules for completing attempts, calculating exact results, and selecting the best result.

**Scope:**

- Mark a lesson complete only after all exercises have submitted answers.
- Calculate exact accuracy from correct answers and total exercises.
- Compare results without prior rounding.
- Round only the percentage rendered to the user.
- Preserve a higher or equal best result.
- Preserve the existing best result when a new result is lower.
- Support valid 0% and 100% outcomes.

**Dependencies:** TB-005.

**Completion criteria:**

- Domain tests cover incomplete, zero-correct, perfect, equal, higher, and lower results.
- Tests prove that display rounding cannot change best-result comparison.
- The implementation does not use a rounded percentage as its comparison value.
- The result-rounding rule is documented in the relevant domain test names or test descriptions.

**Traceability:** Specification FR-008, FR-010, BR-005, BR-008, BR-009, BR-022, BR-023, EC-006 through EC-010; Acceptance Criteria 9, 12, 15, 16, 19, and 20; Plan sections 4.2, 7.1, 7.2, and 8.1.

**Task status:** Completed.

### TB-010 — Implement interrupted-attempt restart behavior

**Objective:** Implement the transient attempt lifecycle and restart-from-start behavior.

**Scope:**

- Keep incomplete attempt state in memory only.
- Discard incomplete answers when the lesson is abandoned or reloaded.
- Start a returned lesson at its first exercise.
- Preserve completed state and best result from earlier attempts.

**Dependencies:** TB-005, TB-009.

**Completion criteria:**

- Domain or session tests prove that an incomplete attempt is not completed.
- A new attempt starts at the first exercise with no prior answers.
- Existing completion and best-result values remain unchanged.
- No incomplete-attempt data is sent to the persistence adapter.

**Traceability:** Specification FR-009, FR-012, BR-018 through BR-021, EC-002, and EC-005; Acceptance Criteria 13, 14, and 18; Plan section 4.3.

**Task status:** Completed.

### TB-011 — Implement the versioned progress storage boundary

**Objective:** Persist and restore completed progress safely in the same browser.

**Scope:**

- Define a small storage interface.
- Implement a versioned `localStorage` adapter.
- Persist completed lesson state and best results.
- Load progress at application start.
- Handle missing, malformed, and unsupported stored data safely.
- Keep the exact persisted representation behind the persistence boundary.

**Dependencies:** TB-005, TB-009.

**Completion criteria:**

- Storage tests cover empty storage, valid data, malformed data, and unsupported versions.
- Save/load round-trip tests preserve completion and best-result semantics.
- Storage failures do not produce fabricated scores.
- The domain and feature code do not call `localStorage` directly.

**Traceability:** Specification FR-011, FR-012, BR-010, BR-011, EC-001, EC-010, and EC-011; Acceptance Criteria 19, 20, and 24; Plan section 7.

**Task status:** Completed.

**Parallelization:** May run in parallel with TB-008 and TB-010 after TB-005, but must integrate with TB-009 before feature work consumes persisted results.

## 7. Phase 4 — Learning Features

### TB-012 — Implement the application shell and learning-path view

**Objective:** Render the learning path and expose all six lessons for direct access.

**Scope:**

- Render three modules in linear order.
- Render two lessons per module.
- Display title, position, completion state, and displayed best result when present.
- Allow any lesson to be opened without prerequisites.
- Provide the top-level state transition into a selected lesson.

**Dependencies:** TB-004, TB-006, TB-009, TB-011.

**Completion criteria:**

- The view renders all modules and lessons from content data rather than duplicated markup.
- Any lesson can be selected regardless of earlier completion.
- Empty progress is displayed without fabricated scores.
- Component or integration tests cover ordering, direct access, and progress display.
- The view is usable at the agreed desktop and mobile widths.

**Traceability:** Specification FR-001, FR-002, FR-013, BR-001 through BR-004, EC-001, and EC-013; Acceptance Criteria 1, 2, 18, and 23; Plan sections 4, 5, and 9.

**Task status:** Completed.

### TB-013 — Implement lesson content and vocabulary presentation

**Objective:** Present bilingual lesson material and contextual vocabulary before and during exercise flow.

**Scope:**

- Render English-first explanations and development contexts.
- Render technical terms with Portuguese translations or explanations.
- Keep vocabulary review inside the lesson.
- Provide semantic headings and readable content structure.

**Dependencies:** TB-004, TB-006, TB-007, TB-012.

**Completion criteria:**

- Each lesson displays its explanation, context, and vocabulary from content data.
- English is visually primary and Portuguese support is clearly associated with the relevant content.
- Component tests cover content rendering and bilingual fields.
- Keyboard navigation and heading structure are usable.

**Traceability:** Specification FR-003, FR-004, BR-014, and BR-015; Acceptance Criteria 3 and 10; Plan sections 6 and 9.

**Task status:** Completed.

### TB-014 — Implement exercise interaction and immediate feedback

**Objective:** Connect exercise UI controls to deterministic domain evaluation.

**Scope:**

- Render multiple-choice and true/false controls.
- Allow selection changes before submission.
- Disable or finalize submitted answers for the current attempt.
- Prevent submission without a selection.
- Display immediate correct/incorrect feedback.
- Display the correct answer for an incorrect submission.
- Display accessible feedback and a clear next action.

**Dependencies:** TB-008, TB-012, TB-013.

**Completion criteria:**

- Component/integration tests cover both exercise types.
- Tests cover pre-submission selection changes and post-submission finality.
- Tests cover missing selection validation.
- Feedback is exposed through an accessible status or equivalent semantic mechanism.
- The user can continue to the next exercise after feedback.

**Traceability:** Specification FR-005 through FR-007, BR-006, BR-007, EC-003 through EC-005; Acceptance Criteria 4 through 9; Plan sections 4.2, 8.4, and 9.

**Task status:** Completed.

### TB-015 — Implement lesson completion and result presentation

**Objective:** Complete lessons, present exact-derived results, and update persisted best progress.

**Scope:**

- Advance through all exercises in an attempt.
- Show completion only after the final exercise is answered.
- Display the mathematically rounded whole-number percentage.
- Preserve completion on repeated lessons.
- Update the stored best result only when the exact result is not lower.
- Provide a clear path to repeat the lesson.

**Dependencies:** TB-009, TB-011, TB-014.

**Completion criteria:**

- Integration tests cover completion after all exercises and not before.
- 0% completion remains valid.
- Lower exact results do not replace the best result.
- Equal and higher exact results are retained.
- Displayed percentages are rounded only at render time.
- Completion and result updates are persisted.

**Traceability:** Specification FR-008, FR-009, FR-010, BR-008, BR-009, BR-020, BR-022, and BR-023; Acceptance Criteria 11 through 20; Plan sections 7 and 8.4.

**Task status:** Completed.

### TB-016 — Integrate restart and progress restoration into the lesson flow

**Objective:** Ensure interrupted attempts restart correctly and completed progress survives reloads and browser restarts.

**Scope:**

- Reset a lesson session when it is reopened after abandonment.
- Start the new attempt at the first exercise.
- Restore completion and best-result data at application startup.
- Keep incomplete answers out of restored progress.
- Allow continued learning if stored progress is missing or invalid.

**Dependencies:** TB-010, TB-011, TB-012, TB-015.

**Completion criteria:**

- Integration tests cover an interrupted lesson returning to its first exercise.
- Tests prove that previous completion and best results remain visible.
- Tests cover normal reload restoration.
- Invalid storage does not block lesson access.
- No incomplete answer is displayed after restoration.

**Traceability:** Specification FR-011, FR-012, BR-018 through BR-020, EC-002, EC-010, and EC-011; Acceptance Criteria 13, 14, 19, 20, and 24; Plan sections 4.3, 7.3, and 8.4.

**Task status:** Completed.

This task may begin only after all listed dependencies, including TB-015, are complete. It has no additional independent parallelization recommendation because it integrates the completed lesson flow with persistence and restart behavior.

## 8. Phase 5 — Cross-Cutting Validation

### TB-017 — Add end-to-end acceptance coverage

**Objective:** Verify the complete learning loop in a real browser.

**Scope:**

- Configure Playwright against the development or preview server.
- Cover module and lesson access.
- Cover bilingual lesson content.
- Cover both exercise types.
- Cover feedback, completion, exact best-result behavior, restart, and restoration.
- Isolate browser storage between tests.

**Dependencies:** TB-003, TB-015, TB-016.

**Completion criteria:**

- The agreed E2E scenarios pass in the supported browser matrix.
- Tests use isolated browser contexts or equivalent reset behavior.
- Failures identify the relevant acceptance criterion.
- Tests do not rely on execution order or previously persisted user data.

**Traceability:** All applicable Specification Acceptance Criteria, especially 1 through 24; Plan section 8.5.

**Task status:** Completed. The full E2E suite passes in Chromium, Firefox, and WebKit.

### TB-018 — Complete accessibility and responsive validation

**Objective:** Validate usability across keyboard, assistive-technology-relevant semantics, and target viewport sizes.

**Scope:**

- Review semantic headings, labels, controls, and status feedback.
- Verify keyboard-only navigation through the learning flow.
- Verify visible focus and color-independent feedback.
- Verify common desktop and mobile-sized layouts.
- Fix issues found within the approved UI scope.

**Dependencies:** TB-004, TB-013, TB-014, TB-015.

**Completion criteria:**

- All core controls are reachable and operable by keyboard.
- Feedback and completion states are understandable without relying only on color.
- No critical layout break occurs at the agreed viewport sizes.
- Accessibility and responsive checks are recorded.

**Traceability:** Specification NFR-001 through NFR-003; Acceptance Criteria 3, 6, 8, 9, and 23; Plan section 9.

**Parallelization:** May run in parallel with TB-017 after the relevant feature flows are stable.

**Task status:** Completed. Automated keyboard, semantic feedback, and mobile overflow checks pass; the responsive/accessibility review is recorded in `docs/quality/acceptance-criteria.md`.

### TB-019 — Add acceptance-criteria traceability

**Objective:** Ensure every approved acceptance criterion has verification coverage.

**Scope:**

- Map each acceptance criterion to a unit, integration, E2E, content-validation, or manual-review check.
- Identify any criterion covered only manually.
- Record gaps and resolve them within existing task scope.

**Dependencies:** TB-008 through TB-018.

**Completion criteria:**

- Every acceptance criterion has at least one verification reference.
- Manual pedagogical and accessibility checks are explicitly identified.
- No out-of-scope behavior is used to satisfy a criterion.

**Traceability:** Specification Acceptance Criteria 1 through 27; Plan section 8.6.

TB-019 is the final traceability consolidation task for the feature and validation work. It starts only after TB-017 and TB-018 are complete.

**Task status:** Completed. Every acceptance criterion has a verification reference, including automated and manual checks.

## 9. Phase 6 — Build and Deployment

### TB-020 — Configure production build and static deployment

**Objective:** Produce and publish the application as static assets.

**Scope:**

- Configure the production build output.
- Configure the selected static-host deployment workflow.
- Ensure asset paths work at the deployment base path.
- Add deployment documentation.
- Keep the deployment free of backend services and secrets.

**Dependencies:** TB-002, TB-003, TB-017, TB-018, TB-019, TB-021.

**Completion criteria:**

- The production build completes in a clean environment.
- The deployed application loads and supports the complete learning flow.
- Static assets resolve correctly at the selected host path.
- Deployment runs only after required checks pass.
- No secret or server-side configuration is required.

**Traceability:** Specification Technical and Quality Goals 1, 3, 5, and 7; NFR-004; Plan sections 10 and 11.

**Task status:** Completed. The GitHub Pages workflow, deployment base path, and deployment documentation are configured.

### TB-021 — Add final quality gate

**Objective:** Create a single repeatable pre-release verification command or workflow.

**Scope:**

- Run formatting checks.
- Run linting and type checking.
- Run unit and integration tests.
- Run structural content validation.
- Run the production build.
- Run E2E tests against the built application or preview server.

**Dependencies:** TB-003, TB-006, TB-008 through TB-019.

**Completion criteria:**

- The quality gate passes from a clean checkout.
- Failure output identifies the failed stage.
- The deployment task depends on this gate.
- The gate does not modify approved specification or planning documents.

**Traceability:** Specification NFR-004 through NFR-009; Acceptance Criterion 27; Plan sections 8 and 10.

**Task status:** Completed. The complete quality gate passes, including all three browser projects.

## 10. Dependency and Parallelization Summary

### Critical path

```text
TB-001
  → TB-002
  → TB-005
  → TB-008 / TB-009
  → TB-011
  → TB-012
  → TB-013
  → TB-014
  → TB-015
  → TB-016
  → TB-017 / TB-018
  → TB-019
  → TB-021
  → TB-020
```

### Safe parallel groups

#### Group A — Foundation

After TB-002:

- TB-003 — Quality tooling.
- TB-004 — Style foundation.
- TB-005 — Domain and content types.

These tasks should use separate configuration, style, and type ownership.

#### Group B — Domain and content

After TB-005:

- TB-006 — Content structure and validation.
- TB-008 — Exercise evaluation.
- TB-009 — Lesson result rules.

TB-007 must follow TB-006 because pedagogical review requires the initial content.

#### Group C — Persistence and presentation preparation

After TB-009:

- TB-010 — Interrupted-attempt lifecycle.
- TB-011 — Progress storage.

After TB-006, TB-009, and TB-011:

- TB-012 — Learning-path view can begin once its required domain and content contracts are available.

#### Group D — Cross-cutting validation

After TB-003, TB-015, and TB-016:

- TB-017 — E2E coverage.

After TB-004, TB-013, TB-014, and TB-015:

- TB-018 — Accessibility and responsive validation.

TB-017 and TB-018 may proceed in parallel after their formal dependencies are complete. TB-019 starts after both TB-017 and TB-018 and consolidates their verification references.

## 11. Definition of Done for the MVP

The MVP task breakdown is complete when:

1. All tasks required for the approved scope are complete.
2. The six lessons pass automated structural validation and manual pedagogical review.
3. The learning path, lesson flow, exercises, feedback, completion, restart, and progress restoration satisfy the specification.
4. Exact best-result comparison and display-only rounding are verified.
5. Unit, integration, content-validation, and E2E coverage are passing.
6. Accessibility and responsive checks are complete.
7. The production build and static deployment succeed through the quality gate.
8. No backend, authentication, runtime AI, or other out-of-scope functionality has been introduced.
