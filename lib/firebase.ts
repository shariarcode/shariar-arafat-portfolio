// Standard Firebase v9+ modular imports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCBXOHIFg4H2v1R-8QYHuYvj8iIgc7C4Q0",
  authDomain: "shariar-arafat-portfolio.firebaseapp.com",
  projectId: "shariar-arafat-portfolio",
  storageBucket: "shariar-arafat-portfolio.firebasestorage.app",
  messagingSenderId: "702383377696",
  appId: "1:702383377696:web:7bc65eff18fe6c285ddb45",
  measurementId: "G-W19BLTGWYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
