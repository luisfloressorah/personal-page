// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { Navigate } from 'react-router-dom'
//import AdminProjects from './pages/admin/AdminProjects.jsx' // ej. página de proyectos

function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/" element={<HomePage />} />

      {/* login */}
      <Route path="/admin/login" element={<Login />} />

      {/* TODO lo que empiece con /admin pasa por AdminLayout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        {/* 🚨 Cualquier ruta no válida dentro de /admin cae aquí */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

export default App
