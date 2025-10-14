import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductCreationPage } from '../pages/ProductCreationPage';
import { DimensionsPage, DimensionData } from '../pages/DimensionsPage';
import { ProductDetailsPage, ProductValidationData } from '../pages/ProductDetailsPage';
import { getTestData } from '../utils/testDataUtil';

test.describe('BrownTape Product Management', () => {
  test('Add Single Product with all attributes and validate SKU details', async ({ page }) => {
    // Get test data for TC_PRODUCT_FULL_VALIDATION
    const testData = getTestData('TC_PRODUCT_FULL_VALIDATION');
    
    // Initialize Page Objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const productCreationPage = new ProductCreationPage(page);
    const dimensionsPage = new DimensionsPage(page);
    const productDetailsPage = new ProductDetailsPage(page);
    
    let skuCode: string;

    // Step 1: Navigate to BrownTape login page
    await test.step('Navigate to BrownTape login page', async () => {
      await loginPage.navigateToLogin(testData.login.url);
      await loginPage.verifyLoginPageTitle(testData.expectedTitles.login);
    });

    // Step 2: Enter username
    await test.step('Enter username', async () => {
      await loginPage.login(testData.login.username, testData.login.password);
      await loginPage.verifyDashboardAccess(testData.validation.dashboardLinks);
    });

    // Step 5: Hover on Inventory menu
    await test.step('Hover on Inventory menu', async () => {
      await inventoryPage.hoverInventoryMenu();
    });

    // Step 6: Navigate to Add Product page
    await test.step('Navigate to Add Product page', async () => {
      await inventoryPage.clickAddProduct();
      await productCreationPage.verifyAddProductPage();
      await productCreationPage.verifyProductCreatePageTitle(testData.expectedTitles.productCreate);
    });

    // Step 7: Enter product name
    await test.step('Enter product name', async () => {
      await productCreationPage.enterProductName(testData.product.name);
      await productCreationPage.verifyProductNameValue(testData.product.name);
    });

    // Step 8-9: Select top level category
    await test.step('Select top level category', async () => {
      await productCreationPage.selectTopLevelCategory(testData.product.topLevelCategory);
    });

    // Step 10-11: Select sub category
    await test.step('Select sub category', async () => {
      await productCreationPage.selectSubCategory(testData.product.subCategory);
    });

    // Step 12-14: Create product and capture SKU code
    await test.step('Create product and capture SKU code', async () => {
      await productCreationPage.clickCreateProduct();
      
      // Wait for navigation to stock page and verify
      await dimensionsPage.verifyDimensionsPageTitle(testData.expectedTitles.addStock);
      await dimensionsPage.verifyProductSavedMessage();
      await dimensionsPage.closeSuccessMessage();
      
      // Extract SKU code
      skuCode = await dimensionsPage.extractSKUCode();
      console.log('Generated SKU Code:', skuCode);
      await dimensionsPage.verifySKUCodePattern(skuCode, testData.validation.skuCodePattern);
    });

    // Step 15-24: Select warehouse and fill product dimensions
    await test.step('Fill product dimensions and cost details', async () => {
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
      
      await dimensionsPage.enterDimensions(dimensionData);
      await page.waitForTimeout(2000); // Explicit wait as in original test
    });

    // Step 25-26: Save stock information
    await test.step('Save stock information', async () => {
      await dimensionsPage.saveStockAndProceed();
      await inventoryPage.verifyInventoryPageTitle(testData.expectedTitles.inventory);
      await inventoryPage.closeSuccessMessage();
    });

    // Step 27-28: Search for created product and navigate to details
    await test.step('Search for created product by SKU code', async () => {
      await inventoryPage.searchAndNavigateToProduct(
        skuCode,
        testData.product.name,
        testData.validation.searchResultText
      );
    });

    // Step 29: Validate product details on Product Info page
    await test.step('Validate product details on Product Info page', async () => {
      await productDetailsPage.verifyProductDetailsPageTitle(testData.expectedTitles.productView);
      
      const validationData: ProductValidationData = {
        skuCode: skuCode,
        category: testData.product.subCategory,
        productName: testData.product.name,
        mrp: testData.dimensions.mrp,
        unitCost: testData.dimensions.unitCost,
        length: testData.dimensions.length,
        breadth: testData.dimensions.breadth,
        height: testData.dimensions.height,
        weight: testData.dimensions.weight,
        size: testData.dimensions.size,
        color: testData.dimensions.color
      };
      
      await productDetailsPage.validateAllProductDetails(validationData);
    });
  });
});
