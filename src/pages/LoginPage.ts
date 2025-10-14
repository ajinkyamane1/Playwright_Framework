import { Page, expect } from '@playwright/test';

export class LoginPage {
  private page: Page;

  // Locators
  private readonly emailInput = () => this.page.getByRole('textbox', { name: 'Email address' });
  private readonly passwordInput = () => this.page.getByRole('textbox', { name: 'Password' });
  private readonly signInButton = () => this.page.getByRole('button', { name: 'Sign in' });

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to login page
   * @param url - Login URL
   */
  async navigateToLogin(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Verify login page title
   * @param expectedTitle - Expected page title
   */
  async verifyLoginPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify dashboard elements after login
   * @param dashboardLinks - Array of expected dashboard links
   */
  async verifyDashboardAccess(dashboardLinks: string[]): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    
    // Close any error notifications if they appear
    const closeButton = this.page.getByRole('button', { name: '×' });
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
    
    // Verify dashboard elements are visible
    for (const linkName of dashboardLinks) {
      await expect(this.page.getByRole('link', { name: linkName })).toBeVisible();
    }
  }

  /**
   * Verify username field value
   * @param expectedValue - Expected username value
   */
  async verifyUsernameValue(expectedValue: string): Promise<void> {
    await expect(this.emailInput()).toHaveValue(expectedValue);
  }

  /**
   * Verify password field value
   * @param expectedValue - Expected password value
   */
  async verifyPasswordValue(expectedValue: string): Promise<void> {
    await expect(this.passwordInput()).toHaveValue(expectedValue);
  }

  /**
   * Perform login with credentials
   * @param username - User email
   * @param password - User password
   */
  async login(username: string, password: string): Promise<void> {
    await this.emailInput().fill(username);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  /**
   * Complete login flow
   * @param url - Login URL
   * @param username - User email
   * @param password - User password
   */
  async performLogin(url: string, username: string, password: string): Promise<void> {
    await this.navigateToLogin(url);
    await this.login(username, password);
  }
}
