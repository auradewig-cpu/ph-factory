import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

let _db: ReturnType<typeof drizzle> | null = null;

function getDb() {
  if (!_db) {
    _db = drizzle(neon(process.env.DATABASE_URL!), { schema });
  }
  return _db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_, prop) {
    const instance = getDb();
    const value = (instance as any)[prop];
    return typeof value === 'function' ? value.bind(instance) : value;
  },
});
