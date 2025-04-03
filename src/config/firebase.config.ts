import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBFW_VV3K4cb2_zNrqE2x_xtaDqSj3bD84",
  authDomain: "tienda-de-jersey.firebaseapp.com",
  projectId: "tienda-de-jersey",
  storageBucket: "tienda-de-jersey.firebasestorage.app",
  messagingSenderId: "476701240965",
  appId: "1:476701240965:web:87eee6ddb139e4db3383ec"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
