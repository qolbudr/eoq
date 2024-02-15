import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"

const firebaseConfig: FirebaseOptions = {
    // apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    apiKey: "AIzaSyAvr4APzfegkYxnHDHJ6pcVw5iD77gLpjo",
    authDomain: "locker-project-239a1.firebaseapp.com",
    projectId: "locker-project-239a1",
    appId: "1:657772317212:web:f112f2081c7213f2ffadd9"
}

initializeApp(firebaseConfig);

export const auth = getAuth()
export const signIn = signInWithEmailAndPassword;
export const db = getFirestore()