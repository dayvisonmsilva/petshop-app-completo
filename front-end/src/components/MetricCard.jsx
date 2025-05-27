import React from 'react';

const MetricCard = ({ label, value, icon }) => {
  console.log('MetricCard: Rendering with label:', label);
  return (
    <div className="col-md-4 mb-3">
      <div className="card shadow-sm p-3 h-100">
        <div className="d-flex align-items-center">
          <i className={`bi ${icon} fs-2 text-primary me-3`}></i>
          <div>
            <h5 className="card-title mb-0 text-muted">{label}</h5>
            <p className="card-text fs-4 fw-bold">{value}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
