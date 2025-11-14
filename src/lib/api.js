import axios from 'axios'

const api = axios.create({
  baseURL: '/api',          // En producción va detrás de Nginx: /api → Nest
  withCredentials: true,    // Enviar cookies (JWT, XSRF) en cada request
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

export default api
