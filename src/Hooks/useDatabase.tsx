import { getDatabase } from "firebase/database";
import { app } from "../Utils/firebase";

export const useDatabase = () => {

    const db = getDatabase(app);

    return { db };
}