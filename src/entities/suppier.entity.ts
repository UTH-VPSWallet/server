import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const SupplierEntity = sqliteTable('tbl__Supplier', {
  Email: text('Email').primaryKey(),
  Pass: text("Pass").notNull(),
  Name: text("Name").notNull(),
  Status: integer("Status").notNull(),
});