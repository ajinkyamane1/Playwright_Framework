# Convert Flat Test to Modular Framework - Complete Instructions

You are an expert Test Automation Architect. Your mission is to convert flat Playwright TypeScript test cases into a modular, enterprise-grade automation framework.

---

## 🎯 OBJECTIVE

Convert flat test files (with inline locators and hardcoded values) into a well-structured modular framework following these layers:
1. **Page Objects** (`/pageobjects`) - Locators only
2. **Page Classes** (`/pages`) - Action methods
3. **Test Data** (`/testdata`) - Centralized data
4. **Tests** (`/tests`) - Clean test flow
5. **Utilities** (`/utils`) - Reusable helpers

---

## 🔄 THREE-PHASE CONVERSION WORKFLOW

The conversion process is divided into **3 separate phases** for better control and quality:

### **PHASE 1: Analyze and Plan** 
📋 Command: `@analyze-and-plan.md`
- Understand the flat test case
- Analyze existing framework context
- Identify reusable components
- Create comprehensive conversion plan
- **Output:** Detailed conversion plan document

### **PHASE 2: Convert to Modular**
🚀 Command: `@convert-to-modular.md`
- Implement the conversion plan
- Create/update page objects and page classes
- Update test data
- Create modular test file
- **Output:** All framework files created/updated

### **PHASE 3: Run and Debug**
🐛 Command: `@run-and-debug.md`
- Run the converted modular test
- Identify and analyze errors
- Debug using flat test as ground truth
- Fix all issues until test passes
- **Output:** Working, production-ready test

---

## 🚀 HOW TO USE THE 3-PHASE WORKFLOW

**Step 1: Start with Analysis**
```
User: @analyze-and-plan.md @TC_01_browntape-product-test.spec.ts
AI: Creates comprehensive conversion plan
```

**Step 2: Implement Conversion**
```
User: @convert-to-modular.md
AI: Creates all framework files based on the plan
```

**Step 3: Run and Fix**
```
User: @run-and-debug.md
AI: Runs test, debugs issues, and fixes them using flat test as reference
```

---

## ✅ BENEFITS OF 3-PHASE APPROACH

1. **Better Control:** Each phase is focused and manageable
2. **Quality Assurance:** Plan is reviewed before implementation
3. **Easy Debugging:** Dedicated phase for testing and fixing
4. **Ground Truth Reference:** Flat test guides debugging
5. **Clear Workflow:** Know exactly what to do at each phase
6. **No Skipped Steps:** Testing is mandatory, not optional

---

## 📖 COMPLETE REFERENCE GUIDE (ALL-IN-ONE)

Below is the complete reference guide for all phases combined. Use this for understanding the full process, or use the individual phase commands for step-by-step execution.

---

## ⚠️ CRITICAL RULE: NO CODE DUPLICATION

**BEFORE creating ANY new code:**
1. ✅ Run analyzer: `cd Framework/src && python3 analyze_framework.py`
2. ✅ Check existing page objects in `/pageobjects`
3. ✅ Check existing page classes in `/pages`
4. ✅ Check existing utilities in `/utils`
5. ✅ Check existing methods and functions

**NEVER create new code if similar already exists - ALWAYS REUSE!**

---

## 📥 INPUT REQUIRED

User will provide:
- **Flat Test File:** e.g., `@TC_01_browntape-product-test.spec.ts`
- **Framework Context:** Existing structure (run analyzer first)

---

## 🔄 CONVERSION PROCESS

### STEP 1: ANALYZE FRAMEWORK STRUCTURE (MANDATORY FIRST STEP)

**Run the analyzer to understand existing components:**

```bash
cd Framework/src
python3 analyze_framework.py
```

**Document what exists:**
- Existing page objects and their methods
- Available utility functions
- Current naming patterns
- Existing locators
- Framework structure

**Output:** List all reusable components to avoid duplication.

---

### STEP 2: ANALYZE FLAT TEST

**Read flat test and extract:**

