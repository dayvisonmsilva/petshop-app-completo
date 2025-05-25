import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getServices, deleteService } from '../services/api';
import ServicesTable from '../components/ServicesTable';
import ServiceForm from '../components/ServiceForm';

const ServiceManagementPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError('Erro ao carregar serviços.');
      console.error('Failed to fetch services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddServiceClick = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDeleteService = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        setError('Erro ao excluir serviço.');
        console.error('Failed to delete service:', err);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchServices();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="service-management-page">
      <h1 className="mb-4">Gerenciamento de Serviços</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando serviços...</div>}

      {!showForm && (
        <div className="mb-4">
          <button className="btn btn-primary" onClick={handleAddServiceClick}>
            <i className="bi bi-plus-circle me-2"></i>Adicionar Novo Serviço
          </button>
        </div>
      )}

      {showForm ? (
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <ServicesTable
          services={services}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      )}
    </div>
  );
};

export default ServiceManagementPage;
