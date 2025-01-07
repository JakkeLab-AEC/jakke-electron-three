import { Database } from "@journeyapps/sqlcipher";
import { openDB } from "./repository/repositoryConfig";
import fs from "fs";

export class AppController {
    private static instance: AppController;
    private db?: Database;
    private dbPath?: string;

    private constructor() {
        openDB().then((res) => {
            this.db = res.db;
            this.dbPath = res.dbPath;
        })
    }

    static InitiateAppController(){
        AppController.instance = new AppController();
    }

    static getInstance(): AppController {
        return AppController.instance;
    }

    async closeAppActions() {
        if (this.dbPath && fs.existsSync(this.dbPath)) {
            console.log("Remove DB");
            const checkAndDeleteFile = (filePath: string, retries: number = 5, delay: number = 1000) => {
                setTimeout(() => {
                    try {
                        fs.unlinkSync(filePath);
                        console.log("DB removed successfully");
                    } catch (err) {
                        if (retries > 0) {
                            console.log(`Retrying to remove DB. Attempts left: ${retries}`);
                            checkAndDeleteFile(filePath, retries - 1, delay);
                        } else {
                            console.error("Failed to remove DB after multiple attempts", err);
                        }
                    }
                }, delay);
            };
        
            checkAndDeleteFile(this.dbPath);
        }
    }
}