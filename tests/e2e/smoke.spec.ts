import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/auth/sign-in',
  '/onboarding',
  '/dashboard',
  '/lesson',
  '/question-bank',
  '/progress',
  '/settings',
];

test.describe('Smoke navigation', () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(new RegExp(`${route.replace('/', '\\/')}$`));
    });
  }
});
