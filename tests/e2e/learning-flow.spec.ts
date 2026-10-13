import { expect, test, type Page } from '@playwright/test'

const correctAnswers = [0, 1, 0, 0, 1]
const incorrectAnswers = [1, 0, 1, 1, 0]

const openLesson = async (page: Page) => {
  await page.getByRole('button', { name: /Talking about bugs/i }).click()
}

const completeLesson = async (page: Page, answers: number[]) => {
  for (
    let exerciseIndex = 0;
    exerciseIndex < answers.length;
    exerciseIndex += 1
  ) {
    await page.getByRole('radio').nth(answers[exerciseIndex]).check()
    await page.getByRole('button', { name: 'Submit answer' }).click()
    if (exerciseIndex < answers.length - 1) {
      await page.getByRole('button', { name: 'Next exercise' }).click()
    }
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('.')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('opens a later lesson and presents bilingual content', async ({
  page,
}) => {
  await page
    .getByRole('button', { name: /Reading technical documentation/i })
    .click()

  await expect(
    page.getByRole('heading', { name: 'Reading technical documentation' }),
  ).toBeVisible()
  await expect(page.getByText('Vocabulary review')).toBeVisible()
  await expect(page.getByText(/prerequisite/i).first()).toBeVisible()
})

test('completes, repeats, and preserves the best exact result', async ({
  page,
}) => {
  await openLesson(page)
  await completeLesson(page, correctAnswers)

  await expect(page.getByText('Lesson completed')).toBeVisible()
  await expect(page.getByText('Your result:').locator('..')).toContainText(
    '100%',
  )

  await page.getByRole('button', { name: /Back to learning path/i }).click()
  await expect(page.getByText(/Completed.*Best score: 100%/)).toBeVisible()

  await openLesson(page)
  await completeLesson(page, incorrectAnswers)

  await expect(page.getByText('Your result:').locator('..')).toContainText('0%')
  await page.getByRole('button', { name: /Back to learning path/i }).click()
  await expect(page.getByText(/Completed.*Best score: 100%/)).toBeVisible()
})

test('restores completed progress and restarts interrupted attempts', async ({
  page,
}) => {
  await openLesson(page)
  await completeLesson(page, correctAnswers)
  await page.getByRole('button', { name: /Back to learning path/i }).click()

  await page.reload()
  await expect(page.getByText(/Completed.*Best score: 100%/)).toBeVisible()

  await openLesson(page)
  await page.getByRole('radio').first().check()
  await page.getByRole('button', { name: 'Submit answer' }).click()
  await page.getByRole('button', { name: /Back to learning path/i }).click()
  await openLesson(page)

  await expect(page.getByText('Exercise 1 of 5')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: /What does “fix a bug” mean/i }),
  ).toBeVisible()
  await expect(page.getByText('Lesson completed')).not.toBeVisible()
})
