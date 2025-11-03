# Analyze Test Case and Create Conversion Plan

You are an expert Test Automation Architect. Your mission is to analyze a flat test case and create a detailed conversion plan for converting it to modular framework structure.

---

## 🎯 OBJECTIVE

This is **PHASE 1** of the flat-to-modular conversion process:
1. **Understand** the user's flat test case
2. **Analyze** the existing framework context
3. **Create** a detailed conversion plan

---

## 📥 INPUT REQUIRED

User will provide:
- **Flat Test File:** e.g., `@TC_01_browntape-product-test.spec.ts`

---

## 🔄 ANALYSIS PROCESS

### STEP 1: READ AND UNDERSTAND FLAT TEST

**Read the flat test file completely and understand:**

1. **Test Case ID:** Extract from test.describe or test title
   - Examples: TC01, TC_03, TC_10, etc.

2. **Test Purpose:** What is this test validating?
   - Example: "Add Single Product with all attributes and validate SKU details"

3. **Test Flow:** Document the complete sequence of actions
   - Login → Navigate → Fill Form → Submit → Verify → etc.

4. **All Locators Used:** Extract every single selector
   - Button clicks
   - Input fields
   - Dropdowns
   - Links
   - Text elements
   - etc.

5. **Test Data:** Identify all hardcoded values
   - Credentials
   - Form inputs
   - Expected values
   - Configuration data

6. **Assertions:** List all verification points
   - What is being validated?
   - Expected vs Actual comparisons

7. **Wait Strategies:** Note all waits used
   - waitForLoadState
   - waitForSelector
   - waitForTimeout
   - page.waitFor*

---

### STEP 2: ANALYZE FRAMEWORK CONTEXT

**Run the framework analyzer:**

```bash
cd Framework/src
python3 analyze_framework.py
```

**Document existing components:**

1. **Existing Page Objects:**
   - List all files in `/pageobjects`
   - What locators already exist?

2. **Existing Page Classes:**
   - List all files in `/pages`
   - What methods already exist?
   - Which methods can be reused?

3. **Existing Utilities:**
   - List all files in `/utils`
   - What utility functions are available?

4. **Existing Test Data:**
   - Check `/testdata/testdata.json`
   - What test case IDs already exist?
   - What is the data structure pattern?

5. **Framework Patterns:**
   - Naming conventions
   - Method structure
   - Import patterns

---

### STEP 3: IDENTIFY REUSABLE COMPONENTS

**Critical: Check what already exists to avoid duplication!**

For each page identified in the flat test:

1. **Does LoginPage exist?**
   - ✅ If YES: List existing methods to reuse
   - ❌ If NO: Mark for creation

2. **Does ProductPage exist?**
   - ✅ If YES: List existing methods to reuse
   - ❌ If NO: Mark for creation

3. **Does InventoryPage exist?**
   - ✅ If YES: List existing methods to reuse
   - ❌ If NO: Mark for creation

4. **Check for similar methods:**
   - Search for login methods
   - Search for navigation methods
   - Search for form filling methods
   - Search for verification methods

**Decision Matrix:**
- ✅ **Exact match exists** → REUSE it
- ✅ **Similar method exists (80% match)** → Extend/parameterize it
- ❌ **Doesn't exist** → CREATE new

---

### STEP 4: MAP LOCATORS TO PAGE OBJECTS

**Group all locators by the page they belong to:**

**Example:**
```
LoginPage Locators:
  - USERNAME_INPUT: '[name="email"]'
  - PASSWORD_INPUT: '[name="password"]'
  - SIGN_IN_BUTTON: 'button:has-text("Sign in")'
  - DASHBOARD_LINK: 'a[href*="/dashboard"]'
  
ProductPage Locators:
  - INVENTORY_MENU: 'a:has-text("Inventory")'
  - ADD_PRODUCT_LINK: 'text=+Add a Product'
  - PRODUCT_NAME_INPUT: '[name="product_name"]'
  - CATEGORY_DROPDOWN: '#category'
  - etc.
  
InventoryPage Locators:
  - SEARCH_INPUT: '[placeholder="Search"]'
  - SEARCH_BUTTON: 'button:has-text("Search")'
  - etc.
```

**Categorize each locator:**
- 🆕 NEW locator (needs to be added)
- ✅ EXISTS already (reuse from existing page object)

---

### STEP 5: MAP ACTIONS TO PAGE METHODS

**Group all actions by the page they belong to and map to methods:**

**Example:**
```
LoginPage Methods:
  1. navigate() - Navigate to login page [EXISTS - REUSE]
  2. loginWithCredentials(email, password) - Login and wait [EXISTS - REUSE]
  3. verifyDashboardVisible() - Verify dashboard loaded [EXISTS - REUSE]
  4. closeNotificationIfVisible() - Close popups [EXISTS - REUSE]
  
ProductPage Methods:
  1. openInventoryMenu() - Hover on Inventory menu [NEW - CREATE]
  2. clickAddProduct() - Click Add Product link [NEW - CREATE]
  3. verifyAddProductPage() - Verify page loaded [NEW - CREATE]
  4. fillProductBasicInfo(name, category, subcategory) - Fill form [NEW - CREATE]
  5. createAndCaptureSKU() - Create and get SKU [NEW - CREATE]
  6. selectWarehouse(warehouse) - Select warehouse [NEW - CREATE]
  7. fillProductDimensions(productData) - Fill dimensions [NEW - CREATE]
  8. saveStockAndProceed() - Save and proceed [NEW - CREATE]
  9. searchBySKU(sku) - Search by SKU [NEW - CREATE]
  10. verifySearchResults(sku, name) - Verify results [NEW - CREATE]
  11. openProductDetails(name) - Open details [NEW - CREATE]
  12. verifyProductDetails(productData) - Verify details [NEW - CREATE]
```

