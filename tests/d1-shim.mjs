// A tiny in-memory stand-in for Cloudflare D1 (node:sqlite), for tests that call the Worker's functions in-process.
import { DatabaseSync } from 'node:sqlite';

export function fakeD1() {
  const db = new DatabaseSync(':memory:');
  const stmt = (sql, args = []) => ({
    bind: (...a) => stmt(sql, a),
    first: async () => { const r = db.prepare(sql).all(...args); return r[0] ?? null; },
    all: async () => ({ results: db.prepare(sql).all(...args) }),
    run: async () => {
      if (/\breturning\b/i.test(sql)) return { results: db.prepare(sql).all(...args), meta: {} };
      const r = db.prepare(sql).run(...args);
      return { meta: { changes: Number(r.changes) } };
    },
    _exec: () => (/^\s*(select|pragma)|\breturning\b/i.test(sql) ? { results: db.prepare(sql).all(...args) } : (db.prepare(sql).run(...args), { results: [] })),
  });
  return { prepare: (sql) => stmt(sql), batch: async (list) => list.map((s) => s._exec()), _db: db };
}
