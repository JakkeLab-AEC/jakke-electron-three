import {Database} from '@journeyapps/sqlcipher';
import { app } from "electron";
import path from "path";
import fs from "fs";


export async function openDB():Promise<{db: Database, dbPath: string}> {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'appDB.db');

    console.log(dbPath);

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    try {
        const db = new Database(dbPath)
        db.serialize(function() {
            db.run("PRAGMA cipher_compatibility = 4");

            // To open a database created with SQLCipher 3.x, use this:
            // db.run("PRAGMA cipher_compatibility = 3");

            db.run("PRAGMA key = 'mysecret'");
            db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT)");

            var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();

            db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info);
            });
        });

        return {db: db, dbPath: dbPath};
    } catch (error) {
        console.error('Failed to open database:', error);
        throw error;
    }
}