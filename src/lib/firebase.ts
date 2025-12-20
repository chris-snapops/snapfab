// /lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2ZX0vq8hNNNCGkXzfFOLHt09fTz50awU",
  authDomain: "snapfab.firebaseapp.com",
  projectId: "snapfab",
  storageBucket: "snapfab.firebasestorage.app",
  messagingSenderId: "340409809974",
  appId: "1:340409809974:web:8632cb851006a8643aac97",
  measurementId: "G-Q9TQTPM3N9"
};

// Prevent multiple apps in dev
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);