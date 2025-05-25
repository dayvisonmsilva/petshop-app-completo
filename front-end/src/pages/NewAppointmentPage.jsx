import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { getClients, getPetsByClientId, getServices, createAppointment, getAppointmentById, updateAppointment } from '../services/api'; // Import getAppointmentById and updateAppointment

const NewAppointmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId } = useParams();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  // const [professionals, setProfessionals] = useState([]); // If API supports it
  // const [selectedProfessional, setSelectedProfessional] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      if (appointmentId) {
        setIsEditMode(true);
        setError(null);
        try {
          const appointmentData = await getAppointmentById(appointmentId);
          if (appointmentData) {
            setSelectedClient(appointmentData.clientId || '');
            setSelectedPet(appointmentData.petId || '');
            setSelectedService(appointmentData.serviceId || '');
            setAppointmentDate(appointmentData.date || '');
            setAppointmentTime(appointmentData.time || '');

            if (appointmentData.clientId) {
              const petsData = await getPetsByClientId(appointmentData.clientId);
              setPets(petsData);
            }
          }
        } catch (err) {
          setError('Erro ao carregar dados do agendamento para edição (WIP).');
          console.error('Failed to fetch appointment for edit:', err);
        }
      }
    };

    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const clientsData = await getClients();
        setClients(clientsData);

        const servicesData = await getServices();
        setServices(servicesData);

        if (location.state && location.state.clientId) {
          setSelectedClient(location.state.clientId);
          const petsData = await getPetsByClientId(location.state.clientId);
          setPets(petsData);
        }

        await fetchAppointmentData();

      } catch (err) {
        setError('Erro ao carregar dados iniciais (clientes, serviços) (WIP).');
        console.error('Failed to fetch initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [appointmentId, location.state]);

  useEffect(() => {
    const fetchPets = async () => {
      if (selectedClient && !isEditMode) { 
        setLoading(true);
        setError(null);
        try {
          const petsData = await getPetsByClientId(selectedClient);
          setPets(petsData);
          setSelectedPet('');
        } catch (err) {
          setError('Erro ao carregar pets para o cliente selecionado (WIP).');
          console.error('Failed to fetch pets by client:', err);
        } finally {
          setLoading(false);
        }
      } else if (selectedClient && isEditMode) {
        // In edit mode, pets are fetched by fetchAppointmentData or pre-filled
        // No need to reset selected pet here.
      } else {
        setPets([]);
        setSelectedPet('');
      }
    };
    fetchPets();
  }, [selectedClient, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    if (!selectedClient || !selectedPet || !selectedService || !appointmentDate || !appointmentTime) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setSubmitting(false);
      return;
    }

    const appointmentData = {
      clientId: selectedClient,
      petId: selectedPet,
      serviceId: selectedService,
      date: appointmentDate,
      time: appointmentTime,
      // professionalId: selectedProfessional, // Add if professional selection is implemented
      status: isEditMode ? 'Pendente' : 'Pendente', // Keep status for now, adjust based on API
    };

    try {
      if (isEditMode && appointmentId) {
        await updateAppointment(appointmentId, appointmentData);
        alert('Agendamento atualizado com sucesso!');
      } else {
        await createAppointment(appointmentData);
        alert('Agendamento criado com sucesso!');
      }
      navigate('/appointments'); 
    } catch (err) {
      setError(isEditMode ? 'Erro ao atualizar agendamento (WIP).' : 'Erro ao agendar serviço (WIP).');
      console.error('Failed to save appointment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="new-appointment-page">
      <h1 className="mb-4">{isEditMode ? 'Editar Agendamento' : 'Novo Agendamento'}</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando dados (WIP)...</div>}

      {!loading && (
        <div className="card shadow-sm p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="clientSelect" className="form-label">Selecionar Cliente</label>
              <select
                className="form-select"
                id="clientSelect"
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                required
              >
                <option value="">-- Selecione um Cliente --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="petSelect" className="form-label">Selecionar Pet</label>
              <select
                className="form-select"
                id="petSelect"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                disabled={!selectedClient || pets.length === 0}
                required
              >
                <option value="">-- Selecione um Pet --</option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nome} ({pet.raca})
                  </option>
                ))}
              </select>
              {selectedClient && pets.length === 0 && !loading && (
                <small className="text-muted">Nenhum pet encontrado para o cliente selecionado (WIP).</small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="serviceSelect" className="form-label">Selecionar Serviço</label>
              <select
                className="form-select"
                id="serviceSelect"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                <option value="">-- Selecione um Serviço --</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.nome} (R$ {service.valor ? service.valor.toFixed(2) : '-'}) - {service.duracao} min
                  </option>
                ))}
              </select>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="appointmentDate" className="form-label">Data</label>
                <input
                  type="date"
                  className="form-control"
                  id="appointmentDate"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="appointmentTime" className="form-label">Hora</label>
                <input
                  type="time"
                  className="form-control"
                  id="appointmentTime"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="professionalSelect" className="form-label">Selecionar Profissional (WIP)</label>
              <select
                className="form-select"
                id="professionalSelect"
                value={''} // Placeholder for professional
                onChange={() => {}} // Placeholder
                disabled // Disabled until API is available
              >
                <option value="">-- Selecione um Profissional (WIP) --</option>
              </select>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {submitting ? (isEditMode ? 'Atualizando...' : 'Agendando...') : (isEditMode ? 'Salvar Alterações' : 'Confirmar Agendamento')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewAppointmentPage;
