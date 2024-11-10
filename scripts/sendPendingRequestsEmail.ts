/**
 * Email Notification Script
 * 
 * Automated script for sending email notifications about pending organization requests.
 * Features:
 * - Firebase integration for data fetching
 * - SendGrid email service integration
 * - Type definitions for organization requests and admin users
 * - Environment variable validation
 */

import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

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

// Initialize SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY;
if (!sendGridApiKey) {
  throw new Error("SENDGRID_API_KEY is not defined");
}
sgMail.setApiKey(sendGridApiKey);

interface OrgRequest {
  name: string;
  email: string;
  approvalStatus: number;
  studentID: string;
}

// Add this new interface
interface Admin {
  admin_id: string;
  email: string;
  adminType: AdminType; // Changed from adminType to type
  viewableStudents: string[];
}

enum AdminType {
  SuperAdmin = 0,
  Admin = 1,
}

async function sendPendingRequestsEmail() {
  try {
    // Fetch all requests and filter in memory
    const orgRequestsRef = ref(database, "orgRequests");
    const snapshot = await get(orgRequestsRef);

    if (!snapshot.exists()) {
      console.log("No requests found");
      return;
    }

    // Filter pending requests in memory
    const allRequests = snapshot.val();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const pendingRequests = Object.values<OrgRequest>(allRequests).filter(
      (request) => request.approvalStatus === 0,
    );

    if (pendingRequests.length === 0) {
      console.log("No pending requests found");
      return;
    }

    // Fetch all admins
    const adminsRef = ref(database, "admins");
    const adminSnapshot = await get(adminsRef);

    if (!adminSnapshot.exists()) {
      console.log("No admins found");
      return;
    }
    console.log("Admin data:", adminSnapshot.val());

    const admins = Object.values(adminSnapshot.val() as Admin[]);
    console.log("Parsed admins:", admins);
    const superAdmin = admins.find(
      (admin) => admin.adminType === AdminType.SuperAdmin,
    );

    if (!superAdmin) {
      console.log("No superadmin found");
      return;
    }

    // Prepare email content
    const requestList = pendingRequests
      .map(
        (request) =>
          `<li>Organisation: ${request.name}, Email: ${request.email}</li>`,
      )
      .join("");

    const msg = {
      to: superAdmin.email,
      from: "peeper.tracking@gmail.com",
      subject: "Pending Organisation Requests",
      html: `
                <h1>Pending Organisation Requests</h1>
                <p>The following organisations have requested to join the platform:</p>
                <ul>${requestList}</ul>
                <p>Please review these requests at your <a href="https://herenow-portal.vercel.app/dashboard">dashboard</a>.</p>
            `,
    };

    await sgMail.send(msg);
    console.log("Email sent successfully to superadmin");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

void sendPendingRequestsEmail();
