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

export default function App()
{
  return(
    <>
      <p>Olá</p>
    </>
  ) 
}