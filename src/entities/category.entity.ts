import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const CategoryEntity = sqliteTable('tbl__Category', {
    ID: integer('ID').primaryKey(),
    Name: text("Name").notNull(),
    SupplierEmail: text("SupplierEmail").notNull(),
    Status: integer("Status").notNull()
});