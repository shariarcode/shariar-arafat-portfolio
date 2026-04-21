// Modular Firebase imports for client-side SDK
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBGitX7ARXa7y-A-4Vq6uva2fFuNSpBgoo",
  authDomain: "shariar-arafat-portfolio-f0324.firebaseapp.com",
  projectId: "shariar-arafat-portfolio-f0324",
  storageBucket: "shariar-arafat-portfolio-f0324.firebasestorage.app",
  messagingSenderId: "559698565032",
  appId: "1:559698565032:web:61f3d5a3303933acd12f9d",
  measurementId: "G-81NGMDWYEZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);