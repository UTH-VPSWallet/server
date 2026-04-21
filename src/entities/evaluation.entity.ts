import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const EvaluationEntity = sqliteTable('tbl__Evaluation', {
    VPSID: integer('VPSID').primaryKey(),
    Email: text("Email").notNull(),
    Rate: integer("Rate").notNull(),
    Status: integer("Status").notNull()
});