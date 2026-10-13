# DevLingo MVP Functional Specification

## 1. Document Status

- **Specification:** 001-mvp
- **Status:** Approved scope; pending implementation planning
- **Product:** DevLingo
- **Language:** English
- **Audience:** Product, design, development, and testing contributors

## 2. Product Context

DevLingo is a learning application for software developers with basic or intermediate English proficiency. It helps users understand and use technical English in everyday professional software-development situations, with emphasis on technical vocabulary and documentation reading.

The MVP is both a personal learning tool and a technical portfolio project. It must provide a complete learning loop: study a short lesson, answer interactive exercises, receive immediate feedback, revisit content, and observe progress over time.

## 3. Goals

### 3.1 Functional Goals

The MVP shall enable a user to:

1. Follow a structured learning path containing three modules and two lessons per module.
2. Open any available lesson without being forced to complete earlier lessons first.
3. Study short, technology-independent technical-English content based on realistic software-development situations.
4. Review vocabulary within the context of each lesson.
5. Answer multiple-choice and true/false exercises.
6. Receive immediate feedback after every submitted answer.
7. Repeat exercises and lessons as desired.
8. Complete a lesson after answering all exercises in that lesson.
9. Preserve the best result achieved for each lesson after repeated attempts.
10. Track lesson completion and exercise accuracy.
11. Close and reopen the application in the same browser without losing progress.

### 3.2 Technical and Quality Goals

The MVP shall be developed as a small, maintainable, and testable product suitable for a technical portfolio. Its implementation must support:

1. Clear separation between learning content, application behavior, and presentation concerns.
2. Deterministic evaluation of exercise answers.
3. Reliable persistence and restoration of progress in the same browser.
4. Content that can be reviewed and updated without unnecessary duplication.
5. Verifiable behavior through automated and/or repeatable tests appropriate to the selected implementation.
6. Explicitly documented architectural decisions in a later technical-planning phase.
7. Simple solutions proportional to the MVP, without premature complexity.

No technology, framework, storage mechanism, deployment target, or architecture is selected by this specification.

## 4. Users and Assumptions

### 4.1 Primary User

The primary user is a software developer with basic or intermediate English proficiency who wants to improve technical vocabulary and documentation comprehension.

### 4.2 Assumptions

1. The MVP has no account system and no authentication.
2. The MVP is intended for one user on one browser profile.
3. Progress is scoped to the same browser and is not synchronized across browsers or devices.
4. Learning content is static at runtime, created with assistance from AI and reviewed before release.
5. Exercise answers have deterministic expected results defined as part of the content.
6. The learning path contains exactly three modules and six lessons in the initial MVP content set.
7. The content uses realistic software-development situations but does not depend on a specific programming language, framework, vendor, or tool.
8. Lesson content is bilingual, with English as the primary language and Portuguese as learner support.
9. There is no initial placement test.

## 5. Domain Model

The following concepts are part of the functional model:

- **Module:** A thematic grouping of lessons in the learning path.
- **Lesson:** A short learning unit containing instructional content, vocabulary review, and exercises.
- **Vocabulary item:** A technical-English term or expression with learner-facing meaning and contextual usage.
- **Exercise:** An interactive question belonging to a lesson.
- **Lesson attempt:** One run through all exercises in a lesson. An attempt is complete only after every exercise has received a submitted answer.
- **Lesson completion:** The state reached when every exercise in a lesson has been answered at least once in the current completion flow.
- **Best result:** The highest recorded lesson accuracy achieved by the user.
- **Progress:** The user’s lesson completion state and recorded accuracy.

## 6. Functional Requirements

### FR-001 — Display the learning path

The system shall display three modules, each containing two lessons.

For each lesson, the system shall communicate at least:

- Lesson title.
- Lesson position within its module.
- Completion state.
- Best recorded accuracy, when an attempt exists.

### FR-002 — Provide linear ordering with free access

The system shall present modules and lessons in a defined linear order.

