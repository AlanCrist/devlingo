import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.route('**/api.dictionaryapi.dev/**', async (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          phonetics: [{ text: '/rʌn ɪnˈtuː/' }],
          meanings: [
            {
              partOfSpeech: 'phrasal verb',
              definitions: [
                {
                  definition: 'To encounter something unexpectedly.',
                  example: 'I ran into an issue.',
                },
              ],
            },
          ],
        },
      ]),
    }),
  )
  await page.route('**/api.languagetool.org/**', async (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ matches: [] }),
    }),
  )
  await page.goto('.')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('saves, studies, reviews, archives, restores, and removes a record', async ({
  page,
}) => {
  await page.getByRole('button', { name: 'Smart Notebook' }).click()
  await page.getByLabel('Word or expression').fill('run into')
  await page
    .getByLabel('Source sentence (optional)')
    .fill('I ran into an issue.')
  await page.getByRole('button', { name: 'Save term' }).click()

  await expect(page.getByRole('heading', { name: 'run into' })).toBeVisible()
  await expect(
    page.getByText('To encounter something unexpectedly.'),
  ).toBeVisible()
  await page
    .getByPlaceholder('Write your sentence in English')
    .fill('I ran into a problem.')
  await page.getByRole('button', { name: 'Check and save' }).click()
  await expect(page.getByText('I ran into a problem.')).toBeVisible()

  await page.getByRole('button', { name: 'Start review' }).click()
  await page.getByRole('button', { name: 'I’m ready' }).click()
  await page.getByRole('button', { name: 'Continue to production' }).click()
  await page.locator('textarea').fill('We run into another issue.')
  await page.getByRole('button', { name: 'Submit sentence' }).click()
  await expect(page.getByRole('heading', { name: 'run into' })).toBeVisible()

  await page.getByRole('button', { name: 'Archive' }).click()
  await page.getByRole('button', { name: 'Back to notebook' }).click()
  await page.getByRole('button', { name: 'Archived' }).click()
  await page.getByRole('button', { name: /run into/ }).click()
  await page.getByRole('button', { name: 'Restore' }).click()
  page.once('dialog', (dialog) => dialog.accept())
  await page.getByRole('button', { name: 'Remove' }).click()
  await expect(page.getByText('No archived records yet')).toBeVisible()
})
