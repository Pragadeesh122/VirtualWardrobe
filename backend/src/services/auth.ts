import {auth, db} from "../config/firebase";
import {
  RegisterData,
  LoginCredentials,
  RegisterResponse,
  LoginResponse,
} from "../types/auth";
import dotenv from "dotenv";

dotenv.config();

export const authService = {
  async register(data: RegisterData): Promise<RegisterResponse> {
    // Create user in Firebase Authentication
    const userExists = await db
      .collection("userProfiles")
      .doc(data.email)
      .get();

    if (userExists.exists) {
      throw new Error("User already exists");
    }
    const userRecord = await auth.createUser({
      email: data.email,
      password: data.password,
      displayName: data.userName,
    });

    // Create user document in Firestore
    await db.collection("userProfiles").doc(userRecord.uid).set({
      email: data.email,
      userName: data.userName,
      createdAt: new Date(),
    });

    return {
      success: true,
    };
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const authResult = await signInWithPassword(
        credentials.email,
        credentials.password
      );

      const userProfile = await db
        .collection("userProfiles")
        .doc(authResult.localId)
        .get();

      if (!userProfile.exists) {
        throw new Error("User profile not found");
      }

      const userData = userProfile.data();
      console.log("Login Response here");
      console.log(authResult);

      return {
        token: authResult.idToken,
        refreshToken: authResult.refreshToken,
        user: {
          userName: userData?.userName,
          email: userData?.email,
          uid: authResult.localId,
        },
      };
    } catch (error) {
      throw new Error(
        `Authentication failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();


      const decodedToken = await auth.verifyIdToken(data.id_token);
      const userProfile = await db
        .collection("userProfiles")
        .doc(decodedToken.uid)
        .get();

      if (!userProfile.exists) {
        throw new Error("User profile not found");
      }

      const userData = userProfile.data();

      return {
        token: data.id_token,
        refreshToken: data.refresh_token,
        user: {
          userName: userData?.userName,
          email: userData?.email,
          uid: decodedToken.uid,
        },
      };
    } catch (error) {
      throw new Error(
        `Token refresh failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  },
};

async function signInWithPassword(
  email: string,
  password: string
): Promise<{idToken: string; localId: string; refreshToken: string}> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  const data = await response.json();
  return data;
}
