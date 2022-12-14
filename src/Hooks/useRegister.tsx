import { collection, deleteDoc, doc, endAt, getDocs, limit, onSnapshot, orderBy, query, QueryDocumentSnapshot, setDoc, SnapshotOptions, startAt, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect } from "react";
import { RegisterContext, RegisterProps, RegisterType } from "../Context/RegisterContext";
import { convertToMoneyString } from "../Utils/util";
import { useAuth } from "./useAuth";
import { useDatabase } from "./useDatabase";

export const useRegister = () => {

    const { registers, setRegisters } = useContext(RegisterContext);
    const { dbFirestore } = useDatabase();
    const { currentUser } = useAuth();

    //#region Converter
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
    //#endregion
    //#region useEffect
    useEffect(() => {

        const collectionQuery = query(collection(dbFirestore, "register"),
            where("userId", "==", currentUser?.uid),
            orderBy("date", "asc"),
            limit(10));
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
    //#endregion
    //#region set, update, delete
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
    //#endregion
    //#region get
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
            setRegisters(registersQuery);
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

    const getRegistersLimit = async (limitResult = 10) => {
        try {
            const registerRef = collection(dbFirestore, "register");
            const q = query(registerRef,
                where("userId", "==", currentUser?.uid),
                orderBy("date", "asc"),
                limit(limitResult));
            const data = await getDocs(q)
            const registersQuery = data.docs.map(item => ({ id: item.id, ...item.data() })) as RegisterProps[];
            setRegisters(registersQuery);
            return registersQuery;
        }
        catch (error) {
            console.log(error)
            return [] as RegisterProps[];
        }
    }

    const getRegistersByMonth = async (month: string) => {
        const registerRef = collection(dbFirestore, "register");
        const startDate = new Date(`2023-${month}-01`).toISOString();
        const endDate = new Date(`2023-${month}-31`).toISOString();
        const q = query(registerRef,
            where("userId", "==", currentUser?.uid),
            orderBy("date", "asc"),
            startAt(startDate),
            endAt(endDate)
        );
        const data = await getDocs(q);
        const registersQuery = data.docs.map(item => ({ id: item.id, ...item.data() })) as RegisterProps[];
        setRegisters(registersQuery);
        return registersQuery;
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

    const getRegistersLength = async () => {
        try {
            const registerRef = collection(dbFirestore, "register");
            const q = query(registerRef, where("userId", "==", currentUser?.uid));
            const data = await getDocs(q)
            const registersQuery = data.docs.map(item => ({ id: item.id, ...item.data() })) as RegisterProps[];
            return registersQuery.length;
        }
        catch (error) {
            console.log(error)
            return 0;
        }
    }
    //#endregion 
    //#region export
    return {
        registers,
        setRegisters,
        firestore: {
            saveRegister: saveRegisterFirestore,
            deleteRegister: deleteRegisterFirestore,
            updateRegister: updateRegisterFirestore,
            get: {
                RegisterByType: getRegisterByTypeFirestore,
                RegistersTotalValue: getValueTotalRegisters,
                RegistersByMonth: getRegistersByMonth,
                RegistersLimit: getRegistersLimit,
                RegistersLength: getRegistersLength,
            }
        }
    };
    //#endregion
}