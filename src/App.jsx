import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/HomePage.jsx'
import Login from './pages/admin/Login.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ExperiencePage from './pages/admin/ExperiencePage.jsx'
import MessagesPage from './pages/admin/MessagesPage.jsx'

function App() {
  return (
    <Routes>
      {/* pública */}
      <Route path="/" element={<HomePage />} />

      {/* login */}
      <Route path="/admin/login" element={<Login />} />

      {/* admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}

export default App
