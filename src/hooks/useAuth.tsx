import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { validateCredentials } from '@/lib/users';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => void;
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
    const savedPassword = localStorage.getItem('loggedInPassword');
    if (savedUsername && savedPassword && validateCredentials(savedUsername, savedPassword)) {
      setIsAuthenticated(true);
      setUsername(savedUsername);
    } else {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInPassword');
      localStorage.removeItem('loginTimestamp');
      setIsAuthenticated(false);
      setUsername(null);
    }
  };

  const login = (username: string, password: string) => {
    localStorage.setItem('loggedInUser', username);
    localStorage.setItem('loggedInPassword', password);
    localStorage.setItem('loginTimestamp', new Date().toISOString());
    setIsAuthenticated(true);
    setUsername(username);
  };

  const logout = () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loggedInPassword');
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