import { Page } from '@playwright/test';

export class ActionUtil {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for specified timeout
   * @param timeout - Timeout in milliseconds
   */
  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  /**
   * Hover over element
   * @param locator - Element locator
   */
  async hoverElement(locator: any): Promise<void> {
    await locator.hover();
  }

  /**
   * Click element
   * @param locator - Element locator
   */
  async clickElement(locator: any): Promise<void> {
    await locator.click();
  }

  /**
   * Fill input field
   * @param locator - Element locator
   * @param text - Text to fill
   */
  async fillInput(locator: any, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Select option from dropdown
   * @param locator - Dropdown locator
   * @param option - Option to select
   */
  async selectOption(locator: any, option: string[]): Promise<void> {
    await locator.selectOption(option);
  }

  /**
   * Navigate to URL
   * @param url - URL to navigate to
   */
  async navigateToURL(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout
   */
  async waitForElement(locator: any, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get element text content
   * @param locator - Element locator
   * @returns Text content of element
   */
  async getElementText(locator: any): Promise<string> {
    return await locator.textContent();
  }
}
