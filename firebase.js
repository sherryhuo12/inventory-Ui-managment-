// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqBL3HGNKS0ShfJs-gPFQpEBfdVZBwrD0",
  authDomain: "inventory-management-app-4e019.firebaseapp.com",
  projectId: "inventory-management-app-4e019",
  storageBucket: "inventory-management-app-4e019.appspot.com",
  messagingSenderId: "797026360374",
  appId: "1:797026360374:web:17133b2f44994a66388c97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };