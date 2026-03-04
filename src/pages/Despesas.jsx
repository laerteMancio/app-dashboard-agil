import { useState, useEffect } from 'react';
import api from '../api/api';

export default function Despesas() {
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const [despesas, setDespesas] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (!inicio || !fim) return;
    api.get(`/despesas?inicio=${inicio}&fim=${fim}`)
      .then(res => setDespesas(res.data))
      .catch(err => setErro(err.message));
  }, [inicio, fim]);

  return (
    <div className="container-despesas">
      <div className="input-section">
        <input type="date" value={inicio} onChange={e => setInicio(e.target.value)} className="date-input" />
        <input type="date" value={fim} onChange={e => setFim(e.target.value)} className="date-input" />
      </div>
      {erro && <p className="error-message">{erro}</p>}
      {despesas.length > 0 ? (
        despesas.map((d, i) => (
          <div key={i} className="card">
            <div className="card-title">{d.DATA}</div>
            <div className="card-content">{Number(d.VALOR).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
          </div>
        ))
      ) : <p className="info-message">Nenhuma despesa encontrada</p>}
    </div>
  );
}