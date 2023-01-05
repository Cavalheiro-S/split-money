import { get, off, onValue, push, ref, remove, update } from "firebase/database";
import { collection, deleteDoc, doc, query, where, setDoc, getDocs, onSnapshot, updateDoc, PartialWithFieldValue, QueryDocumentSnapshot, SnapshotOptions, addDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { RegisterContext, RegisterProps, RegisterType } from "../Context/RegisterContext";
import { convertSnapshotToRegister, convertSnapshotToRegisterArray } from "../Utils/database";
import { convertToMoneyString } from "../Utils/util";
import { useAuth } from "./useAuth";
import { useDatabase } from "./useDatabase";

export const useRegister = () => {

    const { registers, setRegisters } = useContext(RegisterContext);
    const { db, dbFirestore } = useDatabase();
    const { currentUser } = useAuth();

    const registerConverter = {
        toFirestore: (register: RegisterProps) => {
            return {
                id: register.id,
                name: register.name,
                type: register.type,
                value: register.value,
                date: register.date,
                userId: register.userId,
            } as RegisterProps
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot<RegisterProps>, options: SnapshotOptions) => {
            const data = snapshot.data(options);
            return {
                id: snapshot.id,
                name: data.name,
                type: data.type,
                value: data.value,
                date: data.date,
                userId: data.userId,
            } as RegisterProps
        }
    }

    useEffect(() => {

        const collectionQuery = query(collection(dbFirestore, "register"), where("userId", "==", currentUser?.uid));
        const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
            const registersChanged = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data()
                } as RegisterProps
            })
            setRegisters(registersChanged);
        });

        return unsubscribe;
    }, [])

    const saveRegisterFirestore = async (register: RegisterProps) => {
        const registerRef = doc(dbFirestore, "register", register.id).withConverter(registerConverter);
        await setDoc(registerRef, register);
    }

    const updateRegisterFirestore = async (register: RegisterProps) => {
        const registerRef = doc(dbFirestore, "register", register.id).withConverter(registerConverter);
        await updateDoc(registerRef, register);
    }

    const deleteRegisterFirestore = async (registerId: string) => {
        await deleteDoc(doc(dbFirestore, "register", registerId));
    }

    const getRegisterByTypeFirestore = async (type: RegisterType) => {

        try {
            const registerRef = collection(dbFirestore, "register");
            const q = query(registerRef, where("type", "==", type as string), where("userId", "==", currentUser?.uid));
            const data = await getDocs(q);
            const registersQuery = data.docs.map(item => {
                return {
                    id: item.id,
                    ...item.data()
                }
            }) as RegisterProps[];
            return registersQuery;
        }
        catch (error) {
            console.log(error)
            return []
        }
    }

    const getAllRegistersFirestore = async () => {
        try {
            const registerRef = collection(dbFirestore, "register");
            const q = query(registerRef, where("userId", "==", currentUser?.uid));
            const data = await getDocs(q)
            const registersQuery = data.docs.map(item => ({ id: item.id, ...item.data() })) as RegisterProps[];
            return registersQuery;
        }
        catch (error) {
            console.log(error)
            return []
        }
    }

    const getRegisterByMonth = async (month: number) => {
        const snapshot = await get(ref(db, `users/${currentUser?.uid}/register`));
        const registers = convertSnapshotToRegisterArray(snapshot);
        return registers.filter(item => {
            const date = new Date(item.date);
            return date.getMonth() === month;
        });
    }

    const getValueTotalRegisters = async (type: RegisterType, formated = true) => {
        try {
            let registers = await getRegisterByTypeFirestore(type);
            if (!registers) return 0;
            const total = registers.reduce((total, register) => total + register.value, 0)

            if (formated) return convertToMoneyString(total)
            return total;
        }
        catch (error) {
            console.log(error)
        }
    }
    return {
        registers,
        saveRegisterFirestore,
        getAllRegistersFirestore,
        deleteRegisterFirestore,
        getRegisterByTypeFirestore,
        getValueTotalRegisters,
        getRegisterByMonth,
        updateRegisterFirestore
    };
}