import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'

function App() {
  return (
    <Routes>
      {/* Sitio público */}
      <Route path="/" element={<HomePage />} />

      {/* Panel admin (rutas anidadas) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        {/* Aquí después: <Route path="projects" ... />, etc */}
      </Route>
    </Routes>
  )
}

export default App
