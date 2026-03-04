import { useState, useEffect } from 'react';
import api from '../api/api';

export default function Contas() {
  const [dataConta, setDataConta] = useState('');
  const [contas, setContas] = useState([]);
  const [erro, setErro] = useState(null);

  useEffect(() => {
  if (!dataConta) return;

  api.get(`/contas-a-pagar?data=${dataConta}`)
    .then(res => setContas(res.data))
    .catch(err => setErro(err.response?.data?.error || err.message));
}, [dataConta]);

  return (
    <div className="container-contas-a-pagar">
      <div className="input-section">
        <input type="date" value={dataConta} onChange={e => setDataConta(e.target.value)} className="date-input-contas" />
      </div>
      {erro && <p className="error-message">{erro}</p>}
      <div className="lista-contas-grid">
        {contas.length > 0 ? contas.map((c, i) => (
          <div key={i} className="card-conta">
            <ul className="item-lista">
              <li><span className="card-title">Título:</span><span className="card-description">{c.COD_TITULO}</span></li>
              <li><span className="card-title">Valor:</span><span className="card-description">R$ {parseFloat(c.VALOR).toFixed(2)}</span></li>
              <li><span className="card-title">Descrição:</span><span className="card-description">{c.DESCRICAO}</span></li>
            </ul>
          </div>
        )) : <p className="info-message">Nenhuma conta encontrada</p>}
      </div>
    </div>
  );
}