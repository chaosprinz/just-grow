import db from "./db"
import { collectionTypes as collectionTypesTable } from '../db/schema'
import { eq } from "drizzle-orm"


const collectionTypes = {
  getMany: (): Record<string, unknown>[] => db
    .select()
    .from(collectionTypesTable)
    .all(),

  getOne: (id: number ): Record<string, unknown> | undefined => db
    .select()
    .from(collectionTypesTable)
    .where(eq(collectionTypesTable.id, id))
    .get(),

  createOne: (data: any): Record<string, unknown> => db
    .insert(collectionTypesTable)
    .values(data)
    .returning()
    .get(),
  
  updateOne: (id: number, data: any): Record<string, unknown> => db
    .update(collectionTypesTable)
    .set(data)
    .where(eq(collectionTypesTable.id, id))
    .returning()
    .get(),

  deleteOne: (id: number): Record<string, unknown> | undefined => db
    .delete(collectionTypesTable)
    .where(eq(collectionTypesTable.id, id))
    .returning()
    .get()
  }

export default collectionTypes
