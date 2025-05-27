import React from 'react';

const PetsTable = ({ pets, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      {pets.length > 0 ? (
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Idade</th>
              <th>Raça</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.nome}</td>
                <td>{pet.idade}</td>
                <td>{pet.raca}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white me-2"
                    onClick={() => onEdit(pet)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(pet.id)}
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
          Nenhum pet cadastrado para este cliente.
        </div>
      )}
    </div>
  );
};

export default PetsTable;
