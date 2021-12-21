import * as fs from "firebase/firestore";
import * as fbAuth from "firebase/auth";
import "./app.firebase";

const auth = fbAuth.getAuth();
const db = fs.getFirestore();

/* AUTH */
export function onAuthStateChanged(onNext) {
    return fbAuth.onAuthStateChanged(auth, onNext);
}

export async function signInWithEmailAndPassword(email, password) {
    return await fbAuth.signInWithEmailAndPassword(auth, email, password);
}

export async function signOut() {
    return await fbAuth.signOut(auth);
}

/* FIRESTORE */
export function path() {
    if (arguments.length === 1 && typeof arguments[0] === "string") {
        return [arguments[0]];
    }

    return Array.from(arguments);
}

export async function getDoc(path) {
    return await fs.getDoc(fs.doc(db, ...path));
}

export async function getCollection(path) {
    return await fs.getDocs(fs.collection(db, ...path))
}

export async function readDoc(path) {
    return read(await getDoc(path));
}

export async function readCollection(path) {
    return readAll(await getCollection(path));
}

export async function setDoc(path, data, options) {
    return await fs.setDoc(fs.doc(db, ...path), data, options);
}

export async function addDoc(path, data) {
    const ref = await fs.addDoc(fs.collection(db, ...path), data);

    return ref.id;
}

export async function deleteDoc(path) {
    await fs.deleteDoc(fs.doc(db, ...path));
}


export function exists(snapshot) {
    return snapshot.exists();
}

// Read the data from a firebase document and append the id.
export function read(snapshot) {
    return {...snapshot.data(), id: snapshot.id};
}

export function readAll(snapshot) {
    let elements = [];
    snapshot.forEach(doc => {
        elements = [...elements, read(doc)];
    });
    return elements;
}