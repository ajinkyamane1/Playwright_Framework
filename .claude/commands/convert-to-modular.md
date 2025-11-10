# Convert Flat Test to Modular Framework - Implementation

<prompt_instructions>

<persona>
You are an expert Test Automation Architect. Your mission is to implement the conversion plan and create modular framework files.
</persona>

---

<objective>
This is **PHASE 2** of the flat-to-modular conversion process:
1. **Implement** the conversion plan from Phase 1
2. **Create/Update** all framework files
3. **Follow** enterprise best practices
</objective>

---

<input_required>
From Phase 1 (analyze-and-plan):
- **Conversion Plan Document**
- **Flat Test File** reference
- **Framework Context** understanding
</input_required>

---

<critical_rules>
## CRITICAL RULES

1. **Follow the conversion plan EXACTLY**
2. **NO code duplication** - Reuse existing components as planned
3. **ALL methods MUST have JSDoc comments**
4. **NO hardcoded values** - Use parameters and test data
5. **Follow existing framework patterns**
6. **CRITICAL:** Verify all locators against the flat test script during integration
7. **ASSERTIONS BELONG IN TEST FILES** - Page Object methods should focus on actions, not verifications
   - Exception: Pre-condition safety checks (sparingly, e.g., element.toBeVisible() before click)
8. **SEPARATE TEST DATA LOGIC FROM UI ACTIONS** - Test data generation in test files/utilities, not in page methods
9. **USE COMPONENT OBJECT MODEL (COM)** - Create reusable components for elements used across multiple pages
</critical_rules>

---

<best_practices_remediation_guide>
## AUTOMATION BEST PRACTICES REMEDIATION GUIDE

**This guide addresses three common anti-patterns in test automation:**

### 1. File Structure and Reusability (Shared Components)

**Issue:** Duplicating locators for the same element (e.g., header image, footer, common button) across multiple Page Object files.

**Best Practice:** Use a Component Object Model (COM)

| What | How | Why |
|------|-----|-----|
| **Create separate component class** | `src/components/HeaderComponent.ts` for reusable parts | Holds locators and methods only for that specific component |
| **Instantiate in Page Objects** | Any main Page Object that needs it imports and uses the component | Prevents code duplication |
| **Single source of truth** | If the locator changes, update it in only one central file | Drastically simplifies maintenance |

**Implementation:**
```typescript
// components/HeaderComponent.ts - REUSABLE COMPONENT
export class HeaderComponent {
  constructor(private page: Page) {}
  async navigateToInventory(): Promise<void> { ... }
}

// pages/ProductPage.ts - Using component
import { HeaderComponent } from '../components/HeaderComponent';
export class ProductPage {
  private header = new HeaderComponent(this.page);
  async goToInventory(): Promise<void> {
    await this.header.navigateToInventory(); // Reusing component
  }
}
```

---

### 2. Test Data & Login Methods (Separation of Concerns)

**Issue:** Hardcoding data into methods or re-logging in for every single test unnecessarily.

**Solutions:**

| Area | Best Practice & Fixes |
|------|----------------------|
| **Test Data Utility** | **1. Centralize Data:** Store data in dedicated file (`data/testData.json`) or reader utility in `utils/`<br>**2. Ensure Isolation:** Use unique credentials for parallel tests; avoid shared states that might change |
| **Login Page Methods** | **1. Focus on Actions:** `LoginPage.ts` methods should only contain UI actions (`fill()`, `click()`), not test data generation<br>**2. Use Fixtures:** For multiple tests needing login, use Playwright's `storageState` to log in once and reuse the session, skipping repetitive steps |

**Implementation - WRONG:**
```typescript
// Page method generating data - WRONG
async fillProductForm(): Promise<void> {
  const productName = `Product_${Date.now()}`; // Data generation in UI method - WRONG
  await this.page.fill(PRODUCT_NAME, productName);
}
```

**Implementation - CORRECT:**
```typescript
// Test file - Data generation separate
const productName = generateProductName(); // Data logic in utility/test file - CORRECT
await productPage.fillProductName(productName); // UI logic only in page method - CORRECT
```

