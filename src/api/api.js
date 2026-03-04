import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // agora aponta para as rotas da Vercel (HTTPS)
});

export default api;