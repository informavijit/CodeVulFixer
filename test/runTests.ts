import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { SizingEngine } from '../src/analysis/sizingEngine';
import { CompatibilityAdvisor } from '../src/analysis/compatibilityAdvisor';
import { TaskValidator } from '../src/validation/taskValidator';
import { SprintPlanner } from '../src/sprint/sprintPlanner';
import { StateStore } from '../src/sprint/stateStore';
import { PRECOMPILED_AST_RULES } from '../src/engines/astGrepRules';
import { REALISTIC_DEMO_FINDINGS } from '../src/ingestion/mockData';
import { VulnerabilityFinding } from '../src/ingestion/types';
import { ExcelExporter } from '../src/export/excelExporter';
import { ClubbingEngine } from '../src/analysis/clubbingEngine';
import { LearnedPatternEngine } from '../src/engines/learnedPatternEngine';
import { UniqueVulnAggregator } from '../src/analysis/uniqueVulnAggregator';
import { FixClarifierEngine } from '../src/analysis/fixClarifierEngine';
import { logger, LogEntry } from '../src/utils/logger';
import { getDashboardHtml } from '../src/webview/htmlTemplate';
import { DeterministicFixer } from '../src/engines/deterministicFixer';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 CodeVulFixer Comprehensive Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function it(title: string, fn: () => void | Promise<void>) {
    try {
      await fn();
      console.log(`  ✔ [PASS] ${title}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✘ [FAIL] ${title}: ${err.stack || err.message}`);
      failed++;
    }
  }

  // 1. Sizing Matrix Tests
  console.log('📋 Test Group 1: T-Shirt Sizing & Impact Analysis Matrix');

  await it('Dependabot minor/patch bump should size as Size S with low risk', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-TEST-1',
      source: 'dependabot',
      alertNumber: 1,
      title: 'Patch vulnerability',
      description: 'Patch bump',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Bump',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const evaluated = SizingEngine.evaluate(finding, {
      packageName: 'lodash',
      ecosystem: 'npm',
      currentVersion: '4.17.20',
      fixedVersion: '4.17.21',
      isDirect: true,
      upgradeType: 'patch',
    });

    assert.strictEqual(evaluated.size, 'S');
    assert.strictEqual(evaluated.riskLevel, 'low');
    assert.strictEqual(evaluated.isAutomatedCandidate, true);
    assert.strictEqual(evaluated.estimatedHours, 0.5);
  });

  await it('Dependabot major version upgrade should size as Size L with high risk', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-TEST-2',
      source: 'dependabot',
      alertNumber: 2,
      title: 'Major version upgrade required',
      description: 'Major bump',
      severity: 'critical',
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Major upgrade',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 3.5, isAutomatedCandidate: false },
    };

    const evaluated = SizingEngine.evaluate(finding, {
      packageName: 'package-foo',
      ecosystem: 'npm',
      currentVersion: '1.2.0',
      fixedVersion: '2.0.0',
      isDirect: true,
      upgradeType: 'major',
    });

    assert.strictEqual(evaluated.size, 'L');
    assert.strictEqual(evaluated.riskLevel, 'high');
    assert.strictEqual(evaluated.isAutomatedCandidate, false);
    assert.strictEqual(evaluated.estimatedHours, 3.5);
  });

  await it('Dependabot multi-major version jump (Spring 1.x -> 5.x) should size as Size XL with scaled hours', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-SPRING-TEST',
      source: 'dependabot',
      alertNumber: 999,
      title: 'Spring Framework RCE',
      description: 'Upgrade Spring 1.2.9 to 5.3.39 on Java 8',
      severity: 'critical',
      status: 'pending',
      targetSprint: 2,
      remediationPlan: 'Migrate Spring 1.x XML to 5.x',
      sizing: { size: 'XL', riskLevel: 'high', reasons: [], estimatedHours: 54, isAutomatedCandidate: false },
    };

    const evaluated = SizingEngine.evaluate(finding, {
      packageName: 'org.springframework:spring-core',
      ecosystem: 'maven',
      currentVersion: '1.2.9',
      fixedVersion: '5.3.39',
      isDirect: true,
      upgradeType: 'major',
      majorGap: 4,
    });

    assert.strictEqual(evaluated.size, 'XL');
    assert.strictEqual(evaluated.riskLevel, 'high');
    assert.strictEqual(evaluated.isAutomatedCandidate, false);
    assert.ok(evaluated.estimatedHours >= 40, `Multi-major leap must estimate >= 40 hours, got ${evaluated.estimatedHours}`);
    assert.ok(evaluated.reasons.some(r => r.includes('Multi-generational major version jump')));
  });

  await it('CodeQL SQL Injection should size as Size L with high risk', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-SQL',
      source: 'code_scanning',
      alertNumber: 99,
      title: 'SQL Injection',
      description: 'SQLi',
      severity: 'critical',
      ruleId: 'js/sql-injection',
      cweIds: ['CWE-89'],
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Fix SQL',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 4.0, isAutomatedCandidate: false },
    };

    const evaluated = SizingEngine.evaluate(finding, undefined, {
      fileExists: true,
      fileLinesCount: 150,
      isSelfContained: false,
      taintComplexity: 'complex',
    });

    assert.strictEqual(evaluated.size, 'L');
    assert.strictEqual(evaluated.riskLevel, 'high');
    assert.strictEqual(evaluated.isAutomatedCandidate, false);
    assert.strictEqual(evaluated.estimatedHours, 4.0);
  });

  await it('CodeQL Insecure Randomness (Math.random) should size as Size S', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-RND',
      source: 'code_scanning',
      alertNumber: 98,
      title: 'Insecure randomness',
      description: 'Math.random',
      severity: 'medium',
      ruleId: 'js/insecure-randomness',
      cweIds: ['CWE-330'],
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Fix RNG',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const evaluated = SizingEngine.evaluate(finding, undefined, {
      fileExists: true,
      fileLinesCount: 20,
      isSelfContained: true,
      taintComplexity: 'simple',
    });

    assert.strictEqual(evaluated.size, 'S');
    assert.strictEqual(evaluated.riskLevel, 'low');
    assert.strictEqual(evaluated.isAutomatedCandidate, true);
    assert.strictEqual(evaluated.estimatedHours, 0.5);
  });

  await it('Delphi / Object Pascal unmanaged code should size with elevated effort', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-DELPHI',
      source: 'code_scanning',
      alertNumber: 97,
      title: 'Buffer Boundary Violation in Native Unit',
      description: 'Unsafe pointer arithmetic in legacy Pascal unit',
      severity: 'medium',
      ruleId: 'delphi/buffer-overflow',
      cweIds: ['CWE-120'],
      location: { filePath: 'src/native/CryptoEngine.pas', startLine: 45, endLine: 50 },
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Fix buffer',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const evaluated = SizingEngine.evaluate(finding, undefined, {
      fileExists: true,
      fileLinesCount: 150,
      isSelfContained: true,
      taintComplexity: 'simple',
    });

    assert.ok(evaluated.size === 'M' || evaluated.size === 'L', `Delphi should be elevated, got ${evaluated.size}`);
    assert.ok(evaluated.estimatedHours >= 3.0, `Delphi hours should be >= 3.0, got ${evaluated.estimatedHours}`);
    assert.ok(evaluated.reasons.some(r => r.includes('Delphi / Object Pascal unmanaged binary')));
  });

  await it('PowerShell script finding should detect PowerShell ecosystem and CmdletBinding', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-PS1',
      source: 'code_scanning',
      alertNumber: 96,
      title: 'Script Injection in Invoke-Expression',
      description: 'Untrusted user input concatenated into PowerShell command',
      severity: 'high',
      ruleId: 'powershell/command-injection',
      cweIds: ['CWE-78'],
      location: { filePath: 'scripts/DeployCluster.ps1', startLine: 12, endLine: 18 },
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Fix PowerShell',
      sizing: { size: 'M', riskLevel: 'medium', reasons: [], estimatedHours: 2.0, isAutomatedCandidate: false },
    };

    const evaluated = SizingEngine.evaluate(finding);
    assert.ok(evaluated.reasons.some(r => r.includes('PowerShell script environment')));
  });

  await it('.NET log4net upgrade with .NET Framework constraint should recommend safe intermediate 2.0.15', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-TEST-LOG4NET',
      source: 'dependabot',
      alertNumber: 95,
      title: 'XML External Entity in log4net',
      description: 'Target repository runs .NET Framework 4.8',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Upgrade log4net',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 3.5, isAutomatedCandidate: false },
    };

    const advice = CompatibilityAdvisor.advise(finding, 'C:\\Avijit\\CodeVulFixer', {
      packageName: 'log4net',
      ecosystem: 'nuget',
      currentVersion: '1.2.10',
      fixedVersion: '3.0.0',
      isDirect: true,
      upgradeType: 'major',
      targetFramework: 'net48',
    });

    assert.ok(advice, 'Compatibility advice should be returned for log4net on net48');
    assert.strictEqual(advice?.safeRecommendedVersion, '2.0.15');
    assert.strictEqual(advice?.hasDeadlock, true);
  });

  await it('C/C++ native unmanaged code should size with elevated memory-safety effort', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-CPP',
      source: 'code_scanning',
      alertNumber: 94,
      title: 'Buffer Overflow / Out-of-bounds Write',
      description: 'Unsafe memcpy boundary in network parser',
      severity: 'critical',
      ruleId: 'cpp/overflow-buffer',
      cweIds: ['CWE-120', 'CWE-787'],
      location: { filePath: 'src/core/packet_parser.cpp', startLine: 120, endLine: 135 },
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Fix memcpy with bounds check',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const evaluated = SizingEngine.evaluate(finding, undefined, {
      fileExists: true,
      fileLinesCount: 400,
      isSelfContained: true,
      taintComplexity: 'simple',
    });

    assert.ok(evaluated.size === 'M' || evaluated.size === 'L', `C++ should be elevated, got ${evaluated.size}`);
    assert.ok(evaluated.estimatedHours >= 3.5, `C++ hours should be >= 3.5, got ${evaluated.estimatedHours}`);
    assert.ok(evaluated.reasons.some(r => r.includes('C/C++ native unmanaged code')));
    assert.strictEqual(evaluated.isAutomatedCandidate, false);
  });

  // 2. Sprint Planner Tests
  console.log('\n📅 Test Group 2: 10-Day Agile Sprints (60h Capacity) & Unique Vulnerabilities');

  await it('Sprint-wise Plan divides total estimated hours into 10-day Agile sprints (60h capacity @ 6h/day)', () => {
    const plan = SprintPlanner.planSprints(
      REALISTIC_DEMO_FINDINGS,
      'test-owner',
      'test-repo'
    );

    assert.strictEqual(plan.planningMode, 'sprint_wise');
    assert.strictEqual(plan.daysPerSprint, 10);
    // 96.5 total hours / 60h capacity = 2 sprints
    assert.strictEqual(plan.sprints.length, 2, 'Must generate exactly 2 sprints for 96.5h');
    assert.strictEqual(plan.sprints[0].durationDays, 10);
    assert.strictEqual(plan.sprints[0].sprintNumber, 1);
    assert.strictEqual(plan.sprints[0].dayLabel, 'Sprint 1 (10-Day Agile Sprint)');
    assert.ok(plan.sprints[0].title.startsWith('Sprint 1:'), 'Sprint 1 title must start with Sprint 1');
    assert.ok(!plan.sprints[0].dayLabel.includes('Sprint 2'), 'Sprint 1 must NOT be labeled Sprint 2');
    assert.strictEqual(plan.sprints[1].sprintNumber, 2);
    assert.strictEqual(plan.sprints[1].dayLabel, 'Sprint 2 (10-Day Agile Sprint)');
  });

  await it('UniqueVulnAggregator aggregates findings into unique vulnerabilities with accurate occurrence counts', () => {
    const uniqueVulns = UniqueVulnAggregator.aggregate(REALISTIC_DEMO_FINDINGS);

    assert.ok(uniqueVulns.length > 0, 'Must aggregate findings into unique items');
    assert.ok(uniqueVulns.length <= REALISTIC_DEMO_FINDINGS.length, 'Unique items count must be <= raw findings');
    // Verify occurrence counts
    const totalOccurrences = uniqueVulns.reduce((sum, u) => sum + u.occurrenceCount, 0);
    assert.strictEqual(totalOccurrences, REALISTIC_DEMO_FINDINGS.length, 'Sum of occurrence counts must equal total raw findings');
    const multiOcc = uniqueVulns.filter(u => u.occurrenceCount > 1);
    assert.ok(multiOcc.length > 0, 'Must identify multi-occurrence vulnerabilities');
  });

  // 3. Structural AST-grep Rules Tests
  console.log('\n⚡ Test Group 3: Structural AST-grep Deterministic Rules');

  await it('AST Rule for Insecure Randomness replaces Math.random() with crypto.randomBytes', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.cwe === 'CWE-330');
    assert.ok(rule, 'CWE-330 rule must exist');
    const input = 'const token = Math.random().toString(36).substring(2);';
    const { transformed } = rule.transform(input);
    assert.ok(transformed.includes("randomBytes"));
  });

  await it('AST Rule for DOM XSS replaces innerHTML with textContent', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.cwe === 'CWE-79');
    assert.ok(rule, 'CWE-79 rule must exist');
    const input = 'element.innerHTML = userInput;';
    const { transformed } = rule.transform(input);
    assert.strictEqual(transformed, 'element.textContent = userInput;');
  });

  await it('AST Rule for Command Injection transforms string interpolation to execFile array', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.cwe === 'CWE-78');
    assert.ok(rule, 'CWE-78 rule must exist');
    const input = 'exec(`git checkout ${branchName}`, callback);';
    const { transformed } = rule.transform(input);
    assert.ok(transformed.includes('execFile'));
    assert.ok(transformed.includes('["checkout", branchName]'));
  });

  // 4. Local File Persistence StateStore Tests
  console.log('\n💾 Test Group 4: Local File Persistence (.codevulfixer/sprint-state.json)');

  await it('StateStore accurately persists, loads, updates findings, and cleans up', async () => {
    const testDir = path.join(__dirname, '..', '.tmp_test_workspace');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    try {
      const plan = SprintPlanner.planSprints(
        REALISTIC_DEMO_FINDINGS.slice(0, 3),
        'unit-test-org',
        'unit-test-repo'
      );

      // Save
      await StateStore.saveState(testDir, plan);

      // Load
      const loaded = await StateStore.loadState(testDir);
      assert.ok(loaded, 'Loaded state must exist');
      if (!loaded) return;

      assert.strictEqual(loaded.repoOwner, 'unit-test-org');
      assert.strictEqual(loaded.repoName, 'unit-test-repo');

      // Update finding status to verified
      const firstId = Object.keys(loaded.findings)[0];
      const updated = await StateStore.updateFinding(testDir, firstId, { status: 'verified' });
      assert.ok(updated);
      if (!updated) return;

      assert.strictEqual(updated.findings[firstId].status, 'verified');
      assert.strictEqual(updated.metrics.resolvedCount, 1);

      // Reset
      await StateStore.resetState(testDir);
      const afterReset = await StateStore.loadState(testDir);
      assert.strictEqual(afterReset, undefined, 'State must be null after reset');
    } finally {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  });

  await it('StateStore.mergeWithExistingState retains verified and applied statuses when re-ingesting raw findings', () => {
    const existingFindings: Record<string, VulnerabilityFinding> = {
      'DEP-1': {
        id: 'DEP-1',
        source: 'dependabot',
        alertNumber: 1,
        title: 'Vulnerable Lib',
        description: 'SQLi',
        severity: 'critical',
        status: 'verified',
        resolutionEngine: 'deterministic',
        appliedDiff: 'diff content',
        remediationPlan: 'Fix lib',
        sizing: { size: 'M', riskLevel: 'medium', reasons: [], estimatedHours: 2, isAutomatedCandidate: true },
      },
      'DEP-2': {
        id: 'DEP-2',
        source: 'dependabot',
        alertNumber: 2,
        title: 'Pending Lib',
        description: 'XSS',
        severity: 'medium',
        status: 'pending',
        remediationPlan: 'Fix lib',
        sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 1, isAutomatedCandidate: true },
      },
    };

    const existingState: SprintState = {
      version: '1.0.7',
      repoOwner: 'org',
      repoName: 'repo',
      lastUpdated: new Date().toISOString(),
      planningMode: 'sprint_wise',
      daysPerSprint: 10,
      sprints: [],
      findings: existingFindings,
      activeSprint: 1,
      metrics: { totalFindings: 2, resolvedCount: 1, pendingCount: 1, failedCount: 0, totalEstimatedHours: 3, hoursSaved: 2 },
    };

    // Incoming raw findings from fresh GitHub scan (status default pending)
    const incomingRaw: VulnerabilityFinding[] = [
      {
        id: 'DEP-1',
        source: 'dependabot',
        alertNumber: 1,
        title: 'Vulnerable Lib',
        description: 'SQLi',
        severity: 'critical',
        status: 'pending',
        remediationPlan: 'Fix lib',
        sizing: { size: 'M', riskLevel: 'medium', reasons: [], estimatedHours: 2, isAutomatedCandidate: true },
      },
      {
        id: 'DEP-3',
        source: 'dependabot',
        alertNumber: 3,
        title: 'Newly Discovered Vulnerability',
        description: 'RCE',
        severity: 'critical',
        status: 'pending',
        remediationPlan: 'Upgrade',
        sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 4, isAutomatedCandidate: false },
      },
    ];

    const { mergedFindings, retainedCount } = StateStore.mergeWithExistingState(existingState, incomingRaw);

    assert.strictEqual(retainedCount, 1, 'Must retain 1 previously verified finding');
    const dep1 = mergedFindings.find(f => f.id === 'DEP-1');
    assert.ok(dep1);
    assert.strictEqual(dep1?.status, 'verified', 'DEP-1 must keep its verified status');
    assert.strictEqual(dep1?.resolutionEngine, 'deterministic', 'DEP-1 must keep resolution engine');
    assert.strictEqual(dep1?.appliedDiff, 'diff content', 'DEP-1 must keep diff content');

    const dep3 = mergedFindings.find(f => f.id === 'DEP-3');
    assert.ok(dep3);
    assert.strictEqual(dep3?.status, 'pending', 'Newly discovered finding must be pending');
  });

  // 5. Compatibility Advisor & Collateral Risk Guard Tests
  console.log('\n🛡️ Test Group 5: Compatibility Advisor & Collateral Vulnerability Guard');

  await it('CompatibilityAdvisor recommends safe intermediate Spring 5.3.39 when Java 8 constraint exists', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-SPRING-DEADLOCK',
      source: 'dependabot',
      alertNumber: 998,
      title: 'Spring Upgrade Requesting Spring 6',
      description: 'Upgrade Spring to 6.1.14 but module requires Java 8 for compatibility',
      severity: 'critical',
      status: 'pending',
      targetSprint: 2,
      remediationPlan: 'Upgrade Spring',
      sizing: { size: 'XL', riskLevel: 'high', reasons: [], estimatedHours: 72, isAutomatedCandidate: false },
    };

    const advice = CompatibilityAdvisor.advise(finding, '', {
      packageName: 'org.springframework:spring-core',
      ecosystem: 'maven',
      currentVersion: '1.2.9',
      fixedVersion: '6.1.14',
      isDirect: true,
      upgradeType: 'major',
      javaVersionConstraint: '8',
    });

    assert.ok(advice, 'Compatibility advice must be generated');
    if (!advice) return;
    assert.strictEqual(advice.hasDeadlock, true);
    assert.strictEqual(advice.idealVersion, '6.1.14');
    assert.strictEqual(advice.safeRecommendedVersion, '5.3.39');
    assert.ok(advice.tradeoffReason.includes('5.3.39'));
  });

  await it('TaskValidator intercepts cascading vulnerabilities and flags validation failure', async () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-EXPRESS-COLLATERAL',
      source: 'dependabot',
      alertNumber: 997,
      title: 'Open redirect in Express',
      description: 'Upgrade to 5.0 introduces middleware peer conflicts',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Upgrade',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 3.5, isAutomatedCandidate: false },
      dependency: {
        packageName: 'express',
        ecosystem: 'npm',
        currentVersion: '4.17.1',
        fixedVersion: '5.0.0',
        isDirect: true,
        upgradeType: 'major',
      },
    };

    const valSummary = await TaskValidator.validateWorkspace('', finding);
    assert.strictEqual(valSummary.passed, false, 'Validation must fail when collateral vulnerabilities are detected');
    assert.strictEqual(valSummary.compatibilityStatus, 'failed');
    assert.ok(valSummary.cascadingVulnerabilitiesIntroduced && valSummary.cascadingVulnerabilitiesIntroduced.length > 0);
    assert.strictEqual(valSummary.suggestedAlternativeVersion, '4.19.2');
  });

  // 6. Exporter & Clubbing Tests
  console.log('\n📊 Test Group 6: Excel XML Workbook Exporter & Clubbing Analysis');

  await it('ExcelExporter generates multi-tab workbook (.xml) with separated Dependabot and Code Scanning worksheets', () => {
    const plan = SprintPlanner.planSprints(REALISTIC_DEMO_FINDINGS, 'informavijit', 'CodeVulFixer');
    const xml = ExcelExporter.generateWorkbook(plan);

    assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), 'Must be valid XML declaration');
    assert.ok(xml.includes('<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"'), 'Must specify Excel Spreadsheet schema');
    assert.ok(xml.includes('ss:Name="Executive Summary"'), 'Must have Executive Summary worksheet');
    assert.ok(xml.includes('ss:Name="Dependabot Vulnerabilities"'), 'Must have Dependabot Vulnerabilities worksheet');
    assert.ok(xml.includes('ss:Name="Code Scanning Findings"'), 'Must have Code Scanning Findings worksheet');
    assert.ok(xml.includes('Dependabot Vulnerabilities</Data>'), 'Summary worksheet must include Dependabot Vulnerabilities row');
    assert.ok(xml.includes('Code Scanning Findings</Data>'), 'Summary worksheet must include Code Scanning Findings row');
    assert.ok(xml.includes('Spring 5.3.39'), 'Dependabot worksheet must include safe intermediate versions');
    assert.ok(xml.includes('CodeVulFixer Extension v1.0.7'), 'Author metadata must indicate v1.0.7');
  });

  await it('ExcelExporter generates valid binary .xlsx workbook with Unique Vulnerabilities worksheet', async () => {
    const plan = SprintPlanner.planSprints(REALISTIC_DEMO_FINDINGS, 'informavijit', 'CodeVulFixer');
    const buffer = await ExcelExporter.generateXlsxWorkbook(plan);

    assert.ok(buffer, 'Must return a buffer');
    assert.ok(buffer.length > 5000, `Buffer size must be realistic for xlsx, got ${buffer.length}`);
    // Check zip header: PK (0x50, 0x4B)
    assert.strictEqual(buffer[0], 0x50);
    assert.strictEqual(buffer[1], 0x4B);
  });

  await it('ClubbingEngine groups similar findings into clusters and computes unique issues count', () => {
    const summary = ClubbingEngine.analyzeClusters(REALISTIC_DEMO_FINDINGS);

    assert.ok(summary.totalRawFindings > 0, 'Must process raw findings');
    assert.ok(summary.uniqueIssuesCount <= summary.totalRawFindings, 'Unique issues count must be <= total raw findings');
    assert.ok(summary.remediationLeverageRatio >= 1.0, 'Leverage ratio must be >= 1.0');
    assert.ok(summary.clusters.length > 0, 'Clusters must be formed');
    assert.ok(summary.uniquePackagesCount > 0, 'Unique packages count must be > 0');
  });

  await it('ClubbingEngine identifies cascading co-remediation candidates for shared packages', () => {
    const axiosPrimary = REALISTIC_DEMO_FINDINGS.find(f => f.id === 'DEP-101')!;
    const cascading = ClubbingEngine.findCascadingCandidates(axiosPrimary, REALISTIC_DEMO_FINDINGS);

    assert.ok(cascading.length > 0, 'Must find linked findings sharing axios package');
    assert.ok(cascading.some(f => f.id === 'DEP-109'), 'DEP-109 must be identified as cascading candidate');
  });

  await it('LearnedPatternEngine learns fix pattern repo-wise and applies it with Zero AI Tokens', async () => {
    const testDir = path.join(__dirname, '..', '.tmp_pattern_test_ws');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    try {
      const finding: VulnerabilityFinding = {
        id: 'CS-SQL-1',
        source: 'code_scanning',
        alertNumber: 991,
        title: 'SQL injection',
        description: 'Tainted SQL',
        severity: 'critical',
        ruleId: 'js/sql-injection',
        cweIds: ['CWE-89'],
        status: 'pending',
        targetSprint: 1,
        remediationPlan: 'Fix query',
        location: {
          filePath: 'src/db.js',
          startLine: 10,
          endLine: 10,
          snippet: 'db.query(`SELECT * FROM users WHERE id = ${userId}`)',
        },
        sizing: { size: 'M', riskLevel: 'medium', reasons: [], estimatedHours: 2.0, isAutomatedCandidate: false },
      };

      const diff = '@@ -10,1 +10,1 @@\n-db.query(`SELECT * FROM users WHERE id = ${userId}`)\n+db.query("SELECT * FROM users WHERE id = $1", [userId])';

      // 1. Learn from fix
      const pattern = await LearnedPatternEngine.learnFromFix(testDir, finding, diff, 'copilot');
      assert.ok(pattern, 'Must create learned pattern');
      if (!pattern) return;

      assert.strictEqual(pattern.ruleId, 'js/sql-injection');
      assert.strictEqual(pattern.tokensSavedEstimate, 500);

      // Verify file persisted repo-wise
      const patternFile = path.join(testDir, '.codevulfixer', 'learned-patterns.json');
      assert.ok(fs.existsSync(patternFile), 'Pattern file must exist in .codevulfixer directory');

      // 2. Similar finding in another file
      const similarFinding: VulnerabilityFinding = {
        id: 'CS-SQL-2',
        source: 'code_scanning',
        alertNumber: 992,
        title: 'Another SQL injection in same repo',
        description: 'SQLi',
        severity: 'critical',
        ruleId: 'js/sql-injection',
        cweIds: ['CWE-89'],
        status: 'pending',
        targetSprint: 1,
        remediationPlan: 'Fix query',
        location: {
          filePath: 'src/auth.js',
          startLine: 15,
          endLine: 15,
          snippet: 'db.query(`SELECT * FROM users WHERE id = ${userId}`)',
        },
        sizing: { size: 'M', riskLevel: 'medium', reasons: [], estimatedHours: 2.0, isAutomatedCandidate: false },
      };

      // 3. Find matching pattern
      const matched = await LearnedPatternEngine.findMatchingPattern(testDir, similarFinding);
      assert.ok(matched, 'Matching pattern must be found for similar finding');
      assert.strictEqual(matched?.id, pattern.id);

      // 4. Apply learned pattern with zero tokens
      const result = await LearnedPatternEngine.applyLearnedPattern(testDir, similarFinding, matched!);
      assert.strictEqual(result.success, true, 'Learned pattern must execute successfully with Zero Tokens');
    } finally {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    }
  });

  console.log('\n🤖 Test Group 7: Zero-AI Fix Clarifier, Realistic Ranges & Fix Plans');

  await it('SizingEngine computes realistic effort ranges (min, max, range string)', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-TEST-RANGE',
      source: 'dependabot',
      alertNumber: 999,
      title: 'Major version upgrade',
      description: 'Major upgrade testing',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Upgrade package',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 3.5, isAutomatedCandidate: false },
      dependency: {
        packageName: 'lodash',
        ecosystem: 'npm',
        currentVersion: '3.0.0',
        fixedVersion: '4.17.21',
        isDirect: true,
        upgradeType: 'major',
        majorGap: 1,
      },
    };

    const evaluated = SizingEngine.evaluate(finding);
    assert.strictEqual(evaluated.size, 'L');
    assert.ok(evaluated.estimatedHoursMin !== undefined && evaluated.estimatedHoursMin >= 4.0, 'Size L minimum hours must be >= 4.0');
    assert.ok(evaluated.estimatedHoursMax !== undefined && evaluated.estimatedHoursMax >= 8.0, 'Size L maximum hours must be >= 8.0');
    assert.ok(evaluated.estimatedHoursRange?.includes('–'), 'Range string must contain en-dash separator');
  });

  await it('FixClarifierEngine accurately parses diff and computes addition/deletion metrics', () => {
    const sampleDiff = `
--- a/package-lock.json
+++ b/package-lock.json
@@ -10,12 +10,4 @@
-    "node_modules/old-dep": {
-      "version": "1.0.0",
-      "resolved": "https://..."
-    },
-    "node_modules/old-nested": {
-      "version": "0.5.0"
-    },
+    "node_modules/new-dep": {
+      "version": "2.0.0"
+    }
`;
    const metrics = FixClarifierEngine.analyzeDiff(sampleDiff);
    assert.strictEqual(metrics.linesAdded, 3, 'Must count 3 added lines');
    assert.strictEqual(metrics.linesRemoved, 7, 'Must count 7 removed lines');
    assert.strictEqual(metrics.netLines, -4, 'Net lines must be -4');
    assert.strictEqual(metrics.isLockfile, true, 'Must detect package-lock.json as lockfile');
  });

  await it('FixClarifierEngine answers why lines were removed with lockfile deduplication explanation', () => {
    const finding: VulnerabilityFinding = {
      id: 'DEP-LOCK-TEST',
      source: 'dependabot',
      alertNumber: 101,
      title: 'Axios upgrade',
      description: 'DoS in axios',
      severity: 'high',
      status: 'applied',
      targetSprint: 1,
      remediationPlan: 'npm install axios@1.7.4',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
      dependency: {
        packageName: 'axios',
        ecosystem: 'npm',
        currentVersion: '1.6.0',
        fixedVersion: '1.7.4',
        isDirect: true,
        lockfile: 'package-lock.json',
        upgradeType: 'patch',
      },
    };

    const answer = FixClarifierEngine.answerQuestion('why were 1000 lines removed and only 200 added?', finding);
    assert.ok(answer.title.includes('Lockfile') || answer.title.includes('Removed'), 'Answer title must address line removal');
    assert.ok(answer.answerHtml.includes('Deduplication') || answer.answerHtml.includes('Flattening') || answer.answerHtml.includes('Pruned'), 'Must explain lockfile tree pruning and deduplication');
    assert.ok(answer.answerHtml.includes('Zero Business Logic Lost'), 'Must reassure that zero application logic was lost');
  });

  await it('FixClarifierEngine clarifies manual baseline vs automated execution runtime and savings', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-SQLI-TEST',
      source: 'code_scanning',
      alertNumber: 201,
      title: 'SQL Injection in repository',
      description: 'Raw SQL concatenation',
      severity: 'critical',
      status: 'applied',
      targetSprint: 1,
      ruleId: 'js/sql-injection',
      remediationPlan: 'db.query("SELECT * FROM users WHERE id = $1", [id])',
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 4.0, estimatedHoursRange: '4.0 – 8.0 hrs', isAutomatedCandidate: false },
    };

    const answer = FixClarifierEngine.answerQuestion('why does the estimate say 4-8 hrs but it executed in seconds?', finding);
    assert.ok(answer.title.includes('Manual Effort') || answer.title.includes('Baseline'), 'Title must contrast manual effort with automated runtime');
    assert.ok(answer.answerHtml.includes('15 seconds'), 'Must cite automated fix duration in seconds');
    assert.ok(answer.answerHtml.includes('Saved') || answer.answerHtml.includes('Time Saved'), 'Must explain net developer hours saved');
  });

  await it('FixClarifierEngine generates structured 4-stage remediation fix plan for cards', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-XSS-TEST',
      source: 'code_scanning',
      alertNumber: 203,
      title: 'DOM XSS',
      description: 'innerHTML vulnerability',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      ruleId: 'js/xss-through-dom',
      remediationPlan: 'Replace innerHTML with textContent',
      location: { filePath: 'src/render.ts', startLine: 10, endLine: 10 },
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, estimatedHoursRange: '0.5 – 1.0 hrs', isAutomatedCandidate: true },
    };

    const plan = FixClarifierEngine.generateFixPlan(finding);
    assert.strictEqual(plan.findingId, 'CS-XSS-TEST');
    assert.strictEqual(plan.steps.length, 4, 'Must provide exactly 4 structured remediation stages');
    assert.strictEqual(plan.steps[0].stepNumber, 1);
    assert.strictEqual(plan.steps[1].stepNumber, 2);
    assert.strictEqual(plan.steps[2].stepNumber, 3);
    assert.strictEqual(plan.steps[3].stepNumber, 4);
    assert.ok(plan.steps[1].desc.includes('textContent') || plan.steps[1].desc.includes('Replace'));
  });

  console.log('\n📜 Test Group 8: Execution Logs, Real-Time Diagnostics & Transitive Overrides');

  await it('Logger records structured in-memory entries and diagnostic remedies', async () => {
    logger.clear();
    assert.strictEqual(logger.getEntries().length, 0);

    logger.info('Test Info Message');
    logger.warn('Test Warning Message', 'Check dependency graph');
    logger.error('Test Error Message', new Error('Mock failure'), 'Run npm install --legacy-peer-deps');
    logger.success('Test Success Message');

    const entries = logger.getEntries();
    assert.strictEqual(entries.length, 4);
    assert.strictEqual(entries[0].level, 'INFO');
    assert.strictEqual(entries[1].level, 'WARN');
    assert.strictEqual(entries[1].suggestedFix, 'Check dependency graph');
    assert.strictEqual(entries[2].level, 'ERROR');
    assert.ok(entries[2].suggestedFix?.includes('--legacy-peer-deps'));
    assert.strictEqual(entries[3].level, 'SUCCESS');
  });

  await it('getDashboardHtml renders Tab 5 Execution Logs with Diagnostic Remedy cards', async () => {
    const testLogs: LogEntry[] = [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Failed to execute lockfile upgrade command: ERESOLVE unable to resolve dependency tree',
        details: 'npm ERR! code ERESOLVE\nnpm ERR! ERESOLVE unable to resolve dependency tree',
        suggestedFix: '1. Add overrides to package.json\n2. Run npm install --legacy-peer-deps',
        commandExecuted: 'npm install semver@7.5.3 --package-lock-only',
      },
    ];

    const html = getDashboardHtml(undefined, 'logs', undefined, testLogs);
    assert.ok(html.includes('id="tab-btn-logs"'), 'Must render Tab 5 button in tab bar');
    assert.ok(html.includes('id="tab-content-logs"'), 'Must render Tab 5 content container');
    assert.ok(html.includes('ERESOLVE unable to resolve dependency tree'), 'Must include error message in log stream');
    assert.ok(html.includes('diagnostic-remedy-card'), 'Must render active diagnostic remedy card on errors');
    assert.ok(html.includes('Option A (Recommended for Transitive CVEs)'), 'Must include recommended fix remedies');
    assert.ok(html.includes('npm install --package-lock-only --legacy-peer-deps'), 'Must include legacy peer deps suggestion');
  });

  await it('DeterministicFixer handles direct CLI lockfile bump with legacy-peer-deps', async () => {
    const testDir = path.join(__dirname, '..', '.tmp_direct_test');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const pkgJsonPath = path.join(testDir, 'package.json');
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify({
        name: 'test-direct-app',
        version: '1.0.0',
        dependencies: {
          express: '^4.18.2',
        },
      }, null, 2),
      'utf8'
    );

    const directFinding: VulnerabilityFinding = {
      id: 'DEP-DIRECT-1',
      source: 'dependabot',
      alertNumber: 998,
      title: 'Direct CVE in express',
      description: 'Prototype pollution',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      dependency: {
        packageName: 'express',
        ecosystem: 'npm',
        currentVersion: '4.18.2',
        fixedVersion: '4.19.2',
        isDirect: true,
        manifestFile: 'package.json',
      },
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const res = await DeterministicFixer.applyFix(testDir, directFinding);
    assert.ok(res.success, 'Direct bump should succeed');
    assert.ok(res.commandExecuted?.includes('--legacy-peer-deps'), 'Command must use --legacy-peer-deps');

    fs.rmSync(testDir, { recursive: true, force: true });
  });

  await it('DeterministicFixer fallback writes package.json overrides for transitive packages when CLI fails', async () => {
    const testDir = path.join(__dirname, '..', '.tmp_transitive_test');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

    const pkgJsonPath = path.join(testDir, 'package.json');
    fs.writeFileSync(
      pkgJsonPath,
      JSON.stringify({
        name: 'test-transitive-app',
        version: '1.0.0',
        dependencies: {
          express: '^4.18.2',
        },
      }, null, 2),
      'utf8'
    );

    const transitiveFinding: VulnerabilityFinding = {
      id: 'DEP-TRANSITIVE-1',
      source: 'dependabot',
      alertNumber: 999,
      title: 'Transitive CVE in nested dependency',
      description: 'ReDoS vulnerability in nested package',
      severity: 'high',
      status: 'pending',
      targetSprint: 1,
      dependency: {
        packageName: '@internal/fake-nested-transitive-pkg',
        ecosystem: 'npm',
        currentVersion: '1.0.0',
        fixedVersion: '>= 2.1.0',
        isDirect: false,
        manifestFile: 'package.json',
      },
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const res = await DeterministicFixer.applyFix(testDir, transitiveFinding);
    assert.ok(res.success, 'Fallback must succeed by adding overrides to package.json');
    assert.ok(res.message.includes('overrides') || res.message.includes('package.json'));

    const updatedRaw = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    assert.ok(updatedRaw.overrides && updatedRaw.overrides['@internal/fake-nested-transitive-pkg'], 'package.json must contain package in overrides');
    assert.strictEqual(updatedRaw.overrides['@internal/fake-nested-transitive-pkg'], '^2.1.0');

    fs.rmSync(testDir, { recursive: true, force: true });
  });

  await it('FixClarifierEngine answers hallucination and < 10% line count replacement justification', async () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-SQL-INJ',
      source: 'code_scanning',
      alertNumber: 101,
      title: 'SQL Injection',
      description: 'Untrusted user input formatted into query string',
      severity: 'critical',
      status: 'applied',
      targetSprint: 1,
      ruleId: 'js/sql-injection',
      remediationPlan: 'Use parameterized query db.query(sql, [params])',
      location: { filePath: 'src/users.ts', startLine: 20, endLine: 65, snippet: 'db.query("SELECT * FROM users WHERE id = " + id)' },
      sizing: { size: 'L', riskLevel: 'high', reasons: [], estimatedHours: 4.0, isAutomatedCandidate: true },
    };

    const diff = [
      '--- a/src/users.ts',
      '+++ b/src/users.ts',
      '- // 45 lines of custom manual regex escaping and string concatenation',
      "- let sanitized = id.replace(/'/g, \"''\");",
      '- let query = "SELECT * FROM users WHERE id = " + sanitized;',
      '- return db.raw(query);',
      '+ return db.query("SELECT * FROM users WHERE id = $1", [id]);',
    ].join('\n');

    const resp = FixClarifierEngine.answerQuestion(
      'Is this working code or is it hallucinating? Why replace so many lines with less than 10% lines count?',
      finding,
      diff
    );

    assert.ok(resp.title.includes('Hallucination Justification'), 'Title must highlight hallucination justification');
    assert.ok(resp.badge?.includes('Verified Working Code'), 'Badge must assert verified working code');
    assert.ok(resp.answerHtml.includes('Verified Working Code (Zero AI Hallucination)'), 'Answer must explain zero hallucination');
    assert.ok(resp.answerHtml.includes('Replacing Flawed Custom Logic with Standard Platform Primitives'), 'Answer must explain replacing custom logic with platform primitives');
    assert.ok(resp.answerHtml.includes('Deterministic AST Transformation'), 'Answer must cite deterministic AST engine');
    assert.ok(resp.answerHtml.includes('Triple-Guard Telemetry'), 'Answer must provide triple validation telemetry');
  });

  console.log('\n====================================================');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
