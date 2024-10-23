import axios from "axios";
import {API_URL} from "@env";

console.log(API_URL);

export const userLogin = async (email: string, password: string) => {
  console.log(email, password);
  const response = await axios.post(`${API_URL}/auth/login`, {
    email: email,
    password: password,
  });
  console.log(response.data);
  if (response.data.token && response.data.user) {
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
