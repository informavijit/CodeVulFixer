import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { SizingEngine } from '../src/analysis/sizingEngine';
import { SprintPlanner } from '../src/sprint/sprintPlanner';
import { StateStore } from '../src/sprint/stateStore';
import { PRECOMPILED_AST_RULES } from '../src/engines/astGrepRules';
import { REALISTIC_DEMO_FINDINGS } from '../src/ingestion/mockData';
import { VulnerabilityFinding } from '../src/ingestion/types';

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 CodeVulFixer Comprehensive Test Suite');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function it(title: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`  ✔ [PASS] ${title}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✘ [FAIL] ${title}: ${err.message}`);
      failed++;
    }
  }

  // 1. Sizing Matrix Tests
  console.log('📋 Test Group 1: T-Shirt Sizing & Impact Analysis Matrix');

  it('Dependabot minor/patch bump should size as Size S with low risk', () => {
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

  it('Dependabot major version upgrade should size as Size L with high risk', () => {
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

  it('CodeQL SQL Injection should size as Size L with high risk', () => {
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

  it('CodeQL Insecure Randomness (Math.random) should size as Size S', () => {
    const finding: VulnerabilityFinding = {
      id: 'CS-TEST-RANDOM',
      source: 'code_scanning',
      alertNumber: 100,
      title: 'Insecure PRNG',
      description: 'Math.random',
      severity: 'medium',
      ruleId: 'js/insecure-randomness',
      cweIds: ['CWE-330'],
      status: 'pending',
      targetSprint: 1,
      remediationPlan: 'Use crypto',
      sizing: { size: 'S', riskLevel: 'low', reasons: [], estimatedHours: 0.5, isAutomatedCandidate: true },
    };

    const evaluated = SizingEngine.evaluate(finding, undefined, {
      fileExists: true,
      fileLinesCount: 30,
      isSelfContained: true,
      taintComplexity: 'simple',
    });

    assert.strictEqual(evaluated.size, 'S');
    assert.strictEqual(evaluated.riskLevel, 'low');
    assert.strictEqual(evaluated.isAutomatedCandidate, true);
  });

  // 2. Multi-Day Sprint Bucketing Tests
  console.log('\n📅 Test Group 2: Multi-Day Sprint Work Chunking');

  it('Automated Sprint bucketing partitions findings into Day 1, Day 2, and Day 3+ chunks', () => {
    const plan = SprintPlanner.planSprints(
      REALISTIC_DEMO_FINDINGS,
      'test-org',
      'test-repo',
      { maxHighRiskPerDay: 3, targetSprintDays: 4 }
    );

    assert.ok(plan.sprints.length >= 3, `Expected at least 3 sprints, got ${plan.sprints.length}`);

    // Day 1: Quick Wins
    const sprint1 = plan.sprints[0];
    assert.strictEqual(sprint1.sprintNumber, 1);
    assert.ok(sprint1.dayLabel.includes('Day 1'));
    assert.ok(sprint1.findings.length > 0);

    // Day 2: High Severity Architectural
    const sprint2 = plan.sprints[1];
    assert.strictEqual(sprint2.sprintNumber, 2);
    assert.ok(sprint2.dayLabel.includes('Day 2'));
    assert.ok(sprint2.findings.length <= 3, 'Enforced max 3 high-risk items per day');

    // Day 3+: Hygiene
    const sprint3 = plan.sprints[2];
    assert.strictEqual(sprint3.sprintNumber, 3);

    // Metrics verification
    assert.strictEqual(plan.metrics.totalFindings, REALISTIC_DEMO_FINDINGS.length);
    assert.ok(plan.metrics.totalEstimatedHours > 0);
    assert.ok(plan.metrics.hoursSaved > 0);
  });

  // 3. Precompiled AST-grep Transformation Rules Tests
  console.log('\n⚡ Test Group 3: Structural AST-grep Deterministic Rules');

  it('AST Rule for Insecure Randomness replaces Math.random() with crypto.randomBytes', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.ruleId === 'js/insecure-randomness');
    assert.ok(rule, 'Insecure randomness rule must exist');
    if (!rule) return;

    const inputSnippet = 'const token = Math.random().toString(36).substring(2);';
    assert.ok(rule.matcher(inputSnippet));

    const { transformed } = rule.transform(inputSnippet);
    assert.ok(!transformed.includes('Math.random()'));
    assert.ok(transformed.includes('crypto'));
  });

  it('AST Rule for DOM XSS replaces innerHTML with textContent', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.ruleId === 'js/xss-through-dom');
    assert.ok(rule, 'DOM XSS rule must exist');
    if (!rule) return;

    const inputSnippet = 'userBioElement.innerHTML = user.bio;';
    assert.ok(rule.matcher(inputSnippet));

    const { transformed } = rule.transform(inputSnippet);
    assert.strictEqual(transformed, 'userBioElement.textContent = user.bio;');
  });

  it('AST Rule for Command Injection transforms string interpolation to execFile array', () => {
    const rule = PRECOMPILED_AST_RULES.find((r) => r.ruleId === 'js/command-injection');
    assert.ok(rule, 'Command injection rule must exist');
    if (!rule) return;

    const inputSnippet = 'exec(`git checkout ${branchName}`, callback);';
    assert.ok(rule.matcher(inputSnippet));

    const { transformed } = rule.transform(inputSnippet);
    assert.ok(transformed.includes('execFile'));
    assert.ok(transformed.includes('["checkout", branchName]'));
  });

  // 4. Local File Persistence StateStore Tests
  console.log('\n💾 Test Group 4: Local File Persistence (.codevulfixer/sprint-state.json)');

  it('StateStore accurately persists, loads, updates findings, and cleans up', async () => {
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