The system shall allow the user to open any lesson directly, regardless of the completion state of other lessons.

The system shall not require previous-lesson completion to access a later lesson.

### FR-003 — Present lesson content

Each lesson shall contain:

- A concise explanation related to technical English, with English as the primary language and Portuguese as support.
- At least one realistic software-development context or example presented in English.
- Vocabulary review items with technical terms in English and Portuguese translations or explanations.
- A set of exercises.

Lesson content shall be understandable without knowledge of a specific technology.

Portuguese support shall assist comprehension without replacing the English terms and examples that the user is expected to learn.

### FR-004 — Support vocabulary review

The system shall allow the user to review vocabulary items within the lesson that contains them.

Each vocabulary item shall provide sufficient information for the user to understand its meaning in the lesson context.

The MVP shall not require a separate vocabulary area outside the lesson flow.

### FR-005 — Support multiple-choice exercises

The system shall support exercises with multiple answer options and one defined correct answer.

The system shall allow the user to select an option, change the selection before submission, and submit the answer.

After submission, the selected answer shall be final for that exercise in the current lesson attempt.

The system shall prevent an incomplete multiple-choice answer from being evaluated as a valid submission.

### FR-006 — Support true/false exercises

The system shall support exercises with exactly two answer options representing true and false.

The system shall allow the user to select an option, change the selection before submission, and submit the answer.

After submission, the selected answer shall be final for that exercise in the current lesson attempt.

The system shall prevent an unselected true/false exercise from being evaluated as a valid submission.

### FR-007 — Provide immediate feedback

After every valid answer submission, the system shall immediately indicate whether the answer is correct or incorrect.

The feedback shall identify the correct answer when the submitted answer is incorrect.

The feedback shall provide an accessible explanation, using Portuguese support when necessary for users with basic or intermediate English proficiency, sufficient to connect the result to the lesson content.

Exercises shall prioritize English in their prompts and answer options. Portuguese may be used when necessary to make the instruction or feedback clear.

The system shall clearly indicate when the user may continue to the next exercise or lesson step.

### FR-008 — Complete a lesson

The system shall mark a lesson as completed when the user has submitted an answer for every exercise in that lesson during the current lesson attempt.

The system shall not mark a lesson as completed merely because the user opened it or read its content.

After completion, the system shall communicate the completion state and the result for that completed flow.

### FR-009 — Repeat exercises and lessons

The system shall allow the user to repeat exercises and revisit completed lessons.

Repeating a lesson shall not remove its completion state.

Before submitting an answer, the user shall be able to change the selected answer in the current attempt.

After submitting an answer, the user shall not be able to change that answer in the current attempt.

To answer an already submitted exercise again, the user shall restart the lesson and begin a new attempt.

The user shall be able to restart an incomplete attempt when returning to a lesson.

### FR-010 — Record accuracy and best result

The system shall calculate a lesson accuracy percentage from the number of correct answers divided by the total number of exercises in the completed flow.

The system shall preserve the highest accuracy achieved for each lesson.

The system shall compare a new result with the stored best result using the exact proportion of correct answers to total exercises, without rounding before comparison.

If a new result is lower than the stored best result, the system shall retain the stored best result.

If a new result equals or exceeds the stored best result, the system shall retain the equal or higher result accordingly.

The system shall display the best result for a lesson as a mathematically rounded whole-number percentage when that result exists.

Accuracy shall be calculated only when all exercises in the lesson attempt have been answered. Rounding shall apply only to the percentage presented to the user.

### FR-011 — Persist progress

The system shall persist, at minimum, the following information for each lesson:

- Whether the lesson has been completed.
- The best result achieved, when available.

The system shall restore persisted progress when the application is reopened in the same browser profile.

The system shall preserve progress across normal application reloads and browser restarts.

### FR-012 — Handle new or missing progress

When no progress exists for a lesson, the system shall display it as not started and shall not display a fabricated score.

