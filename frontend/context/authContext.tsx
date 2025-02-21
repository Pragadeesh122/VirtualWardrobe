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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isTokenExpired = useCallback((token: string) => {
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      // Add a 5-minute buffer to refresh the token before it actually expires
      return decodedToken.exp - currentTime < 300; // 5 minutes in seconds
    } catch {
      return true;
    }
  }, []);

  const refreshTokenFn = useCallback(async () => {
    try {
      let currentRefreshToken = refreshToken;

      // If no refresh token in state, try to get it from storage
      if (!currentRefreshToken) {
        currentRefreshToken = await AsyncStorage.getItem(
          STORAGE_KEYS.REFRESH_TOKEN
        );
      }

      if (!currentRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      });

      const {
        token: newToken,
        refreshToken: newRefreshToken,
        user: userData,
      } = response.data;

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
      ]);

      setToken(newToken);
      setRefreshToken(newRefreshToken);
      setUser(userData);

      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // If refresh fails, log the user out
      await logout();
      throw error;
    }
  }, [refreshToken]);

  // Check token expiration and refresh if needed
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const checkAndRefreshToken = async () => {
      if (token && isTokenExpired(token)) {
        try {
          await refreshTokenFn();
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
    };

    if (token) {
      // Check immediately
      checkAndRefreshToken();
      // Then set up interval to check every minute
      refreshInterval = setInterval(checkAndRefreshToken, 60000);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [token, isTokenExpired, refreshTokenFn]);

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

        if (storedToken && storedUser && storedRefreshToken) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setRefreshToken(storedRefreshToken);
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
    async (newToken: string, newUser: UserProfile, newRefreshToken: string) => {
      try {
        const storagePromises = [
          AsyncStorage.setItem(STORAGE_KEYS.TOKEN, newToken),
          AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser)),
          AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken),
        ];

        await Promise.all(storagePromises);

        setToken(newToken);
        setUser(newUser);
        setRefreshToken(newRefreshToken);
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
      setRefreshToken(null);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export {AuthContext};
