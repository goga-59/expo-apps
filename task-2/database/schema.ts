import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const markers = sqliteTable("markers", {
    id: text("id").primaryKey(),
    title: text("title"),
    description: text("description"),
    coordinate: text("coordinate").notNull(),
    createdAt: integer("created_at").notNull().default(sql`(cast(strftime('%s','now') as integer) * 1000)`)
});

export const photos = sqliteTable("photos", {
    id: text("id").primaryKey(),
    uri: text("uri").notNull(),
    markerId: text("marker_id").notNull().references(() => markers.id, { onDelete: "cascade" }),
    addedAt: integer("added_at").notNull().default(sql`(cast(strftime('%s','now') as integer) * 1000)`)
});

export type MarkerData = typeof markers.$inferSelect;
export type NewMarker = typeof markers.$inferInsert;

export type PhotoData = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;