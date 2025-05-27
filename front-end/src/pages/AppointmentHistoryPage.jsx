import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAppointments, cancelAppointment, updateAppointment } from '../services/api';
import AppointmentsTable from '../components/AppointmentsTable';

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('CANCELADO_CLIENTE');
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtersToSend = {};
      if (filterStatus) filtersToSend.status = filterStatus;
      if (filterDate) filtersToSend.dataAgendamento = filterDate;
      const data = await getAppointments(filtersToSend);
      setAppointments(data);
    } catch (err) {
      setError('Erro ao carregar histórico de agendamentos.');
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, filterDate]);

  const handleCancelAppointment = (id) => {
    setCancelId(id);
    setShowCancelModal(true);
  };

  const confirmCancelAppointment = async () => {
    if (!cancelId) return;
    try {
      await updateAppointment(cancelId, { status: cancelReason });
      alert('Agendamento cancelado com sucesso!');
      setShowCancelModal(false);
      setCancelId(null);
      fetchAppointments();
    } catch (err) {
      setError('Erro ao cancelar agendamento.');
      console.error('Failed to cancel appointment:', err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateAppointment(id, { status });
      fetchAppointments();
    } catch (err) {
      setError('Erro ao atualizar status do agendamento.');
      console.error('Failed to update appointment status:', err);
    }
  };

  return (
    <div className="appointment-history-page">
      <h1 className="mb-4">Histórico de Agendamentos</h1>
      <div className="mb-3 d-flex justify-content-between align-items-end">
        <div className="row g-2 align-items-end w-100">
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Todos</option>
              <option value="AGENDADO">Agendado</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="CANCELADO_CLIENTE">Cancelado pelo Cliente</option>
              <option value="CANCELADO_PETSHOP">Cancelado pelo Petshop</option>
              <option value="CONCLUIDO">Concluído</option>
              <option value="NAO_COMPARECEU">Não Compareceu</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Data</label>
            <input type="date" className="form-control" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary ms-3" onClick={() => navigate('/appointments/new')}>
          <i className="bi bi-calendar-plus me-2"></i>Novo Agendamento
        </button>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando agendamentos...</div>}
      {!loading && (
        <AppointmentsTable
          appointments={appointments}
          onEdit={() => { /* Não implementado aqui, tratado pela rota */ }}
          onCancel={handleCancelAppointment}
          onStatusChange={handleStatusChange}
        />
      )}
      {/* Modal de motivo de cancelamento */}
      {showCancelModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Motivo do Cancelamento</h5>
                <button type="button" className="btn-close" onClick={() => setShowCancelModal(false)}></button>
              </div>
              <div className="modal-body">
                <select className="form-select" value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                  <option value="CANCELADO_CLIENTE">Cancelado pelo Cliente</option>
                  <option value="CANCELADO_PETSHOP">Cancelado pelo Petshop</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>Fechar</button>
                <button type="button" className="btn btn-danger" onClick={confirmCancelAppointment}>Confirmar Cancelamento</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryPage;
