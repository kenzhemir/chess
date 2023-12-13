// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    doc,
    getDoc,
    getFirestore,
    onSnapshot,
    setDoc,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXJTenRrTzeT3c_QRK9XwH7al-h2gPGtc",
  authDomain: "chess-1cffa.firebaseapp.com",
  projectId: "chess-1cffa",
  storageBucket: "chess-1cffa.appspot.com",
  messagingSenderId: "860488065630",
  appId: "1:860488065630:web:4b01dee43896f521658acf",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export function onGameSnapshot(gameId, cb) {
  const gameRef = doc(db, "games", gameId);
  return onSnapshot(gameRef, (snapshot) => {
    cb(snapshot.data());
  });
}

export async function pushMoveToFirebase(gameId, move) {
  const gameRef = doc(db, "games", gameId);
  const game = await getDoc(gameRef);
  setDoc(
    gameRef,
    { moves: `${game.data().moves ?? ""} ${move}` },
    { merge: true }
  );
}

export async function pushMessageToFirebase(gameId, message) {
  const gameRef = doc(db, "games", gameId);
  const game = await getDoc(gameRef);
  const prevMessages = game.data()?.messages ?? [];
  setDoc(gameRef, { messages: [...prevMessages, message] }, { merge: true });
}
