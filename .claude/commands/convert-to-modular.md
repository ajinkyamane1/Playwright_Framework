# Convert Flat Test to Modular Framework - Implementation

You are an expert Test Automation Architect. Your mission is to implement the conversion plan and create modular framework files.

---

## 🎯 OBJECTIVE

This is **PHASE 2** of the flat-to-modular conversion process:
1. **Implement** the conversion plan from Phase 1
2. **Create/Update** all framework files
3. **Follow** enterprise best practices

---

## 📥 INPUT REQUIRED

From Phase 1 (analyze-and-plan):
- **Conversion Plan Document**
- **Flat Test File** reference
- **Framework Context** understanding

---

## ⚠️ CRITICAL RULES

1. ✅ **Follow the conversion plan EXACTLY**
2. ✅ **NO code duplication** - Reuse existing components as planned
3. ✅ **ALL methods MUST have JSDoc comments**
4. ✅ **NO hardcoded values** - Use parameters and test data
5. ✅ **Follow existing framework patterns**

---

## 🔄 IMPLEMENTATION PROCESS

### STEP 1: CREATE/UPDATE PAGE OBJECTS (LOCATORS)

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
- ✅ UPPER_SNAKE_CASE naming
- ✅ Descriptive names
- ✅ Group by sections with comments
- ✅ Use exact selectors from flat test (don't modify working locators)
- ❌ NO logic, NO actions, NO test data

---

### STEP 2: CREATE/UPDATE PAGE CLASSES (METHODS)

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
    // Implementation using locators from pageobjects
    await this.page.fill([PageName]Locators.LOCATOR_NAME, paramName);
  }
}
```

**Critical Rules:**
- ✅ **EVERY method MUST have JSDoc comment** (mandatory!)
- ✅ Import locators from pageobjects (never inline)
- ✅ Use intent-driven method names (what + why)
- ✅ Accept test data as parameters (no hardcoding)
- ✅ Use exact waits from flat test (waitForLoadState, waitForSelector, etc.)
- ✅ Handle conditional logic (if visible, then click)
- ✅ Keep methods focused (< 20 lines ideally)
- ❌ NO inline locators
- ❌ NO hardcoded test data

---

### STEP 3: UPDATE TEST DATA

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
- ✅ Use TestCaseID as primary key
- ✅ Include description field
- ✅ Structure data logically
- ✅ Use exact values from flat test
- ❌ NO credentials if using environment variables

---

### STEP 4: CREATE MODULAR TEST FILE

**Location:** `/Framework/src/tests/tc[id]-[description].spec.ts`

**Follow the test flow outline from the plan:**

```typescript
import { test, expect } from '@playwright/test';
import { [Page1] } from '../pages/[Page1]';
import { [Page2] } from '../pages/[Page2]';
import { getTestData } from '../utils/testDataUtil';

test.describe('[TestCaseID]: [Description]', () => {
  let testData: any;

  test.beforeAll(() => {
    testData = getTestData('[TestCaseID]');
  });

  test('[Test Name]', async ({ page }) => {
    const page1 = new [Page1](page);
    const page2 = new [Page2](page);
    
    await test.step('[Step Description]', async () => {
      // Call page object methods with test data
      await page1.methodName(testData.field);
      await page1.verifyResult();
    });
    
    await test.step('[Another Step]', async () => {
      await page2.methodName(testData.anotherField);
    });
  });
});
```

**Critical Rules:**
- ✅ Use test.step() for each logical step
- ✅ Call ONLY page object methods (no direct page interactions)
- ✅ Get ALL data using getTestData(TestCaseID)
- ✅ Use environment variables for credentials
- ✅ Test file should be MINIMAL (just flow and assertions)
- ❌ NO inline locators
- ❌ NO hardcoded values
- ❌ NO business logic

---

### STEP 5: CREATE UTILITIES (IF NEEDED)

**Only if new utilities are needed and don't exist:**

**Location:** `/Framework/src/utils/[utilityName].ts`

```typescript
import * as fs from 'fs';
import * as path from 'path';

/**
 * Description of what utility does
 * @param param - Description of parameter
 * @returns Description of return value
 */
export function utilityFunction(param: string): any {
  // Implementation
  return result;
}
```

**Common utilities (check if exist first):**
- getTestData(testCaseId) - Load test data
- generateRandomString(length) - Generate random strings
- getCurrentTimestamp(format) - Get current timestamp
- waitForElement(page, selector) - Custom waits

---

### STEP 6: HANDLE CREDENTIALS

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
```

**Use in code:**
```typescript
process.env.TEST_USERNAME || testData.credentials.email
process.env.TEST_PASSWORD || testData.credentials.password
process.env.BASE_URL
```

---

## 📤 DELIVERABLES

After implementation, provide:

### 1. Created/Updated Files List
```
✅ Created:
- Framework/src/pageobjects/ProductPage.locators.ts
- Framework/src/pages/ProductPage.ts
- Framework/src/tests/tc01-product-management.spec.ts

✅ Updated:
- Framework/src/testdata/testdata.json (added TC01)
- Framework/src/pageobjects/LoginPage.locators.ts (added 2 new locators)

✅ Reused:
- Framework/src/pages/LoginPage.ts (loginWithCredentials, verifyDashboardVisible)
- Framework/src/utils/testDataUtil.ts (getTestData)
```

### 2. Summary of Changes
```
Page Objects:
- ProductPage.locators.ts: 25 locators defined
- LoginPage.locators.ts: Added 2 new locators (CLOSE_NOTIFICATION, INVENTORY_LINK)

Page Classes:
- ProductPage.ts: 13 methods created
- LoginPage.ts: Reused 3 existing methods

Test Data:
- Added TC01 entry with product data

Test File:
- tc01-product-management.spec.ts created
- 4 test steps with clear flow
```

### 3. Code Quality Confirmation
```
✅ Zero code duplication
✅ 100% JSDoc coverage on methods
✅ All locators in pageobjects folder
✅ No hardcoded values in code
✅ Credentials use environment variables
✅ Follows framework naming conventions
✅ Proper separation of concerns
✅ All async operations use await
```

---

## ✅ COMPLETION CHECKLIST

Before submitting, verify:

- [ ] All files from plan created/updated
- [ ] NO code duplication (checked existing components)
- [ ] ALL locators are in /pageobjects folder
- [ ] ALL page methods have JSDoc comments
- [ ] NO hardcoded values (all in testdata.json)
- [ ] TestCaseID is used for data lookup
- [ ] Credentials use environment variables
- [ ] Method names are intent-driven and descriptive
- [ ] Tests are clean and minimal
- [ ] Existing utilities are reused
- [ ] Framework patterns are followed
- [ ] Proper separation of concerns maintained
- [ ] All async operations use await

---

## 🎯 NEXT STEP

Once implementation is complete:
- Use `@run-and-debug.md` command to test and debug the converted code
- The flat test is the ground truth for fixing any issues

---

**Now implement the conversion following the plan and best practices!** 🚀

