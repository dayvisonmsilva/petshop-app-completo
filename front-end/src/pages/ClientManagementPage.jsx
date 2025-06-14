import React, { useState, useEffect } from 'react';
import { getClients, deleteClient, getPetsByClientId } from '../services/api';
import ClientsTable from '../components/ClientsTable';
import ClientForm from '../components/ClientForm';

const ClientManagementPage = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClients();
      // Para cada cliente, buscar o número de pets
      const clientsWithPets = await Promise.all(
        data.map(async (client) => {
          try {
            const pets = await getPetsByClientId(client.id);
            return { ...client, numPets: pets.length };
          } catch (e) {
            return { ...client, numPets: 0 };
          }
        })
      );
      setClients(clientsWithPets);
    } catch (err) {
      setError('Erro ao carregar clientes.');
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClientClick = () => {
    setEditingClient(null); 
    setShowForm(true);
  };

  const handleEditClient = (client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient(id);
        fetchClients(); 
      } catch (err) {
        setError('Erro ao excluir cliente.');
        console.error('Failed to delete client:', err);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false); 
    fetchClients(); 
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingClient(null);
  };

  return (
    <div className="client-management-page">
      <h1 className="mb-4">Gerenciamento de Clientes</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando clientes...</div>}

      {!showForm && (
        <div className="mb-4">
          <button className="btn btn-primary" onClick={handleAddClientClick}>
            <i className="bi bi-person-plus me-2"></i>Adicionar Novo Cliente
          </button>
        </div>
      )}

      {showForm ? (
        <ClientForm
          initialData={editingClient}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <ClientsTable
          clients={clients}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
        />
      )}
    </div>
  );
};

export default ClientManagementPage;
