// Demo Vulnerability Target: SQL Injection (CWE-89 / js/sql-injection)
export async function findUserByEmail(db: any, req: { query: { email: string } }): Promise<any> {
  // VULNERABLE LINE: User-controlled string interpolated into raw SQL
  const query = `SELECT * FROM users WHERE email = '${req.query.email}'`;
  const result = await db.raw(query);
  return result;
}
