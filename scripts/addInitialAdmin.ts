/**
 * Initial Admin Setup Script
 * 
 * Creates the first admin user in the Firebase database.
 * Features:
 * - Firebase initialization
 * - Admin type enumeration
 * - Default admin configuration
 * - Error handling for setup process
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import dotenv from "dotenv";
import { AdminType } from "../src/server/db/interfaces/enums.js";

// Load environment variables
dotenv.config();

// Firebase config
const firebaseConfig = {
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  apiKey: process.env.FIREBASE_API_KEY,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initial admin data
const initialAdmins = {
  admin_1: {
    admin_id: "admin_1",
    email: "nicsmeyer@gmail.com", // Replace with your email
    adminType: AdminType.SuperAdmin,
    viewableStudents: ["1", "2", "3"],
  },
};

async function addInitialAdmin() {
  try {
    const adminsRef = ref(database, "admins");
    await set(adminsRef, initialAdmins);
    console.log("Successfully added initial admin data");
  } catch (error) {
    console.error("Error adding admin data:", error);
    throw error;
  }
}

// Run the function
void addInitialAdmin();
