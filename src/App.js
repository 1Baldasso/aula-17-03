import { useState, useEffect } from "react";
import { 
  db, 
  auth
} from "./firebaseConnection";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

export default function App()
{
  return(
    <>
      <p>Olá</p>
    </>
  ) 
}