// src/lib/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Nest
  withCredentials: true,                // para enviar/recibir cookies
  xsrfCookieName: 'XSRF-TOKEN',         // nombre de la cookie que manda el backend
  xsrfHeaderName: 'X-XSRF-TOKEN',       // cabecera que leerá el backend
})

export default api
