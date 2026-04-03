import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const VPSEntity = sqliteTable('tbl__VPS', {
    ID: integer('ID').primaryKey(),
    Name: text("Name").notNull(),
    CategoryID: integer("CategoryID").notNull(),
    Status: integer("Status").notNull()
});