If progress exists for some lessons but not others, the system shall restore the available progress without preventing access to any lesson.

The system shall not be required to persist or restore answers from an incomplete lesson attempt.

When the user returns to a lesson after abandoning an incomplete attempt, the system shall start a new attempt at the first exercise.

### FR-013 — Provide progress overview

The system shall provide an overview from which the user can identify:

- Which lessons are completed.
- Which lessons are not completed.
- The best accuracy for lessons with recorded results.

The MVP does not require a separate analytics dashboard; the learning-path view may serve as the progress overview.

## 7. Business Rules

- **BR-001:** The initial learning path contains exactly three modules.
- **BR-002:** Each module contains exactly two lessons.
- **BR-003:** Lessons have a defined linear display order.
- **BR-004:** Lesson access is unrestricted by completion state.
- **BR-005:** A lesson requires an answer submission for every exercise before it can be completed.
- **BR-006:** A user may repeat any exercise or completed lesson.
- **BR-007:** Immediate feedback is shown after each valid answer submission.
- **BR-008:** Lesson accuracy is expressed as a percentage based on correct answers over all exercises in the completed flow.
- **BR-009:** Only the best lesson accuracy is retained as the displayed result.
- **BR-010:** Progress is local to the same browser profile and is not shared across devices or browsers.
- **BR-011:** No user account is required to access lessons or record progress.
- **BR-012:** Content is static during normal use of the MVP.
- **BR-013:** Content must not require a specific technology to understand the intended answer.
- **BR-014:** English is the primary language for technical terms, examples, exercise prompts, and answer options.
- **BR-015:** Portuguese translations and explanations provide learner support and must not replace the English learning material.
- **BR-016:** An answer may be changed before submission but is final after submission within the current lesson attempt.
- **BR-017:** A lesson attempt is complete only after every exercise has received a submitted answer.
- **BR-018:** An incomplete lesson attempt may be restarted when the user returns to the lesson.
- **BR-019:** The MVP is not required to recover answers from an interrupted lesson attempt.
- **BR-020:** Completed lesson states and best results remain preserved when an incomplete attempt is restarted.
- **BR-021:** Restarting an abandoned incomplete lesson attempt begins at the first exercise.
- **BR-022:** New and stored lesson results are compared using the exact proportion of correct answers to total exercises, without prior rounding.
- **BR-023:** Lesson percentages displayed to the user are mathematically rounded to whole numbers.

## 8. Main User Flows

### 8.1 Start or Resume Learning

1. The user opens the application.
2. The system displays the three-module learning path.
3. The system restores any available lesson completion and best-result data.
4. The user selects any lesson.
5. The system opens the selected lesson at its content and exercise flow.

### 8.2 Study and Complete a Lesson

1. The user opens a lesson.
2. The system presents the lesson explanation and vocabulary review.
3. The system presents an exercise.
4. The user selects an answer.
5. The user may change the selected answer before submitting it.
6. The user submits the answer.
7. The system evaluates the answer, treats it as final for the current attempt, and immediately displays feedback.
8. The user proceeds through the remaining exercises.
9. After the final exercise is answered, the system calculates the lesson accuracy.
10. The system marks the lesson as completed.
11. The system updates the stored best result if the new result is higher or equal.
12. The system persists the updated progress.

### 8.3 Repeat a Completed Lesson

1. The user opens a completed lesson.
2. The system presents the lesson content and exercises again.
3. The user selects and submits answers, receiving immediate feedback after each submission.
4. The system calculates the new accuracy after all exercises are answered.
5. The system preserves the existing completion state.
6. The system replaces the stored best result only when the new result is not lower.

### 8.4 Restart an Interrupted Lesson

1. The user opens a lesson and answers zero or more exercises without answering all exercises.
2. The user leaves the lesson or closes the application.
3. The user returns to the lesson.
4. The system does not mark the interrupted attempt as completed.
5. The system allows the user to restart the lesson attempt.
6. The user begins a new attempt at the first exercise without recovering answers from the interrupted attempt.
7. Any previous completion state and best result remain unchanged.

