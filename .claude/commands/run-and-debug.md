# Run and Debug Modular Test

<prompt_instructions>

<persona>
You are an expert Test Automation Architect. Your mission is to run the converted modular test, identify issues, and fix them using the flat test as ground truth.
</persona>

---

<objective>
This is **PHASE 3** of the flat-to-modular conversion process:
1. **Run** the converted modular test
2. **Identify** any errors or issues
3. **Debug** by comparing with flat test (ground truth)
4. **Fix** all issues until test passes
5. **Verify** behavior matches flat test exactly
</objective>

---

<critical_rule>
## CRITICAL RULE: FLAT TEST IS GROUND TRUTH

**The flat test script contains the CORRECT:**
- Exact locators that work
- Proper wait strategies
- Correct test flow sequence
- Valid test data values
- Working assertions
- Timing and synchronization

**When debugging, ALWAYS reference the flat test!**
</critical_rule>

---

<best_practices_remediation_guide>
## AUTOMATION BEST PRACTICES REMEDIATION GUIDE

**When debugging, verify the modular test follows these patterns to avoid common anti-patterns:**

### 1. File Structure and Reusability (Shared Components)

**Issue:** Duplicating locators for the same element across multiple files.

**What to Check:**

| What | How | Fix |
|------|-----|-----|
| **Component duplication** | Look for same locators in multiple page objects | Move to `src/components/[ComponentName].ts` |
| **Proper instantiation** | Verify components are imported and instantiated in pages | Add `private header = new HeaderComponent(this.page);` |
| **Single source of truth** | Check if changing a locator requires changes in multiple files | Consolidate to one component file |

---

### 2. Test Data & Login Methods (Separation of Concerns)

**Issue:** Test data generation mixed with UI actions.

**What to Check:**

| Area | What to Look For | Fix |
|------|-----------------|-----|
| **Test Data Generation** | Data generation (`Date.now()`, random strings) in page methods | Move to test file or `utils/dataGenerator.ts` |
| **Login Pattern** | Logging in for every test individually | Implement `storageState` pattern for session reuse |
| **UI Actions** | Page methods should only have `fill()`, `click()`, `waitFor()` | Remove data generation from page methods |

**Debugging Example:**
```typescript
// If you see this in ProductPage.ts - WRONG
async fillProductForm(): Promise<void> {
  const productName = `Product_${Date.now()}`; // WRONG - data in page method
  await this.page.fill(PRODUCT_NAME, productName);
}

// Fix: Move to test file
// In test file - CORRECT
const productName = generateProductName(); // Data generation in test/utility
await productPage.fillProductName(productName); // Only UI action in page method
```

---

### 3. Structuring Assertions (Intent-wise vs Method-wise)

**Issue:** Assertions scattered in page methods instead of grouped in test files.

**What to Check:**

| Location | What to Look For | Fix |
|----------|-----------------|-----|
| **Page Methods** | Business outcome assertions (`expect(...).toBeVisible()`) | Move to test file, group by intent |
| **Test Files** | Intent-wise assertion grouping | Assertions should verify complete outcomes |
| **Pre-conditions** | Safety checks before actions | OK to keep sparingly in page methods |

**Debugging Table:**

| Approach | Where | Example | Is It Correct? |
|----------|-------|---------|----------------|
| **Intent-wise** | Test File | `expect(page.locator('text=Product')).toBeVisible()` in test.step() | ✅ CORRECT |
| **Safety Check** | Page Method | `expect(BUTTON).toBeVisible()` before `click()` | ✅ OK (sparingly) |
| **Business Verification** | Page Method | `async verifyProductCreated()` with expects | ❌ WRONG - Move to test |

