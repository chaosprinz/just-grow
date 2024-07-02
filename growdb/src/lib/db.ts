import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from '../db/schema'

const DB_PATH: string = `./db/${process.env.NODE_ENV || 'development'}.db`

const sqlite = new Database(DB_PATH)
const db = drizzle(sqlite, { schema })

export default db
