import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SidebarNavigation = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="d-flex flex-column h-100 bg-dark text-white p-3">
      <div className="text-center mb-4">
        <h4 className="fw-bold">PetShop Management System</h4>
        {user && <p className="small text-muted">Painel do {user.tipoUsuario}</p>}
      </div>
      <ul className="nav flex-column flex-grow-1">
        <li className="nav-item mb-2">
          {user && user.tipoUsuario === 'Administrador' ? (
            <NavLink to="/admin-dashboard" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
              <i className="bi bi-house-door me-2"></i>Dashboard
            </NavLink>
          ) : (
            <NavLink to="/employee-dashboard" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
              <i className="bi bi-house-door me-2"></i>Meu Dashboard
            </NavLink>
          )}
        </li>
        {user && user.tipoUsuario === 'Administrador' && (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/services" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
                <i className="bi bi-tools me-2"></i>Gerenciamento de Serviços
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/employees" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
                <i className="bi bi-people me-2"></i>Gerenciamento de Funcionários
              </NavLink>
            </li>
          </>
        )}
        {user && user.tipoUsuario === 'Funcionario' && (
          <>
            <li className="nav-item mb-2">
              <NavLink to="/view-services" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
                <i className="bi bi-card-list me-2"></i>Ver Serviços
              </NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/clients" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
                <i className="bi bi-person-lines-fill me-2"></i>Gerenciamento de Clientes (WIP)
              </NavLink>
            </li>
            {/* os Pets são gerenciados a partir da pagina de clientes */}
            <li className="nav-item mb-2">
              <NavLink to="/appointments" className={({ isActive }) => "nav-link text-white" + (isActive ? " bg-primary rounded" : "")}>
                <i className="bi bi-calendar-check me-2"></i>Agendamentos (WIP)
              </NavLink>
            </li>
          </>
        )}
      </ul>
      <div className="mt-auto">
        <button onClick={handleLogout} className="btn btn-outline-light w-100">
          <i className="bi bi-box-arrow-right me-2"></i>Logout
        </button>
      </div>
    </nav>
  );
};

export default SidebarNavigation;