1. **TestCaseID:** From test.describe or test title (e.g., TC01, TC_03, TC_10)
2. **Pages Used:** All pages/components being tested (Login, Product, Inventory, etc.)
3. **All Locators:** Every selector used in the test
4. **Test Data:** All hardcoded values (credentials, product details, etc.)
5. **Test Flow:** Sequence of actions and assertions
6. **Reusable Patterns:** Login flows, navigation, form fills

**Example:**
```
TestCaseID: TC01
Pages: LoginPage, InventoryPage, ProductPage
Locators: 
  - Email input: '[name="email"]'
  - Password input: '[name="password"]'
  - Sign in button: 'button:has-text("Sign in")'
  - etc.
Test Data:
  - username: 'inttest@browntape.com'
  - password: 'browntape'
  - product name: 'White shirts14'
  - etc.
```

---

### STEP 3: CHECK EXISTING COMPONENTS (CRITICAL!)

**For each page identified, check if it exists:**

```bash
# Check if LoginPage exists
ls Framework/src/pageobjects/LoginPage.locators.ts
ls Framework/src/pages/LoginPage.ts

# Check utilities
ls Framework/src/utils/
```

**Decision Tree:**

- ✅ **Page Object EXISTS** → Reuse it, add only NEW locators if needed
- ✅ **Method EXISTS** → Reuse it, don't create duplicate
- ✅ **Similar Method EXISTS (80%)** → Extend/parameterize it
- ❌ **Doesn't exist** → Create new following patterns below

---

### STEP 4: CREATE/UPDATE PAGE OBJECTS (LOCATORS ONLY)

**Location:** `/Framework/src/pageobjects/[PageName].locators.ts`

**Template:**
```typescript
/**
 * Locators for [PageName] page
 */
export class [PageName]Locators {
  // Section: [Section Name]
  static readonly LOCATOR_NAME = 'selector-here';
  static readonly ANOTHER_LOCATOR = 'selector-here';
  
  // Section: [Another Section]
  static readonly MORE_LOCATORS = 'selector-here';
}
```

**Real Example:**
```typescript
/**
 * Locators for Login page
 */
export class LoginPageLocators {
  // Login Form
  static readonly USERNAME_INPUT = '[name="email"]';
  static readonly PASSWORD_INPUT = '[name="password"]';
  static readonly SIGN_IN_BUTTON = 'button:has-text("Sign in")';
  
  // Dashboard Elements
  static readonly DASHBOARD_LINK = 'a[href*="/dashboard"]';
  static readonly INVENTORY_LINK = 'a:has-text("Inventory")';
  static readonly CLOSE_NOTIFICATION = 'button:has-text("×")';
}
```

**Rules:**
- ❌ NO logic, NO actions, NO test data
- ✅ Only static readonly constants
- ✅ UPPER_SNAKE_CASE naming
- ✅ Descriptive names
- ✅ Group by page sections with comments
- ✅ Use best locator strategy: data-testid > role > aria-label > text > CSS

---

### STEP 5: CREATE/UPDATE PAGE CLASSES (ACTION METHODS)

**Location:** `/Framework/src/pages/[PageName].ts`

**Template:**
```typescript
import { Page, expect } from '@playwright/test';
import { [PageName]Locators } from '../pageobjects/[PageName].locators';

/**
 * [PageName] page object class
 * Handles all interactions with [PageName] page
 */
export class [PageName] {
  constructor(private page: Page) {}
  
  /**
   * [Description of what method does and why]
   * @param paramName - Description of parameter
   * @returns Description of return value
   */
  async methodName(paramName: string): Promise<void> {
    // Implementation using locators
    await this.page.fill([PageName]Locators.LOCATOR_NAME, paramName);
  }
}
```

