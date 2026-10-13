# DevLingo MVP Technical Plan

## 1. Document Status

- **Specification:** 001-mvp
- **Plan:** Technical Planning for the MVP
- **Status:** Proposed for implementation approval
- **Language:** English
- **Scope:** Implementation of the approved functional specification only

This plan translates the approved functional specification into a technical approach. It does not add product features or change functional requirements.

## 2. Planning Principles

The implementation shall follow these principles:

1. Keep the architecture proportional to six lessons and one local user.
2. Keep business rules independent from the UI and browser APIs.
3. Prefer explicit data structures and pure functions over framework-specific abstractions.
4. Keep content versioned with the source code.
5. Make acceptance criteria testable through deterministic behavior.
6. Avoid backend, authentication, global state libraries, and complex routing until an approved requirement needs them.
7. Document decisions that materially affect maintenance, testing, or future evolution.

## 3. Proposed Technology Stack

### 3.1 Application Stack

- **Language:** TypeScript with strict compiler settings.
- **UI library:** React.
- **Build and development tool:** Vite.
- **Styling:** CSS Modules with a small global stylesheet for tokens and base styles.
- **Runtime model:** Client-rendered static web application.
- **Persistence:** Versioned browser `localStorage`.

React provides a suitable component model for the learning path, lesson flow, exercise state, and feedback states. TypeScript provides explicit contracts for content, answers, attempts, and progress. Vite provides a small development and production-build setup for a static application.

### 3.2 Quality Tooling

- **Unit tests:** Vitest.
- **Component and integration tests:** React Testing Library with Vitest.
- **End-to-end tests:** Playwright.
- **Static analysis:** ESLint.
- **Formatting:** Prettier.
- **Package manager:** npm with a committed lockfile, unless the repository adopts another package manager before implementation.

The exact dependency versions shall be selected and pinned during project bootstrap. The selected Node.js version shall be an actively supported LTS version compatible with the toolchain.

### 3.3 Alternatives Rejected for the MVP

- **Vanilla TypeScript:** technically sufficient, but React better demonstrates reusable UI composition for this portfolio project.
- **Vue:** also suitable, but there is no product constraint that favors it over React.
- **Next.js or another full-stack framework:** unnecessary because the MVP has no server, authentication, API, or server-rendered requirement.
- **Redux, Zustand, or another global state library:** unnecessary for the small amount of state and would add an extra abstraction layer.
- **Tailwind CSS or a UI component library:** not needed for the limited visual scope and would reduce control over the learning interface.
- **IndexedDB:** more capable than required for six lesson-progress records.

## 4. Architecture

### 4.1 Overview

The application will be a single-page client application with four responsibilities:

```text
Static content
      ↓
Domain rules ← Persistence adapter
      ↓
Learning features and session state
      ↓
React presentation
```

The domain layer will not import React or access browser storage. Persistence will be accessed through a small adapter. Feature components will coordinate user interaction and render state.

### 4.2 Architectural Boundaries

#### Content

Owns the six modules and their reviewed instructional material. Content is data, not UI logic.

#### Domain

Owns deterministic rules:

- Exercise answer evaluation.
- Answer-submission state.
- Lesson completion.
- Exact accuracy comparison.
- Best-result selection.
- Display percentage rounding.

#### Features

Owns user-facing learning flows:

- Learning-path display.
- Lesson presentation.
- Vocabulary review.
- Exercise interaction.
- Immediate feedback.
- Progress display.

#### Persistence

Owns serialization, storage access, schema version checks, and safe handling of missing or malformed progress.

#### Styling

Owns design tokens, base styles, responsive layout rules, and component-scoped styles.

No separate application-service, repository, or shared-component layer will be introduced unless repeated behavior justifies it.

### 4.3 Runtime State

The current lesson attempt exists only in memory. It includes:

- Selected answer for the current exercise.
- Submitted answers for the current attempt.
- Current exercise position.
- Correct-answer count.
- Feedback state.

