import { useEffect, useState } from 'react';
import api from '../api/api';
import Table from '../components/Table';

export default function Resumo() {
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    api.get('/resumo')
      .then(res => setResumo(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!resumo) return <div>Carregando...</div>;

  return (
    <div className="container-estatisticas">
      <div className="card">
        <div className="card-title">Total Clientes</div>
        <div className="card-content stat-value">{resumo.TOTAL_CLIENTES}</div>
      </div>
      {/* Aqui você pode adicionar mais cards */}
    </div>
  );
}