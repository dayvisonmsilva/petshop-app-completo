import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ServiceManagementPage from './pages/ServiceManagementPage';
import EmployeeManagementPage from './pages/EmployeeManagementPage';
import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import ViewServicesPage from './pages/ViewServicesPage';
import ClientManagementPage from './pages/ClientManagementPage';
import PetManagementPage from './pages/PetManagementPage';
import NewAppointmentPage from './pages/NewAppointmentPage';
import AppointmentHistoryPage from './pages/AppointmentHistoryPage';
import AuthRedirector from './components/AuthRedirector';
import { AuthProvider, useAuth } from './context/AuthContext';
import SidebarNavigation from './components/SidebarNavigation';
import './index.css';

// Componente de Layout Principal
const MainLayout = () => {
  console.log('MainLayout: Rendering');
  return (
    <div className="d-flex vh-100">
      <SidebarNavigation />
      <main className="flex-grow-1 p-4 overflow-auto bg-light">
        <Outlet /> {}
      </main>
    </div>
  );
};

// Rota Protegida
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute: User state in ProtectedRoute:', user);
    console.log('ProtectedRoute: Current path:', location.pathname);
    if (!user) {
      console.log('ProtectedRoute: No user found, redirecting to /login');
    } else if (allowedRoles && user && !allowedRoles.includes(user.tipoUsuario)) {
      console.log('ProtectedRoute: User role', user.tipoUsuario, 'not in allowed roles', allowedRoles, ', redirecting to /login');
    } else {
      console.log('ProtectedRoute: User is authorized, rendering children');
    }
  }, [user, allowedRoles, location.pathname]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipoUsuario)) {
    // If user is logged in but not allowed for this route, redirect to their default dashboard
    if (user.tipoUsuario === 'Administrador') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.tipoUsuario === 'Funcionario') {
      return <Navigate to="/employee-dashboard" replace />;
    }
    return <Navigate to="/login" replace />; // Fallback
  }

  return children;
};

function App() {
  // const { user } = useAuth(); // Removed this line

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Main Redirect after successful login or if root path is accessed */}
          {/* This route uses AuthRedirector to ensure useAuth() is called within AuthProvider's scope */}
          <Route path="/" element={<AuthRedirector />} />

          {/* Parent Route for MainLayout and Protected Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['Administrador', 'Funcionario']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin Dashboard Page (Admin only) */}
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Administrador']}><AdminDashboardPage /></ProtectedRoute>} />
            
            {/* Employee Dashboard Page (Employee only) */}
            <Route path="/employee-dashboard" element={<ProtectedRoute allowedRoles={['Funcionario']}><EmployeeDashboardPage /></ProtectedRoute>} />
            
            {/* Rotas protegidas para Gerenciamento de Serviços (Admin only) */}
            <Route path="/services" element={<ProtectedRoute allowedRoles={['Administrador']}><ServiceManagementPage /></ProtectedRoute>} />

            {/* Rotas protegidas para Gerenciamento de Funcionários (Admin only) */}
            <Route path="/employees" element={<ProtectedRoute allowedRoles={['Administrador']}><EmployeeManagementPage /></ProtectedRoute>} />
            
            {/* Rotas para funcionários (Funcionario or Admin to view services) */}
            <Route path="/view-services" element={<ProtectedRoute allowedRoles={['Funcionario', 'Administrador']}><ViewServicesPage /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute allowedRoles={['Funcionario']}><ClientManagementPage /></ProtectedRoute>} />
            <Route path="/clients/:clientId/pets" element={<ProtectedRoute allowedRoles={['Funcionario']}><PetManagementPage /></ProtectedRoute>} />

            {/* Rotas para Agendamentos (Funcionario only) */}
            <Route path="/appointments/new" element={<ProtectedRoute allowedRoles={['Funcionario']}><NewAppointmentPage /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute allowedRoles={['Funcionario']}><AppointmentHistoryPage /></ProtectedRoute>} />
          </Route>

          {/* Fallback to /login for any unmatched routes if not already handled by parent redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
