import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        login(result.user); // Armazena o usuário no contexto
        if (result.user.tipoUsuario === 'Administrador') {
          navigate('/admin-dashboard');
        } else if (result.user.tipoUsuario === 'Funcionario') {
          navigate('/employee-dashboard');
        } else {
          navigate('/login'); // Fallback
        }
      } else {
        setError(result.message || 'Credenciais inválidas. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.');
      console.error('Login error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-0">
      <h2 className="fs-3 fw-bold text-dark mb-2">Access your Account</h2>
      <p className="text-muted mb-4">Access the PetShop management panel.</p>

      {error && <div className="alert alert-danger mb-4" role="alert">{error}</div>}

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          className="form-control form-control-lg" style={{borderRadius: '8px'}}
          placeholder="yourmail@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <div className="input-group mb-0">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="form-control form-control-lg" style={{borderRight: 'none', borderRadius: '8px 0 0 8px'}}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary border-start-0" style={{borderRadius: '0 8px 8px 0'}}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="form-check d-flex align-items-center ps-0">
          <input
            type="checkbox"
            className="form-check-input me-2" style={{margin: '0', float: 'none'}}
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label className="form-check-label text-muted small" htmlFor="rememberMe">Remember Me</label>
        </div>
        <a href="#" className="text-decoration-none text-primary fw-bold small">
          Forgot your password?
        </a>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center" style={{borderRadius: '8px', padding: '12px 0'}}
      >
        <span className="me-2">→</span> Sign In
      </button>
    </form>
  );
};

export default LoginForm;
