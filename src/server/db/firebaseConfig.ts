import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import 'firebase/messaging';
import { env } from "~/env.js";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.FIREBASE_DATABASE_URL,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = getDatabase(app);

export { app, database, firebaseConfig };