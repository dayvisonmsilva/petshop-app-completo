import React from 'react';

const ServicesTable = ({ services, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      {services.length > 0 ? (
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Duração (min)</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.nome}</td>
                <td>{service.duracao}</td>
                <td>{service.valor ? `R$ ${service.valor.toFixed(2)}` : '-'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white me-2"
                    onClick={() => onEdit(service)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(service.id)}
                    title="Excluir"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          Nenhum serviço cadastrado.
        </div>
      )}
    </div>
  );
};

export default ServicesTable;
