import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getClientById, getPetById, getServiceById } from '../services/api';

const AppointmentsTable = ({ appointments, onEdit, onCancel, onStatusChange }) => {
  const navigate = useNavigate();
  const [namesMap, setNamesMap] = useState({ clients: {}, pets: {}, services: {} });

  useEffect(() => {
    const fetchNames = async () => {
      const clientIds = [...new Set(appointments.map(a => a.clienteId).filter(Boolean))];
      const petIds = [...new Set(appointments.map(a => a.petId).filter(Boolean))];
      const serviceIds = [...new Set(appointments.map(a => a.servicoId).filter(Boolean))];
      const clients = { ...namesMap.clients };
      const pets = { ...namesMap.pets };
      const services = { ...namesMap.services };
      for (const id of clientIds) {
        if (!clients[id]) {
          try { const c = await getClientById(id); clients[id] = c.nome; } catch { clients[id] = id; }
        }
      }
      for (const id of petIds) {
        if (!pets[id]) {
          try { const p = await getPetById(id); pets[id] = p.nome; } catch { pets[id] = id; }
        }
      }
      for (const id of serviceIds) {
        if (!services[id]) {
          try { const s = await getServiceById(id); services[id] = s.nome; } catch { services[id] = id; }
        }
      }
      setNamesMap({ clients, pets, services });
    };
    if (appointments.length > 0) fetchNames();
    // eslint-disable-next-line
  }, [appointments]);

  const handleEditClick = (appointment) => {
    navigate(`/appointments/edit/${appointment.id}`);
  };

  // Função para traduzir status
  const traduzirStatus = (status) => {
    switch (status) {
      case 'AGENDADO': return 'Agendado';
      case 'CONFIRMADO': return 'Confirmado';
      case 'CANCELADO_CLIENTE': return 'Cancelado pelo Cliente';
      case 'CANCELADO_PETSHOP': return 'Cancelado pelo Petshop';
      case 'CONCLUIDO': return 'Concluído';
      case 'NAO_COMPARECEU': return 'Não Compareceu';
      default: return status;
    }
  };

  // Verifica se todos os nomes já foram carregados
  const nomesCarregados = appointments.every(a =>
    (!a.clienteId || namesMap.clients[a.clienteId]) &&
    (!a.petId || namesMap.pets[a.petId]) &&
    (!a.servicoId || namesMap.services[a.servicoId])
  );

  return (
    <div className="table-responsive">
      {appointments.length > 0 ? (
        nomesCarregados ? (
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Pet</th>
                <th>Serviço</th>
                <th>Profissional</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.dataHora ? appointment.dataHora.split('T')[0] : '-'}</td>
                  <td>{appointment.dataHora ? appointment.dataHora.split('T')[1]?.slice(0,5) : '-'}</td>
                  <td>{namesMap.clients[appointment.clienteId] || '-'}</td>
                  <td>{namesMap.pets[appointment.petId] || '-'}</td>
                  <td>{namesMap.services[appointment.servicoId] || '-'}</td>
                  <td>{appointment.colaboradorAlocado || '-'}</td>
                  <td>{traduzirStatus(appointment.status)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info text-white me-2"
                      onClick={() => handleEditClick(appointment)}
                      title="Alterar Agendamento"
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => onCancel(appointment.id)}
                      title="Cancelar Agendamento"
                      disabled={appointment.status === 'CANCELADO_CLIENTE' || appointment.status === 'CANCELADO_PETSHOP'}
                    >
                      <i className="bi bi-x-circle-fill"></i>
                    </button>
                    {(appointment.status !== 'CANCELADO_CLIENTE' && appointment.status !== 'CANCELADO_PETSHOP' && appointment.status !== 'CONCLUIDO') && (
                      <div className="btn-group">
                        <button type="button" className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                          Status
                        </button>
                        <ul className="dropdown-menu">
                          <li><button className="dropdown-item" onClick={() => onStatusChange(appointment.id, 'CONFIRMADO')}>Confirmar</button></li>
                          <li><button className="dropdown-item" onClick={() => onStatusChange(appointment.id, 'CONCLUIDO')}>Concluir</button></li>
                          <li><button className="dropdown-item" onClick={() => onStatusChange(appointment.id, 'NAO_COMPARECEU')}>Não Compareceu</button></li>
                        </ul>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="alert alert-info" role="alert">
            Carregando nomes dos agendamentos...
          </div>
        )
      ) : (
        <div className="alert alert-info" role="alert">
          Nenhum agendamento encontrado.
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;
