import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    signInWithRedirect, 
    getRedirectResult, 
    GoogleAuthProvider, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuZruAk7KoodRRVRmL5o4C6usjCFh56xQ",
  authDomain: "edusut-d2ed3.firebaseapp.com",
  projectId: "edusut-d2ed3",
  storageBucket: "edusut-d2ed3.firebasestorage.app",
  messagingSenderId: "488727279181",
  appId: "1:488727279181:web:3cf1eac8b9358369b60e04",
  measurementId: "G-DPT7H9DMD8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// IMPORTANT: This is the function the error is complaining about!
async function checkIsAdmin(email) {
    if (!email) return false;
    try {
        const docRef = doc(db, "whitelisted_admins", email);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Admin check failed:", error);
        return false;
    }
}

export { 
    auth, 
    db, 
    provider, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    onAuthStateChanged, 
    signOut, 
    doc, 
    setDoc, 
    getDoc, 
    checkIsAdmin 
};