Before submission, the selected answer can change. After submission, that answer is immutable for the current attempt. Leaving or reloading an incomplete lesson discards the attempt. Reopening the lesson starts from its first exercise.

Completed progress is loaded when the application starts and written after a lesson is completed or a better result is achieved.

## 5. Repository Structure

```text
src/
├── content/
│   ├── modules.ts
│   ├── lessons/
│   └── content-validator.ts
├── domain/
│   ├── content-types.ts
│   ├── exercise-evaluation.ts
│   ├── lesson-progress.ts
│   └── progress-types.ts
├── features/
│   ├── learning-path/
│   ├── lesson/
│   └── progress/
├── persistence/
│   ├── progress-storage.ts
│   └── local-progress-storage.ts
├── styles/
│   ├── global.css
│   └── tokens.css
├── App.tsx
└── main.tsx

tests/
├── unit/
├── integration/
├── content/
└── e2e/
```

### 5.1 Folder Responsibilities

- `content/`: static, reviewed learning content and structural validation.
- `domain/`: framework-independent types and business rules.
- `features/learning-path/`: module and lesson list presentation.
- `features/lesson/`: explanation, vocabulary, exercises, feedback, and lesson controls.
- `features/progress/`: completion and best-result presentation.
- `persistence/`: browser storage boundary and progress serialization.
- `styles/`: global visual foundations.
- `tests/`: tests grouped by behavior level.

The structure intentionally does not include a generic service layer, a generic component library, a state-management folder, or a routing layer.

## 6. Content Model

### 6.1 Learning Path

```text
LearningPath
  modules: Module[]

Module
  id: ModuleId
  title: BilingualText
  order: number
  lessons: Lesson[]

Lesson
  id: LessonId
  moduleId: ModuleId
  title: BilingualText
  order: number
  explanation: BilingualText
  context: BilingualText
  vocabulary: VocabularyItem[]
  exercises: Exercise[]
```

The initial content must contain exactly three modules and two lessons per module. IDs and order values must be stable.

### 6.2 Bilingual Content

```text
BilingualText
  en: string
  pt: string
```

English is primary for technical terms, examples, exercise prompts, and answer options. Portuguese supplies translations, explanations, and accessible feedback where needed.

```text
VocabularyItem
  id: string
  termEn: string
  translationPt: string
  explanationPt: string
  exampleEn: string
```

### 6.3 Exercise Model

Exercises shall use a discriminated type based on `type`:

```text
MultipleChoiceExercise
  type: "multiple-choice"
  id: string
  prompt: BilingualText
  options: AnswerOption[]
  correctOptionId: string
  feedback: BilingualText

TrueFalseExercise
  type: "true-false"
  id: string
  prompt: BilingualText
  options: [TrueOption, FalseOption]
  correctOptionId: string
  feedback: BilingualText
```

The content validator shall ensure that each exercise has exactly one correct option and that true/false exercises contain exactly two valid options.

## 7. Progress and Persistence Design

### 7.1 Persisted Progress Semantics

The application must persist enough information to restore:

- Lesson completion state.
- The best result for each lesson.

The functional specification intentionally does not prescribe the persisted data shape. The technical implementation will use a versioned progress record containing exact result information, including the number of correct answers and the total number of exercises for the best completed attempt. This permits exact comparison without relying on rounded percentages.

The persisted representation is an implementation detail and must remain behind the persistence boundary.

### 7.2 Result Rules

For a completed attempt:

```text
exactAccuracy = correctAnswers / totalExercises
displayedPercentage = mathematicalRound(exactAccuracy * 100)
```

The application shall:

1. Compare new and stored results using exact accuracy.
2. Retain the stored result when the new exact accuracy is lower.
3. Replace it when the new exact accuracy is equal to or higher.
4. Round only when rendering a percentage for the user.

If attempts have different exercise counts in a future content revision, the ratio remains the comparison value. The MVP content itself is static during runtime.

