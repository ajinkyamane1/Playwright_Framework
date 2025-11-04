#!/usr/bin/env python3
"""
Framework Structure Analyzer
Analyzes the project structure and extracts classes, functions, and dependencies
from TypeScript/JavaScript files.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Set


class FrameworkAnalyzer:
    def __init__(self, root_path: str):
        self.root_path = Path(root_path)
        self.ignore_dirs = {'node_modules', '.git', 'dist', 'build', 'coverage', 'test-results', 'playwright-report'}
        self.ignore_files = {'.DS_Store', '.env'}
        self.file_extensions = {'.ts', '.js', '.tsx', '.jsx'}
        
    def print_tree(self, directory: Path = None, prefix: str = "", is_last: bool = True):
        """Print directory tree structure"""
        if directory is None:
            directory = self.root_path
            print(f"\n📂 {directory.name}/")
            print("=" * 80)
        
        try:
            entries = sorted(directory.iterdir(), key=lambda x: (not x.is_dir(), x.name))
            entries = [e for e in entries if e.name not in self.ignore_dirs and e.name not in self.ignore_files]
            
            for i, entry in enumerate(entries):
                is_last_entry = i == len(entries) - 1
                
                if entry.is_dir():
                    connector = "└── " if is_last_entry else "├── "
                    print(f"{prefix}{connector}📁 {entry.name}/")
                    
                    extension = "    " if is_last_entry else "│   "
                    self.print_tree(entry, prefix + extension, is_last_entry)
                else:
                    connector = "└── " if is_last_entry else "├── "
                    icon = self._get_file_icon(entry.suffix)
                    print(f"{prefix}{connector}{icon} {entry.name}")
                    
                    # Analyze file if it's a source file
                    if entry.suffix in self.file_extensions:
                        self._analyze_and_print_file(entry, prefix + ("    " if is_last_entry else "│   "))
                        
        except PermissionError:
            print(f"{prefix}[Permission Denied]")
    
    def _get_file_icon(self, suffix: str) -> str:
        """Return appropriate emoji icon for file type"""
        icons = {
            '.ts': '📘',
            '.tsx': '📘',
            '.js': '📙',
            '.jsx': '📙',
            '.json': '📋',
            '.md': '📝',
            '.yml': '⚙️',
            '.yaml': '⚙️',
            '.env': '🔐',
            '.py': '🐍'
        }
        return icons.get(suffix, '📄')
    
    def _analyze_and_print_file(self, file_path: Path, prefix: str):
        """Analyze TypeScript/JavaScript file and print its contents"""
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
            
            # Extract imports
            imports = self._extract_imports(content)
            
            # Extract classes
            classes = self._extract_classes(content)
            
            # Extract functions
            functions = self._extract_functions(content)
            
            # Extract interfaces/types
            interfaces = self._extract_interfaces(content)
            
            # Print analysis
            if imports or classes or functions or interfaces:
                print(f"{prefix}│")
                
                if imports:
                    print(f"{prefix}├─ 📦 Imports ({len(imports)}):")
                    for imp in imports[:5]:  # Show first 5 imports
                        print(f"{prefix}│  • {imp}")
                    if len(imports) > 5:
                        print(f"{prefix}│  • ... and {len(imports) - 5} more")
                
                if interfaces:
                    print(f"{prefix}├─ 🔷 Interfaces/Types ({len(interfaces)}):")
                    for interface in interfaces:
                        print(f"{prefix}│  • {interface}")
                
                if classes:
                    print(f"{prefix}├─ 🎓 Classes ({len(classes)}):")
                    for class_name, methods in classes.items():
                        print(f"{prefix}│  • {class_name}")
                        if methods:
                            for method in methods[:5]:  # Show first 5 methods
                                print(f"{prefix}│    ↳ {method}")
                            if len(methods) > 5:
                                print(f"{prefix}│    ↳ ... and {len(methods) - 5} more")
                
                if functions:
                    print(f"{prefix}├─ ⚡ Functions ({len(functions)}):")
                    for func in functions[:5]:  # Show first 5 functions
                        print(f"{prefix}│  • {func}")
                    if len(functions) > 5:
                        print(f"{prefix}│  • ... and {len(functions) - 5} more")
                
                print(f"{prefix}│")
                
        except Exception as e:
            print(f"{prefix}│  ⚠️  Error analyzing file: {str(e)}")
    
    def _extract_imports(self, content: str) -> List[str]:
        """Extract import statements"""
        imports = []
        
        # Match: import ... from '...'
        import_pattern = r"import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['\"]([^'\"]+)['\"]"
        matches = re.finditer(import_pattern, content)
        for match in matches:
            imports.append(match.group(1))
        
        # Match: import '...'
        import_pattern2 = r"import\s+['\"]([^'\"]+)['\"]"
        matches = re.finditer(import_pattern2, content)
        for match in matches:
            if match.group(1) not in imports:
                imports.append(match.group(1))
        
        return imports
    
    def _extract_classes(self, content: str) -> Dict[str, List[str]]:
        """Extract class names and their methods"""
        classes = {}
        
        # Match: export class ClassName or class ClassName
        class_pattern = r"(?:export\s+)?(?:abstract\s+)?class\s+(\w+)(?:\s+extends\s+\w+)?(?:\s+implements\s+[\w,\s]+)?\s*{([^}]*(?:{[^}]*}[^}]*)*)}"
        
        # For complex classes with nested braces, use a simpler approach
        simple_class_pattern = r"(?:export\s+)?(?:abstract\s+)?class\s+(\w+)"
        matches = re.finditer(simple_class_pattern, content)
        
        for match in matches:
            class_name = match.group(1)
            
            # Find the class body (everything until the matching closing brace)
            class_start = match.end()
            brace_count = 0
            class_end = class_start
            
            for i, char in enumerate(content[class_start:], start=class_start):
                if char == '{':
                    brace_count += 1
                elif char == '}':
                    brace_count -= 1
                    if brace_count == -1:
                        class_end = i
                        break
            
            class_body = content[class_start:class_end] if class_end > class_start else ""
            
            # Extract methods from class body
            methods = self._extract_class_methods(class_body)
            classes[class_name] = methods
        
        return classes
    
    def _extract_class_methods(self, class_body: str) -> List[str]:
        """Extract method names from class body"""
        methods = []
        
        # Match: async methodName( or methodName( but not constructor
        method_pattern = r"(?:async\s+)?(?:public\s+|private\s+|protected\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*{"
        matches = re.finditer(method_pattern, class_body)
        
        for match in matches:
            method_name = match.group(1)
            if method_name not in ['constructor', 'if', 'for', 'while', 'switch']:
                methods.append(method_name)
        
        return list(set(methods))  # Remove duplicates
    
    def _extract_functions(self, content: str) -> List[str]:
        """Extract standalone function names (not class methods)"""
        functions = []
        
        # Match: export function name( or function name( or export const name = async function
        function_patterns = [
            r"(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(",
            r"(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s+)?(?:function|\([^)]*\)\s*=>)",
            r"(?:export\s+)?const\s+(\w+):\s*\([^)]*\)\s*=>\s*(?:void|Promise|any|[A-Z]\w*)"
        ]
        
        for pattern in function_patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                func_name = match.group(1)
                if func_name not in ['if', 'for', 'while', 'switch']:
                    functions.append(func_name)
        
        return list(set(functions))  # Remove duplicates
    
    def _extract_interfaces(self, content: str) -> List[str]:
        """Extract interface and type names"""
        interfaces = []
        
        # Match: export interface Name or interface Name
        interface_pattern = r"(?:export\s+)?interface\s+(\w+)"
        matches = re.finditer(interface_pattern, content)
        for match in matches:
            interfaces.append(f"interface {match.group(1)}")
        
        # Match: export type Name or type Name
        type_pattern = r"(?:export\s+)?type\s+(\w+)"
        matches = re.finditer(type_pattern, content)
        for match in matches:
            interfaces.append(f"type {match.group(1)}")
        
        return interfaces
    
    def generate_summary(self):
        """Generate a summary report of the framework"""
        print("\n" + "=" * 80)
        print("📊 FRAMEWORK SUMMARY")
        print("=" * 80)
        
        total_files = 0
        total_classes = 0
        total_functions = 0
        total_imports = set()
        
        for root, dirs, files in os.walk(self.root_path):
            # Remove ignored directories
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs]
            
            for file in files:
                if Path(file).suffix in self.file_extensions:
                    total_files += 1
                    file_path = Path(root) / file
                    
                    try:
                        content = file_path.read_text(encoding='utf-8', errors='ignore')
                        
                        imports = self._extract_imports(content)
                        total_imports.update(imports)
                        
                        classes = self._extract_classes(content)
                        total_classes += len(classes)
                        
                        functions = self._extract_functions(content)
                        total_functions += len(functions)
                        
                    except Exception:
                        pass
        
        print(f"\n📁 Total Source Files: {total_files}")
        print(f"🎓 Total Classes: {total_classes}")
        print(f"⚡ Total Functions: {total_functions}")
        print(f"📦 Unique Imports: {len(total_imports)}")
        
        # Common dependencies
        print(f"\n📦 Common Dependencies:")
        playwright_imports = [imp for imp in total_imports if 'playwright' in imp.lower()]
        if playwright_imports:
            print(f"   • Playwright: {len(playwright_imports)} imports")
        
        print("\n" + "=" * 80)


def main():
    """Main entry point"""
    import sys
    
    # Get the directory to analyze (from argument or default to script location)
    if len(sys.argv) > 1:
        target_dir = Path(sys.argv[1])
        if not target_dir.exists():
            print(f"❌ Error: Directory '{target_dir}' does not exist!")
            sys.exit(1)
        if not target_dir.is_dir():
            print(f"❌ Error: '{target_dir}' is not a directory!")
            sys.exit(1)
    else:
        target_dir = Path(__file__).parent
    
    print("\n" + "=" * 80)
    print("🔍 FRAMEWORK STRUCTURE ANALYZER")
    print("=" * 80)
    print(f"📂 Analyzing: {target_dir.absolute()}")
    print("=" * 80)
    
    analyzer = FrameworkAnalyzer(target_dir)
    
    # Print the tree structure with analysis
    analyzer.print_tree()
    
    # Generate summary
    analyzer.generate_summary()
    
    print("\n✅ Analysis Complete!\n")
    print("💡 Usage: python3 analyze_framework.py [directory_path]")
    print("   If no path provided, analyzes current directory\n")


if __name__ == "__main__":
    main()

