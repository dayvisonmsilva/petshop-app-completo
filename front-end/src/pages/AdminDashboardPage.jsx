import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MetricCard from '../components/MetricCard';
import { getServices, getUsers } from '../services/api';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalServices, setTotalServices] = useState('--');
  const [totalEmployees, setTotalEmployees] = useState('--');
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState(null);

  // Recent activity will remain mock/WIP for now
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    console.log('AdminDashboardPage: Component Mounted.');
    if (user) {
      console.log('AdminDashboardPage: Current user is', user.nome, '(' + user.tipoUsuario + ')');
    } else {
      console.log('AdminDashboardPage: No user is logged in.');
    }

    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      setMetricsError(null);
      try {
        // Fetch Total Services
        const servicesData = await getServices();
        setTotalServices(servicesData.length);
        console.log('AdminDashboardPage: Total Services fetched:', servicesData.length);

        // Fetch Total Employees
        const usersData = await getUsers();
        const employeesCount = usersData.filter(u => u.tipoUsuario === 'Funcionario' || u.tipoUsuario === 'Administrador').length;
        setTotalEmployees(employeesCount);
        console.log('AdminDashboardPage: Total Employees fetched:', employeesCount);

      } catch (err) {
        setMetricsError('Erro ao carregar métricas do dashboard.');
        console.error('AdminDashboardPage: Failed to fetch dashboard metrics:', err);
      } finally {
        setLoadingMetrics(false);
      }
    };
    fetchMetrics();

  }, [user]);

  const metrics = [
    { label: 'Total de Serviços Cadastrados', value: loadingMetrics ? 'Carregando...' : totalServices, icon: 'bi-tools' },
    { label: 'Total de Funcionários Ativos', value: loadingMetrics ? 'Carregando...' : totalEmployees, icon: 'bi-people' },
    { label: 'Agendamentos para Hoje/Próximos (WIP)', value: '--', icon: 'bi-calendar-check' },
  ];

  const adminRecentActivity = [
    // Placeholder data, por hora WIP
  ];

  return (
    <div className="admin-dashboard-page">
      <h1 className="mb-4">Dashboard Geral</h1>
      {user && <p className="text-muted mb-4">Bem-vindo(a) de volta, {user.nome}!</p>}

      {metricsError && <div className="alert alert-danger" role="alert">{metricsError}</div>}
      
      {/* Metric Cards Section */}
      <div className="row mb-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} label={metric.label} value={metric.value} icon={metric.icon} />
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="card shadow-sm p-4 mb-4">
        <h4 className="mb-3">Ações Rápidas</h4>
        <div className="d-flex flex-wrap gap-3">
          <button onClick={() => navigate('/services')} className="btn btn-success btn-lg d-flex align-items-center">
            <i className="bi bi-plus-circle me-2"></i>Adicionar Novo Serviço
          </button>
          <button onClick={() => navigate('/employees')} className="btn btn-info btn-lg text-white d-flex align-items-center">
            <i className="bi bi-people me-2"></i>Gerenciar Funcionários
          </button>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Atividade Recente no Sistema (WIP)</h4>
        {adminRecentActivity.length > 0 ? (
          <ul className="list-group list-group-flush">
            {adminRecentActivity.map((activity, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">{activity.date}</small><br/>
                  <strong>{activity.action}:</strong> {activity.details}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">Nenhuma atividade recente para exibir (WIP).</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