### 7.3 Storage Boundary

The application shall use a small storage interface with operations equivalent to:

- Load progress.
- Save progress.
- Clear progress for test or local-reset purposes.

The browser-specific implementation shall use a versioned `localStorage` key. The domain and feature layers shall not call `localStorage` directly.

### 7.4 Error Handling

- Missing data produces empty progress.
- Malformed data is rejected safely.
- Unsupported schema versions are treated as unavailable unless a migration exists.
- The user can continue learning when progress cannot be restored.
- No fabricated score is displayed for unavailable data.

## 8. Testing and Validation Strategy

### 8.1 Unit Tests

Unit tests will cover pure domain behavior:

- Multiple-choice evaluation.
- True/false evaluation.
- No-answer submission rejection.
- Selection changes before submission.
- Submitted-answer immutability.
- Lesson completion only after all exercises are answered.
- Exact result comparison.
- Mathematical whole-number display rounding.
- 0% and 100% results.
- Best-result preservation and replacement.
- Restarting an incomplete attempt at the first exercise.

### 8.2 Structural Content Validation

Automated content validation is separate from pedagogical review. It will verify:

- Exactly three modules.
- Exactly two lessons per module.
- Stable and unique IDs.
- Valid module-to-lesson relationships.
- Required bilingual fields.
- At least one exercise per lesson.
- Supported exercise types only.
- Valid option counts.
- Exactly one correct answer.
- Non-empty prompts, explanations, translations, and feedback fields where required.

### 8.3 Manual Pedagogical Review

Before release, the content author shall manually review:

- English correctness and naturalness.
- Portuguese translation quality.
- Suitability for basic or intermediate learners.
- Technical accuracy.
- Clarity of examples.
- Unambiguous exercise wording and answers.
- Consistency of terminology across lessons.

Automated structural validation cannot replace this review.

### 8.4 Integration Tests

Integration tests will verify feature behavior across domain rules, UI state, and the persistence adapter:

- Learning-path rendering.
- Unrestricted lesson access.
- Lesson content and vocabulary display.
- Answer selection and pre-submission changes.
- Immediate feedback.
- Restart after interruption.
- Completion and best-result updates.
- Progress restoration.
- Malformed-storage handling.

### 8.5 End-to-End Tests

Playwright scenarios will cover the highest-value acceptance flows:

1. Open the application and view all modules and lessons.
2. Open a later lesson without completing earlier lessons.
3. Complete a lesson with mixed exercise types.
4. Change an answer before submission.
5. Confirm that submitted answers are final in the current attempt.
6. Complete a lesson with zero correct answers.
7. Repeat a lesson and improve the best result.
8. Verify that a lower exact result does not replace the best result.
9. Interrupt a lesson and verify that reopening starts at the first exercise.
10. Reload or reopen the application and verify progress restoration.

### 8.6 Acceptance-Criteria Traceability

The test suite shall reference the functional requirement or acceptance-criterion IDs it validates. Each acceptance criterion must have at least one automated test or an explicitly documented manual validation step.

## 9. Accessibility and Responsive Behavior

The implementation shall:

- Use semantic headings and form controls.
- Associate labels with answer controls.
- Expose correct/incorrect feedback to assistive technologies.
- Preserve visible keyboard focus.
- Support keyboard operation of exercise selection and submission.
- Use sufficient color-independent distinction for feedback states.
- Remain usable at common desktop and mobile browser widths.

Accessibility checks will be included in component review and end-to-end smoke testing. A dedicated accessibility automation tool is optional for the MVP but may be added if manual checks reveal risk.

## 10. Configuration and Development Workflow

The initial project configuration shall include:

- Strict TypeScript settings.
- Vite development and production scripts.
- Unit and integration test scripts.
- Playwright end-to-end test script.
- Type-check script.
- Lint and format scripts.
- A committed dependency lockfile.
- A pinned supported Node.js LTS version.
- No runtime secrets or required environment variables.

The development workflow shall be:

