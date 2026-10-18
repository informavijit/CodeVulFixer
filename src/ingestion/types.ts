export type AlertSource = 'dependabot' | 'code_scanning';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type FindingStatus =
  | 'pending'
  | 'in_progress'
  | 'applied'
  | 'verified'
  | 'failed'
  | 'rejected';

export type TShirtSize = 'S' | 'M' | 'L' | 'XL';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface CodeLocation {
  filePath: string;
  startLine: number;
  endLine: number;
  startColumn?: number;
  endColumn?: number;
  snippet?: string;
}

export interface CompatibilityAdvice {
  hasDeadlock: boolean;
  idealVersion: string;
  safeRecommendedVersion: string;
  constraintSummary: string;
  tradeoffReason: string;
  riskReduction: string;
  actionStrategy: 'intermediate_upgrade' | 'modular_isolation' | 'direct_upgrade';
  conflictingPackages?: string[];
}

export interface DependencyInfo {
  packageName: string;
  ecosystem: string; // 'npm' | 'pip' | 'yarn' | 'pnpm' | 'uv' | 'maven' | 'gradle'
  currentVersion: string;
  fixedVersion: string;
  isDirect: boolean;
  manifestFile?: string;
  lockfile?: string;
  vulnerableVersionRange?: string;
  upgradeType: 'patch' | 'minor' | 'major' | 'unknown';
  majorGap?: number;
  javaVersionConstraint?: string;
  targetJavaVersion?: string;
  targetFramework?: string;
  cppStandard?: string;
  technology?: string;
  peerConflicts?: string[];
}

export interface SizingResult {
  size: TShirtSize;
  riskLevel: RiskLevel;
  reasons: string[];
  estimatedHours: number;
  isAutomatedCandidate: boolean;
}

export interface VulnerabilityFinding {
  id: string; // unique internal ID e.g. "DEP-123" or "CS-456"
  source: AlertSource;
  alertNumber: number;
  title: string;
  description: string;
  severity: Severity;
  htmlUrl?: string;
  cveId?: string;
  ghsaId?: string;
  ruleId?: string; // For Code Scanning: e.g. "js/sql-injection"
  cweIds?: string[];
  location?: CodeLocation;
  dependency?: DependencyInfo;
  sizing: SizingResult;
  status: FindingStatus;
  statusMessage?: string;
  targetSprint: number; // 1, 2, 3, etc.
  remediationPlan: string;
  lastAttemptAt?: string;
  appliedDiff?: string;
  validationReport?: ValidationSummary;
  compatibilityAdvice?: CompatibilityAdvice;
}

export interface ValidationSummary {
  passed: boolean;
  timestamp: string;
  buildStatus: 'passed' | 'failed' | 'skipped';
  buildDurationMs?: number;
  buildOutput?: string;
  testStatus: 'passed' | 'failed' | 'skipped';
  testDurationMs?: number;
  testOutput?: string;
  auditStatus: 'passed' | 'failed' | 'skipped';
  auditOutput?: string;
  failureStackTrace?: string;
  compatibilityStatus?: 'passed' | 'failed' | 'warning' | 'skipped';
  cascadingVulnerabilitiesIntroduced?: string[];
  compatibilityIssues?: string[];
  suggestedAlternativeVersion?: string;
}

export type PlanningMode = 'sprint_wise' | 'day_wise';

export interface SprintDay {
  sprintNumber: number;
  planningMode?: PlanningMode;
  durationDays: number; // 10 for standard Agile Sprint, 1 for Day-wise
  dayLabel: string; // e.g. "Sprint 1 (10-Day Agile Sprint)" or "Day 1 (Daily Focus)"
  title: string;
  description: string;
  targetDate?: string;
  findings: string[]; // Finding IDs
  totalEstimatedHours: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface SprintState {
  version: string;
  repoOwner: string;
  repoName: string;
  lastUpdated: string;
  planningMode: PlanningMode;
  daysPerSprint: number;
  sprints: SprintDay[];
  findings: Record<string, VulnerabilityFinding>;
  activeSprint: number;
  metrics: {
    totalFindings: number;
    resolvedCount: number;
    pendingCount: number;
    failedCount: number;
    totalEstimatedHours: number;
    hoursSaved: number;
  };
}

export interface GitRepoMetadata {
  owner: string;
  repo: string;
  remoteUrl: string;
  defaultBranch?: string;
  currentBranch?: string;
}
