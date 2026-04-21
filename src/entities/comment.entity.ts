import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const CommentEntity = sqliteTable('tbl__Comment', {
    ID: integer('ID').primaryKey(),
    VPSID: integer('VPSID').notNull(),
    Content: text('Content').notNull(),
    Status: integer('Status').notNull()
});