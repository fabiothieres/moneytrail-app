import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, LogOut, Menu, X, TrendingUp, Tag, BarChart2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard',    label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transações',   Icon: ArrowLeftRight  },
  { to: '/categories',   label: 'Categorias',   Icon: Tag             },
  { to: '/analytics',    label: 'Gráficos',     Icon: BarChart2       },
]

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)

  const handleSignOut = async () => {
    await signOut()
    toast.success('Sessão encerrada.')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-surface-card/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">MoneyTrail</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/20 text-brand-400'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* User & logout */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-surface-muted truncate max-w-[160px]">{user?.email}</span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-surface-border bg-surface-card animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {NAV_ITEMS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'bg-brand-500/20 text-brand-400' : 'text-slate-400'
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
