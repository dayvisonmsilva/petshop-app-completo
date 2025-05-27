import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser } from '../services/api';
import EmployeesTable from '../components/EmployeesTable';
import EmployeeForm from '../components/EmployeeForm';

const EmployeeManagementPage = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setEmployees(data);
    } catch (err) {
      setError('Erro ao carregar funcionários.');
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployeeClick = () => {
    setEditingEmployee(null); 
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await deleteUser(id);
        fetchEmployees(); 
      } catch (err) {
        setError('Erro ao excluir funcionário.');
        console.error('Failed to delete employee:', err);
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    fetchEmployees();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  return (
    <div className="employee-management-page">
      <h1 className="mb-4">Gerenciamento de Funcionários</h1>
      
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando funcionários...</div>}

      {!showForm && (
        <div className="mb-4">
          <button className="btn btn-primary" onClick={handleAddEmployeeClick}>
            <i className="bi bi-person-plus me-2"></i>Adicionar Novo Funcionário
          </button>
        </div>
      )}

      {showForm ? (
        <EmployeeForm
          initialData={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      ) : (
        <EmployeesTable
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeManagementPage;