---

### 3. Structuring Assertions (Intent-wise vs Method-wise)

**Issue:** Unclear where to place verification logic, leading to hard-to-read tests.

**Best Practice:** Assertions must primarily live in the Test File (`.spec.ts`), not Page Object methods.

| Approach | Where to Put Assertions | Why It's Best |
|----------|------------------------|---------------|
| **Intent-wise (Recommended)** | **Test File (`.spec.ts`)** | Groups assertions to verify a complete outcome (e.g., entire "Product flow"). Reads like a user story: Action 1 → Action 2 → Assert Final State |
| **Method-wise** | **Page Object Method (Sparingly)** | Use ONLY for critical low-level checks (e.g., ensuring element is visible before clicking it) |

**Implementation - Intent-wise in Test File (CORRECT):**
```typescript
// Test File - All assertions grouped by business outcome - CORRECT
await test.step('Verify product created successfully', async () => {
  // Intent: Verify complete product creation outcome
  await expect(page.locator(`text=${productName}`)).toBeVisible();
  await expect(page.locator(`text=${productSKU}`)).toBeVisible();
  await expect(page.locator(`text=${productPrice}`)).toBeVisible();
});
```

**Implementation - Method-wise in Page Object (USE SPARINGLY):**
```typescript
// Page method - Pre-condition safety check ONLY - OK
async clickSubmitButton(): Promise<void> {
  await expect(this.page.locator(SUBMIT_BUTTON)).toBeVisible(); // Safety check - OK
  await this.page.click(SUBMIT_BUTTON);
}
```

