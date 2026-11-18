import { VulnerabilityFinding } from '../ingestion/types';

export type TechnologyType =
  | 'npm'
  | 'maven'
  | 'java'
  | 'typescript'
  | 'javascript'
  | 'python'
  | 'csharp'
  | 'cpp'
  | 'go'
  | 'rust'
  | 'other';

export interface TechnologyClassification {
  type: TechnologyType;
  label: string;
  badgeLabel: string;
  badgeClass: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
  category: 'build_dependency' | 'source_code';
  categoryLabel: string;
  isBuildDependency: boolean;
  isSourceCode: boolean;
  description: string;
}

export class TechnologyClassifier {
  /**
   * Strictly classifies a vulnerability finding into its exact technology,
   * distinguishing Maven (Java build tool/dependency) from Java (source code/language)
   * and npm (JavaScript/TypeScript Node.js package manager).
   */
  public static classify(finding: VulnerabilityFinding): TechnologyClassification {
    const raw = this.classifyInternal(finding);
    const badgeClass = 'badge-' + (raw.type === 'typescript' ? 'ts' : raw.type === 'javascript' ? 'js' : raw.type);
    return {
      ...raw,
      badgeClass,
      isBuildDependency: raw.category === 'build_dependency',
      isSourceCode: raw.category === 'source_code',
    };
  }

