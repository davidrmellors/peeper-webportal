import { initializeApp, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import { credential } from 'firebase-admin';
import { env } from "~/env";

const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: env.FIREBASE_DATABASE_URL,
  });
}

export const db = getDatabase();