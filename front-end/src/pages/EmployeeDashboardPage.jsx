import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import { getClients, getPetsByClientId, getPets } from '../services/api'; 

const EmployeeDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalClients, setTotalClients] = useState('--');
  const [totalPets, setTotalPets] = useState('--');
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  // Atividades recentes (WIP)
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    console.log('EmployeeDashboardPage: Component Mounted.');
    if (user) {
      console.log('EmployeeDashboardPage: Current user is', user.nome, '(' + user.tipoUsuario + ')');
    } else {
      console.log('EmployeeDashboardPage: No user is logged in.');
    }

    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      setMetricsError(null);
      try {
        // Fetch Total Clients
        const clientsData = await getClients();
        setTotalClients(clientsData.length);
        console.log('EmployeeDashboardPage: Total Clients fetched:', clientsData.length);

        // Fetch Total Pets
        const petsData = await getPets();
        setTotalPets(petsData.length);
        console.log('EmployeeDashboardPage: Total Pets:', petsData.length);

      } catch (err) {
        setMetricsError('Erro ao carregar métricas do dashboard de funcionário.');
        console.error('EmployeeDashboardPage: Failed to fetch dashboard metrics:', err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();

  }, [user]);

  const employeeMetrics = [
    { label: 'Total de Clientes', value: loadingMetrics ? 'Carregando...' : totalClients, icon: 'bi-person-lines-fill' },
    { label: 'Total de Pets', value: loadingMetrics ? 'Carregando...' : totalPets, icon: 'bi-grid-fill' },
    { label: 'Próximos Agendamentos (WIP)', value: '--', icon: 'bi-calendar-event' },
  ];

  const employeeRecentActivity = [
    // Placeholder data, will remain WIP
  ];

  return (
    <div className="employee-dashboard-page">
      <h1 className="mb-4">Meu Dashboard</h1>
      {user && <p className="text-muted mb-4">Bem-vindo(a) de volta, {user.nome}!</p>}

      {metricsError && <div className="alert alert-danger" role="alert">{metricsError}</div>}
      
      {/* Metric Cards Section */}
      <div className="row mb-4">
        {employeeMetrics.map((metric, index) => (
          <MetricCard key={index} label={metric.label} value={metric.value} icon={metric.icon} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h4 className="mb-3">Ações Rápidas</h4>
        <div className="d-flex flex-wrap gap-3">
          <button onClick={() => navigate('/clients')} className="btn btn-success btn-lg d-flex align-items-center">
            <i className="bi bi-person-plus me-2"></i>Adicionar Novo Cliente
          </button>
          <button onClick={() => navigate('/appointments/new')} className="btn btn-primary btn-lg d-flex align-items-center">
            <i className="bi bi-calendar-plus me-2"></i>Agendar Serviço
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Atividade Recente de Agendamentos (WIP)</h4>
        {employeeRecentActivity.length > 0 ? (
          <ul className="list-group list-group-flush">
            {employeeRecentActivity.map((activity, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">{activity.date}</small><br/>
                  <strong>{activity.action}:</strong> {activity.details}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Nenhuma atividade recente de agendamentos para exibir (WIP).</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboardPage;
