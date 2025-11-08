import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjXEragOqrjZrKvSRKCU8eCQOih7PRV-A",
  authDomain: "career-platform-lesotho-188b9.firebaseapp.com",
  databaseURL: "https://career-platform-lesotho-188b9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "career-platform-lesotho-188b9",
  storageBucket: "career-platform-lesotho-188b9.firebasestorage.app",
  messagingSenderId: "688621774023",
  appId: "1:688621774023:web:fc2e6cc0c6a7034d69cae2"
};

// Initialize Firebase
let app;
let db;
let auth;
let storage;

try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
  storage = getStorage(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export initialized services
export { db, auth, storage };
export default app;