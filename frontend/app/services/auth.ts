import axios from "axios";

import {UserProfile} from "@/types/auth";
import {API_URL} from "../utils/API_url";

export const userLogin = async (
  email: string,
  password: string,
  loginFn: (
    token: string,
    user: UserProfile,
    refreshToken: string
  ) => Promise<void>
) => {
  try {
    console.log("Attempting login with URL:", API_URL);
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: email,
      password: password,
    });
    console.log("Login response:", response.data);

    if (response.data.token && response.data.user) {
      await loginFn(
        response.data.token,
        response.data.user,
        response.data.refreshToken
      );
      return true;
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Error:", error.response?.data);
      console.error("API Status:", error.response?.status);
    }
    throw new Error("Failed to login");
  }
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
