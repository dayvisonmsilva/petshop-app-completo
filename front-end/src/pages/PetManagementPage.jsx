import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPetsByClientId, deletePet, getClientById } from '../services/api';
import PetsTable from '../components/PetsTable';
import PetForm from '../components/PetForm';

const PetManagementPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [clientName, setClientName] = useState('Cliente');
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('PetManagementPage: Component Mounted. Client ID from URL params:', clientId);
    const fetchPetsAndClient = async () => {
      setLoading(true);
      setError(null);
      try {
        if (clientId) {
          const clientData = await getClientById(clientId);
          if (clientData && clientData.nome) {
            setClientName(clientData.nome);
            console.log('PetManagementPage: Fetched client name:', clientData.nome);
          } else {
            setClientName('Cliente [ID: ' + clientId + ']');
            console.warn('PetManagementPage: Client data not found for ID:', clientId);
          }
          const petsData = await getPetsByClientId(clientId);
          setPets(petsData);
        } else {
          setError('ID do cliente não fornecido na URL para gerenciamento de pets.');
          console.error('PetManagementPage: Client ID is null or undefined.');
        }
    } catch (err) {
        setError('Erro ao carregar pets ou dados do cliente (WIP).');
        console.error('Failed to fetch pets or client data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPetsAndClient();
  }, [clientId]);

  const handleAddPetClick = () => {
    setEditingPet(null);
    setShowForm(true);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setShowForm(true);
  };

  const handleDeletePet = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pet?')) {
      try {
        await deletePet(id);
        fetchPetsAndClient();
      } catch (err) {
        setError('Erro ao excluir pet (WIP).');
        console.error('Failed to delete pet:', err);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchPetsAndClient();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPet(null);
  };

  return (
    <div className="pet-management-page">
      <h1 className="mb-4">Gerenciamento de Pets de {clientName} (WIP)</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando pets (WIP)...</div>}

      {!showForm && (
        <div className="mb-4">
          <button className="btn btn-primary me-2" onClick={handleAddPetClick}>
            <i className="bi bi-plus-circle me-2"></i>Adicionar Pet
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/clients')}>
            Voltar para Clientes
          </button>
        </div>
      )}

      {showForm ? (
        <PetForm
          initialData={editingPet}
          clientId={clientId}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <PetsTable
          pets={pets}
          onEdit={handleEditPet}
          onDelete={handleDeletePet}
        />
      )}
    </div>
  );
};

export default PetManagementPage;
