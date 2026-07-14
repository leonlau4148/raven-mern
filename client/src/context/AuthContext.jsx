import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

// Context is React's built-in way to share state down the widget tree
// without passing props through every level — the same problem
// BlocProvider/Cubit solves in your Flutter apps.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lazy initializer: on first render, restore the session from
  // localStorage (the browser's SharedPreferences equivalent).
  // This is why a page refresh doesn't log you out.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user); // triggers re-render everywhere user is consumed
  };

  // These are your Cubit methods. Errors are NOT caught here on
  // purpose — the calling page catches them and shows the message.
  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveSession(data);
  };

  const register = async (username, email, password) => {
    const { data } = await api.post('/auth/register', {
      username,
      email,
      password,
    });
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook so pages can write: const { user, login } = useAuth();
// — the context.read<AuthCubit>() equivalent.
export const useAuth = () => useContext(AuthContext);
