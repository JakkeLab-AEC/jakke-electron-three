import { Database } from "sqlite3";
import { openDB } from "./repository/repositoryConfig";

export class AppController {
    private static Instance: AppController;
    private db?: Database;

    private constructor() {
        openDB().then((res) => {
            this.db = res;
        })
    }

    public static InitiateAppController(){
        AppController.Instance = new AppController();
    }
}