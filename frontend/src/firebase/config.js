// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCh5V5GqhMsdt7yO5puKYOXXQcGzDJu5rY",
  authDomain: "santalgpt.firebaseapp.com",
  projectId: "santalgpt",
  storageBucket: "santalgpt.firebasestorage.app",
  messagingSenderId: "290268372902",
  appId: "1:290268372902:web:85ea7f019e9a5019753967",
  measurementId: "G-K3SW5JE9CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// Initialize Analytics only on client side
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}
