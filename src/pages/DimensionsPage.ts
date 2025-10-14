import { Page, expect } from '@playwright/test';

export interface DimensionData {
  warehouse: string;
  mrp: string;
  unitCost: string;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  color: string;
  size: string;
}

export class DimensionsPage {
  private page: Page;

  // Locators
  private readonly warehouseDropdown = () => this.page.locator('#warehouse_id');
  private readonly mrpInput = () => this.page.locator('#dimension-fields #variant_name2');
  private readonly unitCostInput = () => this.page.locator('input[name="data[Global][default_cost_price]"]');
  private readonly lengthInput = () => this.page.locator('input[name="data[Global][length_mm]"]');
  private readonly breadthInput = () => this.page.locator('input[name="data[Global][breadth_mm]"]');
  private readonly heightInput = () => this.page.locator('input[name="data[Global][height_mm]"]');
  private readonly weightInput = () => this.page.locator('input[name="data[Global][weight_gm]"]');
  private readonly colorInput = () => this.page.locator('input[name="data[Global][color]"]');
  private readonly sizeInput = () => this.page.locator('input[name="data[Global][size]"]');
  private readonly saveStockButton = () => this.page.getByRole('button', { name: 'Save Stock & Proceed →' });
  private readonly pageHeading = () => this.page.getByRole('heading', { name: '2. Dimensions, Cost & Stock' });
  private readonly successMessage = () => this.page.getByText('The SKU information has been updated');
  private readonly skuCodeInput = () => this.page.locator('table tbody tr:nth-child(2) td:nth-child(3) input');
  private readonly closeSuccessButton = () => this.page.getByRole('button', { name: '×' });

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify Dimensions page is loaded
   */
  async verifyDimensionsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/Skus\/add_stock\/\d+/);
    await expect(this.pageHeading()).toBeVisible();
  }

  /**
   * Select warehouse
   * @param warehouse - Warehouse name
   */
  async selectWarehouse(warehouse: string): Promise<void> {
    await this.warehouseDropdown().click();
    await this.warehouseDropdown().selectOption([warehouse]);
  }

  /**
   * Enter product dimensions and details
   * @param dimensionData - Object containing all dimension data
   */
  async enterDimensions(dimensionData: DimensionData): Promise<void> {
    await this.selectWarehouse(dimensionData.warehouse);
    await this.mrpInput().fill(dimensionData.mrp);
    await this.unitCostInput().fill(dimensionData.unitCost);
    await this.lengthInput().fill(dimensionData.length);
    await this.breadthInput().fill(dimensionData.breadth);
    await this.heightInput().fill(dimensionData.height);
    await this.weightInput().fill(dimensionData.weight);
    await this.colorInput().fill(dimensionData.color);
    await this.sizeInput().fill(dimensionData.size);
  }

  /**
   * Save stock and proceed
   */
  async saveStockAndProceed(): Promise<void> {
    await this.saveStockButton().click();
  }

  /**
   * Verify SKU updated message
   */
  async verifySKUUpdatedMessage(): Promise<void> {
    await expect(this.successMessage()).toBeVisible();
  }

  /**
   * Complete dimensions setup flow
   * @param dimensionData - Object containing all dimension data
   */
  async setupDimensions(dimensionData: DimensionData): Promise<void> {
    await this.verifyDimensionsPage();
    await this.enterDimensions(dimensionData);
    await this.saveStockAndProceed();
    await this.verifySKUUpdatedMessage();
  }

  /**
   * Verify dimensions page title
   * @param expectedTitle - Expected page title
   */
  async verifyDimensionsPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Extract SKU code from the table
   * @returns SKU code string
   */
  async extractSKUCode(): Promise<string> {
    const skuCode = await this.skuCodeInput().inputValue();
    return skuCode;
  }

  /**
   * Verify SKU code matches pattern
   * @param skuCode - SKU code to verify
   * @param pattern - Regex pattern to match
   */
  async verifySKUCodePattern(skuCode: string, pattern: string): Promise<void> {
    expect(skuCode).toBeTruthy();
    expect(skuCode).toMatch(new RegExp(pattern));
  }

  /**
   * Close success message
   */
  async closeSuccessMessage(): Promise<void> {
    await this.closeSuccessButton().click();
  }

  /**
   * Complete product creation with SKU extraction
   * @param dimensionData - Object containing all dimension data
   * @param expectedTitle - Expected page title
   * @param skuPattern - SKU validation pattern
   * @returns SKU code
   */
  async createProductAndExtractSKU(dimensionData: DimensionData, expectedTitle: string, skuPattern: string): Promise<string> {
    await this.verifyDimensionsPageTitle(expectedTitle);
    await this.verifyProductSavedMessage();
    await this.closeSuccessMessage();
    
    const skuCode = await this.extractSKUCode();
    console.log('Generated SKU Code:', skuCode);
    await this.verifySKUCodePattern(skuCode, skuPattern);
    
    await this.enterDimensions(dimensionData);
    await this.page.waitForTimeout(2000); // Explicit wait as in original test
    
    return skuCode;
  }

  /**
   * Verify product saved message
   */
  async verifyProductSavedMessage(): Promise<void> {
    await expect(this.page.getByText('The product has been saved')).toBeVisible();
  }
}
