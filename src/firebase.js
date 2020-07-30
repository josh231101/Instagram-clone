import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBn6eZGBCzABchOa7x58pC5lOdiczEEs64",
    authDomain: "instagram-clone-fb6a4.firebaseapp.com",
    databaseURL: "https://instagram-clone-fb6a4.firebaseio.com",
    projectId: "instagram-clone-fb6a4",
    storageBucket: "instagram-clone-fb6a4.appspot.com",
    messagingSenderId: "919477923797",
    appId: "1:919477923797:web:70b89754371038d812d75c",
    measurementId: "G-EX9D64REZ9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};