1. Update approved content or implementation code.
2. Run formatting and static checks.
3. Run unit and integration tests.
4. Run content validation.
5. Run the production build.
6. Run end-to-end tests.
7. Perform manual pedagogical and accessibility review when relevant.

## 11. Deployment Strategy

The MVP will be deployed as static assets generated by the Vite production build.

### Recommended Target

GitHub Pages is the recommended initial target because it is appropriate for a portfolio project, requires no application server, and can publish static build output through repository automation.

If the repository is not hosted on GitHub, an equivalent static host such as Vercel, Netlify, or Cloudflare Pages may be used without changing the application architecture.

### Deployment Pipeline

The deployment pipeline should:

1. Install dependencies from the lockfile.
2. Run type checking.
3. Run linting.
4. Run unit, integration, and content-validation tests.
5. Build the production assets.
6. Run end-to-end tests against the built application or preview server.
7. Publish only after required checks pass.

No server-side environment variables, database migrations, authentication configuration, or secret management are required for the MVP.

## 12. Risks and Trade-offs

### Local-only progress

Clearing browser data or changing browsers can remove access to progress. This is an accepted consequence of the approved no-login, same-browser scope.

### Static content growth

TypeScript content modules are convenient and typed for a small individual project. If content becomes large or needs non-developer editing, a later approved change may move content to JSON or Markdown with explicit schema validation.

### Exact result comparison

Storing exact result information avoids errors caused by comparing rounded percentages. The trade-off is a slightly richer progress record, kept behind the persistence boundary.

### Interrupted attempts

Discarding incomplete attempts simplifies persistence and matches the approved behavior. The trade-off is that the user must restart the lesson after leaving it.

### Browser compatibility

The implementation will target modern browsers supported by the selected Node/Vite/React toolchain. Legacy browser support is not part of the MVP unless separately approved.

### Accessibility debt

An educational interface can become difficult to use if feedback is conveyed only through color or visual position. Semantic controls, keyboard support, and accessible feedback are therefore part of the implementation baseline rather than optional polish.

## 13. Implementation Sequence

The implementation should proceed in these technical increments:

1. Bootstrap the project and quality tooling.
2. Define domain types and pure exercise/progress rules.
3. Add the reviewed content model and structural validator.
4. Implement versioned progress persistence behind the storage boundary.
5. Implement the learning-path feature.
6. Implement the lesson and exercise flow.
7. Implement completion, best-result display, and restart behavior.
8. Add unit, integration, content, and end-to-end tests.
9. Apply responsive and accessibility refinements.
10. Configure static deployment and verify the production build.

Each increment should remain aligned with the approved specification. Any new behavior that expands the MVP must return to specification review before implementation.

## 14. Architectural Decisions Summary

| Decision | Choice | Reason |
|---|---|---|
| UI library | React | Suitable component model and strong portfolio value |
| Language | TypeScript | Explicit contracts and maintainability |
| Build tool | Vite | Small, fast static-app workflow |
| Styling | CSS Modules | Local styles without a UI framework dependency |
| State | React local state | Sufficient for the small MVP state model |
| Content | Typed static modules | Versioned, reviewable, and easy to validate |
| Persistence | Versioned `localStorage` | Meets same-browser requirement with minimal complexity |
| Unit testing | Vitest | Fits the Vite-based toolchain |
| UI testing | React Testing Library | Verifies user-visible behavior |
| E2E testing | Playwright | Verifies complete browser flows |
| Deployment | Static hosting | No backend or authentication is required |
| Routing | No router initially | Six lessons do not require route infrastructure |

## 15. Out-of-Scope Technical Work

This plan does not include:

- Backend or API development.
- Database setup.
- Authentication or account management.
- Cloud synchronization.
- Runtime AI integration.
- Content administration tools.
- Native mobile packaging.
- Advanced analytics infrastructure.
- A design-system package.
- A general-purpose state-management framework.

Any of these would require an approved scope change or a later specification.
