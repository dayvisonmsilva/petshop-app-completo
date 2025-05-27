import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../services/api';

const EmployeeForm = ({ initialData, onSubmit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('Funcionario');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIsEditMode(true);
      setNome(initialData.nome || '');
      setEmail(initialData.email || '');
      setTipoUsuario(initialData.tipoUsuario || 'Funcionario');
      setSenha(''); 
    } else {
      setIsEditMode(false);
      setNome('');
      setEmail('');
      setSenha('');
      setTipoUsuario('Funcionario');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!nome || !email || (!isEditMode && !senha) || !tipoUsuario) {
      setError('Todos os campos obrigatórios (exceto senha na edição, se não for alterar).');
      setLoading(false);
      return;
    }
    if (!/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError('Formato de email inválido.');
      setLoading(false);
      return;
    }

    const userData = {
      nome,
      email,
      tipoUsuario,
    };
    if (senha) {
      userData.senha = senha;
    }

    try {
      if (isEditMode && initialData && initialData.id) {
        await updateUser(initialData.id, userData);
      } else {
        await createUser(userData);
      }
      onSubmit();
    } catch (err) {
      setError('Erro ao salvar funcionário.');
      console.error('Failed to save employee:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">{isEditMode ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</h4>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome Completo</label>
          <input
            type="text"
            className="form-control"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="senha" className="form-label">Senha {isEditMode && '(deixe em branco para não alterar)'}</label>
          <input
            type="password"
            className="form-control"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required={!isEditMode}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tipoUsuario" className="form-label">Tipo de Usuário</label>
          <select
            className="form-select"
            id="tipoUsuario"
            value={tipoUsuario}
            onChange={(e) => setTipoUsuario(e.target.value)}
            required
          >
            <option value="Funcionario">Funcionário</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>
        <div className="d-flex justify-content-end">
          <button type="button" className="btn btn-secondary me-2" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
