import { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';
import api from './api/api'; // ajuste sua importação de api
import moment from 'moment';
import 'moment/locale/pt-br';
import './index.css';

export default function App() {

  // ======================= DESPESAS =======================
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [erro, setErro] = useState(null);
  const [dadosAgrupados, setDadosAgrupados] = useState([]);
  const [tipoGrafico, setTipoGrafico] = useState('linha');

  // ======================= TANQUES =======================
  const [data, setData] = useState('');
  const [totalQtd, setTotalQtd] = useState([]);
  const [erroQtd, setErroQtd] = useState(null);

  // ======================= CONTAS =======================
  const [dataConta, setDataConta] = useState('');
  const [contas, setContas] = useState([]);
  const [erroContas, setErroContas] = useState(null);

  // ======================= FUNÇÕES =======================
  const formatarData = (dataString) => moment(dataString).format('DD/MM');

  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor || 0);
  }

  const gerarTodasAsDatas = (inicio, fim) => {
    const datas = [];
    const dataAtual = new Date(inicio);
    const dataFinal = new Date(fim);
    while (dataAtual <= dataFinal) {
      datas.push(dataAtual.toISOString().slice(0,10));
      dataAtual.setDate(dataAtual.getDate() + 1);
    }
    return datas;
  }

  const totalDespesas = dadosAgrupados.reduce((acc,curr)=>acc+(curr.valor||0),0);
  const mediaDespesas = dadosAgrupados.length >0 ? totalDespesas/dadosAgrupados.length : 0;
  const maiorDespesa = dadosAgrupados.length >0 ? Math.max(...dadosAgrupados.map(d=>d.valor||0)) : 0;
  const valoresValidos = dadosAgrupados.map(d=>d.valor).filter(v=>typeof v==='number'&&v>0);
  const menorDespesa = valoresValidos.length>0 ? Math.min(...valoresValidos) : 0;

  const dadosGrafico = dadosAgrupados.map(d=>({
    dataFormatada: formatarData(d.data),
    valor: d.valor || 0
  }));

  // ======================= BUSCAR DESPESAS =======================
  const buscarTotal = useCallback(async () => {
    if (!dataInicio || !dataFim) {
      setErro("Por favor, informe as duas datas");
      return;
    }
    setErro(null);
    try {
      const res = await api.get(`/despesas?inicio=${dataInicio}&fim=${dataFim}`);
      const json = res.data;

      const todasAsDatas = gerarTodasAsDatas(dataInicio,dataFim);
      const agrupado = {};
      todasAsDatas.forEach(d=>agrupado[d]=0);
      json.forEach(item=>{
        const dt = item.DATA.slice(0,10);
        if(agrupado.hasOwnProperty(dt)) agrupado[dt]+=Number(item.VALOR||0);
      });
      const dados = Object.entries(agrupado).map(([data,valor])=>({data,valor}));
      setDadosAgrupados(dados);
    } catch(e) {
      setErro(e.message);
    }
  }, [dataInicio, dataFim]);

  // ======================= BUSCAR TANQUES =======================
  const buscarTanques = useCallback(async () => {
    if (!data) {
      setErroQtd("Por favor, informe a data");
      return;
    }
    setErroQtd(null);
    try {
      const res = await api.get(`/tanques?data=${data}`);
      setTotalQtd(res.data);
    } catch(e) {
      setErroQtd(e.message);
    }
  }, [data]);

  // ======================= BUSCAR CONTAS =======================
  const buscarContas = useCallback(async () => {
    if(!dataConta){
      setErroContas("Por favor, informe a data");
      return;
    }
    setErroContas(null);
    try{
      const res = await api.get(`/contas-a-pagar?data=${dataConta}`);
      setContas(res.data);
    } catch(e){
      setErroContas(e.message);
    }
  }, [dataConta]);

  // ======================= EFFECTS =======================
  useEffect(()=>{ if(dataInicio && dataFim) buscarTotal() },[dataInicio,dataFim,buscarTotal]);
  useEffect(()=>{ if(data) buscarTanques() },[data,buscarTanques]);
  useEffect(()=>{ if(dataConta) buscarContas() },[dataConta,buscarContas]);

  // ======================= RENDER =======================
  return (
    <div className="container-principal">

      {/* === DESPESAS === */}
      <div className="container-despesas">
        <div className="container-estatisticas">
          <div className="card-header">
            <h3 className="card-title">Estatísticas</h3>
            <p className="card-description">Informe a data para visualizar as despesas</p>
          </div>

          <div className="input-section">
            <input type="date" value={dataInicio} onChange={e=>setDataInicio(e.target.value)} className="date-input"/>
            <input type="date" value={dataFim} onChange={e=>setDataFim(e.target.value)} className="date-input"/>
          </div>
          {erro && <p className="error-message">{erro}</p>}

          <div className="card"><div className="card-title">Total de Despesas</div><div className="card-content stat-value total-expense">{formatarValor(totalDespesas)}</div></div>
          <div className="card"><div className="card-title">Média por Dia</div><div className="card-content stat-value average-expense">{formatarValor(mediaDespesas)}</div></div>
          <div className="card"><div className="card-title">Maior Despesa</div><div className="card-content stat-value max-expense">{formatarValor(maiorDespesa)}</div></div>
          <div className="card"><div className="card-title">Menor Despesa</div><div className="card-content stat-value min-expense">{formatarValor(menorDespesa)}</div></div>
        </div>

        <div className="container-grafico">
          <div className="tipo-grafico-layout">
            <h3>Gráfico de Despesas</h3>
            <div className="button-group">
              <button className={`button ${tipoGrafico==='linha'?'active':''}`} onClick={()=>setTipoGrafico('linha')}>Linha</button>
              <button className={`button ${tipoGrafico==='barra'?'active':''}`} onClick={()=>setTipoGrafico('barra')}>Barra</button>
            </div>
          </div>
          <div className="grafico-layout">
            <ResponsiveContainer width="100%" height="100%">
              {tipoGrafico==='linha' ? (
                <LineChart data={dadosGrafico} margin={{top:5,right:30,left:20}}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="dataFormatada" tick={{ fontSize:10, angle:-45, textAnchor:'end' }}/>
                  <YAxis tickFormatter={v=>`R$ ${v}`}/>
                  <Tooltip formatter={v=>[formatarValor(v),'Valor']}/>
                  <Legend/>
                  <Line type="monotone" dataKey="valor" stroke="#8884d8" strokeWidth={2}/>
                </LineChart>
              ) : (
                <BarChart data={dadosGrafico} margin={{top:5,right:30,left:20,bottom:60}}>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="dataFormatada" tick={{ fontSize:10, angle:-45, textAnchor:'end' }}/>
                  <YAxis tickFormatter={v=>`R$ ${v}`}/>
                  <Tooltip formatter={v=>[formatarValor(v),'Valor']}/>
                  <Legend/>
                  <Bar dataKey="valor" fill="#82ca9d"/>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* === TANQUES === */}
      <div className="container-tanques">
        <div className="header"><h1>Dados Tanques</h1><p>Visualização por dia</p></div>
        <div className="input-section">
          <input type="date" value={data} onChange={e=>setData(e.target.value)} className="date-input-tanques"/>
        </div>
        {erroQtd && <p className="error-message">{erroQtd}</p>}
        <div className="input-section tanques-grid">
          {totalQtd.length>0 ? totalQtd.map((item,i)=>(
            <div key={i} className="card-tanques">
              <div className="card-header"><h3 className="card-title">Tanque {item.TANQUE}</h3></div>
              <div className="card-content stat-value">{item.QUANTIDADE} L</div>
            </div>
          )) : <p className="info-message">Nenhum dado carregado</p>}
        </div>
      </div>

      {/* === CONTAS A PAGAR === */}
      <div className="container-contas-a-pagar">
        <div className="header"><h1>Contas a pagar</h1><p>Visualização por data de vencimento</p></div>
        <div className="input-section">
          <input type="date" value={dataConta} onChange={e=>setDataConta(e.target.value)} className="date-input-contas"/>
        </div>
        {erroContas && <p className="error-message">{erroContas}</p>}
        <div className="lista-contas-grid">
          {contas.length>0 ? contas.map((c,i)=>(
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

    </div>
  );
}