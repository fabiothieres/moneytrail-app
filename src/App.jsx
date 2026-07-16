import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'
import Dashboard    from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories   from './pages/Categories'
import Analytics    from './pages/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color:      '#f8fafc',
              border:     '1px solid #334155',
              borderRadius: '12px',
              fontSize:   '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0f172a' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
          }}
        />

        <Routes>
          <Route path="/"         element={<Landing />}  />

          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard"    element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
          <Route path="/categories"   element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/analytics"    element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
