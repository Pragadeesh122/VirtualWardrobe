import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserProfile} from "@/types/auth";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import {API_URL} from "@/app/utils/API_url";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (
    token: string,
    user: UserProfile,
    refreshToken: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  isLoading: true,
  isAuthenticated: false,
});

const STORAGE_KEYS = {
  TOKEN: "userToken",
  USER: "user",
  REFRESH_TOKEN: "refreshToken",
} as const;

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = useCallback((token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log("token", token);
      console.log("decodedToken", decodedToken);
      const currentTime = Date.now() / 1000;
      console.log(decodedToken.exp, currentTime);
      return decodedToken.exp < currentTime;
    } catch {
      return true;
    }
  }, []);

  if (isTokenExpired(token!)) {
    try {
      async function refreshTokenFn() {
        const storedRefreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: storedRefreshToken,
        });
        console.log("New Token", response.data);
      }
      refreshTokenFn();
    } catch (error) {
      console.error("Failed to refresh token:", error);
    }
  }

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUser, storedRefreshToken] = await Promise.all(
          [
            AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
            AsyncStorage.getItem(STORAGE_KEYS.USER),
            AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
          ]
        );

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load auth info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = useCallback(
    async (newToken: string, newUser: UserProfile, refreshToken: string) => {
      try {
        const storagePromises = [
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken),
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
        ];

        await Promise.all(storagePromises);

        setToken(newToken);
        setUser(newUser);
      } catch (error) {
        console.error("Failed to save auth info:", error);
        throw new Error("Failed to login");
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const storagePromises = [
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      ];

      await Promise.all(storagePromises);

      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Failed to remove auth info:", error);
      throw new Error("Failed to logout");
    }
  }, []);

  const contextValue = {
    user,
    token,
    login,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("The user is not authenticated! Please login.");
  }
  return context;
};

export {AuthContext};
