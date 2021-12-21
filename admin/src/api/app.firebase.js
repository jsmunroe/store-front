// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC3eMK7dtuWsyeNrBDvz5fNjqWM_4axCfI",
    authDomain: "munroesoft-store-front.firebaseapp.com",
    projectId: "munroesoft-store-front",
    storageBucket: "munroesoft-store-front.appspot.com",
    messagingSenderId: "143491798521",
    appId: "1:143491798521:web:e2b32dc3328e9b5df41928",
    measurementId: "G-K4EM50053Z"
  };

console.log('Firebase app initialized.');

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;