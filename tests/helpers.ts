import { Page } from '@playwright/test';

const setValidCredentials = async (page: Page) => {
  await page.setExtraHTTPHeaders({
    Authorization: `Basic ${btoa(
      `${process.env.PROTECTED_BASIC_AUTH_USER}:${process.env.PROTECTED_BASIC_AUTH_PASS}`,
    )}`,
  });
};

export { setValidCredentials };
