// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import config from "../firebase-applet-config.json";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const app = initializeApp(config);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = initializeFirestore(app, {}, "(default)");

export { app, analytics };
