import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../../src/App'

const answerLessonOne = () => {
  for (let exerciseIndex = 0; exerciseIndex < 5; exerciseIndex += 1) {
    const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[[0, 1, 0, 0, 1][exerciseIndex]])
    fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }))
    if (exerciseIndex < 4) {
      fireEvent.click(screen.getByRole('button', { name: 'Next exercise' }))
    }
  }
}

describe('application shell', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the DevLingo shell', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'DevLingo' }),
    ).toBeInTheDocument()
  })

  it('renders all modules and allows direct access to a later lesson', () => {
    render(<App />)

    expect(screen.getAllByRole('button')).toHaveLength(6)
    fireEvent.click(
      screen.getByRole('button', { name: /Reading technical documentation/i }),
    )

    expect(
      screen.getByRole('heading', { name: 'Reading technical documentation' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Vocabulary review')).toBeInTheDocument()
    expect(screen.getAllByText(/prerequisite/i).length).toBeGreaterThan(0)
  })

  it('supports selection changes and provides immediate feedback', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Talking about bugs/i }))

    fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Select an answer')

    fireEvent.click(screen.getByLabelText(/Create a new feature/))
    fireEvent.click(screen.getByLabelText(/Find and correct a problem/))
    fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
    expect(
      screen.queryByRole('button', { name: 'Submit answer' }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Next exercise' }),
    ).toBeInTheDocument()
  })

  it('completes a lesson and displays the best result in the path', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Talking about bugs/i }))

    answerLessonOne()

    expect(screen.getByText('Lesson completed')).toBeInTheDocument()
    expect(screen.getByText('Your result:')).toHaveTextContent('100%')

    fireEvent.click(
      screen.getByRole('button', { name: /Back to learning path/i }),
    )
    expect(screen.getByText(/Completed.*Best score: 100%/)).toBeInTheDocument()
  })

  it('restores completed progress after the application is reopened', () => {
    const firstRender = render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Talking about bugs/i }))
    answerLessonOne()

    firstRender.unmount()
    render(<App />)

    expect(screen.getByText(/Completed.*Best score: 100%/)).toBeInTheDocument()
  })

  it('starts an interrupted lesson again at its first exercise', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Talking about bugs/i }))
    fireEvent.click(screen.getByLabelText(/Find and correct a problem/))
    fireEvent.click(screen.getByRole('button', { name: 'Submit answer' }))
    fireEvent.click(
      screen.getByRole('button', { name: /Back to learning path/i }),
    )
    fireEvent.click(screen.getByRole('button', { name: /Talking about bugs/i }))

    expect(screen.getByText('Exercise 1 of 5')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /What does “fix a bug” mean/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Correct!')).not.toBeInTheDocument()
  })

  it('remains usable when persisted progress is malformed', () => {
    localStorage.setItem('devlingo.progress', '{not-json')

    render(<App />)

    expect(screen.getAllByRole('button')).toHaveLength(6)
    expect(screen.queryByText(/Best score/)).not.toBeInTheDocument()
  })
})
