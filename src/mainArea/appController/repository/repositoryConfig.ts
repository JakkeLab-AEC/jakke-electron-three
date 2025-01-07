import sqlite3, { Database } from 'sqlite3';
import { app } from "electron";
import path from "path";
import fs from "fs";

function dbRun(db: Database, query: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(query, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

export async function openDB() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'appDB.db');

    console.log(dbPath);

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    try {
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
            if (err) {
                console.error('Failed to open database:', err.message);
                throw err;
            }
        });

        await dbRun(db, 'PRAGMA foreign_keys = OFF');
        await initializeDB(db);

        const encryptionKey = 'your-secret-password'; // Replace with your desired password
        await dbRun(db, `PRAGMA key = '${encryptionKey}'`);

        await dbRun(db, 'PRAGMA foreign_keys = ON');

        await initializeDB(db);

        return db;
    } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
    }
}

async function initializeDB(db: Database) {
    await db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    `)
}