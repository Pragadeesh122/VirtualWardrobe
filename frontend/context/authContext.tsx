import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {UserProfile} from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => Promise<void>;
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
} as const;

export const AuthProvider: React.FC<React.PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth state - useEffect at the top after state declarations
  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedToken, storedUser] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.USER),
        ]);

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

  const login = useCallback(async (newToken: string, newUser: UserProfile) => {
    try {
      const storagePromises = [
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)),
      ];

      await Promise.all(storagePromises);

      setToken(newToken);
      setUser(newUser);
    } catch (error) {
      console.error("Failed to save auth info:", error);
      throw new Error("Failed to login");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const storagePromises = [
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER),
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
