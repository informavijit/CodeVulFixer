import * as path from 'path';
import * as fs from 'fs';

// Demo Vulnerability Target: Path Traversal (CWE-22 / js/path-traversal)
export function readPublicAsset(publicDir: string, req: { query: { filename: string } }): Buffer {
  // VULNERABLE LINE: Path traversal via unconstrained path.join
  const filePath = path.join(publicDir, req.query.filename);
  return fs.readFileSync(filePath);
}
