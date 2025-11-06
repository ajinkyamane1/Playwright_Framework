# Run and Debug Modular Test

You are an expert Test Automation Architect. Your mission is to run the converted modular test, identify issues, and fix them using the flat test as ground truth.

---

## OBJECTIVE

This is **PHASE 3** of the flat-to-modular conversion process:
1. **Run** the converted modular test
2. **Identify** any errors or issues
3. **Debug** by comparing with flat test (ground truth)
4. **Fix** all issues until test passes
5. **Verify** behavior matches flat test exactly

---

## CRITICAL RULE: FLAT TEST IS GROUND TRUTH

**The flat test script contains the CORRECT:**
- Exact locators that work
- Proper wait strategies
- Correct test flow sequence
- Valid test data values
- Working assertions
- Timing and synchronization

**When debugging, ALWAYS reference the flat test!**

---

## INPUT REQUIRED

- **Modular Test File:** Path to converted test (e.g., `src/tests/tc01-product-management.spec.ts`)
- **Flat Test File:** Path to original flat test (ground truth)

---

## RUN AND DEBUG PROCESS

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

---

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

---

### STEP 3: IDENTIFY ISSUES

**Read the error message carefully and categorize:**

#### Issue Type 1: Import Errors
```
Error: Cannot find module '../pages/ProductPage'
Error: Module not found
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
```
**Cause:** Test data structure or loading issues
**Next Step:** Go to STEP 4F

---

### STEP 4: DEBUG USING GROUND TRUTH

#### STEP 4A: Fix Import Errors

**Actions:**
1. Verify file exists at specified path
2. Check export statement in the file
3. Verify import path is correct
4. Check file naming (case-sensitive)

```bash
# Check if file exists
ls Framework/src/pages/ProductPage.ts

# Verify export
grep "export class" Framework/src/pages/ProductPage.ts
```

**Fix:**
```typescript
// Correct import
import { ProductPage } from '../pages/ProductPage';

// Verify export in ProductPage.ts
export class ProductPage { ... }
```

---

#### STEP 4B: Fix Locator Issues

**CRITICAL: Reference the flat test for EXACT locators!**

**Actions:**
1. Open the flat test file
2. Find the exact locator that works
3. Compare with modular test locator
4. Copy the EXACT locator from flat test

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
// In ProductPage.locators.ts
static readonly ADD_PRODUCT_LINK = 'text=+Add a Product'; // Use EXACT same selector
```

**Common Locator Fixes:**
- Copy exact text content (including spaces, special characters)
- Use same locator strategy (text=, role=, css, xpath)
- Check for dynamic elements (may need different strategy)
- Verify element is in DOM when locator is called

---

#### STEP 4C: Fix Method Errors

**Actions:**
1. Verify method exists in page class
2. Check method signature matches call
3. Verify parameters are passed correctly
4. Check return type if value is used

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

---

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

---

#### STEP 4E: Fix Assertion Failures

**Actions:**
1. Reference flat test for expected values
2. Check if assertions match flat test assertions
3. Verify test data matches flat test data

**Example:**

**Flat Test:**
```typescript
await expect(page.locator('text=White shirts14')).toBeVisible();
await expect(page.locator('text=1000.0')).toBeVisible();
```

**Modular Test:**
```typescript
async verifyProductDetails(productData: any): Promise<void> {
  await expect(this.page.locator(`text=${productData.name}`)).toBeVisible();
  await expect(this.page.locator(`text=${productData.mrp}`)).toBeVisible();
}
```

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

---

#### STEP 4F: Fix Test Data Errors

**Actions:**
1. Verify testdata.json has correct TestCaseID
2. Check data structure matches what methods expect
3. Verify file path in getTestData() utility
4. Compare data values with flat test

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
});
```

**Check method calls:**
```typescript
await productPage.fillProductBasicInfo(
  testData.product.name,     // ← Path must exist in testdata.json
  testData.product.category,
  testData.product.subcategory
);
```

---

### STEP 5: APPLY FIXES

**For each issue identified:**

1. **Make the fix** in the appropriate file:
   - Locator issue → Fix in pageobjects file
   - Method issue → Fix in pages file
   - Data issue → Fix in testdata.json
   - Import issue → Fix import statements

2. **Reference flat test** to ensure fix is correct

3. **Don't guess** - Use exact code from flat test

---

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

---

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

#### 4. Verify All Locators in Page Objects
```bash
# All locators should be in pageobjects folder
grep "static readonly" Framework/src/pageobjects/*.locators.ts
```

---

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

### Fixes Applied:
- ProductPage.locators.ts - Fixed ADD_PRODUCT_LINK selector
- LoginPage.ts - Added waitForLoadState after login
- tc01-product-management.spec.ts - Fixed test data access path

### Test Result:
- All tests passed
- All assertions passed
- Behavior matches flat test exactly

### Test Execution:
```bash
px playwright test src/tests/tc01-product-management.spec.ts --headed
```

**Result:** PASSED (all steps executed successfully)
```

---

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

---

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
```

---

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

---

## COMMON DEBUGGING MISTAKES

1. **Modifying flat test** - Never change the ground truth
2. **Guessing locators** - Always use exact selector from flat test
3. **Skipping waits** - Copy all waits from flat test
4. **Changing test flow** - Follow exact sequence from flat test
5. **Ignoring error messages** - Read them carefully
6. **Testing in headless mode** - Always use headed mode for debugging
7. **Fixing multiple issues at once** - Fix one, test, then fix next
8. **Not comparing with flat test** - Always reference ground truth

---

## NEXT STEPS

Once test passes:
- **Test is production-ready**
- **Can move to next test case conversion**
- **Update framework analyzer if needed**
- **Document any new patterns discovered**

**DO NOT proceed to next test case until current one passes!**

---

**Now run, debug, and fix the modular test using flat test as ground truth!**

