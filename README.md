<div align="center">
  <img src="resources/icon.png" width="120" height="120" alt="CodeVulFixer Logo" />
  <h1>CodeVulFixer</h1>
  <p><strong>Production-Grade Vulnerability Remediation & Sprint Orchestration Engine</strong></p>

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-v1.90%2B-007ACC.svg)](https://code.visualstudio.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

**CodeVulFixer** is a production-grade VS Code Extension and Systems Architecture designed for automated, enterprise-scale security remediation. It securely authenticates with GitHub, ingests both **Dependabot alerts** and **GitHub Code Scanning (SAST / CodeQL)** findings, performs rigorous static analysis to size the impact, generates detailed multi-day evaluation sprint plans, executes codebase fixes (via **Deterministic Zero-Token** or **Copilot Language Model API**), and enforces a strict post-fix verification engine with human-in-the-loop checkpoints.

📖 **[Read the Full Professional Interactive User Guide](docs/user-guide.html)**  
📊 **[Explore Sample HTML Reports Showcase](reports/index.html)** (all 5 report formats available in [`reports/`](reports/)).

---

## 🌟 Key Architecture & Capabilities

```mermaid
flowchart TD
    A[VS Code Workspace / Git Remote] --> B[Module A: Auth & Ingestion]
    B -->|vscode.authentication| C[GitHub Session: repo, security_events]
    C -->|@octokit/rest| D[Dependabot Alerts]
    C -->|@octokit/rest| E[CodeQL Code Scanning SAST]
    
    D & E --> F[Module B: Impact Analysis & Sizing Engine]
    F -->|Manifest & Taint Analysis| G[T-Shirt Sizing Matrix: S, M, L]
    
    G --> H[Module C: Multi-Day Sprint Planning Engine]
    H -->|State Persistence| I[.codevulfixer/sprint-state.json]
    
    H --> J[Module D: Dual-Engine Repair System]
    J -->|Zero-Token Path| K[Deterministic Fixer: npm/pnpm/yarn/uv/pip + ast-grep]
    J -->|AI Path| L[Native vscode.lm Copilot LM API]
    
    K & L --> M[Module E: Local Validation & Task Runner]
    M -->|vscode.tasks / exec| N[Build: npm run build / tsc]
    M -->|vscode.tasks / exec| O[Tests: npm test / pytest]
    M -->|audit| P[Ecosystem Audit: npm audit]
    
    N & O & P -->|Passed| Q[Human-in-the-Loop Checkpoint Intercept]
    Q -->|Diff Inspection| R[Line-by-Line Git Diff]
    R -->|👍 Verify & Stage| S[vscode.scm API: Git Add & Commit Message Populated]
    R -->|❌ Reject & Rollback| T[Git Restore: Safe Mutation Rollback]

    H --> U[Module F: Enterprise UI Dashboard Webview]
    U --> V[Tab 1: Workspace Risk Profile]
    U --> W[Tab 2: Interactive Sprint Board]
    U --> X[Tab 3: Diff & Checkpoint Intercept]
    U --> Y[Tab 4: Sprint Configuration]
```

---

## 🏗️ Core Functional Modules

### Module A: Secure Authentication & Unified Alert Ingestion
- **Native Authentication:** Invokes `vscode.authentication.getSession('github', ['repo', 'security_events'], { createIfNone: true })` using VS Code's official token provider.
- **Git Remote Resolver:** Automatically inspects Git configuration (`git config --get remote.origin.url`) to resolve repository `owner` and `repo` names across HTTPS, SSH, and tokenized URLs.
- **Unified Fetcher:** Concurrently queries `@octokit/rest` for:
  - **Dependabot Alerts:** CVE/GHSA identifiers, vulnerable version ranges, first patched versions, and package manifest paths.
  - **Code Scanning Findings (CodeQL SAST):** Rule IDs, severity levels, structural taint flows, and precise code boundaries (`filePath`, `startLine`, `endLine`, `startColumn`, `endColumn`).
- **Offline / Sandbox Mode:** Bundled with high-fidelity realistic security findings for zero-config evaluation in environments without GitHub Advanced Security (GHAS).

### Module B: Impact Analysis, Estimation, & Multi-Dimensional Sizing
- **Dependency Topology:** Inspects workspace manifests (`package.json`, `requirements.txt`, `pyproject.toml`) and lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `uv.lock`) to determine whether a dependency is **direct** (requiring API audit) or **transitive** (eligible for pure lockfile deduplication).
- **Code Locality & Taint Analysis:** Analyzes source locality, file lines, function scope enclosure, and data-flow path complexity for CodeQL findings.
- **T-Shirt Sizing Matrix:**
  - **Size S (Low Risk, ~0.5h):** Pure lockfile bump, minor/patch variation, or self-contained localized SAST fixes (e.g. `Math.random` PRNG swap, `innerHTML` -> `textContent`).
  - **Size M (Medium Risk, ~1.5h - 2.5h):** Major version upgrades or SAST findings in non-critical components requiring regression test validation.
  - **Size L (High Risk, ~3.0h - 5.0h):** Breaking changes predicted, critical paths import the vulnerable entity, or complex security weaknesses (SQL Injection, Command Injection, SSRF, Deserialization) traversing multiple application layers.

