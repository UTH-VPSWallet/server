import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const AdminEntity = sqliteTable('tbl__Admin', {
  Email: text('Email').primaryKey(),
  Pass: text("Pass").notNull()
});