### 8.5 Reopen the Application

1. The user completes one or more lessons or partially uses a lesson.
2. The user closes or reloads the application.
3. The user reopens the application in the same browser profile.
4. The system restores the persisted completion states and best results.
5. The system does not restore answers from an incomplete lesson attempt; reopening the lesson starts a new attempt at the first exercise.
6. The learning path displays the restored progress.

## 9. Edge Cases and Expected Behavior

### EC-001 — No previous progress

The system shall show all lessons as not completed and shall omit best-result values until the user has a recorded completed attempt.

### EC-002 — Partial lesson session interrupted

If the user leaves a lesson before answering every exercise, the system shall not mark the lesson as completed. When the user returns, the incomplete attempt may be restarted, and answers from that attempt do not need to be recovered. Existing completion state and best result shall remain preserved.

When restarted, the new attempt shall begin with the first exercise in the lesson.

### EC-003 — Invalid submission

If the user submits an exercise without selecting an answer, the system shall not calculate accuracy, record an attempt, or advance the exercise. It shall ask the user to select an answer.

### EC-004 — Answer changed before submission

If the user changes the selected answer before submission, only the final selection at the moment of submission shall be evaluated.

### EC-005 — Answer changed after submission

If the user attempts to change an answer after submission, the system shall keep the submitted answer final for that attempt. The user must restart the lesson to answer that exercise again.

### EC-006 — Perfect result

An accuracy of 100% shall be displayed as the maximum result and shall be retained as the best result.

### EC-007 — Zero correct answers

An accuracy of 0% shall be a valid completed result when every exercise was answered and none of the answers was correct.

### EC-008 — Repeated result lower than best

The system shall keep the previous higher best result while preserving the lesson’s completed state.

### EC-009 — Repeated result equal to best

The system shall keep the same best result and shall not create an inconsistent duplicate progress state.

### EC-010 — Result comparison before display rounding

The system shall compare results using their exact proportions before converting them to displayed whole-number percentages. Two results that display the same rounded percentage may still have different exact values.

### EC-011 — Progress data unavailable or malformed

If persisted progress cannot be read or does not match the expected structure, the system shall fail safely by treating affected progress as unavailable. The application shall remain usable for learning, and it shall not display an unverified score.

### EC-012 — Browser data cleared

If the user clears the browser’s stored application data, the MVP may lose local progress. The application shall start with no progress and shall not claim that prior progress was restored.

### EC-013 — Direct access to later lesson

The system shall open the requested later lesson even when earlier lessons are incomplete.

### EC-014 — Content consistency

Every released lesson shall contain at least one exercise, and every exercise shall have one unambiguous expected answer. A lesson that violates this condition shall not be considered valid MVP content.

## 10. Non-Functional Requirements

### NFR-001 — Usability

The primary learning flow shall be understandable without external instructions. The current lesson, selected answer, feedback, and available next action shall be visually distinguishable.

### NFR-002 — Accessibility

Interactive controls shall be operable using the supported input mechanisms of the selected implementation. Labels, feedback, and completion states shall be available in a form that assistive technologies can interpret.

### NFR-003 — Responsiveness

The core learning flow shall remain usable on common desktop and mobile-sized browser viewports unless a later approved requirement limits the supported viewport range.

### NFR-004 — Reliability

A normal reload or browser restart shall not discard successfully persisted progress.

### NFR-005 — Determinism

Given the same content and submitted answers, exercise evaluation, accuracy calculation, completion state, and best-result behavior shall produce the same outcome.

### NFR-006 — Maintainability

Learning content and progress behavior shall be organized so that adding or revising a lesson does not require duplicating evaluation logic.

### NFR-007 — Testability

The implementation shall make it possible to verify lesson access, answer evaluation, feedback, completion, accuracy calculation, best-result preservation, and progress restoration.