**Implementation - WRONG (Don't do this):**
```typescript
// Page method with business verification - WRONG
async verifyProductCreated(): Promise<void> {
  await expect(this.page.locator('text=Product')).toBeVisible(); // WRONG - belongs in test file
}
```

</best_practices_remediation_guide>

---

<test_data_classification>
## TEST DATA CLASSIFICATION

Before implementation, understand the three types of test data:

### 1. Dynamic Test Data
**Purpose:** Generate unique values for each test execution to maintain idempotency.

**Examples:**
- Product names with timestamps
- Email addresses with random strings
- Order numbers
- SKU codes

**Implementation:**
```typescript
// In test file or data utility (NOT in page methods)
const productName = `Product_${Date.now()}`;
const email = `user_${Math.random().toString(36).substring(7)}@example.com`;
```

**CRITICAL:** Test data generation should happen in test files or utilities, NOT in page object methods.

### 2. Hardcoded Test Data
**Purpose:** Static values that can be passed directly from test data JSON.

**Examples:**
- Product categories
- User roles
- Configuration values
- Predefined lists

**Implementation:**
```json
{
  "TC01": {
    "product": {
      "category": "Clothing, Shoes & Accessories",
      "warehouse": "Warehouse1"
    }
  }
}
```

### 3. Dynamic Locator Data
**Purpose:** Locators that depend on runtime data to identify elements.

**Examples:**
- Selecting a specific row in a table using product name
- Clicking a link based on dynamic text
- Finding elements with data attributes

**Implementation:**
```typescript
// Parameterized locator using test data
async selectProductByName(productName: string): Promise<void> {
  await this.page.click(`tr:has-text("${productName}") >> button[aria-label="Edit"]`);
}
```

**IMPORTANT:** Ask user to confirm test data values before implementation if any values are unclear or missing from the flat test.
</test_data_classification>

---

<implementation_process>
## IMPLEMENTATION PROCESS

<step_1_verify_locators>
### STEP 1: VERIFY LOCATORS FROM FLAT TEST

**CRITICAL:** Before creating page objects or components, double-check all locators against the flat test script.

**Actions:**
1. Open the flat test file side-by-side with your work
2. For EACH locator, verify:
   - Exact selector syntax
   - Special characters (spaces, symbols, case)
   - Locator strategy (text=, role=, css, xpath)
   - Dynamic parts that need parameterization

**Example Verification:**
```typescript
// Flat Test (GROUND TRUTH):
await page.click('text=+Add a Product');  // Note the + sign

// Page Object (MUST MATCH EXACTLY):
static readonly ADD_PRODUCT_LINK = 'text=+Add a Product';  // Include + sign
```
</step_1_verify_locators>

---

<step_2_create_components>
### STEP 2: CREATE/UPDATE COMPONENT OBJECTS (COM PATTERN)

**Location:** `/Framework/src/components/[ComponentName].locators.ts` and `/Framework/src/components/[ComponentName].ts`

**For each reusable component identified in the plan:**

**Decision:** If element is used on MULTIPLE pages → Create Component

**Component Locators Template:**
```typescript
/**
 * Locators for [ComponentName] component
 * Used across multiple pages
 */
export class [ComponentName]Locators {
  // Section: [Section Name]
  static readonly LOCATOR_NAME = 'selector-here';
  static readonly ANOTHER_LOCATOR = 'selector-here';
}
```

**Component Class Template:**
```typescript
import { Page } from '@playwright/test';
import { [ComponentName]Locators } from './[ComponentName].locators';

/**
 * [ComponentName] component class
 * Reusable component used across multiple pages
 */
export class [ComponentName] {
  constructor(private page: Page) {}
  
  /**
   * [Description of what method does]
   * @param paramName - Description of parameter
   * @returns Description of return value
   */
  async methodName(paramName: string): Promise<void> {
    // Implementation using component locators
    await this.page.click([ComponentName]Locators.LOCATOR_NAME);
  }
}
```

**Rules:**
- Create components ONLY for elements used on multiple pages
- UPPER_SNAKE_CASE naming for locators
- Descriptive names
- **CRITICAL:** Use exact selectors from flat test
- **NEVER** include logic, actions, or test data in locator files
- **NEVER** include assertions in component methods (except pre-condition safety checks)
</step_2_create_components>

---

<step_3_create_page_objects>
### STEP 3: CREATE/UPDATE PAGE OBJECTS (LOCATORS)

**Location:** `/Framework/src/pageobjects/[PageName].locators.ts`

**For each page object identified in the plan:**

1. **If file EXISTS:**
   - Read the existing file
   - Add ONLY new locators
   - Follow existing naming pattern
   - Don't modify existing locators unless necessary

2. **If file DOESN'T EXIST:**
   - Create new file
   - Add all locators from the plan
   - Follow this template:

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

**Rules:**
- UPPER_SNAKE_CASE naming
- Descriptive names
- Group by sections with comments
- **CRITICAL:** Use exact selectors from flat test (don't modify working locators)
- **NEVER** include logic, actions, or test data in locator files
- **NOTE:** If locator belongs to a reusable component, it should be in component locators, not page locators
</step_3_create_page_objects>

---

<step_4_create_page_classes>
### STEP 4: CREATE/UPDATE PAGE CLASSES (METHODS)

**Location:** `/Framework/src/pages/[PageName].ts`

**For each page class identified in the plan:**

1. **If file EXISTS:**
   - Read the existing file
   - Add ONLY new methods from the plan
   - DON'T duplicate existing methods
   - Follow existing patterns

2. **If file DOESN'T EXIST:**
   - Create new file
   - Add all methods from the plan
   - Follow this template:

```typescript
import { Page } from '@playwright/test';
import { [PageName]Locators } from '../pageobjects/[PageName].locators';
import { [ComponentName] } from '../components/[ComponentName]'; // If using components

/**
 * [PageName] page object class
 * Handles all interactions with [PageName] page
 */
export class [PageName] {
  private [componentName]: [ComponentName]; // If using components
  
  constructor(private page: Page) {
    this.[componentName] = new [ComponentName](page); // Initialize component
  }
  
  /**
   * [Description of what method does and why]
   * @param paramName - Description of parameter
   * @returns Description of return value
   */
  async methodName(paramName: string): Promise<void> {
    // Implementation using locators from pageobjects
    await this.page.fill([PageName]Locators.LOCATOR_NAME, paramName);
  }
}
```

**Critical Rules:**
- **EVERY method MUST have JSDoc comment** (mandatory!)
- Import locators from pageobjects (never inline)
- Import and use components if needed
- Use intent-driven method names (what + why)
- Accept test data as parameters (no hardcoding)
- Use exact waits from flat test (waitForLoadState, waitForSelector, etc.)
- Handle conditional logic (if visible, then click)
- Keep methods focused (less than 20 lines ideally)
- **NEVER** use inline locators
- **NEVER** hardcode test data
- **NEVER** generate test data in page methods (data generation belongs in test files/utilities)
- **GROUP RELATED ACTIONS:** Combine related form fields into single methods (e.g., login with email AND password together, not separate methods)
- **ASSERTIONS:** Page methods should NOT contain assertions (except pre-condition safety checks)
  - **WRONG:** Page method with verification logic
    ```typescript
    async verifyProductCreated(): Promise<void> {
      await expect(this.page.locator('text=Product Name')).toBeVisible(); // WRONG
    }
    ```
  - **CORRECT:** Pre-condition safety check (sparingly)
    ```typescript
    async clickSubmitButton(): Promise<void> {
      await expect(this.page.locator(SUBMIT_BUTTON)).toBeVisible(); // OK - safety check
      await this.page.click(SUBMIT_BUTTON);
    }
    ```

**Example - Login Method (CORRECT APPROACH):**
```typescript
/**
 * Performs login with email and password credentials
 * Combines both input actions for better maintainability
 * @param email - User email address
 * @param password - User password
 * @returns Promise that resolves when login is complete
 */
async loginWithCredentials(email: string, password: string): Promise<void> {
  await this.page.fill(LoginPageLocators.EMAIL_INPUT, email);
  await this.page.fill(LoginPageLocators.PASSWORD_INPUT, password);
  await this.page.click(LoginPageLocators.SIGN_IN_BUTTON);
  await this.page.waitForLoadState('networkidle');
}
```

**Example - Using Component:**
```typescript
/**
 * Navigate to inventory page using header component
 * @returns Promise that resolves when navigation is complete
 */
async navigateToInventory(): Promise<void> {
  await this.header.navigateToInventory(); // Using component
}
```

**AVOID:** Creating separate methods like `enterUsername()` and `enterPassword()`. Instead, group them into a single cohesive action method.
</step_4_create_page_classes>

---

<step_5_update_test_data>
### STEP 5: UPDATE TEST DATA

**Location:** `/Framework/src/testdata/testdata.json`

**Add the test data structure from the plan:**

1. Read existing testdata.json
2. Add new test case entry
3. Use TestCaseID as key (e.g., "TC01")
4. Structure data logically (as per plan)
5. Use nested objects for related data

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
      "field2": "value2"
    },
    "expectedResults": {
      "status": "success"
    }
  }
}
```

**Rules:**
- Use TestCaseID as primary key
- Include description field
- Structure data logically
- Use exact values from flat test
- **IMPORTANT:** Confirm unclear test data values with the user before finalizing
- **NEVER** store credentials if using environment variables
- Mark dynamic data with `{{DYNAMIC}}` placeholder if needed
</step_5_update_test_data>

---

<step_6_create_test_file>
### STEP 6: CREATE MODULAR TEST FILE

**Location:** `/Framework/src/tests/tc[id]-[description].spec.ts`

**Follow the test flow outline from the plan:**

**CRITICAL: Assertions belong in test files, not page methods!**

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { HeaderComponent } from '../components/HeaderComponent';
import { getTestData } from '../utils/testDataUtil';
import { generateProductName } from '../utils/dataGenerator'; // Data generation utility

test.describe('[TestCaseID]: [Description]', () => {
  let testData: any;
  let productName: string; // Dynamic data

  test.beforeAll(() => {
    testData = getTestData('[TestCaseID]');
    productName = generateProductName(); // Generate dynamic data in test file
  });

  test('[Test Name]', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    
    // Step 1: Login
    await test.step('Login to application', async () => {
      await loginPage.navigate();
      await loginPage.loginWithCredentials(
        process.env.TEST_USERNAME || testData.credentials.email,
        process.env.TEST_PASSWORD || testData.credentials.password
      );
      // Assertion in test file (intent-wise)
      await expect(page.locator('a[href*="/dashboard"]')).toBeVisible();
    });
    
    // Step 2: Create product
    await test.step('Create product with details', async () => {
      await productPage.fillProductBasicInfo(
        productName, // Dynamic data from test file
        testData.product.category,
        testData.product.subcategory
      );
      await productPage.saveProduct();
    });
    
    // Step 3: Verify product created (Intent-wise assertions grouped here)
    await test.step('Verify product created successfully', async () => {
      // All assertions in test file, grouped by business outcome
      await expect(page.locator(`text=${productName}`)).toBeVisible();
      await expect(page.locator(`text=${testData.product.category}`)).toBeVisible();
      await expect(page.locator(`text=${testData.product.mrp}`)).toBeVisible();
    });
  });
});
```

