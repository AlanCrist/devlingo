import { expect, test } from '@playwright/test'

test('supports keyboard operation and accessible feedback', async ({
  page,
}) => {
  await page.goto('.')
  const lessonButton = page.getByRole('button', { name: /Talking about bugs/i })
  await lessonButton.focus()
  await expect(lessonButton).toBeFocused()
  await page.keyboard.press('Enter')

  const firstRadio = page.getByRole('radio').first()
  await firstRadio.focus()
  await page.keyboard.press('Space')
  await expect(firstRadio).toBeChecked()

  const submitButton = page.getByRole('button', { name: 'Submit answer' })
  await submitButton.focus()
  await expect(submitButton).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toBeVisible()
})

test('remains usable at a mobile-sized viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 })
  await page.goto('.')

  await expect(page.getByRole('heading', { name: 'DevLingo' })).toBeVisible()
  await expect(
    page.getByRole('button', { name: /Talking about bugs/i }),
  ).toBeVisible()
  await page.getByRole('button', { name: /Talking about bugs/i }).click()
  await expect(
    page.getByRole('heading', { name: 'Talking about bugs' }),
  ).toBeVisible()

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  )
  expect(hasHorizontalOverflow).toBe(false)
})
