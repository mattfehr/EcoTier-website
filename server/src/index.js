import {initialzeApp} from 'firebase/app';
// Need to initialize the project then get the getter function from the library
// Treeshaking: functional way, know how to eliminate the unused function
import {getAuth, signInWithRedirect, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore, collection, getDocs, getDoc} from 'firebase/firestore';

// Store firebase condigureation for project
const firebaseApp = initialzeApp({
  apiKey: "AIzaSyCD6HRtwbwcb7yEImpI0BCqC1IGYQXVIvU",
  authDomain: "ecotier.firebaseapp.com",
  projectId: "ecotier",
  storageBucket: "ecotier.firebasestorage.app",
  messagingSenderId: "153347092412",
  appId: "1:153347092412:web:3bc1a34598542a2bf645b9",
  measurementId: "G-8Y5868WN6F"
});

const auth = getAuth(firebaseApp);
const button = document.querySelector('button');
const db = getFirestore(firebaseApp);
db.collection('todos').getDocs();
const todosCol = collection(db, 'todos');
const snapshot = await getDocs(todosCol);

onAuthStateChanged(auth, user => {
    if (user != null){
        console.log(user);
    }else{
        console.log('No user');
    }
});