**Critical Rules:**
- Use test.step() for each logical step
- Call ONLY page object methods (no direct page interactions)
- Get ALL data using getTestData(TestCaseID)
- Generate dynamic data in test file or utilities (NOT in page methods)
- Use environment variables for credentials
- Test file should be MINIMAL (just flow and assertions)
- **NEVER** use inline locators in test files
- **NEVER** hardcode values in test files
- **NEVER** include business logic in test files
- **ASSERTIONS BELONG HERE:** All main assertions should be in test files, grouped by intent (business outcome)
- Import and use components if needed
</step_6_create_test_file>

---

<step_7_create_utilities>
### STEP 7: CREATE UTILITIES (IF NEEDED)

**Only if new utilities are needed and don't exist:**

**Location:** `/Framework/src/utils/[utilityName].ts`

**Test Data Generation Utility:**
```typescript
/**
 * Generate unique product name with timestamp
 * @returns Unique product name string
 */
export function generateProductName(): string {
  return `Product_${Date.now()}`;
}

/**
 * Generate random email address
 * @returns Random email string
 */
export function generateRandomEmail(): string {
  return `user_${Math.random().toString(36).substring(7)}@example.com`;
}
```

**Common utilities (check if exist first):**
- getTestData(testCaseId) - Load test data
- generateRandomString(length) - Generate random strings
- getCurrentTimestamp(format) - Get current timestamp
- waitForElement(page, selector) - Custom waits
- generateProductName() - Generate unique product names
- generateRandomEmail() - Generate unique emails
</step_7_create_utilities>

