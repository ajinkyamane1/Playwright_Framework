import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductCreationPage } from '../pages/ProductCreationPage';
import { DimensionsPage, DimensionData } from '../pages/DimensionsPage';
import { BrandsPage } from '../pages/BrandsPage';
import { getTestData } from '../utils/testDataUtil';
import { AssertionUtil } from '../utils/assertionUtil';

test.describe('Batch 1: Product Creation and Dimensions Setup', () => {
  test('TC03 - Add Brands and assign it to SKUs', async ({ page }) => {
    // Get test data for TC03
    const testData = getTestData('TC03');
    
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const productCreationPage = new ProductCreationPage(page);
    const dimensionsPage = new DimensionsPage(page);
    const brandsPage = new BrandsPage(page);
    const assertionUtil = new AssertionUtil(page);

    // Step 1-4: Login Flow
    await test.step('User Login', async () => {
      await loginPage.performLogin(
        testData.login.url,
        testData.login.username,
        testData.login.password
      );
    });

    // Step 5-6: Navigate to Add Product
    await test.step('Navigate to Add Product', async () => {
      await inventoryPage.navigateToAddProduct();
    });

    // Step 7-13: Create Product
    await test.step('Create Product', async () => {
      await productCreationPage.createProduct(
        testData.product.name,
        testData.product.topLevelCategory,
        testData.product.subCategory
      );
    });

    // Step 14-25: Setup Dimensions and Stock
    await test.step('Setup Dimensions and Stock', async () => {
      const dimensionData: DimensionData = {
        warehouse: testData.dimensions.warehouse,
        mrp: testData.dimensions.mrp,
        unitCost: testData.dimensions.unitCost,
        length: testData.dimensions.length,
        breadth: testData.dimensions.breadth,
        height: testData.dimensions.height,
        weight: testData.dimensions.weight,
        color: testData.dimensions.color,
        size: testData.dimensions.size
      };
      
      await dimensionsPage.setupDimensions(dimensionData);
    });

    // Step 26-27: Verify Inventory Page
    await test.step('Verify Inventory Page', async () => {
      await inventoryPage.verifyInventoryIndexPage();
    });

    // Step 28-29: Navigate to Brands
    await test.step('Navigate to Brands', async () => {
      await inventoryPage.navigateToBrands();
    });

    // Step 30-33: Add Brand
    await test.step('Add Brand', async () => {
      await brandsPage.addBrand(
        testData.brand.name,
        testData.brand.shortCode
      );
    });
  });
});
