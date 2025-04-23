import {Slot} from 'expo-router'
import {SQLiteProvider, type SQLiteDatabase} from 'expo-sqlite'
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
  return (
    <Suspense fallback={<ActivityIndicator />}>
    <SQLiteProvider useSuspense databaseName={"reports.db"} onInit={migrateDBIfNeeded}>
      <Slot />
    </SQLiteProvider>
    </Suspense>
  )
}

async function migrateDBIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let version = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  console.log('🚀 ~ migrateDbIfNeeded ~ version:', version);
  
  let currentDbVersion = version?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  console.log('Migrating db to version 1');
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);
    CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, description TEXT NOT NULL, isUrgent INTEGER NOT NULL, locationId INTEGER, imageUri TEXT, FOREIGN KEY (locationId) REFERENCES locations(id));
  `);

  // Only insert initial data if the database is empty
  const existingLocations = await db.getAllAsync('SELECT * FROM locations');
  if (existingLocations.length === 0) {
    await db.runAsync('INSERT INTO locations (name) VALUES (?)', 'School');
    await db.runAsync('INSERT INTO locations (name) VALUES (?)', 'Hospital');
    await db.runAsync(
      'INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)',
      ['Task 1', 'Description 1', 0, 1]
    );
    await db.runAsync(
      'INSERT INTO tasks (title, description, isUrgent, locationId) VALUES (?, ?, ?, ?)',
      ['Task 2', 'Description 2', 1, 2]
    );
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}