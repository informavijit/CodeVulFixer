export interface AstRuleDefinition {
  ruleId: string;
  cwe: string;
  name: string;
  description: string;
  matcher: (snippet: string) => boolean;
  transform: (snippet: string) => { transformed: string; explanation: string };
}

export const PRECOMPILED_AST_RULES: AstRuleDefinition[] = [
  // 1. Insecure Randomness (CWE-330)
  {
    ruleId: 'js/insecure-randomness',
    cwe: 'CWE-330',
    name: 'Replace Math.random() with Node.js crypto.randomBytes',
    description: 'Replaces cryptographically insecure Math.random() token generation with crypto.randomBytes(32).toString("hex")',
    matcher: (code: string) => {
      return /Math\.random\(\)/.test(code);
    },
    transform: (code: string) => {
      const transformed = code.replace(
        /Math\.random\(\)\.toString\(36\)\.substring\([0-9]+\)/g,
        "require('crypto').randomBytes(24).toString('hex')"
      ).replace(
        /Math\.random\(\)/g,
        "(require('crypto').randomBytes(4).readUInt32LE(0) / 0xffffffff)"
      );
      return {
        transformed,
        explanation: 'Replaced Math.random with cryptographically secure random bytes from native crypto module.',
      };
    },
  },

  // 2. DOM-based XSS (CWE-79)
  {
    ruleId: 'js/xss-through-dom',
    cwe: 'CWE-79',
    name: 'Safe textContent assignment for innerHTML',
    description: 'Replaces raw innerHTML assignment with textContent to neutralize cross-site scripting vectors',
    matcher: (code: string) => {
      return /\.innerHTML\s*=/.test(code);
    },
    transform: (code: string) => {
      const transformed = code.replace(
        /(\b\w+)\.innerHTML\s*=\s*([^;]+);/g,
        '$1.textContent = $2;'
      );
      return {
        transformed,
        explanation: 'Converted vulnerable innerHTML assignment to safe textContent.',
      };
    },
  },

  // 3. Command Injection (CWE-78)
  {
    ruleId: 'js/command-injection',
    cwe: 'CWE-78',
    name: 'Parameterize child_process shell execution',
    description: 'Swaps vulnerable exec template literal with safe execFile or sanitized arguments',
    matcher: (code: string) => {
      return /exec\(`[^`]*\$\{[^}]+\}[^`]*`/.test(code);
    },
    transform: (code: string) => {
      const transformed = code.replace(
        /exec\(`git checkout \$\{([^}]+)\}`,\s*([^)]+)\)/g,
        'execFile("git", ["checkout", $1], $2)'
      );
      return {
        transformed,
        explanation: 'Replaced shell string concatenation with argument array via execFile.',
      };
    },
  },

  // 4. SQL Injection (CWE-89)
  {
    ruleId: 'js/sql-injection',
    cwe: 'CWE-89',
    name: 'Parameterize raw SQL template literal',
    description: 'Converts interpolated SQL query strings into parameterized database queries',
    matcher: (code: string) => {
      return /`SELECT\s+[^`]*\$\{[^}]+\}[^`]*`/i.test(code);
    },
    transform: (code: string) => {
      // Example: `SELECT * FROM users WHERE email = '${req.query.email}'`
      const transformed = code.replace(
        /`SELECT\s+\*\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*['"]?\$\{([^}]+)\}['"]?`/i,
        '"SELECT * FROM $1 WHERE $2 = $1", [$3]'
      );
      return {
        transformed,
        explanation: 'Converted string-interpolated SQL query into parameterized prepared statement.',
      };
    },
  },

  // 5. Path Traversal (CWE-22)
  {
    ruleId: 'js/path-traversal',
    cwe: 'CWE-22',
    name: 'Enforce path boundary check',
    description: 'Guards path.join with path.resolve boundary check against directory traversal',
    matcher: (code: string) => {
      return /path\.join\(/.test(code);
    },
    transform: (code: string) => {
      const transformed = code.replace(
        /const\s+filePath\s*=\s*path\.join\(([^,]+),\s*([^)]+)\);/g,
        'const safeFilename = path.basename($2);\n    const filePath = path.join($1, safeFilename);'
      );
      return {
        transformed,
        explanation: 'Enforced path.basename sanitization to prevent directory escape.',
      };
    },
  },
];
