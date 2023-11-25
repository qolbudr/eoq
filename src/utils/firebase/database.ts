import { db } from "./core"
import { getDoc, doc, DocumentData, collection, getDocs, deleteDoc, addDoc, query, where, orderBy, limit } from "firebase/firestore"

export const getStockData : () => Promise<any[]> = async () => {
    const result : any[] = [];
    const ref = query(collection(db, "app/eoq-kabulgroup", "stock"), orderBy('month'));
    const snapshot = await getDocs(ref)
    snapshot.forEach((doc) => {
        const data = doc.data();
        result.push({...data, id: doc.id});
    })

    return result;
}

export const getReportData : () => Promise<any[]> = async () => {
    const result : any[] = [];
    const ref = query(collection(db, "app/eoq-kabulgroup", "report"), orderBy('date', 'desc'));
    const snapshot = await getDocs(ref)
    snapshot.forEach((doc) => {
        const data = doc.data();
        result.push({...data, id: doc.id});
    })

    return result;
}

export const insertData = async (data : StoreData) => {
    const ref = collection(db, "app/eoq-kabulgroup", "stock");
    await addDoc(ref, data);
}

export const insertReport = async (data : any) => {
    const ref = collection(db, "app/eoq-kabulgroup", "report");
    await addDoc(ref, data);
}

export const deleteData = async (id: string) => {
    const ref = doc(db, "app/eoq-kabulgroup", `stock/${id}`);
    await deleteDoc(ref)
}

export const deleteReportData = async (id: string) => {
    const ref = doc(db, "app/eoq-kabulgroup", `report/${id}`);
    await deleteDoc(ref)
}

export const getDataMonth = async (month: number) => {
    const result : any[] = [];
    
    const ref = query(collection(db, "app/eoq-kabulgroup", "stock"), where("month", "==", month))
    const snapshot = await getDocs(ref)
    snapshot.forEach((doc) => {
        const data = doc.data();
        result.push({...data, id: doc.id});
    })

    return result;
}

export const getMaxUse = async () => {
    const result : any[] = [];
    const ref = query(collection(db, "app/eoq-kabulgroup", "stock"), orderBy("use", 'desc'), limit(1))
    const snapshot = await getDocs(ref)
    snapshot.forEach((doc) => {
        const data = doc.data();
        result.push({...data, id: doc.id});
    })

    return result;
    
}