import React, { useState, useEffect } from 'react';
import { createClient, updateClient } from '../services/api';

const ClientForm = ({ initialData, onSubmit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIsEditMode(true);
      setNome(initialData.nome || '');
      setTelefone(initialData.telefone || '');
      setEmail(initialData.email || '');
      setEndereco(initialData.endereco || '');
    } else {
      setIsEditMode(false);
      setNome('');
      setTelefone('');
      setEmail('');
      setEndereco('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!nome || !telefone) {
      setError('Nome e Telefone são obrigatórios.');
      setLoading(false);
      return;
    }
    if (email && !/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError('Formato de email inválido.');
      setLoading(false);
      return;
    }

    const clientData = {
      nome,
      telefone,
      email,
      endereco,
    };

    try {
      if (isEditMode && initialData && initialData.id) {
        await updateClient(initialData.id, clientData);
      } else {
        await createClient(clientData);
      }
      onSubmit();
    } catch (err) {
      setError('Erro ao salvar cliente.');
      console.error('Failed to save client:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">{isEditMode ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h4>
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
          <label htmlFor="telefone" className="form-label">Telefone</label>
          <input
            type="text"
            className="form-control"
            id="telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email (Opcional)</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endereco" className="form-label">Endereço (Opcional)</label>
          <input
            type="text"
            className="form-control"
            id="endereco"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />
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

export default ClientForm;