**Debugging Example:**
```typescript
// If you see this in ProductPage.ts - WRONG
async verifyProductCreated(): Promise<void> {
  await expect(this.page.locator('text=Product')).toBeVisible(); // WRONG
}

// Fix: Move to test file - CORRECT
await test.step('Verify product created', async () => {
  await expect(page.locator(`text=${productName}`)).toBeVisible(); // CORRECT
  await expect(page.locator(`text=${productSKU}`)).toBeVisible();
});
```

</best_practices_remediation_guide>

---

<input_required>
- **Modular Test File:** Path to converted test (e.g., `src/tests/tc01-product-management.spec.ts`)
- **Flat Test File:** Path to original flat test (ground truth)
</input_required>

---

<run_and_debug_process>
## RUN AND DEBUG PROCESS

<step_1_run_test>
### STEP 1: RUN THE MODULAR TEST

**Execute the converted test in headed mode:**

```bash
cd Framework
px playwright test src/tests/tc01-product-management.spec.ts --headed
```

**Alternative commands:**
```bash
# Run with npx
npx playwright test src/tests/tc01-product-management.spec.ts --headed

# Run in debug mode
px playwright test src/tests/tc01-product-management.spec.ts --debug

# Run with trace
px playwright test src/tests/tc01-product-management.spec.ts --trace on

# Run with UI
npx playwright test src/tests/tc01-product-management.spec.ts --ui
```
</step_1_run_test>

---

<step_2_analyze_results>
### STEP 2: ANALYZE TEST RESULTS

**Possible Outcomes:**

#### Outcome 1: TEST PASSES
```
All steps executed successfully
All assertions passed
No errors

ACTION: Proceed to STEP 7 (Final Verification)
```

#### Outcome 2: TEST FAILS
```
Test failed with errors
Some steps didn't execute
Assertions failed

ACTION: Proceed to STEP 3 (Identify Issues)
```
</step_2_analyze_results>

---

<step_3_identify_issues>
### STEP 3: IDENTIFY ISSUES

**Read the error message carefully and categorize:**

#### Issue Type 1: Import Errors
```
Error: Cannot find module '../pages/ProductPage'
Error: Module not found
Error: Cannot find module '../components/HeaderComponent'
```
**Cause:** File path or export issues
**Next Step:** Go to STEP 4A

#### Issue Type 2: Locator Not Found
```
Error: Locator not found
Error: Element not visible
Error: Timeout waiting for selector
```
**Cause:** Incorrect locator or selector
**Next Step:** Go to STEP 4B

#### Issue Type 3: Method Errors
```
Error: methodName is not a function
Error: Cannot read property of undefined
TypeError: Expected string but got undefined
```
**Cause:** Method signature or data structure issues
**Next Step:** Go to STEP 4C

#### Issue Type 4: Timing/Synchronization
```
Error: Timeout exceeded
Error: Element not ready
Error: Navigation timeout
```
**Cause:** Missing waits or wrong wait strategy
**Next Step:** Go to STEP 4D

#### Issue Type 5: Assertion Failures
```
Error: Expected "value1" but received "value2"
AssertionError: toBeVisible timeout
```
**Cause:** Wrong expected values or conditions
**Next Step:** Go to STEP 4E

#### Issue Type 6: Test Data Errors
```
Error: Test data not found for test case: TC01
Error: Cannot access property 'product' of undefined
Error: generateProductName is not a function
```
**Cause:** Test data structure, loading issues, or missing data generation utilities
**Next Step:** Go to STEP 4F
</step_3_identify_issues>

---

<step_4_debug_ground_truth>
### STEP 4: DEBUG USING GROUND TRUTH

<step_4a_fix_imports>
#### STEP 4A: Fix Import Errors

**Actions:**
1. Verify file exists at specified path
2. Check export statement in the file
3. Verify import path is correct
4. Check file naming (case-sensitive)
5. Verify component imports if using COM pattern

```bash
# Check if file exists
ls Framework/src/pages/ProductPage.ts
ls Framework/src/components/HeaderComponent.ts

# Verify export
grep "export class" Framework/src/pages/ProductPage.ts
grep "export class" Framework/src/components/HeaderComponent.ts
```

