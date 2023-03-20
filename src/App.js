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
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const[idPost , setIdPost] = useState('');
  function throwError(error){console.log("Erro:",error)};
  function clearFields(){
    setAutor('');
    setTitulo('');
    setIdPost('');
  }
  const [posts, setPosts] = useState([]);
  useEffect( () => {
    async function loadPosts(){
      const dados = onSnapshot(collection(db,"posts"),(snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          })
        })
        setPosts(listaPost);

      })
    }

    loadPosts();
  }, []);

  async function searchPost()
  {
    const postRef = collection(db,"posts");
    await getDocs(postRef).then((snapshot)=>{
      let lista = []
      snapshot.forEach(item => {
        lista.push({
          id: item.id,
          titulo: item.data().titulo,
          autor: item.data().autor
        });
      });
      setPosts(lista);
    }).catch((error)=>{
      throwError(error);
    });
  }

  async function addPost()
  {
    await addDoc(collection(db,"posts"),{
      titulo: titulo,
      autor: autor
    }).then(()=>{
      console.log("Cadastro Realizado com sucesso!");
      clearFields();
    }
    ).catch((error)=>{
      throwError(error);
    })
  }

  async function editPost()
  {
    const docRef = doc(db,"posts",idPost);
    await updateDoc(docref,{
      titulo: titulo,
      autor: autor
    }).then(()=>{
      console.log("POST ATUALIZADO");
      clearFields();
    }).catch((error)=>{
      throwError(error);
    })
  }

  async function deletePost(id){
    const docRef = doc(db,'posts',id);
    await deletePost(docRef).then(()=>{
      console.log("Post deletado com sucesso!");
      clearFields();
    }).catch((error)=>{
      throwError(error);
    })
  }
}