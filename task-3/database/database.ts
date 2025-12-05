import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite'
import * as schema from "./schema"

export type DB = ExpoSQLiteDatabase<typeof schema>;

export async function initDatabase() {
    const sqlite = SQLite.openDatabaseSync("app.db", { enableChangeListener: true });
    await sqlite.execAsync(`PRAGMA  journal_mode = WAL; PRAGMA foreign_keys = on`);
    const db = drizzle(sqlite, { schema });
    return { db };
}