**Fix:**
```typescript
// Correct imports
import { ProductPage } from '../pages/ProductPage';
import { HeaderComponent } from '../components/HeaderComponent';

// Verify exports
export class ProductPage { ... }
export class HeaderComponent { ... }
```
</step_4a_fix_imports>

---

<step_4b_fix_locators>
#### STEP 4B: Fix Locator Issues

**CRITICAL: Reference the flat test for EXACT locators!**

**Actions:**
1. Open the flat test file
2. Find the exact locator that works
3. Compare with modular test locator
4. Copy the EXACT locator from flat test
5. Verify if locator belongs in component or page object

**Example:**

```bash
# Find locator in flat test
grep -A2 "Add a Product" FlatTestScripts/TC_01_*.spec.ts
```

**Flat Test (GROUND TRUTH):**
```typescript
// This works in flat test
await page.click('text=+Add a Product');
```

**Modular Test (Fix if different):**
```typescript
// In ProductPage.locators.ts (if page-specific)
static readonly ADD_PRODUCT_LINK = 'text=+Add a Product'; // Use EXACT same selector

// OR in HeaderComponent.locators.ts (if reusable component)
static readonly ADD_PRODUCT_LINK = 'text=+Add a Product'; // If used across pages
```

**Common Locator Fixes:**
- Copy exact text content (including spaces, special characters)
- Use same locator strategy (text=, role=, css, xpath)
- Check for dynamic elements (may need different strategy)
- Verify element is in DOM when locator is called
- Verify locator is in correct file (component vs page object)
</step_4b_fix_locators>

---

<step_4c_fix_methods>
#### STEP 4C: Fix Method Errors

**Actions:**
1. Verify method exists in page class or component
2. Check method signature matches call
3. Verify parameters are passed correctly
4. Check return type if value is used
5. Verify component is initialized if using COM pattern

**Reference flat test to understand:**
- What parameters are needed?
- What is the method doing?
- What should it return?

**Example:**

**Flat Test:**
```typescript
await page.fill('[name="product_name"]', 'White shirts14');
await page.selectOption('#category', 'Clothing, Shoes & Accessories');
```

**Modular Test:**
```typescript
// Method signature should match usage
async fillProductBasicInfo(name: string, category: string, subcategory: string): Promise<void> {
  await this.page.fill(ProductPageLocators.PRODUCT_NAME_INPUT, name);
  await this.page.selectOption(ProductPageLocators.CATEGORY_DROPDOWN, category);
  await this.page.selectOption(ProductPageLocators.SUBCATEGORY_DROPDOWN, subcategory);
}
```

**Component Method Example:**
```typescript
// In HeaderComponent.ts
async navigateToInventory(): Promise<void> {
  await this.page.hover(HeaderComponentLocators.INVENTORY_MENU);
  await this.page.click(HeaderComponentLocators.INVENTORY_MENU);
}

// In ProductPage.ts - Using component
async openInventoryViaHeader(): Promise<void> {
  await this.header.navigateToInventory(); // Using component method
}
```
</step_4c_fix_methods>

---

<step_4d_fix_timing>
#### STEP 4D: Fix Timing/Synchronization Issues

**CRITICAL: Copy EXACT wait strategies from flat test!**

**Actions:**
1. Open flat test and find where waits are used
2. Identify what waits are applied (waitForLoadState, waitForSelector, etc.)
3. Add same waits to modular test methods

**Example:**

**Flat Test (GROUND TRUTH):**
```typescript
await page.click('button:has-text("Sign in")');
await page.waitForLoadState('networkidle'); // ← This wait is critical!
await expect(page.locator('a[href*="/dashboard"]')).toBeVisible();
```

