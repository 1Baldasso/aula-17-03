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
  onSnapshot,
  deleteDoc
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import './App.css'

export default function App()
{
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost , setIdPost] = useState('');

  const [posts, setPosts] = useState([]);
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});

  function throwError(error){console.log("Erro:",error)};
  function clearFields(){
    setAutor('');
    setTitulo('');
    setIdPost('');
  }
  function clearAuthFields(){
    setEmail('');
    setSenha('');
  }
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
  useEffect( () => {
    async function checkLogin(){
      onAuthStateChanged(auth, (user) => {
        if(user){
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false);
          setUserDetail({});
        }
      })
    }
    checkLogin();
  },[]);

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
    await updateDoc(docRef,{
      titulo: titulo,
      autor: autor
    }).then(()=>{
      console.log("POST ATUALIZADO");
      clearFields();
    }).catch((error)=>{
      throwError(error);
    })
  }

  async function deletePost(idDoPost){
    const docRef = doc(db,'posts',idDoPost);
    await deleteDoc(docRef).then(()=>{
      console.log("Post deletado com sucesso!");
      clearFields();
    }).catch((error)=>{
      throwError(error);
    })
  }
  // Funções de Autenticação
  async function newUser(){
    await createUserWithEmailAndPassword(auth,email,senha)
    .then((user)=>{
      console.log("Usuário criado com sucesso!");
      clearAuthFields();
    }).catch((error)=>{
      if(error.code === 'auth/weak-password')
        alert("Senha fraca!");
      else if(error.code === 'auth/email-already-in-use')
        alert("Email já cadastrado!");
      else
        throwError(error);
    })
  }

  async function login(){
    await signInWithEmailAndPassword(auth,email,senha)
    .then((data)=>{
      setUser(true);
      setUserDetail({
        uid: data.user.uid,
        email: data.user.email
      })
      clearAuthFields();
    }).catch((error)=>{
      if(error.code === 'auth/wrong-password' || error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found')
        alert("Dados de login incorreta!");
      else
        throwError(error);
    })
  }

  return(
    <div>
      <h1>REACTJS + FIREBASE :)</h1>
      <div className="container">
        <h2>POSTS</h2>
        <label>Id do Post</label>
        <input
        placeholder="Digite o Id do Post"
        value={idPost}
        onChange={(content)=>{setIdPost(content.target.value)}}/>
        <br/>
        <label>Título:</label>
        <input
        type="text"
        placeholder="Digite o título"
        value={titulo}
        onChange={(content)=>setTitulo(content.target.value)}
        />
        <br/>
        <label>Autor: </label>
        <input
        type="text"
        placeholder="Digite o autor"
        value={autor}
        onChange={(content)=>setAutor(content.target.value)}
        />
        <br/>
        <button onClick={addPost}>Cadastrar</button>
        <button onClick={searchPost}>Buscar</button>
        <button onClick={editPost}>Editar</button>
        <ul>
          {posts.map((post) => {
            return(
              <li key={post.id}>
                <strong>ID: {post.id}</strong><br/>
                <span>Título: {post.titulo}</span><br/>
                <span>Autor: {post.autor}</span><br/>
                <button onClick={()=>deletePost(post.id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}