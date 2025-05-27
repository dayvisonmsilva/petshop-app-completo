import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100 align-items-center justify-content-start py-5" style={{ background: 'linear-gradient(to bottom, #e0f2f7, #ffffff)' }}>
      {/* Top Section: Logo and Title */}
      <div className="text-center mb-5 mt-4">
        <img src="/public/vite.svg" alt="PetShop Logo" className="me-2" style={{ width: '40px', height: '40px' }} /> {/* Placeholder for a simple paw/pet icon */}
        <h1 className="d-inline-block fs-3 fw-bold text-dark">PetShop Management System</h1>
      </div>

      {/* Login Form Section */}
      <div className="card shadow-lg p-4 p-md-5" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
        <LoginForm />
      </div>

      {/* Footer Section */}
      <footer className="mt-auto text-center small text-muted py-3">
        &copy; {new Date().getFullYear()} PetShop Management System Inc. All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
