import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { authService } from '../api/authService';
import { jwtDecode } from 'jwt-decode'; // Добавьте эту зависимость

interface AuthContextType {
  token: string | null;
  userId: number | null; // Добавлено
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

interface JwtPayload {
  sub: string;
  userId: number; // Предполагаемая структура JWT
  // другие возможные поля
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // Добавлено

  // Извлечение данных из токена
  const parseToken = (token: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        token,
        userId: decoded.userId
      };
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const parsed = parseToken(storedToken);
      if (parsed) {
        setToken(parsed.token);
        setUserId(parsed.userId);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await authService.login({ username, password });
    const parsed = parseToken(response.data.token);
    if (!parsed) throw new Error('Invalid token received');
    
    localStorage.setItem('token', response.data.token);
    setToken(parsed.token);
    setUserId(parsed.userId);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserId(null); // Добавлено
  };

  return (
    <AuthContext.Provider value={{ token, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);