---

<step_8_handle_authentication>
### STEP 8: HANDLE AUTHENTICATION

**CRITICAL: Separate test data logic from UI interaction logic**

#### Option 1: Single Test Login (For individual tests)

**In test file:**
```typescript
test('Test Name', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.navigate();
  await loginPage.loginWithCredentials(
    process.env.TEST_USERNAME || testData.credentials.email,
    process.env.TEST_PASSWORD || testData.credentials.password
  );
  
  // Assertion in test file
  await expect(page.locator('a[href*="/dashboard"]')).toBeVisible();
  
  // Continue with test...
});
```

#### Option 2: storageState (For multiple tests that need auth)

**Create auth setup file:** `/Framework/src/tests/auth.setup.ts`
```typescript
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto(process.env.BASE_URL || 'https://app.example.com');
  await page.fill('[name="email"]', process.env.TEST_USERNAME || '');
  await page.fill('[name="password"]', process.env.TEST_PASSWORD || '');
  await page.click('button:has-text("Sign in")');
  await page.waitForLoadState('networkidle');
  
  // Save authentication state
  await page.context().storageState({ path: 'auth.json' });
});
```

**Configure playwright.config.ts:**
```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'authenticated',
      dependencies: ['setup'],
      use: {
        storageState: 'auth.json',
      },
    },
  ],
});
```

**Use in test:**
```typescript
// Test automatically uses auth.json, no login needed
test('Authenticated test', async ({ page }) => {
  // Already authenticated via storageState
  await page.goto('/dashboard');
  // Continue with test...
});
```

