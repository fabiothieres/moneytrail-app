import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  TrendingUp, ArrowRight, Shield, BarChart3, CreditCard,
  Wallet, PieChart, Calendar, ChevronRight, Zap, Star,
  CheckCircle2, Sparkles
} from 'lucide-react'

/* ── Dados das seções ─────────────────────────────────────── */
const FEATURES = [
  {
    Icon: Wallet,
    title: 'Controle Total',
    desc: 'Registre entradas e saídas com categorias inteligentes. Saiba exatamente para onde vai cada centavo.',
    color: 'from-emerald-500 to-emerald-600',
    glow: 'shadow-emerald-500/20',
  },
  {
    Icon: CreditCard,
    title: 'Parcelamentos',
    desc: 'Cadastre compras parceladas e o sistema gera todas as parcelas automaticamente nos meses certos.',
    color: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/20',
  },
  {
    Icon: PieChart,
    title: 'Gráficos Visuais',
    desc: 'Veja seus gastos e receitas em gráficos de pizza e barras. Identifique padrões instantaneamente.',
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/20',
  },
  {
    Icon: Calendar,
    title: 'Navegação Mensal',
    desc: 'Navegue entre meses passados e futuros. Veja a saúde financeira de cada período separadamente.',
    color: 'from-amber-500 to-amber-600',
    glow: 'shadow-amber-500/20',
  },
  {
    Icon: Shield,
    title: 'Segurança Total',
    desc: 'Seus dados são protegidos com Row Level Security. Ninguém além de você tem acesso às suas finanças.',
    color: 'from-rose-500 to-rose-600',
    glow: 'shadow-rose-500/20',
  },
  {
    Icon: BarChart3,
    title: 'Dashboard Inteligente',
    desc: 'Visão geral com 6 indicadores: saldo total, do mês, entradas, saídas. Tudo em tempo real.',
    color: 'from-cyan-500 to-cyan-600',
    glow: 'shadow-cyan-500/20',
  },
]

const STATS = [
  { value: '100%', label: 'Gratuito' },
  { value: '6', label: 'KPIs no Dashboard' },
  { value: '∞', label: 'Transações' },
  { value: '24/7', label: 'Disponível' },
]

const STEPS = [
  { step: '01', title: 'Crie sua conta', desc: 'Cadastro rápido com e-mail e senha. Sem burocracia.' },
  { step: '02', title: 'Adicione transações', desc: 'Registre entradas, saídas e parcelamentos em segundos.' },
  { step: '03', title: 'Acompanhe tudo', desc: 'Dashboard, gráficos e filtros por mês. Controle total.' },
]

/* ── Componente Landing Page ──────────────────────────────── */
export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-surface text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">MoneyTrail</span>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/40"
              >
                Ir ao Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/40"
                >
                  Começar Agora <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-40 right-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-8 animate-fade-in">
              <Sparkles size={14} />
              Gestão financeira pessoal — 100% gratuito
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up">
              A trilha do seu{' '}
              <span className="bg-gradient-to-r from-brand-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                dinheiro
              </span>
              {' '}começa aqui.
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up leading-relaxed">
              Controle entradas, saídas e parcelamentos de forma simples e visual.
              Dashboard inteligente, gráficos e navegação por mês — tudo em um só lugar.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
              <Link
                to="/register"
                className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/30 hover:scale-[1.02]"
              >
                <Zap size={20} />
                Começar Agora — É Grátis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#features"
                className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/5 font-medium text-base transition-all duration-300"
              >
                Ver Funcionalidades
                <ChevronRight size={18} />
              </a>
            </div>
          </div>

          {/* ── Dashboard Preview Card ───────────────────────── */}
          <div className="mt-20 max-w-4xl mx-auto animate-slide-up">
            <div className="relative rounded-2xl border border-white/10 bg-surface-card/80 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
              {/* Faux browser top bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-lg bg-white/5 text-[11px] text-slate-500 font-mono">
                    moneytrail.vercel.app
                  </div>
                </div>
              </div>

              {/* Dashboard mock content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-white">Dashboard</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Resumo financeiro atualizado</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[11px] text-slate-400">
                    Julho 2026
                  </div>
                </div>

                {/* KPI Cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Saldo Total',     value: 'R$ 12.450,00', color: 'text-brand-400', Icon: Wallet },
                    { label: 'Entradas Totais',  value: 'R$ 8.750,00',  color: 'text-emerald-400', Icon: TrendingUp },
                    { label: 'Saídas Totais',    value: 'R$ 3.300,00',  color: 'text-red-400', Icon: CreditCard },
                    { label: 'Saldo do Mês',     value: 'R$ 2.150,00',  color: 'text-blue-400', Icon: BarChart3 },
                    { label: 'Entradas do Mês',  value: 'R$ 5.000,00',  color: 'text-emerald-400', Icon: TrendingUp },
                    { label: 'Saídas do Mês',    value: 'R$ 2.850,00',  color: 'text-red-400', Icon: CreditCard },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/[.03] border border-white/5 rounded-xl p-4 hover:bg-white/[.05] transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <kpi.Icon size={14} className={kpi.color} />
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{kpi.label}</span>
                      </div>
                      <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient fade at bottom */}
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-surface-card to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-12 border-y border-white/5 bg-white/[.01]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-medium mb-6">
              <Star size={14} />
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Tudo que você precisa para{' '}
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                organizar suas finanças
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Ferramentas poderosas e intuitivas que transformam números em decisões inteligentes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative bg-surface-card/60 border border-white/5 rounded-2xl p-6 hover:bg-surface-card hover:border-white/10 transition-all duration-300 hover:shadow-xl"
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-300`}>
                  <f.Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32 border-t border-white/5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-0 w-[600px] h-[400px] bg-brand-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Comece em{' '}
              <span className="bg-gradient-to-r from-brand-400 to-emerald-400 bg-clip-text text-transparent">
                3 passos
              </span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              Sem configuração complicada. Crie sua conta e comece a controlar suas finanças imediatamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={i} className="relative bg-surface-card/60 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300">
                {/* Step number */}
                <span className="text-5xl font-black bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent select-none">
                  {s.step}
                </span>
                <h3 className="text-base font-semibold text-white mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                <CheckCircle2 size={20} className="absolute top-6 right-6 text-brand-500/30" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-brand-500/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="bg-surface-card/80 backdrop-blur-xl border border-white/10 rounded-3xl p-10 sm:p-14 shadow-2xl shadow-black/30">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/40">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
              Pronto para organizar suas finanças?
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Crie sua conta gratuitamente e tenha controle total do seu dinheiro. Sem cartão de crédito, sem pegadinhas.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/30 hover:scale-[1.02]"
            >
              <Zap size={20} />
              Começar Agora — É Grátis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <TrendingUp size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400">MoneyTrail</span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MoneyTrail. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
