import { SprintState, VulnerabilityFinding } from '../ingestion/types';
import { ClubbingEngine } from '../analysis/clubbingEngine';

/**
 * Excel XML Spreadsheet 2003 Exporter for CodeVulFixer
 * Produces a multi-worksheet workbook (.xml) with separate tabsheets for:
 * 1. Executive Summary & Sprints (KPI metrics with separated rows for Dependabot & Code Scanning)
 * 2. Dependabot Vulnerabilities (Full dependency upgrade details, safe targets, sizing & effort)
 * 3. Code Scanning Findings (CodeQL SAST finding details, paths, CWEs, sizing & effort)
 *
 * Compatible natively with Microsoft Excel, Google Sheets, LibreOffice Calc, and Apple Numbers
 * without requiring external npm binary packages.
 */
export class ExcelExporter {
  public static generateWorkbook(state: SprintState): string {
    const findings = Object.values(state.findings || {});
    const depFindings = findings.filter(f => f.source === 'dependabot');
    const csFindings = findings.filter(f => f.source === 'code_scanning');

    const depHours = Math.round(depFindings.reduce((s, f) => s + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const csHours = Math.round(csFindings.reduce((s, f) => s + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
    const totalHours = Math.round((depHours + csHours) * 10) / 10;

    const depResolved = depFindings.filter(f => f.status === 'applied' || f.status === 'verified').length;
    const csResolved = csFindings.filter(f => f.status === 'applied' || f.status === 'verified').length;
    const totalResolved = depResolved + csResolved;

    const depPending = depFindings.filter(f => f.status === 'pending' || f.status === 'in_progress').length;
    const csPending = csFindings.filter(f => f.status === 'pending' || f.status === 'in_progress').length;

    const depFailed = depFindings.filter(f => f.status === 'failed' || f.status === 'rejected').length;
    const csFailed = csFindings.filter(f => f.status === 'failed' || f.status === 'rejected').length;

    const depSavings = Math.round(depResolved * 2.5 * 10) / 10;
    const csSavings = Math.round(csResolved * 3.8 * 10) / 10;
    const totalSavings = Math.round((depSavings + csSavings) * 10) / 10;

    return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
  <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
    <Title>CodeVulFixer Security &amp; Sprint Remediation Dashboard</Title>
    <Subject>Vulnerability Remediation Report</Subject>
    <Author>CodeVulFixer Extension v1.0.3</Author>
    <Created>${new Date().toISOString()}</Created>
    <Company>CodeVulFixer</Company>
  </DocumentProperties>
  <OfficeDocumentSettings xmlns="urn:schemas-microsoft-com:office:office">
    <AllowPNG/>
  </OfficeDocumentSettings>
  <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
    <WindowHeight>12000</WindowHeight>
    <WindowWidth>24000</WindowWidth>
    <WindowTopX>0</WindowTopX>
    <WindowTopY>0</WindowTopY>
    <ActiveSheet>0</ActiveSheet>
    <ProtectStructure>False</ProtectStructure>
    <ProtectWindows>False</ProtectWindows>
  </ExcelWorkbook>
  <Styles>
    <Style ss:ID="Default" ss:Name="Normal">
      <Alignment ss:Vertical="Center"/>
      <Borders/>
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Interior/>
      <NumberFormat/>
      <Protection/>
    </Style>

    <!-- Header Styles -->
    <Style ss:ID="MainTitle">
      <Font ss:FontName="Segoe UI" ss:Size="15" ss:Color="#0366D6" ss:Bold="1"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SubTitle">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#586069" ss:Italic="1"/>
      <Alignment ss:Vertical="Center"/>
    </Style>
    <Style ss:ID="SectionHeader">
      <Font ss:FontName="Segoe UI" ss:Size="12" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#E1E4E8" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0366D6"/>
      </Borders>
    </Style>

    <!-- Table Column Headers -->
    <Style ss:ID="ColHeaderDefault">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#24292E" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#000000"/>
      </Borders>
    </Style>
    <Style ss:ID="ColHeaderDep">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#28A745" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#1E7E34"/>
      </Borders>
    </Style>
    <Style ss:ID="ColHeaderCodeScan">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
      <Interior ss:Color="#0366D6" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#005CC5"/>
      </Borders>
    </Style>

    <!-- Data Rows -->
    <Style ss:ID="CellText">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellTextBold">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E" ss:Bold="1"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellCenter">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellNumber">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellDecimal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.0"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="CellPercent">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#24292E"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="0.0%"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>

    <!-- Total Row -->
    <Style ss:ID="RowTotal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>
    <Style ss:ID="RowTotalNumber">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>
    <Style ss:ID="RowTotalDecimal">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1B1F23" ss:Bold="1"/>
      <Interior ss:Color="#F6F8FA" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Right" ss:Vertical="Center"/>
      <NumberFormat ss:Format="#,##0.0"/>
      <Borders>
        <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#24292E"/>
        <Border ss:Position="Bottom" ss:LineStyle="Double" ss:Weight="3" ss:Color="#24292E"/>
      </Borders>
    </Style>

    <!-- Severity Styles -->
    <Style ss:ID="SevCritical">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFDCE0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevHigh">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFEEF0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevMedium">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#735C0F" ss:Bold="1"/>
      <Interior ss:Color="#FFF5B1" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="SevLow">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#165C26" ss:Bold="1"/>
      <Interior ss:Color="#DCFFE4" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>

    <!-- Status Styles -->
    <Style ss:ID="StatusResolved">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#165C26" ss:Bold="1"/>
      <Interior ss:Color="#DCFFE4" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="StatusPending">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#735C0F" ss:Bold="1"/>
      <Interior ss:Color="#FFF5B1" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
    <Style ss:ID="StatusFailed">
      <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#86181D" ss:Bold="1"/>
      <Interior ss:Color="#FFDCE0" ss:Pattern="Solid"/>
      <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
      <Borders>
        <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E1E4E8"/>
      </Borders>
    </Style>
  </Styles>

  <!-- TAB 1: EXECUTIVE & SPRINT SUMMARY -->
  ${this.renderSummaryWorksheet(state, depFindings, csFindings, depHours, csHours, totalHours, depResolved, csResolved, totalResolved, depPending, csPending, depFailed, csFailed, depSavings, csSavings, totalSavings)}

  <!-- TAB 2: DEPENDABOT VULNERABILITIES -->
  ${this.renderDependabotWorksheet(depFindings)}

  <!-- TAB 3: CODE SCANNING FINDINGS -->
  ${this.renderCodeScanningWorksheet(csFindings)}

</Workbook>`;
  }

  private static renderSummaryWorksheet(
    state: SprintState,
    depFindings: VulnerabilityFinding[],
    csFindings: VulnerabilityFinding[],
    depHours: number,
    csHours: number,
    totalHours: number,
    depResolved: number,
    csResolved: number,
    totalResolved: number,
    depPending: number,
    csPending: number,
    depFailed: number,
    csFailed: number,
    depSavings: number,
    csSavings: number,
    totalSavings: number
  ): string {
    const depTotal = depFindings.length;
    const csTotal = csFindings.length;
    const grandTotal = depTotal + csTotal;

    const depPct = depTotal > 0 ? (depResolved / depTotal) : 0;
    const csPct = csTotal > 0 ? (csResolved / csTotal) : 0;
    const totalPct = grandTotal > 0 ? (totalResolved / grandTotal) : 0;

    return `  <Worksheet ss:Name="Executive Summary">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="220"/>
      <Column ss:Width="95"/>
      <Column ss:Width="90"/>
      <Column ss:Width="105"/>
      <Column ss:Width="110"/>
      <Column ss:Width="130"/>
      <Column ss:Width="140"/>
      <Column ss:Width="110"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">🛡️ CodeVulFixer — Executive Security &amp; Sprint Posture</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Repository: ${this.escape(state.repoOwner)}/${this.escape(state.repoName)} | Planning Mode: ${this.escape(state.planningMode)} (${state.daysPerSprint || 10} Days/Sprint) | Exported: ${new Date().toLocaleString()}</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- KPI Metrics Section Header -->
      <Row ss:Height="24">
        <Cell ss:MergeAcross="7" ss:StyleID="SectionHeader"><Data ss:Type="String">1. Remediation Metrics Breakdown (Separated by Finding Source)</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Finding Category</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Total Findings</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolved</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Open / Pending</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Validation Failed</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Estimated Hours (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">AI Autonomous Savings (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolution Rate</Data></Cell>
      </Row>

      <!-- Row 1: Dependabot Vulnerabilities -->
      <Row ss:Height="21">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">📦 Dependabot Vulnerabilities</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${depTotal}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${depResolved}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${depPending}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${depFailed}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${depHours}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${depSavings}</Data></Cell>
        <Cell ss:StyleID="CellPercent"><Data ss:Type="Number">${depPct}</Data></Cell>
      </Row>

      <!-- Row 2: Code Scanning Findings -->
      <Row ss:Height="21">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">🔍 Code Scanning Findings</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${csTotal}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${csResolved}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${csPending}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${csFailed}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${csHours}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${csSavings}</Data></Cell>
        <Cell ss:StyleID="CellPercent"><Data ss:Type="Number">${csPct}</Data></Cell>
      </Row>

      <!-- Summary Total Row -->
      <Row ss:Height="22">
        <Cell ss:StyleID="RowTotal"><Data ss:Type="String">🎯 Total Workspace Remediation</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${grandTotal}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${totalResolved}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${depPending + csPending}</Data></Cell>
        <Cell ss:StyleID="RowTotalNumber"><Data ss:Type="Number">${depFailed + csFailed}</Data></Cell>
        <Cell ss:StyleID="RowTotalDecimal"><Data ss:Type="Number">${totalHours}</Data></Cell>
        <Cell ss:StyleID="RowTotalDecimal"><Data ss:Type="Number">${totalSavings}</Data></Cell>
        <Cell ss:StyleID="RowTotal"><Data ss:Type="Number">${Math.round(totalPct * 1000) / 10}%</Data></Cell>
      </Row>
      <Row ss:Height="16"></Row>

      <!-- Sprint Roadmap Section Header -->
      <Row ss:Height="24">
        <Cell ss:MergeAcross="7" ss:StyleID="SectionHeader"><Data ss:Type="String">2. Sequenced Remediation Roadmap (Phase 1: Dependabot First ➔ Phase 2: Code Scanning Next)</Data></Cell>
      </Row>
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Sprint / Iteration</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Remediation Phase</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Duration</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Findings Count</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Resolved</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Allocated Hours (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Net Dev Hours (Post-AI)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDefault"><Data ss:Type="String">Sprint Status</Data></Cell>
      </Row>
      ${this.renderSprintRoadmapRows(state)}
    </Table>
  </Worksheet>`;
  }

  private static renderSprintRoadmapRows(state: SprintState): string {
    const sprints = state.sprints || [];
    if (sprints.length === 0) {
      return `      <Row ss:Height="20">
        <Cell ss:MergeAcross="7" ss:StyleID="CellCenter"><Data ss:Type="String">No active sprints planned. Run scan or load demo data.</Data></Cell>
      </Row>`;
    }

    return sprints.map(sp => {
      const findingIds = sp.findings || [];
      const spFindings = findingIds.map(id => state.findings[id]).filter(Boolean);
      const spResolved = spFindings.filter(f => f.status === 'applied' || f.status === 'verified').length;
      const spHours = Math.round(spFindings.reduce((s, f) => s + (f.sizing?.estimatedHours || 0), 0) * 10) / 10;
      const netHours = Math.round(Math.max(0, spHours - (spResolved * 2.8)) * 10) / 10;
      const isDep = sp.category === 'dependabot' || (!sp.category && spFindings.every(f => f.source === 'dependabot'));
      const phaseLabel = isDep ? 'Phase 1: Dependabot Vulnerabilities' : 'Phase 2: Code Scanning Findings';
      const statusLabel = spResolved === findingIds.length && findingIds.length > 0 ? 'COMPLETED' : (sp.sprintNumber === state.activeSprint ? 'IN PROGRESS' : 'SCHEDULED');
      const statusStyle = statusLabel === 'COMPLETED' ? 'StatusResolved' : (statusLabel === 'IN PROGRESS' ? 'StatusPending' : 'CellCenter');

      return `      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(sp.dayLabel || `Sprint ${sp.sprintNumber}`)}</Data></Cell>
        <Cell ss:StyleID="${isDep ? 'ColHeaderDep' : 'ColHeaderCodeScan'}"><Data ss:Type="String">${phaseLabel}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${sp.durationDays || 10} Days</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${findingIds.length}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${spResolved}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${spHours}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${netHours}</Data></Cell>
        <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${statusLabel}</Data></Cell>
      </Row>`;
    }).join('\n');
  }

  private static renderDependabotWorksheet(findings: VulnerabilityFinding[]): string {
    return `  <Worksheet ss:Name="Dependabot Vulnerabilities">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="110"/>
      <Column ss:Width="85"/>
      <Column ss:Width="130"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="115"/>
      <Column ss:Width="85"/>
      <Column ss:Width="125"/>
      <Column ss:Width="85"/>
      <Column ss:Width="70"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="100"/>
      <Column ss:Width="160"/>
      <Column ss:Width="320"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">📦 Dependabot Vulnerability Remediation Backlog (Phase 1)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Total Dependency Vulnerabilities: ${findings.length} | Priority Order: Critical &amp; High First, Safe Intermediate Targets</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- Table Header -->
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Alert ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Severity</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Package Name</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Ecosystem</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Current Version</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Safe Target Version</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Dependency</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">CVE / GHSA ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">CWE</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Size</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Effort (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Target Sprint</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Status</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Manifest File</Data></Cell>
        <Cell ss:StyleID="ColHeaderDep"><Data ss:Type="String">Advisory &amp; Remediation Plan</Data></Cell>
      </Row>

      <!-- Rows -->
      ${findings.length === 0
        ? `      <Row ss:Height="20"><Cell ss:MergeAcross="14" ss:StyleID="CellCenter"><Data ss:Type="String">No Dependabot vulnerabilities detected.</Data></Cell></Row>`
        : findings.map(f => {
            const sevStyle = this.getSeverityStyle(f.severity);
            const statusStyle = this.getStatusStyle(f.status);
            const fixedVer = f.compatibilityAdvice?.safeRecommendedVersion || f.dependency?.fixedVersion || 'N/A';
            const isDirect = f.dependency?.isDirect !== false ? 'Direct' : 'Transitive';
            const cve = f.cveId || f.ghsaId || 'N/A';
            const cwe = (f.cweIds && f.cweIds.length > 0) ? f.cweIds.join(', ') : 'N/A';
            const size = f.sizing?.size || 'M';
            const hours = f.sizing?.estimatedHours || 2.0;

            return `      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(f.id)}</Data></Cell>
        <Cell ss:StyleID="${sevStyle}"><Data ss:Type="String">${this.escape(f.severity.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(f.dependency?.packageName || f.title)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(f.dependency?.ecosystem || 'npm')}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(f.dependency?.currentVersion || 'N/A')}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(fixedVer)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${isDirect}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(cve)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(cwe)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${size}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${hours}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Sprint ${f.targetSprint || 1}</Data></Cell>
        <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${this.escape(f.status.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(f.dependency?.manifestFile || 'package.json')}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(f.remediationPlan || f.description || '')}</Data></Cell>
      </Row>`;
          }).join('\n')}
    </Table>
  </Worksheet>`;
  }

  private static renderCodeScanningWorksheet(findings: VulnerabilityFinding[]): string {
    return `  <Worksheet ss:Name="Code Scanning Findings">
    <Table ss:DefaultRowHeight="20">
      <Column ss:Width="110"/>
      <Column ss:Width="85"/>
      <Column ss:Width="200"/>
      <Column ss:Width="95"/>
      <Column ss:Width="240"/>
      <Column ss:Width="75"/>
      <Column ss:Width="75"/>
      <Column ss:Width="70"/>
      <Column ss:Width="80"/>
      <Column ss:Width="105"/>
      <Column ss:Width="100"/>
      <Column ss:Width="140"/>
      <Column ss:Width="320"/>

      <!-- Title Block -->
      <Row ss:Height="28">
        <Cell ss:StyleID="MainTitle"><Data ss:Type="String">🔍 Code Scanning (CodeQL SAST) Backlog &amp; Remediation Matrix (Phase 2)</Data></Cell>
      </Row>
      <Row ss:Height="18">
        <Cell ss:StyleID="SubTitle"><Data ss:Type="String">Total Code Scanning Alerts: ${findings.length} | Priority Order: Critical &amp; High First, AST-grep &amp; Copilot LM Remediation</Data></Cell>
      </Row>
      <Row ss:Height="12"></Row>

      <!-- Table Header -->
      <Row ss:Height="22">
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Alert ID</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Severity</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Rule ID / Vulnerability Name</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">CWE Classification</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">File Path</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Start Line</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">End Line</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Size</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Effort (h)</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Target Sprint</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Status</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Fix Engine</Data></Cell>
        <Cell ss:StyleID="ColHeaderCodeScan"><Data ss:Type="String">Description &amp; Remediation Plan</Data></Cell>
      </Row>

      <!-- Rows -->
      ${findings.length === 0
        ? `      <Row ss:Height="20"><Cell ss:MergeAcross="12" ss:StyleID="CellCenter"><Data ss:Type="String">No Code Scanning findings detected.</Data></Cell></Row>`
        : findings.map(f => {
            const sevStyle = this.getSeverityStyle(f.severity);
            const statusStyle = this.getStatusStyle(f.status);
            const cwe = (f.cweIds && f.cweIds.length > 0) ? f.cweIds.join(', ') : 'N/A';
            const size = f.sizing?.size || 'M';
            const hours = f.sizing?.estimatedHours || 3.0;
            const fixEngine = f.location?.snippet?.includes('Math.random') || f.location?.snippet?.includes('innerHTML') || f.ruleId?.includes('exec')
              ? 'AST-grep (Deterministic)'
              : 'Copilot LM API';

            return `      <Row ss:Height="20">
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(f.id)}</Data></Cell>
        <Cell ss:StyleID="${sevStyle}"><Data ss:Type="String">${this.escape(f.severity.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellTextBold"><Data ss:Type="String">${this.escape(f.ruleId || f.title)}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${this.escape(cwe)}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(f.location?.filePath || 'src/index.ts')}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${f.location?.startLine || 1}</Data></Cell>
        <Cell ss:StyleID="CellNumber"><Data ss:Type="Number">${f.location?.endLine || f.location?.startLine || 1}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${size}</Data></Cell>
        <Cell ss:StyleID="CellDecimal"><Data ss:Type="Number">${hours}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">Sprint ${f.targetSprint || 2}</Data></Cell>
        <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${this.escape(f.status.toUpperCase())}</Data></Cell>
        <Cell ss:StyleID="CellCenter"><Data ss:Type="String">${fixEngine}</Data></Cell>
        <Cell ss:StyleID="CellText"><Data ss:Type="String">${this.escape(f.remediationPlan || f.description || '')}</Data></Cell>
      </Row>`;
          }).join('\n')}
    </Table>
  </Worksheet>`;
  }

  private static getSeverityStyle(severity: string): string {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'SevCritical';
      case 'high': return 'SevHigh';
      case 'medium': return 'SevMedium';
      case 'low': return 'SevLow';
      default: return 'CellCenter';
    }
  }

  private static getStatusStyle(status: string): string {
    switch (status?.toLowerCase()) {
      case 'applied':
      case 'verified':
      case 'resolved':
        return 'StatusResolved';
      case 'failed':
      case 'rejected':
      case 'validation_failed':
        return 'StatusFailed';
      case 'in_progress':
      case 'pending':
      default:
        return 'StatusPending';
    }
  }

  private static escape(text?: string): string {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
