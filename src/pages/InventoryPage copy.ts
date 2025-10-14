import { Page, expect } from '@playwright/test';

export class InventoryPage {
  private page: Page;

  // Locators
  private readonly inventoryLink = () => this.page.getByRole('link', { name: 'Inventory' });
  private readonly addProductLink = () => this.page.getByRole('link', { name: '+Add a Product' });
  private readonly setupLink = () => this.page.getByRole('link', { name: 'Setup' });
  private readonly brandsLink = () => this.page.getByRole('link', { name: 'Brands' });
  private readonly searchBox = () => this.page.getByRole('textbox', { name: 'Min 3 chars' });
  private readonly closeSuccessButton = () => this.page.getByRole('button', { name: '×' });

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Hover over Inventory menu and verify visibility
   */
  async hoverInventoryMenu(): Promise<void> {
    await expect(this.inventoryLink()).toBeVisible();
    await this.page.waitForTimeout(3000);
    await this.inventoryLink().hover();
  }

  /**
   * Click on Add a Product link
   */
  async clickAddProduct(): Promise<void> {
    await this.addProductLink().click();
  }

  /**
   * Navigate to add product page
   */
  async navigateToAddProduct(): Promise<void> {
    await this.hoverInventoryMenu();
    await this.clickAddProduct();
  }

  /**
   * Click on Setup dropdown
   */
  async clickSetup(): Promise<void> {
    await this.setupLink().click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * Navigate to Brands page
   */
  async navigateToBrands(): Promise<void> {
    await this.clickSetup();
    await expect(this.brandsLink()).toBeVisible();
    await this.brandsLink().click();
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify we're on inventory index page
   */
  async verifyInventoryIndexPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/skus\/index_new/);
    await this.page.waitForTimeout(3000);
  }

  /**
   * Verify inventory page title
   * @param expectedTitle - Expected page title
   */
  async verifyInventoryPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Close success message
   */
  async closeSuccessMessage(): Promise<void> {
    await this.closeSuccessButton().click();
  }

  /**
   * Search for product by SKU code
   * @param skuCode - SKU code to search for
   */
  async searchProductBySKU(skuCode: string): Promise<void> {
    await this.searchBox().fill(skuCode);
    await this.page.waitForTimeout(2000); // Wait for search results
  }

  /**
   * Verify search results
   * @param expectedResultText - Expected search result text
   * @param skuCode - SKU code that should be visible
   * @param productName - Product name that should be visible
   */
  async verifySearchResults(expectedResultText: string, skuCode: string, productName: string): Promise<void> {
    await expect(this.page.getByText(expectedResultText)).toBeVisible();
    await expect(this.page.getByRole('link', { name: skuCode })).toBeVisible();
    await expect(this.page.getByRole('link', { name: productName })).toBeVisible();
  }

  /**
   * Click on product name to view details
   * @param productName - Product name to click
   */
  async clickProductName(productName: string): Promise<void> {
    await this.page.getByRole('link', { name: productName }).click();
  }

  /**
   * Complete product search and navigation flow
   * @param skuCode - SKU code to search for
   * @param productName - Product name to click
   * @param expectedResultText - Expected search result text
   */
  async searchAndNavigateToProduct(skuCode: string, productName: string, expectedResultText: string): Promise<void> {
    await this.searchProductBySKU(skuCode);
    await this.verifySearchResults(expectedResultText, skuCode, productName);
    await this.clickProductName(productName);
  }
}
