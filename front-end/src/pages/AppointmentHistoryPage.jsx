import React, { useState, useEffect } from 'react';
import { getAppointments, cancelAppointment } from '../services/api';
import AppointmentsTable from '../components/AppointmentsTable';

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({}); // Para filtros futuros

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAppointments(filters); // Passar filters quando implementado
      setAppointments(data);
    } catch (err) {
      setError('Erro ao carregar histórico de agendamentos (WIP).');
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filters]); // Refetch when filters change

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      try {
        await cancelAppointment(id);
        alert('Agendamento cancelado com sucesso!');
        fetchAppointments();
      } catch (err) {
        setError('Erro ao cancelar agendamento (WIP).');
        console.error('Failed to cancel appointment:', err);
      }
    }
  };

  return (
    <div className="appointment-history-page">
      <h1 className="mb-4">Histórico de Agendamentos (WIP)</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando agendamentos (WIP)...</div>}

      <div className="mb-3">
        {/* Filtros de Agendamento (WIP) */}
        <p className="text-muted">Filtros de Agendamento (WIP)</p>
      </div>

      {!loading && (
        <AppointmentsTable
          appointments={appointments}
          onEdit={() => { /* Não implementado aqui, tratado pela rota */ }}
          onCancel={handleCancelAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
