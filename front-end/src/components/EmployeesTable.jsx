import React from 'react';

const EmployeesTable = ({ employees, onEdit, onDelete }) => {
  return (
    <div className="table-responsive">
      {employees.length > 0 ? (
        <table className="table table-hover table-striped">
          <thead className="table-dark">
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.nome}</td>
                <td>{employee.email}</td>
                <td>{employee.tipoUsuario}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white me-2"
                    onClick={() => onEdit(employee)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(employee.id)}
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
          Nenhum funcionário cadastrado.
        </div>
      )}
    </div>
  );
};

export default EmployeesTable;
