import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import 'firebase/messaging';
import { env } from "~/env.js";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyC79dLUv5wmpvYmreVMDS0KMFcmw-RUEMk",
  authDomain: "peeper-xbcad.firebaseapp.com",
  databaseURL: "https://peeper-xbcad-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "peeper-xbcad",
  storageBucket: "peeper-xbcad.appspot.com",
  messagingSenderId: "761357003841",
  appId: "1:761357003841:web:97de31e23cc0c0f449aac0",
  measurementId: "G-8K27P2SQER"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

export { app, database, firebaseConfig };