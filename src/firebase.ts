// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQLbd4xQwn1iZv9TfDySSCNSKcFCWc1ow",
  authDomain: "campusmarket-da919.firebaseapp.com",
  projectId: "campusmarket-da919",
  storageBucket: "campusmarket-da919.firebasestorage.app",
  messagingSenderId: "558704099855",
  appId: "1:558704099855:web:6aa00e3c75d2a49913597a",
  measurementId: "G-S1WM4MNJC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = initializeFirestore(app, {}, "(default)");

export { app, analytics };
