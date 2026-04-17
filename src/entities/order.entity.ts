import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const OrderEntity = sqliteTable('tbl__Order', {
  ID: integer('ID').primaryKey(),
  CustomerEmail: text('CustomerEmail').notNull(),
  VPSID: integer('VPSID').notNull(),
  Status: integer('Status').notNull(),
  TotalMonth: integer('TotalMonth').notNull(),
  TotalPrice: integer('TotalPrice').notNull(),
  CreatedAt: integer('CreatedAt').notNull(),
  UpdatedAt: integer('UpdatedAt').notNull()
});