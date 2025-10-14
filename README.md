# Playwright TypeScript Enterprise Automation Framework

## Overview
This framework provides a scalable, maintainable approach for end-to-end automation of web applications using Playwright with TypeScript.

## Features
Features of this framework include:

- Unique, robust Page Object Model (POM) design  
- Reusable utility and assertion layers  
- Enterprise-grade coding standards (linting, formatting, hooks, logging)  
- Centralized test data management
- Comprehensive reporting capabilities

## Project Structure
The project directory, `Framework/`, is structured as follows:

```
Framework/
├── src/
│   ├── pages/       # Page Object files for each app page
│   ├── utils/       # Utility functions (actions, assertions, locators, test data)
│   ├── specs/       # Test specs organized by feature/scenario
│   ├── testdata/    # Centralized test data files
│   ├── config/      # Playwright/Test/Allure configs
│   └── reports/     # Generated test reports (HTML, Allure)
├── .eslintrc.json   # ESLint configuration
├── .prettierrc      # Prettier configuration
├── playwright.config.ts # Playwright configuration
├── package.json     # Node.js dependencies and scripts
└── README.md        # This file
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers**
   ```bash
   npm run install:browsers
   ```

## Running Tests

- **Run all tests**: `npm test`
- **Run tests in headed mode**: `npm test:headed`
- **Run tests in debug mode**: `npm test:debug`
- **Run tests with UI mode**: `npm test:ui`

## Test Data Management

Test data is centrally managed in `src/testdata/testdata.json`. Each test case has its own section identified by TestCaseID (e.g., TC03).

To access test data in tests:
```typescript
import { getTestData } from '../utils/testDataUtil';
const testData = getTestData('TC03');
```

## Page Object Model

Each page of the application has its own Page Object class in `src/pages/`. Page Objects encapsulate:
- Element locators
- Page-specific actions
- Page verification methods

## Utilities

The `src/utils/` directory contains:
- `testDataUtil.ts`: Test data management utilities
- `assertionUtil.ts`: Common assertion methods
- `actionUtil.ts`: Common action methods

## Code Quality

- **Linting**: `npm run lint`
- **Auto-fix linting issues**: `npm run lint:fix`
- **Format code**: `npm run format`

## Reporting

Test reports are generated in `src/reports/`:
- HTML Report: `npm run report`
- JSON and JUnit reports are automatically generated

## Best Practices

1. Keep test logic minimal - business logic belongs in Page Objects
2. Use centralized test data - no hardcoded values in tests
3. Follow the established naming conventions
4. Write reusable methods in Page Objects
5. Use appropriate assertions from AssertionUtil
6. Maintain clean separation of concerns

## Contributing

1. Follow the existing code structure and patterns
2. Run linting and formatting before committing
3. Ensure all tests pass before submitting changes
4. Update test data in the centralized JSON file
5. Document new Page Object methods and utilities
