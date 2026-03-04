import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#007bff', padding: '10px', display: 'flex', gap: '1rem' }}>
      <NavLink to="/resumo" style={({isActive}) => ({color: isActive ? '#fff' : '#ddd', textDecoration: 'none'})}>Resumo</NavLink>
      <NavLink to="/despesas" style={({isActive}) => ({color: isActive ? '#fff' : '#ddd', textDecoration: 'none'})}>Despesas</NavLink>
      <NavLink to="/contas" style={({isActive}) => ({color: isActive ? '#fff' : '#ddd', textDecoration: 'none'})}>Contas</NavLink>
      <NavLink to="/tanques" style={({isActive}) => ({color: isActive ? '#fff' : '#ddd', textDecoration: 'none'})}>Tanques</NavLink>
    </nav>
  );
}