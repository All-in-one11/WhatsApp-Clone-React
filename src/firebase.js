import firebase from 'firebase';	


const firebaseConfig = {
  apiKey: "AIzaSyA71C8KtKf0IPem-k2nFUKV8r52LU4QCmI",
  authDomain: "whatsapp-431f1.firebaseapp.com",
  projectId: "whatsapp-431f1",
  storageBucket: "whatsapp-431f1.appspot.com",
  messagingSenderId: "762783254581",
  appId: "1:762783254581:web:bd349546a3fbc19ac3097c",
  measurementId: "G-5QQ39T1F2E"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);	

const db = firebaseApp.firestore();	
const auth = firebase.auth();	
const provider = new firebase.auth.GoogleAuthProvider();	
const storage = firebase.storage();

export { auth, provider, storage, firebase };	
export default db;  
