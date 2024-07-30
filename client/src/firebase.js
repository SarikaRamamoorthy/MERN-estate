// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-management.firebaseapp.com",
  projectId: "mern-estate-management",
  storageBucket: "mern-estate-management.appspot.com",
  messagingSenderId: "539500281589",
  appId: "1:539500281589:web:c6529259709d8a3c040fbc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);