**Real Example:**
```typescript
import { Page, expect } from '@playwright/test';
import { LoginPageLocators } from '../pageobjects/LoginPage.locators';

/**
 * LoginPage page object class
 * Handles all login-related interactions
 */
export class LoginPage {
  constructor(private page: Page) {}
  
  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.page.goto(process.env.BASE_URL + '/users/login');
    await expect(this.page).toHaveTitle(/Login/);
  }
  
  /**
   * Login with provided credentials and verify dashboard access
   * Combines login action and verification for common workflow
   * @param email - User email address
   * @param password - User password
   */
  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.page.fill(LoginPageLocators.USERNAME_INPUT, email);
    await this.page.fill(LoginPageLocators.PASSWORD_INPUT, password);
    await this.page.click(LoginPageLocators.SIGN_IN_BUTTON);
    await this.page.waitForLoadState('networkidle');
  }
  
  /**
   * Verify user successfully logged in and dashboard is visible
   * Required to confirm login was successful
   */
  async verifyDashboardVisible(): Promise<void> {
    await expect(this.page.locator(LoginPageLocators.DASHBOARD_LINK)).toBeVisible();
    await expect(this.page.locator(LoginPageLocators.INVENTORY_LINK)).toBeVisible();
  }
  
  /**
   * Close notification popups if visible
   * Used to dismiss success/error messages
   */
  async closeNotificationIfVisible(): Promise<void> {
    const closeButton = this.page.locator(LoginPageLocators.CLOSE_NOTIFICATION);
    if (await closeButton.isVisible()) {
      await closeButton.click();
    }
  }
}
```

**Method Rules:**
- ✅ **EVERY method MUST have JSDoc comment** explaining what and why
- ✅ Method names are **intent-driven verbs** (loginWithCredentials, verifyProductCreated, fillProductForm)
- ✅ **NO hardcoded test data** - use parameters
- ✅ Import locators from pageobjects folder
- ✅ Combine related actions when it represents one user intent
- ✅ Keep methods focused (< 20 lines ideally)
- ✅ Use async/await properly
- ✅ Handle waits and error conditions
- ❌ NO inline locators - import from pageobjects

---

### STEP 6: UPDATE TEST DATA

**Location:** `/Framework/src/testdata/testdata.json`

**Structure:**
```json
{
  "TC01": {
    "description": "Brief description of test case",
    "credentials": {
      "email": "user@example.com",
      "password": "password123"
    },
    "inputData": {
      "field1": "value1",
      "field2": "value2",
      "nestedData": {
        "subfield": "value"
      }
    },
    "expectedResults": {
      "status": "success",
      "message": "Operation completed"
    }
  }
}
```

**Real Example:**
```json
{
  "TC01": {
    "description": "Add Single Product with all attributes and validate SKU details",
    "credentials": {
      "email": "inttest@browntape.com",
      "password": "browntape"
    },
    "product": {
      "name": "White shirts14",
      "category": "Clothing, Shoes & Accessories",
      "subcategory": "Kids' Clothing, Shoes & Accs",
      "mrp": "1000.0",
      "costPrice": "800.0",
      "dimensions": {
        "length": "10.0",
        "breadth": "10.0",
        "height": "10.0"
      },
      "weight": "500.0",
      "color": "Blue",
      "size": "S"
    },
    "warehouse": "Delhi Warehouse"
  }
}
```

**Rules:**
- ✅ Use **TestCaseID as primary key** (TC01, TC_03, etc.)
- ✅ Include description field
- ✅ Structure data logically (credentials, inputs, expected)
- ✅ Use nested objects for related data
- ❌ **NO credentials in JSON** - use environment variables instead
- ✅ All test-specific data goes here

---

### STEP 7: CREATE UTILITY FUNCTIONS (IF NEEDED)

**Location:** `/Framework/src/utils/testDataUtil.ts` (or create new utility file)

**Common Utility: testDataUtil.ts**
```typescript
import * as fs from 'fs';
import * as path from 'path';

/**
 * Get test data for specific test case ID
 * @param testCaseId - Test case identifier (e.g., 'TC01')
 * @returns Test data object for the specified test case
 */
export function getTestData(testCaseId: string): any {
  const testDataPath = path.join(__dirname, '../testdata/testdata.json');
  const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
  
  if (!testData[testCaseId]) {
    throw new Error(`Test data not found for test case: ${testCaseId}`);
  }
  
  return testData[testCaseId];
}

/**
 * Generate random string of specified length
 * @param length - Length of random string
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Get current timestamp in specified format
 * @param format - Date format (default: 'YYYY-MM-DD')
 * @returns Formatted timestamp string
 */
export function getCurrentTimestamp(format: string = 'YYYY-MM-DD'): string {
  const now = new Date();
  // Implementation based on format
  return now.toISOString().split('T')[0];
}
```

