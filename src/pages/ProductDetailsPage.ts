import { Page, expect } from '@playwright/test';

export interface ProductValidationData {
  skuCode: string;
  category: string;
  productName: string;
  mrp: string;
  unitCost: string;
  length: string;
  breadth: string;
  height: string;
  weight: string;
  size: string;
  color: string;
}

export class ProductDetailsPage {
  private page: Page;

  // Locators
  private readonly skuCodeText = (skuCode: string) => this.page.locator('text=SKU Code:').locator('..').getByText(skuCode);
  private readonly mrpField = (value: string) => this.page.locator(`input[value="${value}"]`);
  private readonly costField = (value: string) => this.page.locator(`input[value="${value}"]`);
  private readonly lengthField = (value: string) => this.page.locator(`input[placeholder="Length"][value="${value}"]`);
  private readonly breadthField = (value: string) => this.page.locator(`input[placeholder="Breadth"][value="${value}"]`);
  private readonly heightField = (value: string) => this.page.locator(`input[placeholder="Height"][value="${value}"]`);
  private readonly weightField = (value: string) => this.page.locator(`input[placeholder="Weight"][value="${value}"]`);
  private readonly sizeField = (value: string) => this.page.locator(`input[placeholder="Size"][value="${value}"]`);
  private readonly colorField = (value: string) => this.page.locator(`input[value="${value}"]`);

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Verify product details page title
   * @param expectedTitle - Expected page title
   */
  async verifyProductDetailsPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  /**
   * Verify SKU Code is displayed
   * @param skuCode - SKU code to verify
   */
  async verifySKUCode(skuCode: string): Promise<void> {
    await expect(this.skuCodeText(skuCode)).toBeVisible();
  }

  /**
   * Verify product category
   * @param category - Category to verify
   */
  async verifyCategory(category: string): Promise<void> {
    await expect(this.page.getByText(category)).toBeVisible();
  }

  /**
   * Verify product family/name
   * @param productName - Product name to verify
   */
  async verifyProductFamily(productName: string): Promise<void> {
    await expect(this.page.getByText(productName).nth(1)).toBeVisible();
  }

  /**
   * Verify MRP field
   * @param mrp - MRP value to verify (without decimal)
   */
  async verifyMRP(mrp: string): Promise<void> {
    const mrpValue = mrp.replace('.0', ''); // Remove .0 for field matching
    await expect(this.mrpField(mrpValue)).toBeVisible();
  }

  /**
   * Verify default cost price field
   * @param cost - Cost value to verify (without decimal)
   */
  async verifyCostPrice(cost: string): Promise<void> {
    const costValue = cost.replace('.0', ''); // Remove .0 for field matching
    await expect(this.costField(costValue)).toBeVisible();
  }

  /**
   * Verify length field
   * @param length - Length value to verify (without decimal)
   */
  async verifyLength(length: string): Promise<void> {
    const lengthValue = length.replace('.0', ''); // Remove .0 for field matching
    await expect(this.lengthField(lengthValue)).toBeVisible();
  }

  /**
   * Verify breadth field
   * @param breadth - Breadth value to verify (without decimal)
   */
  async verifyBreadth(breadth: string): Promise<void> {
    const breadthValue = breadth.replace('.0', ''); // Remove .0 for field matching
    await expect(this.breadthField(breadthValue)).toBeVisible();
  }

  /**
   * Verify height field
   * @param height - Height value to verify (without decimal)
   */
  async verifyHeight(height: string): Promise<void> {
    const heightValue = height.replace('.0', ''); // Remove .0 for field matching
    await expect(this.heightField(heightValue)).toBeVisible();
  }

  /**
   * Verify weight field
   * @param weight - Weight value to verify (without decimal)
   */
  async verifyWeight(weight: string): Promise<void> {
    const weightValue = weight.replace('.0', ''); // Remove .0 for field matching
    await expect(this.weightField(weightValue)).toBeVisible();
  }

  /**
   * Verify size field
   * @param size - Size value to verify
   */
  async verifySize(size: string): Promise<void> {
    await expect(this.sizeField(size)).toBeVisible();
  }

  /**
   * Verify color field
   * @param color - Color value to verify
   */
  async verifyColor(color: string): Promise<void> {
    await expect(this.colorField(color)).toBeVisible();
  }

  /**
   * Complete product validation with logging
   * @param validationData - Object containing all validation data
   */
  async validateAllProductDetails(validationData: ProductValidationData): Promise<void> {
    await this.verifySKUCode(validationData.skuCode);
    await this.verifyCategory(validationData.category);
    await this.verifyProductFamily(validationData.productName);
    await this.verifyMRP(validationData.mrp);
    await this.verifyCostPrice(validationData.unitCost);
    await this.verifyLength(validationData.length);
    await this.verifyBreadth(validationData.breadth);
    await this.verifyHeight(validationData.height);
    await this.verifyWeight(validationData.weight);
    await this.verifySize(validationData.size);
    await this.verifyColor(validationData.color);

    // Log validation results
    console.log('✅ Product Details Successfully Validated:');
    console.log(`   • SKU Code: ${validationData.skuCode}`);
    console.log(`   • MRP: ₹${validationData.mrp.replace('.0', '')}`);
    console.log(`   • Default Cost Price: ₹${validationData.unitCost.replace('.0', '')}`);
    console.log(`   • Dimensions: ${validationData.length.replace('.0', '')} x ${validationData.breadth.replace('.0', '')} x ${validationData.height.replace('.0', '')} cm`);
    console.log(`   • Weight: ${validationData.weight.replace('.0', '')} gms`);
    console.log(`   • Size: ${validationData.size}`);
    console.log(`   • Color: ${validationData.color}`);
    console.log(`   • Category: ${validationData.category}`);
  }
}
