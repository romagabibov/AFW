import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    const docSnap = await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Success!");
  } catch (err) {
    console.error("Error connecting to db:", err);
  }
}
test();