**Rules:**
- ✅ Create utility only if it doesn't exist
- ✅ Keep utilities page-agnostic
- ✅ Document with JSDoc
- ✅ Make functions reusable

---

### STEP 8: CREATE MODULAR TEST FILE

**Location:** `/Framework/src/tests/tc[id]-[description].spec.ts`

**Template:**
```typescript
import { test, expect } from '@playwright/test';
import { [Page1]Page } from '../pages/[Page1]Page';
import { [Page2]Page } from '../pages/[Page2]Page';
import { getTestData } from '../utils/testDataUtil';

test.describe('[TestCaseID]: [Description]', () => {
  let testData: any;

  test.beforeAll(() => {
    testData = getTestData('[TestCaseID]');
  });

  test('[Test Name]', async ({ page }) => {
    const page1 = new [Page1]Page(page);
    const page2 = new [Page2]Page(page);
    
    await test.step('[Step Description]', async () => {
      // Call page object methods
      await page1.methodName(testData.field);
      await page1.verifyResult();
    });
    
    await test.step('[Another Step]', async () => {
      await page2.methodName(testData.anotherField);
    });
  });
});
```

**Real Example:**
```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { getTestData } from '../utils/testDataUtil';

test.describe('TC01: Product Management', () => {
  let testData: any;

  test.beforeAll(() => {
    testData = getTestData('TC01');
  });

  test('Add Single Product with all attributes and validate SKU details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    
    await test.step('Login to application', async () => {
      await loginPage.navigate();
      await loginPage.loginWithCredentials(
        process.env.TEST_USERNAME || testData.credentials.email,
        process.env.TEST_PASSWORD || testData.credentials.password
      );
      await loginPage.verifyDashboardVisible();
      await loginPage.closeNotificationIfVisible();
    });
    
    await test.step('Navigate to Add Product page', async () => {
      await productPage.openInventoryMenu();
      await productPage.clickAddProduct();
      await productPage.verifyAddProductPage();
    });
    
    await test.step('Create product with all details', async () => {
      await productPage.fillProductBasicInfo(
        testData.product.name,
        testData.product.category,
        testData.product.subcategory
      );
      const skuCode = await productPage.createAndCaptureSKU();
      
      await productPage.selectWarehouse(testData.warehouse);
      await productPage.fillProductDimensions(testData.product);
      await productPage.saveStockAndProceed();
    });
    
    await test.step('Search and validate created product', async () => {
      const skuCode = productPage.getGeneratedSKU();
      await productPage.searchBySKU(skuCode);
      await productPage.verifySearchResults(skuCode, testData.product.name);
      await productPage.openProductDetails(testData.product.name);
      await productPage.verifyProductDetails(testData.product);
    });
  });
});
```

**Test File Rules:**
- ✅ Test file is **MINIMAL** - only flow and assertions
- ✅ Fetch ALL data using `getTestData(TestCaseID)`
- ✅ Use `test.step()` for clear reporting
- ✅ Use **environment variables for credentials** (process.env.USERNAME)
- ✅ Call page object methods only
- ✅ Group related steps logically
- ❌ NO inline locators
- ❌ NO hardcoded values
- ❌ NO business logic (belongs in page objects)

---

### STEP 9: HANDLE CREDENTIALS SECURELY

