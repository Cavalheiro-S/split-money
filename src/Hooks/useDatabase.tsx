import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { app } from "../Utils/firebase";

export const useDatabase = () => {

    const db = getDatabase(app);
    const dbFirestore = getFirestore();

    return { db, dbFirestore };
}