import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from "../types/auth";
import { getMe } from "../services/authService";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSession: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hidratar la sesión si hay un token al cargar la app
    const hydrateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getMe(token);
        setUser(userData);
      } catch (error) {
        console.error("Token inválido:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    hydrateSession();
  }, [token]);

  const loginSession = (newToken: string, userData: AuthUser) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        loginSession,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};