**Create `.env` file** (if doesn't exist):
```bash
# .env file
BASE_URL=https://app.browntape.com
TEST_USERNAME=inttest@browntape.com
TEST_PASSWORD=browntape
```

**Add to `.gitignore`:**
```
.env
```

**Use in code:**
```typescript
process.env.TEST_USERNAME || testData.credentials.email
process.env.TEST_PASSWORD || testData.credentials.password
```

---

### STEP 10: FINAL VERIFICATION

**Run these checks:**

1. ✅ **No Duplication:**
   ```bash
   # Search for similar methods
   grep -r "methodName" Framework/src/pages/
   ```

2. ✅ **All Locators in Page Objects:**
   ```bash
   # No locators should be in tests
   grep -r "locator\|getByRole\|getByText" Framework/src/tests/
   ```

3. ✅ **No Hardcoded Data:**
   ```bash
   # Check for hardcoded strings in tests
   grep -r "fill('hardcoded" Framework/src/tests/
   ```

4. ✅ **Run Analyzer Again:**
   ```bash
   cd Framework/src
   python3 analyze_framework.py
   ```

---

### STEP 11: RUN AND VERIFY TEST EXECUTION (CRITICAL!)

**After creating all files, ALWAYS run the test to ensure everything works:**

```bash
cd Framework
px playwright test src/tests/tc01-product-management.spec.ts --headed
```

**Why This Step is Critical:**
- ✅ Verifies all imports are correct
- ✅ Confirms locators are working
- ✅ Tests page object methods integration
- ✅ Validates test data is properly loaded
- ✅ Ensures no runtime errors exist

**If Test Fails or Issues Occur:**

1. **Check the Error Message:**
   - Import errors → Verify file paths and exports
   - Locator not found → Compare with flat test locators
   - Method errors → Check method signatures
   - Data errors → Verify testdata.json structure

2. **ALWAYS Reference the Flat Test Script (Ground Truth):**
   - ⚠️ **The flat test script is your SOURCE OF TRUTH**
   - If modular test fails, compare with flat test
   - Flat test contains the CORRECT:
     - ✅ Exact locators that work
     - ✅ Proper wait strategies
     - ✅ Correct test flow sequence
     - ✅ Valid test data values
     - ✅ Working assertions
   
3. **Debugging Steps:**
   ```bash
   # Run in headed mode to see what's happening
   px playwright test src/tests/tc01-product-management.spec.ts --headed
   
   # Run in debug mode
   px playwright test src/tests/tc01-product-management.spec.ts --debug
   
   # Run with trace
   px playwright test src/tests/tc01-product-management.spec.ts --trace on
   ```

4. **Common Issues and Fixes:**
   - **Locator mismatch:** Open flat test, copy exact locator
   - **Timing issues:** Add proper waits like in flat test
   - **Wrong test flow:** Follow exact sequence from flat test
   - **Data mismatch:** Use exact values from flat test
   - **Missing waits:** Check flat test for `waitForLoadState()` or `waitForSelector()`

5. **Validation Against Flat Test:**
   ```bash
   # Compare locators
   grep -A2 "locator\|click\|fill" FlatTestScripts/TC_01_*.spec.ts
   grep -A2 "static readonly" Framework/src/pageobjects/*.locators.ts
   
   # Verify test flow matches
   diff -y FlatTestScripts/TC_01_*.spec.ts Framework/src/tests/tc01-*.spec.ts
   ```

**DO NOT PROCEED to next test case until current test passes!**

**Success Criteria:**
- ✅ Test runs without errors
- ✅ All steps execute correctly
- ✅ All assertions pass
- ✅ Behavior matches flat test exactly

---

## 📤 DELIVERABLES

Provide these files with clear structure:

### 1. Page Objects (Locators)
```
Framework/src/pageobjects/
├── LoginPage.locators.ts
├── ProductPage.locators.ts
└── InventoryPage.locators.ts
```

### 2. Page Classes
```
Framework/src/pages/
├── LoginPage.ts
├── ProductPage.ts
└── InventoryPage.ts
```

### 3. Test Data (Updated)
```
Framework/src/testdata/testdata.json
```

### 4. Test File
```
Framework/src/tests/tc01-product-management.spec.ts
```

### 5. Utilities (if new)
```
Framework/src/utils/testDataUtil.ts
```

---

## ✅ QUALITY CHECKLIST

Before submitting, verify ALL items:

- [ ] Ran framework analyzer first (Step 1)
- [ ] Checked for existing similar components (Step 3)
- [ ] NO code duplication exists
- [ ] ALL locators are in `/pageobjects` folder
- [ ] ALL page methods have JSDoc comments
- [ ] NO hardcoded values in code (all in testdata.json)
- [ ] TestCaseID is used for data lookup
- [ ] Credentials use environment variables
- [ ] Method names are intent-driven and descriptive
- [ ] Tests are clean and minimal
- [ ] Existing utilities are reused
- [ ] Framework patterns are followed
- [ ] Proper separation of concerns maintained
- [ ] All async operations use await
- [ ] Error handling is appropriate
- [ ] **TEST EXECUTED AND PASSED** (Step 11) ⚠️ CRITICAL
- [ ] Test behavior matches flat test exactly
- [ ] All assertions pass
- [ ] No runtime errors

---

## ❌ COMMON MISTAKES TO AVOID

1. ❌ **Skipping the analyzer** - Always run first
2. ❌ **Creating duplicate methods** - Check if exists first
3. ❌ **Hardcoding credentials** - Use environment variables
4. ❌ **Putting locators in page classes** - Only in pageobjects folder
5. ❌ **Missing JSDoc** - Every method needs documentation
6. ❌ **Generic method names** - Be specific about intent
7. ❌ **Mixing concerns** - Keep layers separate
8. ❌ **Inline locators in tests** - Always use page objects
9. ❌ **Hardcoded test data** - Externalize to testdata.json
10. ❌ **Ignoring existing utilities** - Reuse before creating new
11. ❌ **NOT RUNNING THE TEST AFTER CONVERSION** - ALWAYS run and verify! ⚠️ CRITICAL
12. ❌ **Ignoring the flat test when debugging** - Flat test is your ground truth
13. ❌ **Proceeding without fixing errors** - Fix all issues before moving to next test

---

## 🚀 HOW TO USE THIS COMMAND

### Option 1: Use 3-Phase Workflow (RECOMMENDED)

**Phase 1: Analyze and Plan**
```
@analyze-and-plan.md @TC_01_browntape-product-test.spec.ts
```
- AI analyzes test and creates conversion plan
- User reviews the plan

**Phase 2: Implement Conversion**
```
@convert-to-modular.md
```
- AI implements the plan
- Creates all framework files

**Phase 3: Run and Debug**
```
@run-and-debug.md
```
- AI runs test
- Debugs and fixes issues using flat test as ground truth
- Ensures test passes

### Option 2: Use This All-in-One Command

1. **User provides flat test:**
   ```
   @flat-to-modular.md @TC_01_browntape-product-test.spec.ts
   ```

2. **You (AI) execute:**
   - Run analyzer first
   - Check existing components
   - Convert following all steps above
   - **RUN THE TEST** (Step 11) - MANDATORY!
   - Fix any errors by referencing flat test
   - Provide all deliverables

3. **User validates:**
   - Reviews generated files
   - Verifies test execution passed
   - Confirms no duplication
   - Validates behavior matches flat test

---

## 💡 REMEMBER

**The goal is NOT just to convert, but to create:**
- ✅ Maintainable code (easy to update)
- ✅ Reusable components (DRY principle)
- ✅ Scalable structure (easy to extend)
- ✅ Readable tests (self-documenting)
- ✅ Enterprise-grade quality (production-ready)
- ✅ **WORKING CODE** - Always test after conversion!

**⚠️ CRITICAL REMINDER:**
1. **ALWAYS run the test after conversion** using: `px playwright test src/tests/tc01-product-management.spec.ts --headed`
2. **Fix any errors before proceeding** - Don't move to next test case if current one fails
3. **Reference the flat test script** when errors occur - It's your ground truth for correct locators, flow, and data
4. **Test execution is NOT optional** - It's a mandatory step to ensure quality

---

**Now you're ready to convert flat tests to modular framework structure following enterprise best practices!** 🎯