### Module C: Dual-Cadence Sprint Planning & Work Chunking Engine
To align with diverse organizational rhythms, CodeVulFixer supports two distinct planning cadences:
- **Sprint-wise Plan (10 Working Days / 2-Week Scrum Cadence):** Standard 10-day sprint cycle accommodating full sprint backlogs (~10–15 issues) with balanced distribution across Sprint 1 (Sprint Goal: High Risk & Quick Wins), Sprint 2 (Architectural & Transitive), and Sprint 3 (Security Hygiene).
- **Day-wise Plan (1 Working Day Micro-Chunk):** 1 working day per sprint block, strictly enforcing `maxHighRiskPerDay` (default 3) to prevent daily cognitive overload.
- **Dynamic Cadence Switching:** Instant toggle between Sprint-wise (10 Days) and Day-wise (1 Day) right from the interactive Dashboard header buttons or via settings.
- **Persistence Store:** Saves state locally to `.codevulfixer/sprint-state.json`, tracking item states (`pending`, `in_progress`, `applied`, `verified`, `failed`, `rejected`) and selected cadence across editor restarts.

### Module D: The Dual-Engine Repair System
- **Deterministic Path (Zero-Token):**
  - Spawns ecosystem package managers (`npm install package@version --package-lock-only`, `pnpm update`, `yarn up`, `uv add`, `pip install`).
  - Executes precompiled structural AST-grep transformation rules for common CWEs:
    - **CWE-330 (Insecure Randomness):** Replaces `Math.random()` with `crypto.randomBytes(32).toString('hex')`.
    - **CWE-79 (DOM XSS):** Replaces vulnerable `.innerHTML` assignments with safe `.textContent`.
    - **CWE-78 (Command Injection):** Refactors shell string interpolation into argument arrays using `execFile`.
    - **CWE-89 (SQL Injection):** Parameterizes raw SQL template literals.
    - **CWE-22 (Path Traversal):** Enforces path boundary checks and `path.basename` guards.
- **AI-Assisted Path (VS Code LM API):**
  - Leverages the user's active GitHub Copilot instance via native `vscode.lm.selectChatModels({ vendor: 'copilot' })` and `sendRequest(...)` without external API keys.
  - Passes targeted vulnerability context, file content, and security rules in structured prompts.
  - Automatically parses the generated code and applies changes to the workspace.

### Module E: Deep Local Validation & Human-in-the-Loop Verification
- **Automated Compilation & Test Checks:** Executes workspace compilation (`npm run build`, `tsc --noEmit`) and regression test suites (`npm test`, `pytest`) using `vscode.tasks` and background execution. Tracks test durations, exit codes, and failure stack traces.
- **Ecosystem Security Audits:** Runs `npm audit` / `pip-audit` to verify that the target advisory is cleared.
- **Interactive Checkpoint Intercept:** When automated validation succeeds, halts the pipeline and displays a mandatory checkpoint banner:
  - Renders line-by-line color-coded Git diffs.
  - **`[👍 Mark as Verified & Stage for Check-in]`:** Calls `vscode.scm` to stage the file (`git add <file>`) and automatically populates the Git commit message:
    ```
    security(fix): [CodeVulFixer] resolved [ID] in [Context]
    ```
  - **`[❌ Reject Fix & Rollback]`:** Automatically runs `git restore` / `git checkout -- <file>` to revert workspace mutations, marks the finding as `rejected`, and updates sprint state.

