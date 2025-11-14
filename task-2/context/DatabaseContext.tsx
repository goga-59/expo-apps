import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { DB, initDatabase } from "@/database/database"
import migrations from "@/drizzle/migrations"
import { markers, MarkerData, NewMarker, NewPhoto, photos, PhotoData } from "@/database/schema";
import { eq, asc } from "drizzle-orm"
import { View, Text, ActivityIndicator } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

interface DatabaseContext {
    db: DB;
    addMarker: (marker: NewMarker) => Promise<void>;
    removeMarker: (markerId: string) => Promise<void>;
    updateMarker: (markerId: string, title: string | null, description: string | null) => Promise<void>;
    addPhoto: (photo: NewPhoto) => Promise<void>;
    removePhoto: (photoId: string) => Promise<void>;
    success: boolean,
}

const Context = createContext<DatabaseContext | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [db, setDb] = useState<DB | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { db } = await initDatabase();
                setDb(db);
            } catch (e) {
                console.error("Error initializing database: ", e);
                setError(e instanceof Error ? e : new Error(String(e)));
            }
        })()
    }, [])

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Ошибка при инициализации базы данных</Text>
            </View>
        )
    }

    if (!db) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return <DatabaseCoreProvider db={db}>{children}</DatabaseCoreProvider>
}

function DatabaseCoreProvider({ db, children }: { db: DB; children: React.ReactNode }) {

    const { success, error } = useMigrations(db, migrations);

    const addMarker = useCallback(async (marker: NewMarker) => {
        await db.insert(markers).values(marker);
    }, [db]);

    const removeMarker = useCallback(async (markerId: string) => {
        await db.delete(markers).where(eq(markers.id, markerId));
    }, [db]);

    const updateMarker = useCallback(async (markerId: string, title: string | null, description: string | null) => {
        const patch: Partial<MarkerData> = {};
        if (title !== null) patch.title = title;
        if (description !== null) patch.description = description;
        if (Object.keys(patch).length === 0) return;

        await db.update(markers).set(patch).where(eq(markers.id, markerId));
    }, [db]);

    const addPhoto = useCallback(async (photo: NewPhoto) => {
        await db.insert(photos).values(photo);
    }, [db]);

    const removePhoto = useCallback(async (photoId: string) => {
        await db.delete(photos).where(eq(photos.id, photoId));
    }, [db]);

    const value = useMemo(() => ({ db, addMarker, removeMarker, updateMarker, addPhoto, removePhoto, success}), [
        db,
        success,
        addMarker,
        removeMarker,
        updateMarker,
        addPhoto,
        removePhoto,
    ])

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Ошибка при миграции базы</Text>
            </View>
        );
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useDatabase() {
    const context = useContext(Context);
    if (!context)
        throw new Error("There is no DatabaseProvider for useDatabase")

    return context;
}

export function useMarkers() {
    const { db } = useDatabase();

    const { data, error } = useLiveQuery(db.select().from(markers))
    if (error)
        return null;

    return data as MarkerData[];
}

export function usePhoto(markerId: string) {
    const { db } = useDatabase();

    const { data, error } = useLiveQuery(db.select().from(photos).where(eq(photos.markerId, markerId)).orderBy(asc(photos.addedAt)))
    if (error)
        return null

    return data as PhotoData[];
}

export function useMarkerById(markerId: string) {
    const { db } = useDatabase();

    const { data, error } = useLiveQuery(db.select().from(markers).where(eq(markers.id, markerId)).limit(1))
    if (error)
        return null;

    return data[0] as MarkerData;
}