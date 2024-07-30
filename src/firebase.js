// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkg_dltl5uWa97INBHmqlO7SRB2KKG-oo",
  authDomain: "inventory-management-bb643.firebaseapp.com",
  projectId: "inventory-management-bb643",
  storageBucket: "inventory-management-bb643.appspot.com",
  messagingSenderId: "1035665933481",
  appId: "1:1035665933481:web:cbb759b7b25246026a15b8",
  measurementId: "G-ETDWBD5F9B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
