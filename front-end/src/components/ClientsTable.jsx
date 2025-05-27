import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientsTable = ({ clients, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleManagePets = (clientId) => {
    navigate(`/clients/${clientId}/pets`);
  };

  const handleScheduleService = (clientId) => {
    console.log('Agendar Serviço para cliente (WIP):', clientId);
    navigate(`/appointments/new`, { state: { clientId } }); // Pass client ID to new appointment page
  };

  return (
    <div className="table-responsive">
      {clients.length > 0 ? (
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Endereço</th>
              <th>Nº de Pets</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.nome}</td>
                <td>{client.telefone || '-'}</td>
                <td>{client.endereco || '-'}</td>
                <td>{client.numPets || '0'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white me-2"
                    onClick={() => onEdit(client)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger me-2"
                    onClick={() => onDelete(client.id)}
                    title="Excluir"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => handleManagePets(client.id)}
                    title="Gerenciar Pets"
                  >
                    <i className="bi bi-github"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleScheduleService(client.id)}
                    title="Agendar Serviço"
                  >
                    <i className="bi bi-calendar-plus"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          Nenhum cliente cadastrado.
        </div>
      )}
    </div>
  );
};

export default ClientsTable;
