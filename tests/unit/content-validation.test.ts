import { describe, expect, it } from 'vitest'

import { learningPath } from '../../src/content/learning-path'
import { validateLearningPath } from '../../src/content/validate-content'

describe('learning path content', () => {
  it('validates the complete initial content set', () => {
    const result = validateLearningPath(learningPath)

    expect(result).toEqual({ valid: true, errors: [] })
    expect(learningPath.modules).toHaveLength(3)
    expect(learningPath.modules.flatMap((item) => item.lessons)).toHaveLength(6)
  })

  it('rejects missing required bilingual lesson content', () => {
    const invalidContent = structuredClone(learningPath)
    invalidContent.modules[0].lessons[0].explanation.en = ''

    const result = validateLearningPath(invalidContent)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'lesson:lesson-1: bilingual explanation is required',
    )
  })

  it('rejects duplicate IDs and invalid exercise options', () => {
    const invalidContent = structuredClone(learningPath)
    invalidContent.modules[0].lessons[0].exercises[0].id =
      invalidContent.modules[0].lessons[1].exercises[0].id
    invalidContent.modules[0].lessons[0].exercises[0].correctOptionId =
      'missing'

    const result = validateLearningPath(invalidContent)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'Duplicate exercise ID: lesson-2-exercise-1',
    )
    expect(result.errors).toContain(
      'lesson:lesson-1.exercise:lesson-2-exercise-1: correct answer must reference an available option',
    )
  })

  it('rejects an exercise without a correct answer', () => {
    const invalidContent = structuredClone(learningPath)
    Reflect.deleteProperty(
      invalidContent.modules[0].lessons[0].exercises[0],
      'correctOptionId',
    )

    const result = validateLearningPath(invalidContent)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'lesson:lesson-1.exercise:lesson-1-exercise-1: correct answer must reference an available option',
    )
  })

  it('rejects an ambiguous true-false exercise', () => {
    const invalidContent = structuredClone(learningPath)
    invalidContent.modules[0].lessons[0].exercises[3].options[1].id = 'true'

    const result = validateLearningPath(invalidContent)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Duplicate option ID: true')
    expect(result.errors).toContain(
      'lesson:lesson-1.exercise:lesson-1-exercise-4: true-false exercises require exactly true and false options',
    )
  })

  it('rejects lessons with the wrong exercise distribution', () => {
    const invalidContent = structuredClone(learningPath)
    invalidContent.modules[0].lessons[0].exercises.pop()

    const result = validateLearningPath(invalidContent)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'lesson:lesson-1: exactly five exercises are required',
    )
    expect(result.errors).toContain(
      'lesson:lesson-1: exactly two true-false exercises are required',
    )
  })
})
