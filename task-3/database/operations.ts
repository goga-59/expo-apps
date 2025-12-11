import { DB } from "./database";
import { markers, MarkerSelect, MarkerInsert, photos, PhotoInsert } from "./schema";
import { eq, asc } from "drizzle-orm";

export const databaseOperations = (db: DB | null) => ({
    addMarker: async (marker: MarkerInsert) => {
        if (!db) throw new Error("Database is not initialized");
        await db.insert(markers).values(marker);
    },

    removeMarker: async (markerId: string) => {
        if (!db) throw new Error("Database is not initialized");
        await db.delete(markers).where(eq(markers.id, markerId));
    },

    updateMarker: async (markerId: string, title?: string | null, description?: string | null, formattedAddress?: string | null) => {
        if (!db) throw new Error("Database is not initialized");

        const patch: Partial<MarkerSelect> = {};
        if (title !== null) patch.title = title;
        if (description !== null) patch.description = description;
        if (formattedAddress !== null) patch.formattedAddress = formattedAddress;
        if (Object.keys(patch).length === 0) return;

        await db.update(markers).set(patch).where(eq(markers.id, markerId));
    },

    getMarkers: () => {
        if (!db) throw new Error("Database is not initialized");

        return db.select().from(markers);
    },

    getMarkerById: (markerId: string) => {
        if (!db) throw new Error("Database is not initialized");

        return db.select().from(markers).where(eq(markers.id, markerId)).limit(1);
    },

    getPhotosByMarkerId: (markerId: string) => {
        if (!db) throw new Error("Database is not initialized");

        return db.select().from(photos).where(eq(photos.markerId, markerId)).orderBy(asc(photos.addedAt));
    },

    addPhoto: async (photo: PhotoInsert) => {
        if (!db) throw new Error("Database is not initialized");
        await db.insert(photos).values(photo);
    },

    removePhoto: async (photoId: string) => {
        if (!db) throw new Error("Database is not initialized");
        await db.delete(photos).where(eq(photos.id, photoId));
    },
});

export type DatabaseContext = ReturnType<typeof databaseOperations>;