# DevLingo MVP Acceptance-Criteria Traceability

This document maps each approved acceptance criterion to repeatable verification. Automated checks are the default; manual checks are explicitly identified where they cannot be fully replaced by automation.

| Criterion | Verification |
|---|---|
| AC-01 | `tests/integration/app-shell.test.tsx`; `tests/e2e/learning-flow.spec.ts` |
| AC-02 | `tests/integration/app-shell.test.tsx`; E2E later-lesson scenario |
| AC-03 | `tests/integration/app-shell.test.tsx`; `tests/e2e/learning-flow.spec.ts`; manual pedagogical review |
| AC-04 | `tests/unit/exercise-evaluation.test.ts`; E2E learning flow |
| AC-05 | `tests/integration/app-shell.test.tsx`; `tests/unit/exercise-evaluation.test.ts` |
| AC-06 | `tests/unit/exercise-evaluation.test.ts`; integration selection scenario |
| AC-07 | `tests/unit/exercise-evaluation.test.ts`; integration submitted-answer scenario |
| AC-08 | `tests/integration/app-shell.test.tsx`; `tests/e2e/learning-flow.spec.ts` |
| AC-09 | `tests/integration/app-shell.test.tsx`; E2E feedback scenario; accessibility review |
| AC-10 | `tests/unit/content-validation.test.ts`; `tests/e2e/learning-flow.spec.ts`; manual pedagogical review |
| AC-11 | `tests/unit/lesson-results.test.ts`; integration completion scenario |
| AC-12 | `tests/unit/lesson-results.test.ts`; integration completion scenario |
| AC-13 | `tests/unit/attempt-lifecycle.test.ts`; `tests/e2e/learning-flow.spec.ts` |
| AC-14 | `tests/e2e/learning-flow.spec.ts`; `tests/unit/progress-storage.test.ts` |
| AC-15 | `tests/unit/lesson-results.test.ts` |
| AC-16 | `tests/unit/lesson-results.test.ts`; learning-path result rendering |
| AC-17 | `tests/integration/app-shell.test.tsx`; E2E repeat scenario |
| AC-18 | `tests/unit/attempt-lifecycle.test.ts`; E2E restart scenario |
| AC-19 | `tests/unit/lesson-results.test.ts`; E2E lower-result scenario |
| AC-20 | `tests/unit/lesson-results.test.ts`; E2E repeated-result scenario |
| AC-21 | `tests/integration/app-shell.test.tsx`; E2E reload scenario |
| AC-22 | `tests/e2e/learning-flow.spec.ts`; same-browser local storage behavior |
| AC-23 | `tests/integration/app-shell.test.tsx`; no authentication surface exists |
| AC-24 | `tests/unit/content-validation.test.ts`; manual pedagogical review |
| AC-25 | `tests/integration/app-shell.test.tsx`; learning-path progress rendering |
| AC-26 | `tests/unit/progress-storage.test.ts`; integration malformed-storage scenario |
| AC-27 | `scripts/quality-gate.mjs`, which runs all required verification stages |

## Manual review records

- Pedagogical review of all six lessons is recorded in `specs/001-mvp/tasks.md` under TB-007.
- Accessibility and responsive review is exercised by `tests/e2e/accessibility-responsive.spec.ts` across Chromium, Firefox, and WebKit, including keyboard operation, focus visibility, accessible feedback, and a mobile-sized viewport.
