import React, { useState, useEffect } from 'react';
import { createService, updateService } from '../services/api';

const ServiceForm = ({ initialData, onSubmit, onCancel }) => {
  const [nome, setNome] = useState('');
  const [duracao, setDuracao] = useState('');
  const [valor, setValor] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setDuracao(initialData.duracao || '');
      setValor(initialData.valor || '');
    } else {
      setNome('');
      setDuracao('');
      setValor('');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic validation
    if (!nome || !duracao || !valor) {
      setError('Todos os campos são obrigatórios.');
      setLoading(false);
      return;
    }
    if (isNaN(duracao) || duracao <= 0) {
      setError('Duração deve ser um número positivo.');
      setLoading(false);
      return;
    }
    if (isNaN(valor) || valor <= 0) {
      setError('Valor deve ser um número positivo.');
      setLoading(false);
      return;
    }

    const serviceData = {
      nome,
      duracao: parseInt(duracao, 10),
      valor: parseFloat(valor),
    };

    try {
      if (initialData && initialData.id) {
        await updateService(initialData.id, serviceData);
      } else {
        await createService(serviceData);
      }
      onSubmit();
    } catch (err) {
      setError('Erro ao salvar serviço.');
      console.error('Failed to save service:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h4 className="mb-3">{initialData ? 'Editar Serviço' : 'Adicionar Novo Serviço'}</h4>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label">Nome do Serviço</label>
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
          <label htmlFor="duracao" className="form-label">Duração (minutos)</label>
          <input
            type="number"
            className="form-control"
            id="duracao"
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="valor" className="form-label">Valor (R$)</label>
          <input
            type="number"
            className="form-control"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            step="0.01"
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

export default ServiceForm;