  private static classifyInternal(finding: VulnerabilityFinding): Omit<TechnologyClassification, 'badgeClass' | 'isBuildDependency' | 'isSourceCode'> {
    if (finding.source === 'dependabot') {
      const eco = (finding.dependency?.ecosystem || '').toLowerCase();
      const manifest = (finding.dependency?.manifestFile || '').toLowerCase();
      const pkg = (finding.dependency?.packageName || '').toLowerCase();

      // 1. Maven (Java Build & Dependency Tool - NOT Java source code)
      if (
        eco === 'maven' ||
        manifest.endsWith('pom.xml') ||
        pkg.includes(':') ||
        pkg.startsWith('org.spring') ||
        pkg.startsWith('org.apache') ||
        pkg.includes('log4j')
      ) {
        return {
          type: 'maven',
          label: 'Maven (Build & Dependencies)',
          badgeLabel: '📦 Maven (pom.xml)',
          badgeBg: 'rgba(199, 26, 54, 0.2)',
          badgeColor: '#ff7b8b',
          badgeBorder: 'rgba(199, 26, 54, 0.5)',
          category: 'build_dependency',
          categoryLabel: 'Java Build & Manifest Dependency',
          description: 'Managed via Maven pom.xml dependency coordinates and repository resolvers.',
        };
      }

      // 2. npm / Node.js
      if (
        eco === 'npm' ||
        eco === 'yarn' ||
        eco === 'pnpm' ||
        manifest.endsWith('package.json') ||
        manifest.endsWith('package-lock.json')
      ) {
        return {
          type: 'npm',
          label: 'npm (Node.js Package)',
          badgeLabel: '📦 npm (package.json)',
          badgeBg: 'rgba(203, 56, 55, 0.2)',
          badgeColor: '#ff8a80',
          badgeBorder: 'rgba(203, 56, 55, 0.5)',
          category: 'build_dependency',
          categoryLabel: 'Node.js Ecosystem Dependency',
          description: 'Managed via npm package.json and lockfile overrides.',
        };
      }

      // 3. Python pip / uv
      if (
        eco === 'pip' ||
        eco === 'uv' ||
        manifest.endsWith('requirements.txt') ||
        manifest.endsWith('pyproject.toml')
      ) {
        return {
          type: 'python',
          label: 'Python (pip / PyPI)',
          badgeLabel: '🐍 Python (pip)',
          badgeBg: 'rgba(55, 118, 171, 0.2)',
          badgeColor: '#79c0ff',
          badgeBorder: 'rgba(55, 118, 171, 0.5)',
          category: 'build_dependency',
          categoryLabel: 'Python Package Dependency',
          description: 'Managed via requirements.txt or pyproject.toml.',
        };
      }

      // 4. NuGet (.NET / C#)
      if (eco === 'nuget' || manifest.endsWith('.csproj')) {
        return {
          type: 'csharp',
          label: 'NuGet (.NET / C#)',
          badgeLabel: '🔷 NuGet (.csproj)',
          badgeBg: 'rgba(0, 72, 128, 0.25)',
          badgeColor: '#58a6ff',
          badgeBorder: 'rgba(0, 72, 128, 0.5)',
          category: 'build_dependency',
          categoryLabel: '.NET Assembly Dependency',
          description: 'Managed via .csproj PackageReference elements.',
        };
      }

      return {
        type: 'other',
        label: `${eco.toUpperCase() || 'Dependency'}`,
        badgeLabel: `📦 ${eco.toUpperCase() || 'Dependency'}`,
        badgeBg: 'rgba(255, 255, 255, 0.1)',
        badgeColor: '#d1d5da',
        badgeBorder: 'rgba(255, 255, 255, 0.2)',
        category: 'build_dependency',
        categoryLabel: 'Third-Party Dependency',
        description: 'Third-party library manifest entry.',
      };
    } else {
      // Code Scanning / SAST / CodeQL
      const fp = (finding.location?.filePath || '').toLowerCase();
      const rule = (finding.ruleId || '').toLowerCase();

      // 1. Java Source Code (Application code - distinct from Maven build tool)
      if (fp.endsWith('.java') || rule.startsWith('java/')) {
        return {
          type: 'java',
          label: 'Java (Application Source Code)',
          badgeLabel: '☕ Java (Source Code)',
          badgeBg: 'rgba(231, 111, 0, 0.2)',
          badgeColor: '#ffa657',
          badgeBorder: 'rgba(231, 111, 0, 0.5)',
          category: 'source_code',
          categoryLabel: 'Java Application Logic & SAST',
          description: 'First-party Java classes, methods, and Spring filter chains in .java files.',
        };
      }

      // 2. TypeScript
      if (fp.endsWith('.ts') || fp.endsWith('.tsx')) {
        return {
          type: 'typescript',
          label: 'TypeScript (Source Code)',
          badgeLabel: '🔷 TypeScript',
          badgeBg: 'rgba(49, 120, 198, 0.2)',
          badgeColor: '#79c0ff',
          badgeBorder: 'rgba(49, 120, 198, 0.5)',
          category: 'source_code',
          categoryLabel: 'TypeScript Source Code',
          description: 'First-party TypeScript source code.',
        };
      }

      // 3. JavaScript
      if (fp.endsWith('.js') || fp.endsWith('.jsx') || rule.startsWith('js/')) {
        return {
          type: 'javascript',
          label: 'JavaScript (Source Code)',
          badgeLabel: '🟨 JavaScript',
          badgeBg: 'rgba(247, 223, 30, 0.15)',
          badgeColor: '#f9e64f',
          badgeBorder: 'rgba(247, 223, 30, 0.4)',
          category: 'source_code',
          categoryLabel: 'JavaScript Source Code',
          description: 'First-party JavaScript source code.',
        };
      }

      // 4. Python
      if (fp.endsWith('.py') || rule.startsWith('py/')) {
        return {
          type: 'python',
          label: 'Python (Source Code)',
          badgeLabel: '🐍 Python',
          badgeBg: 'rgba(55, 118, 171, 0.2)',
          badgeColor: '#79c0ff',
          badgeBorder: 'rgba(55, 118, 171, 0.5)',
          category: 'source_code',
          categoryLabel: 'Python Source Code',
          description: 'First-party Python scripts and application logic.',
        };
      }

      // 5. C# / .NET
      if (fp.endsWith('.cs') || rule.startsWith('cs/')) {
        return {
          type: 'csharp',
          label: 'C# (Source Code)',
          badgeLabel: '🔷 C#',
          badgeBg: 'rgba(104, 33, 122, 0.2)',
          badgeColor: '#d2a8ff',
          badgeBorder: 'rgba(104, 33, 122, 0.5)',
          category: 'source_code',
          categoryLabel: 'C# Source Code',
          description: 'First-party C# assembly code.',
        };
      }

      // 6. C/C++
      if (
        fp.endsWith('.cpp') ||
        fp.endsWith('.c') ||
        fp.endsWith('.h') ||
        fp.endsWith('.hpp') ||
        rule.startsWith('cpp/') ||
        rule.startsWith('c/')
      ) {
        return {
          type: 'cpp',
          label: 'C/C++ (Source Code)',
          badgeLabel: '⚙️ C/C++',
          badgeBg: 'rgba(0, 89, 156, 0.2)',
          badgeColor: '#58a6ff',
          badgeBorder: 'rgba(0, 89, 156, 0.5)',
          category: 'source_code',
          categoryLabel: 'Native C/C++ Source Code',
          description: 'First-party native memory unmanaged C/C++ source code.',
        };
      }

      return {
        type: 'other',
        label: 'Source Code (SAST)',
        badgeLabel: '🔍 Source Code',
        badgeBg: 'rgba(111, 66, 193, 0.2)',
        badgeColor: '#d2a8ff',
        badgeBorder: 'rgba(111, 66, 193, 0.4)',
        category: 'source_code',
        categoryLabel: 'Application Source Code',
        description: 'First-party application code.',
      };
    }
  }
}
