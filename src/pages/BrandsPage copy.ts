import { Page, expect } from '@playwright/test';

export class BrandsPage {
  private page: Page;

  // Locators
  private readonly brandNameInput = () => this.page.locator('input[name="data[Brand][title]"]');
  private readonly brandShortCodeInput = () => this.page.getByRole('textbox', { name: 'Add Brand short code' });
  private readonly addButton = () => this.page.getByRole('button', { name: 'Add' });
  private readonly pageHeading = () => this.page.getByRole('heading', { name: 'Brands' });
  private readonly successMessage = () => this.page.getByText('The Brand has been added');

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify Brands page is loaded
   */
  async verifyBrandsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/brands\/index/);
    await expect(this.pageHeading()).toBeVisible();
  }

  /**
   * Enter brand name
   * @param brandName - Name of the brand
   */
  async enterBrandName(brandName: string): Promise<void> {
    await this.brandNameInput().fill(brandName);
  }

  /**
   * Enter brand short code
   * @param shortCode - Short code for the brand
   */
  async enterBrandShortCode(shortCode: string): Promise<void> {
    await this.brandShortCodeInput().fill(shortCode);
  }

  /**
   * Click Add button
   */
  async clickAddButton(): Promise<void> {
    await this.addButton().click();
  }

  /**
   * Verify brand added message
   */
  async verifyBrandAddedMessage(): Promise<void> {
    await expect(this.successMessage()).toBeVisible();
  }

  /**
   * Verify brand appears in table
   * @param brandName - Name of the brand to verify
   */
  async verifyBrandInTable(brandName: string): Promise<void> {
    await expect(this.page.getByRole('cell', { name: brandName })).toBeVisible();
  }

  /**
   * Add a new brand
   * @param brandName - Name of the brand
   * @param shortCode - Short code for the brand
   */
  async addBrand(brandName: string, shortCode: string): Promise<void> {
    await this.verifyBrandsPage();
    await this.enterBrandName(brandName);
    await this.enterBrandShortCode(shortCode);
    await this.clickAddButton();
    await this.verifyBrandAddedMessage();
    await this.verifyBrandInTable(brandName);
  }
}