**Modular Test (Add missing wait):**
```typescript
async loginWithCredentials(email: string, password: string): Promise<void> {
  await this.page.fill(LoginPageLocators.USERNAME_INPUT, email);
  await this.page.fill(LoginPageLocators.PASSWORD_INPUT, password);
  await this.page.click(LoginPageLocators.SIGN_IN_BUTTON);
  await this.page.waitForLoadState('networkidle'); // ← Add this wait!
}
```

**Common Wait Strategies from Flat Test:**
```typescript
// Check flat test for these patterns:
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');
await page.waitForSelector('selector');
await page.waitForTimeout(1000);
await page.waitForURL('**/dashboard');
await page.locator('selector').waitFor();
```

**Add same waits to modular methods!**
</step_4d_fix_timing>

---

<step_4e_fix_assertions>
#### STEP 4E: Fix Assertion Failures

**CRITICAL: Assertions should be in test files, not page methods!**

**Actions:**
1. Reference flat test for expected values
2. Check if assertions match flat test assertions
3. Verify test data matches flat test data
4. Verify assertions are in test file (not page methods)

**Example:**

**Flat Test:**
```typescript
await expect(page.locator('text=White shirts14')).toBeVisible();
await expect(page.locator('text=1000.0')).toBeVisible();
```

**Modular Test (CORRECT - Assertions in test file):**
```typescript
// In test file (.spec.ts) - CORRECT
await test.step('Verify product created', async () => {
  await expect(page.locator(`text=${productName}`)).toBeVisible();
  await expect(page.locator(`text=${testData.product.mrp}`)).toBeVisible();
});
```

**Modular Test (WRONG - Assertions in page method):**
```typescript
// In ProductPage.ts - WRONG (should not have assertions)
async verifyProductDetails(productData: any): Promise<void> {
  await expect(this.page.locator(`text=${productData.name}`)).toBeVisible(); // WRONG
  await expect(this.page.locator(`text=${productData.mrp}`)).toBeVisible(); // WRONG
}
```

**Fix:** Move assertions to test file and remove from page method.

**Check test data:**
```json
{
  "TC01": {
    "product": {
      "name": "White shirts14",  // Must match flat test value
      "mrp": "1000.0"             // Must match flat test value
    }
  }
}
```
</step_4e_fix_assertions>

---

<step_4f_fix_test_data>
#### STEP 4F: Fix Test Data Errors

**Actions:**
1. Verify testdata.json has correct TestCaseID
2. Check data structure matches what methods expect
3. Verify file path in getTestData() utility
4. Compare data values with flat test
5. Verify dynamic data generation utilities exist

**Example:**

**Check testdata.json:**
```json
{
  "TC01": {  // ← TestCaseID must match
    "description": "...",
    "product": {
      "name": "...",  // ← Structure must match what methods expect
      "category": "..."
    }
  }
}
```

**Check test file:**
```typescript
test.beforeAll(() => {
  testData = getTestData('TC01'); // ← Must match key in testdata.json
  productName = generateProductName(); // ← Verify utility exists
});
```

**Check method calls:**
```typescript
await productPage.fillProductBasicInfo(
  productName,              // ← Dynamic data from test file
  testData.product.category, // ← Static data from JSON
  testData.product.subcategory
);
```

**Verify data generation utility exists:**
```typescript
// Framework/src/utils/dataGenerator.ts
export function generateProductName(): string {
  return `Product_${Date.now()}`;
}
```
</step_4f_fix_test_data>

</step_4_debug_ground_truth>

---

<step_5_apply_fixes>
### STEP 5: APPLY FIXES

**For each issue identified:**

1. **Make the fix** in the appropriate file:
   - Locator issue → Fix in pageobjects or components file
   - Method issue → Fix in pages or components file
   - Data issue → Fix in testdata.json or test file
   - Import issue → Fix import statements
   - Assertion issue → Move assertions from page methods to test file

2. **Reference flat test** to ensure fix is correct

3. **Don't guess** - Use exact code from flat test