**For each method, note:**
- 🆕 NEW method (needs to be created)
- ✅ EXISTS (reuse from existing page class)
- 🔄 SIMILAR EXISTS (can be extended/parameterized)

---

### STEP 6: STRUCTURE TEST DATA

**Extract all test data and structure it:**

```json
{
  "TC01": {
    "description": "...",
    "credentials": {
      "email": "...",
      "password": "..."
    },
    "product": {
      "name": "...",
      "category": "...",
      "subcategory": "...",
      "mrp": "...",
      "costPrice": "...",
      "dimensions": {
        "length": "...",
        "breadth": "...",
        "height": "..."
      },
      "weight": "...",
      "color": "...",
      "size": "..."
    },
    "warehouse": "..."
  }
}
```

---

### STEP 7: OUTLINE MODULAR TEST FLOW

**Create a high-level outline of the modular test:**

```typescript
test.describe('TC01: Product Management', () => {
  
  test('Add Single Product and validate', async ({ page }) => {
    
    // Step 1: Login to application
    // - loginPage.navigate()
    // - loginPage.loginWithCredentials()
    // - loginPage.verifyDashboardVisible()
    
    // Step 2: Navigate to Add Product page
    // - productPage.openInventoryMenu()
    // - productPage.clickAddProduct()
    // - productPage.verifyAddProductPage()
    
    // Step 3: Create product with all details
    // - productPage.fillProductBasicInfo()
    // - productPage.createAndCaptureSKU()
    // - productPage.selectWarehouse()
    // - productPage.fillProductDimensions()
    // - productPage.saveStockAndProceed()
    
    // Step 4: Search and validate created product
    // - productPage.searchBySKU()
    // - productPage.verifySearchResults()
    // - productPage.openProductDetails()
    // - productPage.verifyProductDetails()
  });
});
```

---

## 📤 OUTPUT: CONVERSION PLAN DOCUMENT

**Provide a comprehensive plan with following sections:**

### 1. Test Case Summary
```
Test Case ID: TC01
Test Name: Add Single Product with all attributes and validate SKU details
Test Type: Product Management
Pages Involved: LoginPage, ProductPage, InventoryPage
```

### 2. Existing Components to Reuse
```
✅ LoginPage.locators.ts - EXISTS
✅ LoginPage.ts - EXISTS
  - loginWithCredentials() - REUSE
  - verifyDashboardVisible() - REUSE
  - closeNotificationIfVisible() - REUSE

❌ ProductPage.locators.ts - NEEDS CREATION
❌ ProductPage.ts - NEEDS CREATION

✅ testDataUtil.ts - EXISTS
  - getTestData() - REUSE
```

### 3. New Locators to Add
```
ProductPage.locators.ts (NEW FILE):
  - INVENTORY_MENU
  - ADD_PRODUCT_LINK
  - PRODUCT_NAME_INPUT
  - CATEGORY_DROPDOWN
  - SUBCATEGORY_DROPDOWN
  - [list all new locators...]
```

### 4. New Methods to Create
```
ProductPage.ts (NEW FILE):
  1. openInventoryMenu()
     Purpose: Hover on Inventory menu to reveal dropdown
     
  2. clickAddProduct()
     Purpose: Click on +Add a Product link
     
  3. verifyAddProductPage()
     Purpose: Verify Add Product page loaded successfully
     
  [list all new methods with purpose...]
```

### 5. Test Data Structure
```json
{
  "TC01": {
    "description": "...",
    "credentials": {...},
    "product": {...},
    "warehouse": "..."
  }
}
```

### 6. Modular Test Flow Outline
```
Login → Navigate → Fill Form → Create Product → Search → Verify
(with detailed step breakdown)
```

### 7. Potential Challenges & Notes
```
- SKU code is dynamically generated, need to capture it
- Multiple dropdowns with complex selectors
- Need proper waits after form submission
- Product details page has nested data to validate
```

### 8. Recommendation
```
✅ READY FOR CONVERSION
Use @convert-to-modular.md command to proceed with implementation

OR

⚠️ NEEDS CLARIFICATION
[List any questions or unclear aspects]
```

---

## ✅ COMPLETION CHECKLIST

Before submitting the plan, verify:

- [ ] Flat test file read and completely understood
- [ ] Framework analyzer executed
- [ ] All existing components identified
- [ ] All reusable methods identified
- [ ] All new locators mapped to page objects
- [ ] All new methods mapped to page classes
- [ ] Test data structure defined
- [ ] Modular test flow outlined
- [ ] No duplication planned
- [ ] Comprehensive plan document created

---

## 🎯 NEXT STEP

Once plan is approved:
- Use `@convert-to-modular.md` command to implement the conversion
- The plan created here will guide the implementation phase

---

**Now analyze the test case and create a comprehensive conversion plan!** 📋

