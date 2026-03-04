import axios from 'axios';

const api = axios.create({
   baseURL: process.env.REACT_APP_API_URL || "/api" // usa proxy
});

export default api;