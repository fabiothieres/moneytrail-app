import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react'

export default function Register() {
  const { signUp } = useAuth()
  const navigate   = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (form.password !== form.confirm) {
      toast.error('As senhas não coincidem.')
      return
    }

    setLoading(true)
    const { error } = await signUp(form.email, form.password)
    setLoading(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Conta criada! Verifique seu e-mail para confirmar.')
      navigate('/login')
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm'

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="bg-surface-card border border-surface-border rounded-3xl p-8 shadow-2xl shadow-black/40">

          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/40 mb-4">
              <UserPlus size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
            <p className="text-sm text-surface-muted mt-1">Comece a controlar suas finanças</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  id="register-email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className={`${inputClass} pl-10`}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  id="register-password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className={`${inputClass} pl-10 pr-12`}
                  required
                  autoComplete="new-password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-surface-muted mb-1.5">Confirmar Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  id="register-confirm"
                  placeholder="Repita a senha"
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className={`${inputClass} pl-10`}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-brand-500 hover:from-purple-400 hover:to-brand-400 disabled:opacity-60 text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/40 mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Criando conta…</> : 'Criar Conta Grátis'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-muted mt-6">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
