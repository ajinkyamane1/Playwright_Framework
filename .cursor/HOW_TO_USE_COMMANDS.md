# 🎯 How to Use Cursor Commands

## ✅ Setup Complete!

Your Cursor command is ready to use!

---

## 📍 Command Location

```
.cursor/
└── commands/
    └── flat-to-modular.md  (21KB)
```

---

## 🚀 How to Use in Cursor

### Step 1: Open Cursor Chat
- Press `Cmd+L` (Mac) or `Ctrl+L` (Windows/Linux)
- Or click the chat icon in Cursor

### Step 2: Type the Command
In the chat, type:
```
/flat-to-modular
```

Cursor will auto-suggest the command from `.cursor/commands/`

### Step 3: Attach Your Flat Test
```
/flat-to-modular

@TC_01_browntape-product-test.spec.ts
```

### Step 4: AI Executes
The AI will:
1. ✅ Run framework analyzer
2. ✅ Check existing components  
3. ✅ Convert flat test to modular
4. ✅ Create page objects, pages, test data
5. ✅ Generate integration summary
6. ✅ Ensure no code duplication

---

## 📋 Complete Example

**In Cursor Chat:**

```
/flat-to-modular

I need to convert this flat test to modular framework:
@FlatTestScripts/TC_01_browntape-product-test.spec.ts

Please follow all the instructions and avoid creating duplicate code.
```

**AI Response Will Include:**

1. **Framework Analysis:**
   - Existing components
   - Reusable methods
   - Current structure

2. **Conversion Files:**
   - Page Object locators
   - Page action methods
   - Updated test data
   - Modular test file

3. **Integration Summary:**
   - Files created
   - Files modified
   - Components reused
   - New methods added
   - Quality metrics

---

## 🎓 What the Command Does

The `/flat-to-modular` command contains ALL instructions for:

### ✅ Analyzing Framework
- Runs Python analyzer script
- Checks existing components
- Lists reusable methods
- Identifies patterns

### ✅ Converting Tests
- Extracts TestCaseID
- Identifies all locators
- Extracts test data
- Maps to framework layers

### ✅ Creating Structure
- **Page Objects** (locators only)
- **Page Classes** (action methods with JSDoc)
- **Test Data** (centralized JSON)
- **Test Files** (clean, minimal)
- **Utilities** (if needed)

### ✅ Quality Assurance
- NO code duplication
- Reuses existing components
- Follows framework patterns
- Security (env variables for credentials)
- Documentation (JSDoc on all methods)

---

## 📂 Output Structure

After conversion, you'll get:

```
Framework/src/
├── pageobjects/
│   ├── LoginPage.locators.ts      ⭐ NEW
│   └── ProductPage.locators.ts    ⭐ NEW
├── pages/
│   ├── LoginPage.ts                ⭐ NEW
│   └── ProductPage.ts              ⭐ NEW
├── testdata/
│   └── testdata.json               ✏️ UPDATED (TC01 added)
├── tests/
│   └── tc01-product-management.spec.ts  ⭐ NEW
└── utils/
    └── testDataUtil.ts             ✏️ UPDATED (if needed)
```

---

## 💡 Pro Tips

### 1. **Always Run Analyzer First**
Before converting, the command will automatically check existing components.

### 2. **Attach Multiple Files**
You can provide context files:
```
/flat-to-modular

@FlatTestScripts/TC_01_browntape-product-test.spec.ts
@Prompts/COMPREHENSIVE_FLAT_TO_MODULAR_CONVERSION_PROMPT.md
```

### 3. **Ask for Specific Changes**
```
/flat-to-modular

Convert @TC_01_browntape-product-test.spec.ts

Note: LoginPage already exists, please reuse it.
```

### 4. **Batch Conversion**
Convert multiple tests:
```
/flat-to-modular

Convert these flat tests one by one:
1. @TC_01_browntape-product-test.spec.ts
2. @TC_02_CreateBundleManually.spec.ts
3. @TC_03-brand-assignment.spec.ts
```

---

## 🔍 Command Features

### ✅ Prevents Duplication
- Checks existing page objects
- Reuses existing methods
- Extends instead of duplicating

### ✅ Follows Best Practices
- JSDoc on all methods
- Intent-driven naming
- Proper separation of concerns
- Security (env variables)

### ✅ Creates Clean Code
- Locators in pageobjects
- Actions in pages
- Data in testdata.json
- Tests are minimal

### ✅ Comprehensive Output
- All necessary files
- Integration summary
- Usage instructions
- Quality checklist

---

## 📖 Additional Resources

### Documentation Files:
1. **`Prompts/COMPREHENSIVE_FLAT_TO_MODULAR_CONVERSION_PROMPT.md`**
   - Detailed conversion methodology
   - Code examples
   - Best practices

2. **`Framework/src/analyze_framework.py`**
   - Python script to analyze framework
   - Shows existing structure
   - Prevents duplication

3. **`Framework/src/README_ANALYZER.md`**
   - How to use the analyzer
   - Command examples

---

## 🎬 Quick Start

**1. First Time Setup:**
```bash
# Verify Python script is executable
cd Framework/src
chmod +x analyze_framework.py
python3 analyze_framework.py
```

**2. Convert Your First Test:**
In Cursor:
```
/flat-to-modular

@FlatTestScripts/TC_01_browntape-product-test.spec.ts
```

**3. Review Output:**
- Check generated files
- Review integration summary
- Run the test

**4. Repeat for Other Tests:**
```
/flat-to-modular

@FlatTestScripts/TC_02_CreateBundleManually.spec.ts
```

---

## ✅ Success Checklist

After conversion, verify:

- [ ] No duplicate code created
- [ ] All locators in pageobjects folder
- [ ] All methods have JSDoc
- [ ] No hardcoded test data
- [ ] Credentials use env variables
- [ ] Tests are clean and readable
- [ ] Framework patterns followed
- [ ] Integration summary provided

---

## 🆘 Troubleshooting

### Command Not Showing Up?
- Restart Cursor
- Check `.cursor/commands/flat-to-modular.md` exists
- Make sure you're in the project root

### Analyzer Not Running?
```bash
cd Framework/src
python3 analyze_framework.py
```

### Want to See Command Content?
```bash
cat .cursor/commands/flat-to-modular.md
```

---

## 🎉 You're All Set!

**To start converting:**
1. Open Cursor
2. Type `/flat-to-modular`
3. Attach your flat test file
4. Let AI do the magic! ✨

---

**Happy Testing! 🚀**

