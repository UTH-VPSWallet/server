import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const CustomerEntity = sqliteTable('tbl__Customer', {
  Email: text('Email').primaryKey(),
  Pass: text('Pass').notNull(),
  Name: text('Name').notNull(),
  Status: integer('Status').notNull()
});