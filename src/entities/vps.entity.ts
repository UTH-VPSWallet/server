import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const VPSEntity = sqliteTable('tbl__VPS', {
    ID: integer('ID').primaryKey(),
    Name: text("Name").notNull(),
    CPU: text("CPU").notNull(),
    RAM: text("RAM").notNull(),
    Storage: text("Storage").notNull(),
    PricePerMonth: integer("PricePerMonth").notNull(),
    Status: integer("Status").notNull()
});
