import React, { useState, useEffect } from 'react';
import { getServices } from '../services/api';

const ViewServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getServices();
        setServices(data);
      } catch (err) {
        setError('Erro ao carregar serviços disponíveis.');
        console.error('Failed to fetch services for view:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-services-page">
      <h1 className="mb-4">Serviços Disponíveis</h1>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && <div className="alert alert-info">Carregando serviços...</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar serviço por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!loading && !error && (
        filteredServices.length > 0 ? (
          <div className="row">
            {filteredServices.map(service => (
              <div key={service.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-primary">{service.nome}</h5>
                    <p className="card-text mb-1">
                      <strong>Duração:</strong> {service.duracao} minutos
                    </p>
                    <p className="card-text mb-0">
                      <strong>Valor:</strong> R$ {service.valor ? service.valor.toFixed(2) : '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-warning" role="alert">
            Nenhum serviço encontrado.
          </div>
        )
      )}
    </div>
  );
};

export default ViewServicesPage;
