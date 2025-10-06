import { test, expect } from '@playwright/test'

test('assistant replies to a message', async ({ page }) => {
  await page.goto('http://localhost:3000')
  const textarea = page.locator('textarea')
  await textarea.fill('Merhaba!')
  await textarea.press('Enter')
  await expect(page.locator('text=Gönül Abla')).toBeVisible()
  // Expect some assistant bubble to appear
  await expect(page.locator('text=Gönül Abla').first()).toBeVisible()
})
