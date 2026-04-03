import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaces basadas en los esquemas de FastAPI
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  activo: boolean;
}

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

  // Hidratar la sesión si hay un token al cargar la app
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const userData: AuthUser = await response.json();
          setUser(userData);
        } else {
          logout(); // Token expirado o inválido
        }
      } catch (error) {
        console.error("Error validando sesión:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
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
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, loginSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};