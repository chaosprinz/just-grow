import type { SQLiteTableWithColumns } from 'drizzle-orm/sqlite-core'
import db from '../db'
import { eq } from 'drizzle-orm'

const createTableApi = (table: SQLiteTableWithColumns<any>) => ({
  getMany: () => db
    .select()
    .from(table)
    .all(),

  getOne: (id: number ) => db
    .select()
    .from(table)
    .where(eq(table.id, id))
    .get(),

  createOne: (data: any) => db
    .insert(table)
    .values(data)
    .returning()
    .get(),
  
  updateOne: (id: number, data: any) => db
    .update(table)
    .set(data)
    .where(eq(table.id, id))
    .returning()
    .get(),

  deleteOne: (id: number) => db
    .delete(table)
    .where(eq(table.id, id))
    .returning()
    .get()
})

export default createTableApi
