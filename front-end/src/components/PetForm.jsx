import React, { useState, useEffect } from 'react';
import { createPet, updatePet } from '../services/api';

const PetForm = ({ initialData, clientId, onSubmit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [raca, setRaca] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setIsEditMode(true);
      setNome(initialData.nome || '');
      setIdade(initialData.idade || '');
      setRaca(initialData.raca || '');
    } else {
      setIsEditMode(false);
      setNome('');
      setIdade('');
      setRaca('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!nome || !idade || !raca) {
      setError('Todos os campos (Nome, Idade, Raça) são obrigatórios.');
      setLoading(false);
      return;
    }
    if (isNaN(idade) || idade < 0) {
      setError('Idade deve ser um número não negativo.');
      setLoading(false);
      return;
    }

    const petData = {
      nome,
      idade: parseInt(idade, 10),
      raca,
      clienteId: clientId,
    };

    try {
      if (isEditMode && initialData && initialData.id) {
        await updatePet(initialData.id, petData);
      } else {
        await createPet(petData);
      }
      onSubmit();
    } catch (err) {
      setError('Erro ao salvar pet.');
      console.error('Failed to save pet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">{isEditMode ? 'Editar Pet' : 'Adicionar Novo Pet'}</h4>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome do Pet</label>
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
          <label htmlFor="idade" className="form-label">Idade</label>
          <input
            type="number"
            className="form-control"
            id="idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="raca" className="form-label">Raça</label>
          <input
            type="text"
            className="form-control"
            id="raca"
            value={raca}
            onChange={(e) => setRaca(e.target.value)}
            required
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

export default PetForm;
