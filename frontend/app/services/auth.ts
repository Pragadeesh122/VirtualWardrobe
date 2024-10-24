import axios from "axios";
import {Platform} from "react-native";
import {useAuth} from "@/context/authContext";
import {UserProfile} from "@/types/auth";

const API_URL =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_ANDROID_API_URL
    : process.env.EXPO_PUBLIC_IOS_API_URL;

export const userLogin = async (
  email: string,
  password: string,
  loginFn: (token: string, user: UserProfile) => Promise<void>
) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: email,
    password: password,
  });
  if (response.data.token && response.data.user) {
    await loginFn(response.data.token, response.data.user);
    return true;
  }
  throw new Error("Failed to login");
};

export const userRegister = async (
  userName: string,
  email: string,
  password: string
) => {
  const response = await axios.post(`${API_URL}/auth/register`, {
    userName: userName,
    email: email,
    password: password,
  });

  console.log(response.data);

  if (response.data.success) {
    return response.data;
  }
  throw new Error("Failed to register");
};
