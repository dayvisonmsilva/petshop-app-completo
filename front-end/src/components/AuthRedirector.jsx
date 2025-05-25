import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirector = () => {
  const { user } = useAuth();

  useEffect(() => {
    console.log('AuthRedirector: User state for initial redirect:', user);
  }, [user]);

  if (user) {
    if (user.tipoUsuario === 'Administrador') {
      console.log('AuthRedirector: Redirecting to /admin-dashboard');
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.tipoUsuario === 'Funcionario') {
      console.log('AuthRedirector: Redirecting to /employee-dashboard');
      return <Navigate to="/employee-dashboard" replace />;
    }
  }
  console.log('AuthRedirector: No user or invalid role, redirecting to /login');
  return <Navigate to="/login" replace />;
};

export default AuthRedirector;
