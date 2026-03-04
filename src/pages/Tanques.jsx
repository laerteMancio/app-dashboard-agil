import { useState, useEffect } from 'react';
import api from '../api/api';

export default function Tanques() {
  const [data, setData] = useState('');
  const [totalQtd, setTotalQtd] = useState([]);
  const [erroQtd, setErroQtd] = useState(null);

  useEffect(() => {
    if (!data) return;
    api.get(`/tanques?data=${data}`)
      .then(res => setTotalQtd(res.data))
      .catch(err => setErroQtd(err.message));
  }, [data]);

  return (
    <div className="container-tanques">
      <div className="input-section">
        <input type="date" value={data} onChange={e => setData(e.target.value)} className="date-input-tanques" />
      </div>
      {erroQtd && <p className="error-message">{erroQtd}</p>}
      <div className="input-section tanques-grid">
        {totalQtd.length > 0 ? totalQtd.map((item, i) => (
          <div key={i} className="card-tanques">
            <div className="card-header">
              <h3 className="card-title">Tanque {item.TANQUE}</h3>
            </div>
            <div className="card-content stat-value">{item.QUANTIDADE} L</div>
          </div>
        )) : <p className="info-message">Nenhum dado carregado</p>}
      </div>
    </div>
  );
}