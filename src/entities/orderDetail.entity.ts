import { sqliteTable, integer } from 'drizzle-orm/sqlite-core';

export const OrderDetailEntity = sqliteTable('tbl__OrderDetail', {
  ID: integer('ID').primaryKey(),
  OrderID: integer('OrderID').notNull(),
  VPSID: integer('VPSID').notNull(),
  TotalMonth: integer('TotalMonth').notNull(),
  PriceAtPurchase: integer('PriceAtPurchase').notNull()
});