**Create or update `.env` file:**
```bash
# .env file
BASE_URL=https://app.browntape.com
TEST_USERNAME=your-username
TEST_PASSWORD=your-password
```

**Ensure `.env` is in `.gitignore`:**
```
.env
node_modules/
test-results/
playwright-report/
auth.json
```

**Use in code:**
```typescript
process.env.TEST_USERNAME || testData.credentials.email
process.env.TEST_PASSWORD || testData.credentials.password
process.env.BASE_URL
```
</step_8_handle_authentication>

</implementation_process>

---

<deliverables>
## DELIVERABLES

After implementation, provide:

### 1. Created/Updated Files List
```
CREATED:
- Framework/src/components/HeaderComponent.locators.ts (if reusable)
- Framework/src/components/HeaderComponent.ts (if reusable)
- Framework/src/pageobjects/ProductPage.locators.ts
- Framework/src/pages/ProductPage.ts
- Framework/src/tests/tc01-product-management.spec.ts
- Framework/src/utils/dataGenerator.ts (if needed for dynamic data)

UPDATED:
- Framework/src/testdata/testdata.json (added TC01)
- Framework/src/pageobjects/LoginPage.locators.ts (added 2 new locators)

REUSED:
- Framework/src/pages/LoginPage.ts (loginWithCredentials)
- Framework/src/components/HeaderComponent.ts (if exists)
- Framework/src/utils/testDataUtil.ts (getTestData)
```

### 2. Summary of Changes
```
Components (COM Pattern):
- HeaderComponent.locators.ts: 5 locators defined (reusable)
- HeaderComponent.ts: 3 methods created (reusable)

Page Objects:
- ProductPage.locators.ts: 25 locators defined
- LoginPage.locators.ts: Added 2 new locators (CLOSE_NOTIFICATION, INVENTORY_LINK)

Page Classes:
- ProductPage.ts: 13 methods created
- LoginPage.ts: Reused 1 existing method

Test Data:
- Added TC01 entry with product data

Test File:
- tc01-product-management.spec.ts created
- 4 test steps with clear flow
- All assertions in test file (intent-wise grouping)

Utilities:
- dataGenerator.ts: Added generateProductName() for dynamic data
```

### 3. Code Quality Confirmation
```
- Zero code duplication
- 100% JSDoc coverage on methods
- All locators in pageobjects/components folders
- No hardcoded values in code
- Test data generation in test files/utilities (not in page methods)
- Credentials use environment variables
- Follows framework naming conventions
- Proper separation of concerns
- All async operations use await
- Assertions in test files (not page methods)
- Components created for reusable elements
- Authentication strategy implemented (single login or storageState)
```
</deliverables>

---

<completion_checklist>
## COMPLETION CHECKLIST

Before submitting, verify:

- [ ] All files from plan created/updated
- [ ] NO code duplication (checked existing components and pages)
- [ ] Components created for reusable elements (COM pattern)
- [ ] ALL locators are in /pageobjects or /components folders
- [ ] ALL page/component methods have JSDoc comments
- [ ] NO hardcoded values (all in testdata.json or generated in test files)
- [ ] Test data generation in test files/utilities (NOT in page methods)
- [ ] TestCaseID is used for data lookup
- [ ] Credentials use environment variables
- [ ] Method names are intent-driven and descriptive
- [ ] Tests are clean and minimal
- [ ] Assertions are in test files (intent-wise grouping)
- [ ] Page methods do NOT contain assertions (except pre-condition safety checks)
- [ ] Existing utilities are reused
- [ ] Framework patterns are followed
- [ ] Proper separation of concerns maintained (data logic vs UI logic)
- [ ] All async operations use await
- [ ] Authentication strategy implemented (single login or storageState)
</completion_checklist>

---

<next_step>
## NEXT STEP

Once implementation is complete:
- Use `@run-and-debug.md` command to test and debug the converted code
- The flat test is the ground truth for fixing any issues
</next_step>

---

**Now implement the conversion following the plan and best practices!**

</prompt_instructions>