### NFR-008 — Privacy

The MVP shall not require collection, transmission, or storage of personal account information.

### NFR-009 — Content quality

All initial content shall be reviewed for English correctness, technical relevance, clarity, and unambiguous exercise answers before release.

## 11. Acceptance Criteria

The MVP is functionally acceptable when all of the following are demonstrably true:

1. The application displays three modules with two lessons in each module.
2. The user can open every lesson without completing another lesson first.
3. Every lesson includes instructional content, contextual vocabulary review, and exercises.
4. The user can answer both multiple-choice and true/false exercises.
5. The system rejects an exercise submission with no selected answer.
6. The user can change a selected answer before submission, and the system evaluates only the final selection.
7. After submission, the answer is final for the current attempt.
8. The system displays immediate correct/incorrect feedback after each valid submission.
9. Incorrect answers display the correct answer and an accessible explanation with Portuguese support when necessary.
10. English is used as the primary language for technical terms, examples, exercise prompts, and answer options, with Portuguese translations or explanations as support.
11. A lesson remains incomplete until every exercise has been answered in the current attempt.
12. A lesson becomes completed after all its exercises have been answered, including when the accuracy is 0%.
13. An interrupted lesson attempt can be restarted without recovering its previous answers.
14. Restarting an interrupted attempt preserves previous completion states and best results.
15. The system compares completed lesson results using the exact proportion of correct answers to total exercises, without prior rounding.
16. The system displays lesson percentages as mathematically rounded whole numbers.
17. Repeating a lesson cannot remove its completion state.
18. An interrupted lesson attempt can be restarted at the first exercise without recovering its previous answers.
19. A lower exact repeated result cannot replace the stored best result.
20. An equal or higher exact repeated result is retained as the best result.
21. The application restores completion and best-result data after a normal reload.
22. The application restores completion and best-result data after closing and reopening in the same browser profile.
23. The application does not require login or authentication.
24. The application does not depend on a specific programming language, framework, vendor, or tool in order to understand the initial lessons.
25. The learning path clearly communicates completion and best accuracy for each lesson.
26. Invalid or unavailable stored progress does not cause a fabricated result or prevent the user from accessing lessons.
27. The core requirements are covered by repeatable verification appropriate to the implementation selected during technical planning.

## 12. Out of Scope

The following are explicitly excluded from the MVP:

- User accounts, authentication, and cloud synchronization.
- Cross-browser or cross-device progress synchronization.
- Initial placement or level-assessment tests.
- AI-generated runtime explanations, feedback, or conversations.
- AI-based writing correction.
- Voice input, pronunciation assessment, and speech recognition.
- Audio lessons and listening-comprehension exercises.
- Exercises other than multiple-choice and true/false.
- A separate vocabulary-management area or spaced-repetition system.
- Adaptive paths, automatic recommendations, or personalized difficulty.
- Mandatory lesson unlocking or prerequisite enforcement.
- Social features, collaboration, messaging, and leaderboards.
- Complex gamification, rewards, streaks, and virtual currencies.
- Content-management or authoring administration tools.
- Integrations with external documentation platforms or services.
- Monetization, subscriptions, payments, and advertising.
- Native mobile applications.
- Support for learner-support languages beyond English and Portuguese.
- Formal proficiency certification.
- Advanced analytics beyond lesson completion and best accuracy.
- Selection of implementation technologies or definition of the technical architecture.

## 13. Future Decisions Required Before Technical Planning

The following items are intentionally not decided by this functional specification and must be addressed in the approved technical plan:

1. The target runtime and supported browsers or platforms.
2. The persistence mechanism for same-browser progress.
3. The content representation and validation approach.
4. The application architecture and module boundaries.
5. The testing tools and test strategy.
6. The exact number of exercises per lesson.
7. The visual design system and detailed interaction design.
8. The packaging, deployment, and portfolio demonstration approach.

These decisions must not expand the functional scope without a new approved specification or an explicit scope amendment.
