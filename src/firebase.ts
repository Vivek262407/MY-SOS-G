import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyClBWMjCbPMx9vkFjkqBhpF3j7qhZiiUok",
  authDomain: "sos-giri.firebaseapp.com",
  projectId: "sos-giri",
  storageBucket: "sos-giri.firebasestorage.app",
  messagingSenderId: "506976130124",
  appId: "1:506976130124:web:fb48edc83ccdb1420250e9",
  measurementId: "G-3KFNWX812T"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app); // Add this line
