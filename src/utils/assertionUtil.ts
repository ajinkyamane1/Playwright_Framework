import { expect, Page } from '@playwright/test';

export class AssertionUtil {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Assert page URL matches pattern
   * @param urlPattern - URL pattern to match
   */
  async assertURL(urlPattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * Assert element is visible
   * @param locator - Element locator
   */
  async assertElementVisible(locator: any): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert text is visible on page
   * @param text - Text to verify
   */
  async assertTextVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  /**
   * Assert page title
   * @param expectedTitle - Expected page title
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert element contains text
   * @param locator - Element locator
   * @param expectedText - Expected text content
   */
  async assertElementText(locator: any, expectedText: string): Promise<void> {
    await expect(locator).toContainText(expectedText);
  }
}
