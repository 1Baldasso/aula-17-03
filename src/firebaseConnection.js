import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyDA3PteIAY4T27Q55kHtxciVgp9_PxNOXU",
  authDomain: "bd-aula-17-03.firebaseapp.com",
  projectId: "bd-aula-17-03",
  storageBucket: "bd-aula-17-03.appspot.com",
  messagingSenderId: "1005956813591",
  appId: "1:1005956813591:web:ede59def73b65e12f79d52"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
export {db, auth};

