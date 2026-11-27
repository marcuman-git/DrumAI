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

test('mobile drummer score supports an excerpt, loop range and direct note navigation',async({page})=>{
 await page.setViewportSize({width:390,height:844})
 await prepareApp(page);await page.goto('/')
 await page.getByRole('button',{name:/song practice/i}).click()
 await page.getByRole('button',{name:'Load Back in Black excerpt'}).click()
 await expect(page.getByLabel('Score count labels')).toHaveValue('eighth')
 const score=page.getByRole('region',{name:'Scrollable song score'})
 await expect(score).toHaveAttribute('tabindex','0');await score.focus();await expect(score).toBeFocused()
 await expect(page.getByRole('img',{name:/Bar \d+ drum notation/})).toHaveCount(4)
 await page.getByRole('button',{name:'Select loop bars'}).click()
 await page.getByRole('button',{name:'3 · Groove',exact:true}).click()
 await page.getByRole('button',{name:'4 · Groove',exact:true}).click()
 await expect(page.getByRole('button',{name:'Loop On',exact:true})).toHaveAttribute('aria-pressed','true')
 await page.getByRole('button',{name:'Start at bar 3, slot 9',exact:true}).click()
 await expect(page.getByText(/Start at bar 3, slot 9/)).toBeVisible()
 await expect(page.getByRole('button',{name:'Play score'})).toBeEnabled()
 await page.getByLabel('Score zoom').selectOption('125')
 await expect(page.getByLabel('Score zoom')).toHaveValue('125')
 await page.getByRole('button',{name:'Play score'}).click()
 await expect(page.getByRole('button',{name:'Stop score'})).toBeEnabled()
 await page.getByRole('button',{name:'Stop score'}).click()
 await expect(page.getByRole('button',{name:'Play score'})).toBeEnabled()
})

test('snare studies keep compound meters in the study player and transfer measured rolls to Song Practice',async({page})=>{
 await prepareApp(page);await page.goto('/');await page.getByRole('button',{name:/song practice/i}).click()
 await page.getByRole('button',{name:'Snare Studies',exact:true}).click()
 await page.getByLabel('Snare study').selectOption('six-eight')
 await expect(page.getByRole('img',{name:'Snare study bar 1, 6/8'})).toBeVisible()
 await expect(page.getByRole('button',{name:'Open study in Song Practice'})).toBeDisabled()
 await page.getByLabel('Snare study').selectOption('five-roll')
 await page.getByRole('button',{name:'Open study in Song Practice'}).click()
 await expect(page.getByRole('heading',{name:'Measured five-stroke roll',exact:true})).toBeVisible()
 await expect(page.getByRole('button',{name:'Play score'})).toBeEnabled()
})
