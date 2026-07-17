import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBylhq72v6vnC2Eve55Mn6--nmzmddJKfI",
  authDomain: "studio-4915153616-f59af.firebaseapp.com",
  databaseURL: "https://studio-4915153616-f59af-default-rtdb.firebaseio.com",
  projectId: "studio-4915153616-f59af",
  storageBucket: "studio-4915153616-f59af.firebasestorage.app",
  messagingSenderId: "691589730779",
  appId: "1:691589730779:web:2e5384ed3a30d33daa57fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