### Module F: Enterprise UI Report Dashboard & Color-Coding Specification
The extension renders a rich, theme-aware Webview dashboard using VS Code theme tokens:

#### 🎨 Color-Coding Telemetry System
| Color Token | Hex / VS Code Variable | Application |
|---|---|---|
| **🟢 SUCCESS / LOW RISK** | `#28a745` / `var(--vscode-testing-iconPassedColor)` | Fully cleared vulnerabilities, verified manual stages, successful test suites, Size S findings. |
| **🟡 WARNING / MEDIUM RISK** | `#ffc107` / `var(--vscode-testing-iconQueuedColor)` | Items awaiting manual verification, partial lockfile updates, unresolved transitive risks, Size M findings. |
| **🔴 FAILURE / HIGH RISK** | `#dc3545` / `var(--vscode-testing-iconFailedColor)` | Failed validation tests, compilation breaks, unmitigated critical security risks, Size L findings. |
| **🔵 TEAL / INFO** | `#17a2b8` / `var(--vscode-textLink-foreground)` | Sprint assumptions, estimated hours saved metrics, multi-day planning timelines. |

#### 📑 UI Tabs Layout
1. **Workspace Risk Profile:** Executive security overview, telemetric counters, risk distribution matrix, and sizing table.
2. **Interactive Sprint Board:** Kanban/chronological timeline mapping Sprint chunks, active command anchors (`[Execute Automated Sprint Fixes]`, `[Zero-Token]`, `[Copilot AI]`, `[Diff]`), and dynamic terminal logs for failure stack traces.
3. **Live Diff & Human-in-the-Loop Intercept:** Line-by-line diff inspector, validation telemetry cards (build, test, audit), and stage/rollback action buttons.
4. **Sprint Configuration:** Sliders and dropdowns to configure daily high-risk caps, target sprint days, package manager overrides, and fix engines.

---

## 🚀 Quick Start & Development

### 1. Installation & Compilation
```bash
# Clone and enter the repository
cd c:\Avijit\CodeVulFixer

# Install dependencies
npm install

# Run TypeScript compilation check
npm run compile

# Build the extension bundle with esbuild
npm run build

# Run comprehensive automated test suite (9 unit & integration tests)
npm test
```

### 1. Installation in VS Code

| Extension Property | Value |
|---|---|
| **Display Name** | **CodeVulFixer** |
| **Extension Identifier** | `AvijitKumarTewary.codevulfixer` |
| **Pre-built VSIX Package** | [`codevulfixer-1.0.7.vsix`](codevulfixer-1.0.7.vsix) |

#### Option A: One-Click VSIX Install (Recommended)
1. Open VS Code.
2. Press `Ctrl + Shift + X` to open the Extensions view.
3. Click the `...` menu in the upper-right corner of the Extensions panel and select **"Install from VSIX..."**.
4. Select `codevulfixer-1.0.7.vsix` from this directory.
5. *Or via Terminal:*
   ```bash
   code --install-extension codevulfixer-1.0.7.vsix
   ```

#### Option B: Debug via Extension Development Host
1. Open this repository in VS Code.
2. Press **`F5`** (or select **Run CodeVulFixer Extension** in the Run & Debug view).
3. An isolated Extension Development Host window will launch with CodeVulFixer active.

---

## ⌨️ Command Palette (`Ctrl + Shift + P`) Reference

All extension capabilities can be executed directly from the VS Code Command Palette:

