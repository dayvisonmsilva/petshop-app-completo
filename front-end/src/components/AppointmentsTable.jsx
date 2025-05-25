import React from 'react';
import { useNavigate } from 'react-router-dom';

const AppointmentsTable = ({ appointments, onEdit, onCancel }) => {
  const navigate = useNavigate();

  const handleEditClick = (appointment) => {
    navigate(`/appointments/edit/${appointment.id}`);
  };

  return (
    <div className="table-responsive">
      {appointments.length > 0 ? (
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
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>{appointment.clientId || 'N/A (WIP)'}</td> {/* Exibira o nome do cliente apos a integração da API */}
                <td>{appointment.petId || 'N/A (WIP)'}</td> {/* Exibira o nome do pet apos a integração da API */}
                <td>{appointment.serviceId || 'N/A (WIP)'}</td> {/* Exibira o nome do serviço apos a integração da API */}
                <td>{appointment.professionalId || 'N/A (WIP)'}</td> {/* Exibira o nome do profissional apos a integração da API */}
                <td>{appointment.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white me-2"
                    onClick={() => handleEditClick(appointment)}
                    title="Alterar Agendamento"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => onCancel(appointment.id)}
                    title="Cancelar Agendamento"
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          Nenhum agendamento encontrado (WIP).
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;
