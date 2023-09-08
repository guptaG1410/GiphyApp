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
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGEING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
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
