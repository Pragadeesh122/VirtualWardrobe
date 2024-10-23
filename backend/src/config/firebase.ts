import admin from "firebase-admin";
import {ServiceAccount} from "firebase-admin";
import serviceAccount from "../../firebaseKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

export const auth = admin.auth();
export const db = admin.firestore();
