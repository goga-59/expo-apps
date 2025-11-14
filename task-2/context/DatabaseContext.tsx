import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { DB, initDatabase } from "@/database/database"
import migrations from "@/drizzle/migrations"
import { View, Text, ActivityIndicator } from "react-native";
import { DatabaseContext, databaseOperations } from "@/database/operations";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const Context = createContext<DatabaseContext | null>(null);

export function useDatabase() {
    const context = useContext(Context);
    if (!context)
        throw new Error("There is no DatabaseProvider for useDatabase")

    return context;
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
    const [db, setDb] = useState<DB | null>(null);
    const [dbError, setDbError] = useState<Error | undefined>(undefined);

    useEffect(() => {
        (async () => {
            try {
                const { db } = await initDatabase();
                setDb(db);
            } catch (e) {
                setDbError(e instanceof Error ? e : new Error(String(e)))
                console.error("Error initializing database: ", e);
            }
        })()
    }, []);

    const value = useMemo(() => databaseOperations(db), [db]);

    if (dbError) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Извините, у нас выходной!</Text>
                <FontAwesome5 name="bed" size={45} color="black" />
            </View>
        )
    }

    if (!db) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    };

    return <MigrationsWrapper db={db} value={value}>{children}</MigrationsWrapper>
}

function MigrationsWrapper({ db, value, children }: { db: DB, value: DatabaseContext; children: React.ReactNode }) {
    const { success, error } = useMigrations(db, migrations);

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg">Извините, у нас выходной!</Text>
                <FontAwesome5 name="bed" size={45} color="black" />
            </View>
        )
    }

    if (!success) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return <Context.Provider value={value}>{children}</Context.Provider>
}