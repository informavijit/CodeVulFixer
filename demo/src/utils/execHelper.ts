import { exec } from 'child_process';

// Demo Vulnerability Target: Command Injection (CWE-78 / js/command-injection)
export function checkoutGitBranch(branchName: string, callback: (err: any) => void): void {
  // VULNERABLE LINE: Untrusted string concatenation directly into shell command
  exec(`git checkout ${branchName}`, callback);
}
