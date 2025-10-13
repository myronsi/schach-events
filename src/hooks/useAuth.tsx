import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuthStatus = () => {
    const savedUsername = localStorage.getItem('loggedInUser');
    if (savedUsername) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    } else {
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const login = (username: string) => {
    localStorage.setItem('loggedInUser', username);
    localStorage.setItem('loginTimestamp', new Date().toISOString());
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loginTimestamp');
    setIsAuthenticated(false);
    setUsername(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      username,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};