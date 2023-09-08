import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCQCpYwCPyGeBuVZ1ebynNNA5JD39s0kGs',
  authDomain: 'alphabi-d6593.firebaseapp.com',
  projectId: 'alphabi-d6593',
  storageBucket: 'alphabi-d6593.appspot.com',
  messagingSenderId: '221855813130',
  appId: '1:221855813130:web:090d0b61cc486c221659f3',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initializing with provider
const googleProvider = new GoogleAuthProvider();

// To sign in with google
const loginWithGooglePopup = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    return user;
  } catch (error) {
    alert(error.message);
  }
};

// To sign in user with email and password
const loginWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error) return false;
  }
  return true;
};

// to create user account with email and password
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const resp = await createUserWithEmailAndPassword(auth, email, password);
    if (resp.user) {
      const user = resp.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        authProvider: 'email',
        email,
      }).catch((e) => console.log(e));
    }
  } catch (error) {
    alert(error.message);
    return false;
  }
};

// to remove the user session to logout the user
const logout = () => {
  signOut(auth);
};

export {
  auth,
  db,
  loginWithGooglePopup,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
  logout,
};
