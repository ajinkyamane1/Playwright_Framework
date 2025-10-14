import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT_DIR, "src"); 

const PAGES_DIR = path.join(ROOT_DIR, "src", "pages");
const UTILS_DIR = path.join(ROOT_DIR, "src", "utils");
const TESTDATA_FILE = path.join(ROOT_DIR, "src", "testdata", "testdata.json");
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "Framework_Context", "@Framework_Context.md");

// Helper: Extract exported method names from a file
function extractMethods(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const methodRegex = /\b(public|private|async)?\s*(\w+)\s*\(/g;
  const methods: string[] = [];
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    if (match[2] && !["constructor"].includes(match[2])) {
      methods.push(match[2]);
    }
  }
  return methods;
}

// Helper: Build folder structure string
function buildFolderTree(dir: string, indent = ""): string {
  const files = fs.readdirSync(dir);
  return files
    .map((file) => {
      const fullPath = path.join(dir, file);
      const isDir = fs.statSync(fullPath).isDirectory();
      return (
        indent +
        (isDir ? "📂 " : "📄 ") +
        file +
        (isDir ? "\n" + buildFolderTree(fullPath, indent + "  ") : "")
      );
    })
    .join("\n");
}

// Generate Page Objects Index
function generatePageObjects() {
  const files = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".ts"));
  let md = "## 2. 📝 Page Objects Index\n";
  files.forEach((file) => {
    const methods = extractMethods(path.join(PAGES_DIR, file));
    md += `### ${file}\n`;
    methods.forEach((m) => (md += `- \`${m}()\`\n`));
    md += "\n";
  });
  return md;
}

// Generate Utilities Index
function generateUtils() {
  const files = fs.readdirSync(UTILS_DIR).filter((f) => f.endsWith(".ts"));
  let md = "## 3. 🛠 Utilities & Helpers\n";
  files.forEach((file) => {
    const methods = extractMethods(path.join(UTILS_DIR, file));
    md += `### ${file}\n`;
    methods.forEach((m) => (md += `- \`${m}()\`\n`));
    md += "\n";
  });
  return md;
}

// Generate Test Data Index
function generateTestData() {
  let md = "## 4. 📊 Test Data Index\n";
  if (fs.existsSync(TESTDATA_FILE)) {
    // const testdata = JSON.parse(fs.readFileSync(TESTDATA_FILE, "utf-8"));
    // testdata.forEach((tc: any) => {
    //   md += `- ${tc.id}: ${tc.name}\n`;
    // });
    const testdata: { [key: string]: any } = JSON.parse(fs.readFileSync(TESTDATA_FILE, "utf-8"));
    Object.keys(testdata).forEach((tcId: string) => { 
       md += `- \`${tcId}\`\n`; 
    });
  } else {
    md += "_No testdata.json found_\n";
  }
  return md;
}

// Coding Standards
const CODING_STANDARDS = `
## 5. 🔖 Coding Standards & Locator Strategy
- Always use \`page.locator()\` (strict mode).
- Prefer \`data-testid\`, \`aria-label\`, or role-based locators.
- No raw locators in tests — only in Page Objects.
- Naming conventions:
  - Tests: \`tcNN-feature-name.spec.ts\`
  - Page Object methods: camelCase verbs (\`addBrand\`, \`createProduct\`)
  - Utils: clear, descriptive names
- Use centralized logger from \`/utils/logger.ts\`.
- Assertions go via \`/utils/assertions.ts\` (not raw expect).
`;

function generateFrameworkContext() {
  const folderStructure = buildFolderTree(SRC_DIR);

  const content = `# 📑 @Framework_Context.md

## 1. 📂 Folder Structure
\`\`\`
${folderStructure}
\`\`\`

${generatePageObjects()}
${generateUtils()}
${generateTestData()}
${CODING_STANDARDS}
`;
  fs.writeFileSync(OUTPUT_FILE, content, { encoding: "utf-8"});
  console.log(`✅ Framework context updated at ${OUTPUT_FILE}`);
}

generateFrameworkContext();
