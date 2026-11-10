// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS2_UHNVaXjHl2uebvVi0UQMos82NMQv4",
  authDomain: "skill-building-fall26-b1.firebaseapp.com",
  projectId: "skill-building-fall26-b1",
  storageBucket: "skill-building-fall26-b1.firebasestorage.app",
  messagingSenderId: "671527015736",
  appId: "1:671527015736:web:666c02a41c73dae1181dcd",
  measurementId: "G-8PH7JMQB8V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);