4. **Verify assertion placement:**
   - Assertions should be in test files (intent-wise grouping)
   - Page methods should NOT have assertions (except pre-condition safety checks)
</step_5_apply_fixes>

---

<step_6_rerun_test>
### STEP 6: RE-RUN TEST

**After applying fixes, run the test again:**

```bash
px playwright test src/tests/tc01-product-management.spec.ts --headed
```

**If test still fails:**
- Go back to STEP 3 (Identify Issues)
- Repeat the debug cycle
- Keep referencing flat test

**If test passes:**
- Proceed to STEP 7 (Final Verification)
</step_6_rerun_test>

---

<step_7_final_verification>
### STEP 7: FINAL VERIFICATION

**Once test passes, verify quality:**

#### 1. Compare Behavior with Flat Test
```bash
# Run both tests side by side
# Flat test
cd FlatTestScripts
px playwright test TC_01_*.spec.ts --headed

# Modular test
cd Framework
px playwright test src/tests/tc01-*.spec.ts --headed
```

**Verify:**
- Same actions performed
- Same elements interacted with
- Same assertions checked
- Same end result

#### 2. Verify Code Quality
```bash
# Check no inline locators in test
grep -r "locator\|getByRole\|getByText" Framework/src/tests/tc01-*.spec.ts

# Should return minimal or no results (only in page.locator calls via page objects)
```

#### 3. Check for Hardcoded Values
```bash
# Check for hardcoded strings
grep -r "'.*'" Framework/src/tests/tc01-*.spec.ts

# Should only find page object method calls, no hardcoded data
```

#### 4. Verify All Locators in Page Objects/Components
```bash
# All locators should be in pageobjects or components folders
grep "static readonly" Framework/src/pageobjects/*.locators.ts
grep "static readonly" Framework/src/components/*.locators.ts
```

#### 5. Verify Assertion Placement
```bash
# Check assertions are in test files, not page methods
grep -r "expect\|toBeVisible\|toHaveText" Framework/src/pages/*.ts

# Should return minimal results (only pre-condition safety checks)
# Main assertions should be in test files
grep -r "expect\|toBeVisible\|toHaveText" Framework/src/tests/tc01-*.spec.ts

# Should return assertion results (main assertions belong here)
```

#### 6. Verify Component Usage (COM Pattern)
```bash
# Check if components are properly used
grep -r "Component" Framework/src/pages/*.ts
grep -r "Component" Framework/src/tests/tc01-*.spec.ts
```
</step_7_final_verification>

---

<step_8_document_fixes>
### STEP 8: DOCUMENT FIXES APPLIED

**Create a summary of debugging session:**

```markdown
## Debug Summary for TC01

### Issues Found:
1. Locator not found: ADD_PRODUCT_LINK
   - Fix: Changed from 'text=Add a Product' to 'text=+Add a Product' (+ sign was missing)
   - Reference: Line 45 in flat test

2. Timing issue: Dashboard verification failing
   - Fix: Added waitForLoadState('networkidle') after login
   - Reference: Line 30 in flat test

3. Test data structure mismatch
   - Fix: Changed testData.productName to testData.product.name
   - Reference: testdata.json structure

4. Assertions in page method
   - Fix: Moved verifyProductDetails() assertions to test file
   - Reference: Best practice - assertions belong in test files

5. Missing data generation utility
   - Fix: Created generateProductName() in utils/dataGenerator.ts
   - Reference: Dynamic data should be generated in utilities

### Fixes Applied:
- ProductPage.locators.ts - Fixed ADD_PRODUCT_LINK selector
- LoginPage.ts - Added waitForLoadState after login
- ProductPage.ts - Removed assertions (moved to test file)
- tc01-product-management.spec.ts - Fixed test data access path, added assertions
- utils/dataGenerator.ts - Created generateProductName() utility

### Test Result:
- All tests passed
- All assertions passed
- Behavior matches flat test exactly
- Assertions properly placed in test file
- Components properly used (COM pattern)

### Test Execution:
```bash
px playwright test src/tests/tc01-product-management.spec.ts --headed
```

**Result:** PASSED (all steps executed successfully)
```
</step_8_document_fixes>

