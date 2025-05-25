import React, { createContext, useContext, useState } from 'react';

// Contexto de Autenticação
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        console.log('AuthContext: User loaded from localStorage');
        return JSON.parse(storedUser);
      }
      console.log('AuthContext: No user found in localStorage');
      return null;
    } catch (error) {
      console.error("AuthContext: Failed to parse user from localStorage", error);
      return null;
    }
  });

  const login = (userData) => {
    console.log('AuthContext: User logged in', userData.tipoUsuario);
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthContext: User logged out');
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
