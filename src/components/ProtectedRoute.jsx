import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente de rota protegida.
 * Redireciona para /login se o usuário não estiver autenticado.
 * Mostra um spinner enquanto a sessão está sendo carregada.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-muted text-sm">Verificando sessão…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
