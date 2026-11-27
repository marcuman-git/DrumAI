import { expect, test } from '@playwright/test'

async function prepareApp(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'drummaster-ai-user-profile-fallback-v1',
      JSON.stringify({
        id: 'e2e-profile',
        createdAt: '2026-10-24T00:00:00.000Z',
        updatedAt: '2026-10-24T00:00:00.000Z',
        experienceLevel: 'Intermediate',
        styles: ['Rock'],
        goals: ['Improve timing'],
        dailyMinutes: 30,
        drumSetup: 'Practice Pad',
        hasMidiDevice: false,
      }),
    )
  })
}

test('dashboard and key modules load', async ({ page }) => {
  await prepareApp(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'DrumMaster AI — v1.0 RC' })).toBeVisible()
  await expect(page.getByText('Home Dashboard')).toBeVisible()
  await expect(page.getByRole('button', { name: /smart metronome/i })).toBeVisible()

  await page.getByRole('button', { name: /smart metronome/i }).click()
  await expect(page.getByText('Smart Metronome')).toBeVisible()

  await page.getByRole('button', { name: /timing analyzer/i }).click()
  await expect(page.getByText('Timing Analyzer')).toBeVisible()

  await page.getByRole('button', { name: /rhythm reading/i }).click()
  await expect(page.getByText('Rhythm Reading')).toBeVisible()

  await page.getByRole('button', { name: /song practice/i }).click()
  await expect(page.getByText('Song Practice')).toBeVisible()
})

test('mobile song chart exposes its scheduled strokes and keyboard-scrollable grid', async ({ page }) => {
  await page.setViewportSize({width:390,height:844})
  await prepareApp(page)
  await page.goto('/')
  await page.getByRole('button',{name:/song practice/i}).click()
  await page.getByRole('button',{name:'Show basic kit'}).click()
  await expect(page.getByLabel('Staff count labels')).toHaveValue('eighth')
  const grid=page.getByRole('region',{name:'Drum chart grid, scroll horizontally for later slots'})
  await expect(grid).toHaveAttribute('tabindex','0')
  await grid.focus()
  await expect(grid).toBeFocused()
  await page.getByText('Review scheduled strokes before playback',{exact:true}).click()
  const audit=page.getByLabel('Scheduled stroke audit')
  await expect(audit.locator('li')).toHaveCount(12)
  await expect(audit).toContainText('Bar 1, slot 15: Hi-hat')
  await expect(audit).not.toContainText('Bar 1, slot 6:')
  await expect(page.getByRole('button',{name:'Play chart'})).toBeEnabled()
})