</run_and_debug_process>

---

<success_criteria>
## SUCCESS CRITERIA

Test is ready when:

- [ ] Test runs without errors
- [ ] All steps execute successfully
- [ ] All assertions pass
- [ ] No timeout errors
- [ ] Behavior matches flat test exactly
- [ ] Same elements are interacted with
- [ ] Same verifications are performed
- [ ] Test is stable (passes consistently)
- [ ] Assertions are in test files (not page methods)
- [ ] Components properly used (COM pattern)
- [ ] Test data generation in test files/utilities
</success_criteria>

---

<debugging_commands>
## DEBUGGING COMMANDS REFERENCE

```bash
# Run in headed mode (see browser)
px playwright test src/tests/tc01-*.spec.ts --headed

# Run in debug mode (step through)
px playwright test src/tests/tc01-*.spec.ts --debug

# Run with trace (detailed timeline)
px playwright test src/tests/tc01-*.spec.ts --trace on

# Run with UI mode
npx playwright test src/tests/tc01-*.spec.ts --ui

# Run specific test only
px playwright test src/tests/tc01-*.spec.ts --grep "Add Single Product"

# Find locator in flat test
grep -A3 "text=" FlatTestScripts/TC_01_*.spec.ts

# Find wait strategies in flat test
grep -A1 "waitFor" FlatTestScripts/TC_01_*.spec.ts

# Compare files
diff -y FlatTestScripts/TC_01_*.spec.ts Framework/src/tests/tc01-*.spec.ts

# Check assertion placement
grep -r "expect" Framework/src/pages/*.ts
grep -r "expect" Framework/src/tests/tc01-*.spec.ts
```
</debugging_commands>

---

<debugging_tips>
## DEBUGGING TIPS

1. **Always run in headed mode first** - See what's happening visually
2. **Check the browser console** - May show JavaScript errors
3. **Use debug mode** - Step through test line by line
4. **Compare with flat test** - Side by side comparison
5. **Check exact selectors** - Case-sensitive, spaces matter
6. **Verify waits** - Most issues are timing-related
7. **Check test data structure** - Object paths must match
8. **Read error messages carefully** - They usually point to the issue
9. **Don't modify flat test** - It's the ground truth
10. **Fix one issue at a time** - Don't change multiple things
11. **Verify assertion placement** - Should be in test files, not page methods
12. **Check component usage** - Verify components are properly initialized and used
</debugging_tips>

---

<common_mistakes>
## COMMON DEBUGGING MISTAKES

1. **Modifying flat test** - Never change the ground truth
2. **Guessing locators** - Always use exact selector from flat test
3. **Skipping waits** - Copy all waits from flat test
4. **Changing test flow** - Follow exact sequence from flat test
5. **Ignoring error messages** - Read them carefully
6. **Testing in headless mode** - Always use headed mode for debugging
7. **Fixing multiple issues at once** - Fix one, test, then fix next
8. **Not comparing with flat test** - Always reference ground truth
9. **Putting assertions in page methods** - Assertions belong in test files
10. **Generating test data in page methods** - Data generation belongs in test files/utilities
11. **Not using components for reusable elements** - Use COM pattern for cross-page elements
</common_mistakes>

---

<next_steps>
## NEXT STEPS

Once test passes:
- **Test is production-ready**
- **Can move to next test case conversion**
- **Update framework analyzer if needed**
- **Document any new patterns discovered**

**DO NOT proceed to next test case until current one passes!**
</next_steps>

---

**Now run, debug, and fix the modular test using flat test as ground truth!**

</prompt_instructions>
