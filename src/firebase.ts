import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import config from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(config);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if specified, else use '(default)'
export const db = initializeFirestore(app, {}, config.firestoreDatabaseId || '(default)');
