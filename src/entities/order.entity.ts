import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const OrderEntity = sqliteTable('tbl__Order', {
  ID: integer('ID').primaryKey(),
  CustomerEmail: text('CustomerEmail').notNull(),
  TotalPrice: integer('TotalPrice').notNull(),
  Status: integer('Status').notNull(),
  CreatedAt: integer('CreatedAt').notNull(),
  UpdatedAt: integer('UpdatedAt').notNull()
});