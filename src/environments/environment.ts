// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.NG_APP_FIREBASE_DEV_API_KEY,
  authDomain: "tech4good-skill-building-b1.firebaseapp.com",
  projectId: "tech4good-skill-building-b1",
  storageBucket: "tech4good-skill-building-b1.firebasestorage.app",
  messagingSenderId: "887330565695",
  appId: "1:887330565695:web:4f9d671566781eab52928a",
  measurementId: "G-Z3J3V970RB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);