| Command Title | Command ID | Icon | Purpose & Use Case |
|---|---|---|---|
| **`CodeVulFixer: Open Sprint & Risk Dashboard`** | `codevulfixer.openDashboard` | `$(dashboard)` | Opens the interactive Webview dashboard with 5 telemetry tabs (Risk Profile, Sprint Board, Diff Inspector, Settings, Execution Logs & Diagnostics). |
| **`CodeVulFixer: Scan & Ingest Vulnerabilities`** | `codevulfixer.scan` | `$(shield)` | Prompts GitHub OAuth session, concurrently fetches Dependabot + CodeQL alerts, runs sizing, and generates sprint schedule. |
| **`CodeVulFixer: Execute Current Sprint Fixes`** | `codevulfixer.runSprint` | `$(play)` | Executes automated batch fixes for the active sprint day, runs validation suites, and triggers the diff checkpoint. |
| **`CodeVulFixer: Load Realistic Demo Findings`** | `codevulfixer.loadDemoData` | `$(beaker)` | Instantly loads 9 realistic findings (4 Dependabot + 5 CodeQL SAST) for offline testing without needing GHAS credentials. |
| **`CodeVulFixer: Reset Sprint State`** | `codevulfixer.resetState` | `$(refresh)` | Cleans up `.codevulfixer/sprint-state.json` and resets all tracking metrics. |
| **`CodeVulFixer: Export Dashboard to Excel (XML)`** | `codevulfixer.exportExcel` | `$(file)` | Generates complete multi-tab workbook (.xml) with separated Dependabot and Code Scanning worksheets in native Excel XML format. |

---

## 🧭 Where to Find CodeVulFixer in VS Code

1. **Activity Bar Sidebar Icon:** Click the **🛡️ CodeVulFixer Shield** icon on the left Activity Bar to open the **Sprint Remediation Control** sidebar view.
2. **Command Palette:** Press `Ctrl + Shift + P` (or `Cmd + Shift + P`) and type `CodeVulFixer`.
3. **Dedicated Webview Tab:** The full dashboard opens in an editor tab with light, dark, and high-contrast theme support.

---

## ⚙️ Configuration Reference

| Setting | Default | Description |
|---|---|---|
| `codevulfixer.planningMode` | `"sprint_wise"` | Planning cadence: `"sprint_wise"` (10 working days/sprint) or `"day_wise"` (1 day micro-chunk). |
| `codevulfixer.daysPerSprint` | `10` | Number of working days per sprint in Sprint-wise mode (standard 10 days for 2-week Agile sprint). |
| `codevulfixer.maxHighRiskPerDay` | `3` | Maximum number of High-Risk / Size L vulnerabilities to schedule per sprint day in Day-wise mode. |
| `codevulfixer.targetSprintDays` | `4` | Target remediation timeline in days for multi-day sprint planning. |
| `codevulfixer.packageManager` | `"auto"` | Package manager CLI (`auto`, `npm`, `pnpm`, `yarn`, `uv`, `pip`) for lockfile bumps. |
| `codevulfixer.preferredFixEngine` | `"auto"` | Preferred engine (`auto`, `deterministic`, `copilot`). |
| `codevulfixer.autoRunTests` | `true` | Automatically run build and test validation after applying fixes. |
| `codevulfixer.testCommand` | `"npm test"` | Command to execute regression test verification. |
| `codevulfixer.buildCommand` | `"npm run build"` | Command to execute compilation/build check. |
| `codevulfixer.auditCommand` | `"npm audit"` | Command to execute ecosystem security audit verification. |

---

## 🧪 Automated Test Suite

CodeVulFixer comes with 32 automated unit and integration tests covering:
- ✅ **Test Group 1:** T-Shirt Sizing & Impact Analysis Matrix (Dependabot patch/major, CodeQL SQLi, Math.random)
- ✅ **Test Group 2:** Multi-Day Sprint Work Chunking & Cognitive Load Caps
- ✅ **Test Group 3:** Structural AST-grep Deterministic Rules (CWE-330, CWE-79, CWE-78)
- ✅ **Test Group 4:** Local File Persistence (`.codevulfixer/sprint-state.json`) lifecycle
- ✅ **Test Group 5:** Sprint Planner Cadence Modes (`sprint_wise` vs `day_wise`)
- ✅ **Test Group 6:** Fix Clarifier Multi-Turn Intent Architecture
- ✅ **Test Group 7:** Excel Multi-Tab XML Export Formatting & Sanitization
- ✅ **Test Group 8:** Telemetry Diagnostics Buffer, Lockfile Fallback Resolution, Tab 5 Execution Logs, and Hallucination Justification Guardrails

To run tests:
```bash
npm test
```
All 32 tests pass in ~25 milliseconds.
