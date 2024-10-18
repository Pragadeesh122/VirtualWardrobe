import express from "express";
import z from "zod";
import admin from "firebase-admin";
import {ServiceAccount} from "firebase-admin";
import serviceAccount from "../firebaseKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    Message: "Server is running ",
  });
});

app.get("/test-firebase", async (req, res) => {
  try {
    const defaultAuth = admin.auth();
    const userRecord = await defaultAuth.createUser({
      email: "test@example.com",
      password: "secretPassword",
    });
    res.json({message: "Firebase Admin is working", userId: userRecord.uid});
  } catch (error) {
    console.error("Error testing Firebase:", error);
    res.status(500).json({error: "Firebase Admin test failed"});
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
