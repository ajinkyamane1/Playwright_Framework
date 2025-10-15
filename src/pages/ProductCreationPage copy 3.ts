import { Page, expect } from '@playwright/test';

export class ProductCreationPage {
  private page: Page;

  // Locators
  private readonly productNameInput = () => this.page.getByRole('textbox', { name: 'eg. iPhone' });
  private readonly topLevelCategoryDropdown = () => this.page.locator('#top_level_category');
  private readonly subCategoryDropdown = () => this.page.locator('#sub_category');
  private readonly createProductButton = () => this.page.getByRole('button', { name: 'Create Product & SKU' });
  private readonly pageHeading = () => this.page.getByRole('heading', { name: '1. Add a Product' });
  private readonly successMessage = () => this.page.getByText('The product has been saved');

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify Add a Product page is loaded
   */
  async verifyAddProductPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/products\/create/);
    await expect(this.pageHeading()).toBeVisible();
  }

  /**
   * Verify Add a Product page title
   * @param expectedTitle - Expected page title
   */
  async verifyProductCreatePageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify product name field value
   * @param expectedValue - Expected product name value
   */
  async verifyProductNameValue(expectedValue: string): Promise<void> {
    await expect(this.productNameInput()).toHaveValue(expectedValue);
  }

  /**
   * Enter product name
   * @param productName - Name of the product
   */
  async enterProductName(productName: string): Promise<void> {
    await this.productNameInput().fill(productName);
  }

  /**
   * Select top level category
   * @param category - Category to select
   */
  async selectTopLevelCategory(category: string): Promise<void> {
    await this.topLevelCategoryDropdown().click();
    await this.topLevelCategoryDropdown().selectOption([category]);
  }

  /**
   * Select sub category
   * @param subCategory - Sub category to select
   */
  async selectSubCategory(subCategory: string): Promise<void> {
    await this.subCategoryDropdown().click();
    await this.subCategoryDropdown().selectOption([subCategory]);
  }

  /**
   * Click Create Product & SKU button
   */
  async clickCreateProduct(): Promise<void> {
    await this.createProductButton().click();
  }

  /**
   * Verify product saved message
   */
  async verifyProductSavedMessage(): Promise<void> {
    await expect(this.successMessage()).toBeVisible();
  }

  /**
   * Complete product creation flow
   * @param productName - Name of the product
   * @param topLevelCategory - Top level category
   * @param subCategory - Sub category
   */
  async createProduct(productName: string, topLevelCategory: string, subCategory: string): Promise<void> {
    await this.verifyAddProductPage();
    await this.enterProductName(productName);
    await this.selectTopLevelCategory(topLevelCategory);
    await this.selectSubCategory(subCategory);
    await this.clickCreateProduct();
    await this.verifyProductSavedMessage();
  }
}
