// Demo Vulnerability Target: Insecure Randomness (CWE-330 / js/insecure-randomness)
export function generateSessionToken(userId: string): string {
  // VULNERABLE LINE: Math.random() is cryptographically weak for session credentials
  const token = Math.random().toString(36).substring(2);
  return `sess_${userId}_${token}`;
}
