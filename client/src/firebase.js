import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Replace the following with your Firebase configuration
// You can find this in your Firebase Console -> Project Settings -> General -> Your Apps -> Web App
const firebaseConfig = {
  apiKey: "AIzaSyDfzMyIAJwrdqo63FMZgNiRehe8nL9lzRk",
  authDomain: "service-desk-app-8931a.firebaseapp.com",
  projectId: "service-desk-app-8931a",
  storageBucket: "service-desk-app-8931a.firebasestorage.app",
  messagingSenderId: "73396512037",
  appId: "1:73396512037:web:b3acc835da153f3ac9a6cc",
  measurementId: "G-H8PRTRCVXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics
export const analytics = getAnalytics(app);

export default app; 