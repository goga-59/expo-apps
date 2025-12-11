import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"
import { LatLng } from "react-native-maps";

export const markers = sqliteTable("markers", {
    id: text("id").primaryKey(),
    title: text("title"),
    description: text("description"),
    coordinate: text("coordinate", { mode: 'json' }).notNull().$type<LatLng>(),
    formattedAddress: text("formatted_address"),
    createdAt: integer("created_at").notNull().$defaultFn(() => Date.now())
});

export const photos = sqliteTable("photos", {
    id: text("id").primaryKey(),
    uri: text("uri").notNull(),
    markerId: text("marker_id").notNull().references(() => markers.id, { onDelete: "cascade" }),
    addedAt: integer("added_at").notNull().$defaultFn(() => Date.now())
});

export type MarkerSelect = typeof markers.$inferSelect;
export type MarkerInsert = typeof markers.$inferInsert;
export type PhotoSelect = typeof photos.$inferSelect;
export type PhotoInsert = typeof photos.$inferInsert;