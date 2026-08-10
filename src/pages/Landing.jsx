import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Banknote, ArrowRight, Shield, BarChart3, CreditCard,
  Wallet, PieChart, Calendar, ChevronRight, Zap, Star,
  CheckCircle2, Sparkles, TrendingUp, Users, Clock,
  ArrowUpRight, Check, Eye, Lock, Layers
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════
   CUSTOM HOOKS
   ══════════════════════════════════════════════════════════ */

function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, isInView]
}

function useCountUp(end, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return
    let startTime = null
    let raf
    const animate = (ts) => {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(eased * end))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [shouldStart, end, duration])

  return count
}

/* ══════════════════════════════════════════════════════════
   DATA
   ══════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    Icon: Wallet,
    title: 'Controle Total',
    desc: 'Registre entradas e saídas com categorias inteligentes. Saiba exatamente para onde vai cada centavo.',
  },
  {
    Icon: CreditCard,
    title: 'Parcelamentos',
    desc: 'Cadastre compras parceladas e o sistema gera todas as parcelas automaticamente nos meses certos.',
  },
  {
    Icon: PieChart,
    title: 'Gráficos Visuais',
    desc: 'Veja seus gastos e receitas em gráficos de pizza e barras. Identifique padrões instantaneamente.',
  },
  {
    Icon: Calendar,
    title: 'Navegação Mensal',
    desc: 'Navegue entre meses passados e futuros. Veja a saúde financeira de cada período separadamente.',
  },
  {
    Icon: Shield,
    title: 'Segurança Total',
    desc: 'Seus dados são protegidos com Row Level Security. Ninguém além de você tem acesso às suas finanças.',
  },
  {
    Icon: BarChart3,
    title: 'Dashboard Inteligente',
    desc: 'Visão geral com 6 indicadores: saldo total, do mês, entradas, saídas. Tudo em tempo real.',
  },
]

const STATS = [
  { value: 100, suffix: '%', label: 'Gratuito' },
  { value: 6, suffix: '', label: 'KPIs no Dashboard' },
  { value: 24, suffix: '/7', label: 'Disponível' },
  { value: 500, suffix: '+', label: 'Usuários Ativos' },
]

const STEPS = [
  {
    step: '01',
    title: 'Crie sua conta',
    desc: 'Cadastro rápido com e-mail e senha. Sem burocracia, sem cartão de crédito.',
    Icon: Users,
  },
  {
    step: '02',
    title: 'Adicione transações',
    desc: 'Registre entradas, saídas e parcelamentos em segundos com categorias inteligentes.',
    Icon: Layers,
  },
  {
    step: '03',
    title: 'Acompanhe tudo',
    desc: 'Dashboard completo, gráficos interativos e filtros por mês. Controle total.',
    Icon: Eye,
  },
]

/* ══════════════════════════════════════════════════════════
   COMPONENTS
   ══════════════════════════════════════════════════════════ */

/* ── Floating Gold Sparkles ─────────────────────────────── */
function GoldSparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
    opacity: Math.random() * 0.6 + 0.2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="sparkle-particle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            opacity: 0,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

/* ── 3D Credit Card (Pure CSS) ──────────────────────────── */
function CreditCard3D() {
  return (
    <div className="relative" style={{ perspective: '1200px' }}>
      {/* Back card (dark) */}
      <div className="credit-card-back" />

      {/* Main gold card */}
      <div className="credit-card-3d animate-float">
        <div className="credit-card-inner">
          {/* Top row: chip + contactless */}
          <div className="flex items-start justify-between">
            <div className="card-chip" />
            <div className="card-contactless">
              <span /><span /><span />
            </div>
          </div>

          {/* Card number */}
          <p className="text-lg sm:text-xl font-mono tracking-[0.2em] text-white/90 drop-shadow-sm mt-auto mb-1"
             style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
            1234 5678 9012 245
          </p>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-white/50 mb-0.5">Válido Até</p>
              <p className="text-sm font-mono text-white/80">06/25</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-white/50 mb-0.5">Titular</p>
              <p className="text-sm font-semibold text-white/90 tracking-wide">MONEY TRAIL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



/* ── Stat Counter ───────────────────────────────────────── */
function StatCounter({ value, suffix, label }) {
  const [ref, inView] = useInView()
  const count = useCountUp(value, 1800, inView)

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl sm:text-5xl font-extrabold font-display text-gold-gradient leading-none">
        {count}{suffix}
      </p>
      <p className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wider mt-2">
        {label}
      </p>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ══════════════════════════════════════════════════════════ */

export default function Landing() {
  const { user } = useAuth()
  const [navScrolled, setNavScrolled] = useState(false)

  // Navbar scroll effect
  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Continuous scroll-driven animations (rAF loop)
  useEffect(() => {
    let raf
    const ease = (t) => 1 - Math.pow(1 - t, 3) // easeOutCubic

    const animate = () => {
      const vh = window.innerHeight

      // ── Parallax background orbs ──
      document.querySelectorAll('[data-parallax]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallax) || 0.1
        const rect = el.parentElement?.getBoundingClientRect()
        if (rect) {
          const offset = (vh - rect.top) * speed
          el.style.transform = `translateY(${offset}px)`
        }
      })

      // ── Section headers ──
      document.querySelectorAll('[data-scroll-header]').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const raw = (vh * 0.92 - rect.top) / (vh * 0.35)
        const p = ease(Math.max(0, Math.min(1, raw)))
        el.style.transform = `translateY(${(1 - p) * 50}px)`
        el.style.opacity = p
      })

      // ── Feature / generic cards ──
      document.querySelectorAll('[data-scroll-card]').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const delay = parseFloat(el.dataset.scrollDelay) || 0
        const entry = vh * (0.88 - delay * 0.04)
        const raw = (entry - rect.top) / (vh * 0.32)
        const p = ease(Math.max(0, Math.min(1, raw)))
        const y = (1 - p) * 70
        const scale = 0.9 + p * 0.1
        const rotate = (1 - p) * 3
        el.style.transform = `translateY(${y}px) scale(${scale}) rotate(${rotate}deg)`
        el.style.opacity = p
      })

      // ── Dashboard preview ──
      const dash = document.querySelector('[data-scroll-dashboard]')
      if (dash) {
        const rect = dash.getBoundingClientRect()
        const raw = (vh - rect.top) / (vh * 0.65)
        const p = ease(Math.max(0, Math.min(1, raw)))
        const s = 0.82 + p * 0.18
        const rX = (1 - p) * 12
        const y = (1 - p) * 50
        dash.style.transform = `perspective(1200px) translateY(${y}px) scale(${s}) rotateX(${rX}deg)`
        dash.style.opacity = p
      }

      // ── Step cards ──
      document.querySelectorAll('[data-scroll-step]').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const delay = parseFloat(el.dataset.scrollStep) || 0
        const entry = vh * (0.88 - delay * 0.07)
        const raw = (entry - rect.top) / (vh * 0.28)
        const p = ease(Math.max(0, Math.min(1, raw)))
        el.style.transform = `translateY(${(1 - p) * 60}px) scale(${0.92 + p * 0.08})`
        el.style.opacity = p
      })

      // ── Steps progress line ──
      const fill = document.querySelector('[data-progress-fill]')
      if (fill) {
        const section = fill.closest('section')
        if (section) {
          const rect = section.getBoundingClientRect()
          const raw = (vh * 0.55 - rect.top) / (rect.height * 0.55)
          const p = ease(Math.max(0, Math.min(1, raw)))
          fill.style.width = `${p * 100}%`
        }
      }

      // ── CTA card ──
      const cta = document.querySelector('[data-scroll-cta]')
      if (cta) {
        const rect = cta.getBoundingClientRect()
        const raw = (vh - rect.top) / (vh * 0.55)
        const p = ease(Math.max(0, Math.min(1, raw)))
        cta.style.transform = `scale(${0.86 + p * 0.14})`
        cta.style.opacity = p
        // intensify glow
        const glow = cta.querySelector('[data-cta-glow]')
        if (glow) glow.style.opacity = p * 0.8
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="min-h-screen bg-surface text-white overflow-x-hidden">

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'bg-surface/90 backdrop-blur-2xl shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-all duration-300 group-hover:scale-105">
              <Banknote size={20} className="text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold font-display tracking-tight">
              Money<span className="text-brand-400">Trail</span>
            </span>
          </Link>

          {/* Nav Links (desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {['Serviços', 'Como Funciona', 'Benefícios'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-slate-400 hover:text-brand-400 transition-colors duration-300 font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors duration-300"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl border border-brand-500/40 hover:border-brand-400 text-brand-400 hover:text-brand-300 font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/15 hover:bg-brand-500/5"
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 min-h-[90vh] flex items-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-brand-500/[0.06] rounded-full blur-[150px]" />
          <div className="absolute bottom-20 right-[5%] w-[400px] h-[400px] bg-brand-400/[0.04] rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/[0.08] rounded-full blur-[200px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,154,42,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,154,42,.3) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <GoldSparkles />

        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* ── Left Column: Text ── */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-brand-400 text-xs font-medium mb-8 opacity-0 animate-fade-in">
                <Sparkles size={14} />
                Gestão financeira pessoal — 100% gratuito
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold font-display tracking-tight leading-[1.08] mb-6 opacity-0 animate-slide-up">
                Gestão Financeira{' '}
                <span className="text-gold-gradient">
                  Rápida e Inteligente
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed opacity-0 animate-slide-up-delay">
                Controle entradas, saídas e parcelamentos de forma simples e visual.
                Dashboard inteligente, gráficos e navegação por mês — tudo em um só lugar.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14 opacity-0 animate-slide-up-delay2">
                <Link
                  to="/register"
                  className="btn-shimmer group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/25 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Zap size={20} />
                  Começar Agora — É Grátis
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#como-funciona"
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl border border-white/10 text-slate-300 hover:text-brand-400 hover:border-brand-500/30 hover:bg-brand-500/5 font-medium text-base transition-all duration-300"
                >
                  Ver Como Funciona
                  <ChevronRight size={18} />
                </a>
              </div>

              {/* Mini Features (bottom of hero) */}
              <div className="flex flex-col sm:flex-row items-center lg:items-start gap-6 sm:gap-10 opacity-0 animate-slide-up-delay2">
                {[
                  { num: '01', title: 'Transações Financeiras', desc: 'Gerencie tudo pelo app ou website' },
                  { num: '02', title: 'Sistema Fácil de Usar', desc: 'Cada conta com seu saldo único' },
                ].map((item) => (
                  <div key={item.num} className="flex items-start gap-3">
                    <span className="text-2xl font-black font-display text-brand-500/30 leading-none mt-0.5">
                      {item.num}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Column: 3D Card Visual ── */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-center relative overflow-visible">
              <div className="relative">
                <CreditCard3D />

                {/* Glow behind card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/[0.12] rounded-full blur-[80px] pointer-events-none animate-glow-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <section className="relative py-14 border-y border-white/5">
        <div className="absolute inset-0 glass pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <StatCounter key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="serviços" className="relative py-24 lg:py-32">
        {/* Background glow — parallax */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div data-parallax="0.12" className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-brand-500/[0.04] rounded-full blur-[150px]" />
          <div data-parallax="-0.06" className="absolute bottom-0 left-[10%] w-[400px] h-[300px] bg-brand-400/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section Header — scroll-driven */}
          <div data-scroll-header className="text-center mb-16" style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-gold text-brand-400 text-xs font-medium mb-6">
              <Star size={14} />
              Funcionalidades
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight mb-4">
              Tudo que você precisa para{' '}
              <span className="text-gold-gradient">organizar suas finanças</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
              Ferramentas poderosas e intuitivas que transformam números em decisões inteligentes.
            </p>
          </div>

          {/* Features Grid — scroll-driven cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                data-scroll-card
                data-scroll-delay={i}
                style={{ opacity: 0 }}
                className="group relative glass rounded-2xl p-6 hover:bg-surface-elevated/80 transition-[background,box-shadow,border-color] duration-500 hover:shadow-xl hover:shadow-brand-500/[0.05] hover:border-brand-500/20 cursor-default"
              >
                {/* Gold icon */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mb-5 shadow-lg shadow-brand-500/20 group-hover:scale-110 group-hover:shadow-brand-500/30 transition-all duration-300">
                  <f.Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2 font-display">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {f.desc}
                </p>

                {/* Hover gold border glow */}
                <div className="absolute inset-0 rounded-2xl border border-brand-500/0 group-hover:border-brand-500/15 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ DASHBOARD PREVIEW ═══════════════ */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div
            data-scroll-dashboard
            style={{ opacity: 0, transformOrigin: 'center bottom' }}
          >
            <div className="relative rounded-2xl border border-white/[0.06] glass shadow-2xl shadow-black/40 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-lg bg-white/5 text-[11px] text-slate-500 font-mono flex items-center gap-2">
                    <Lock size={10} className="text-brand-400" />
                    moneytrail.vercel.app
                  </div>
                </div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-white font-display">Dashboard</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Resumo financeiro atualizado</p>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg glass text-[11px] text-slate-400">
                    Agosto 2026
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Saldo Total', value: 'R$ 12.450,00', color: 'text-brand-400', Icon: Wallet },
                    { label: 'Entradas Totais', value: 'R$ 8.750,00', color: 'text-emerald-400', Icon: TrendingUp },
                    { label: 'Saídas Totais', value: 'R$ 3.300,00', color: 'text-red-400', Icon: CreditCard },
                    { label: 'Saldo do Mês', value: 'R$ 2.150,00', color: 'text-blue-400', Icon: BarChart3 },
                    { label: 'Entradas do Mês', value: 'R$ 5.000,00', color: 'text-emerald-400', Icon: TrendingUp },
                    { label: 'Saídas do Mês', value: 'R$ 2.850,00', color: 'text-red-400', Icon: CreditCard },
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      className="bg-white/[.02] border border-white/5 rounded-xl p-4 hover:bg-white/[.04] hover:border-brand-500/10 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <kpi.Icon size={14} className={kpi.color} />
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                          {kpi.label}
                        </span>
                      </div>
                      <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient fade */}
              <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-surface-card/90 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="como-funciona" className="relative py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div data-parallax="0.08" className="absolute top-1/2 left-0 w-[600px] h-[400px] bg-brand-500/[0.04] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Section Header — scroll-driven */}
          <div data-scroll-header className="text-center mb-16" style={{ opacity: 0 }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight mb-4">
              Comece em{' '}
              <span className="text-gold-gradient">3 passos simples</span>
            </h2>
            <p className="text-slate-400 max-w-lg mx-auto text-base sm:text-lg">
              Sem configuração complicada. Crie sua conta e comece a controlar suas finanças imediatamente.
            </p>
          </div>

          {/* Progress line that fills as you scroll */}
          <div className="hidden sm:block relative max-w-md mx-auto mb-10">
            <div className="h-[2px] w-full bg-surface-border/40 rounded-full overflow-hidden">
              <div
                data-progress-fill
                className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-none"
                style={{ width: '0%' }}
              />
            </div>
          </div>

          {/* Steps — scroll-driven sequential reveal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div
                key={i}
                data-scroll-step={i}
                style={{ opacity: 0 }}
                className="relative glass rounded-2xl p-7 hover:border-brand-500/20 transition-[background,box-shadow,border-color] duration-500 group"
              >
                {/* Step number */}
                <span className="text-6xl font-black font-display bg-gradient-to-b from-brand-500/20 to-transparent bg-clip-text text-transparent select-none leading-none">
                  {s.step}
                </span>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500/20 to-brand-600/10 flex items-center justify-center mt-3 mb-4 group-hover:from-brand-500/30 group-hover:to-brand-600/20 transition-all duration-300">
                  <s.Icon size={20} className="text-brand-400" />
                </div>

                <h3 className="text-base font-semibold text-white mb-2 font-display">
                  {s.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>

                {/* Check icon */}
                <CheckCircle2
                  size={20}
                  className="absolute top-7 right-7 text-brand-500/20 group-hover:text-brand-500/40 transition-colors duration-300"
                />

                {/* Connector line (not on last card) */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 w-6 border-t border-dashed border-brand-500/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA FINAL ═══════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div data-parallax="0.15" className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-brand-500/[0.06] rounded-full blur-[150px]" />
          <div data-parallax="-0.08" className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-brand-400/[0.03] rounded-full blur-[120px]" />
        </div>

        <GoldSparkles />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div
            data-scroll-cta
            style={{ opacity: 0, transformOrigin: 'center center' }}
            className="glass rounded-3xl p-10 sm:p-16 shadow-2xl shadow-black/30 relative overflow-hidden"
          >
            {/* Subtle gold border glow — intensifies on scroll */}
            <div className="absolute inset-0 rounded-3xl border border-brand-500/10 pointer-events-none" />
            <div data-cta-glow className="absolute -top-1/2 -right-1/2 w-full h-full bg-brand-500/[0.06] rounded-full blur-[100px] pointer-events-none" style={{ opacity: 0 }} />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/30 animate-glow-pulse">
                <Banknote size={32} className="text-white" />
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display tracking-tight mb-4">
                Pronto para organizar{' '}
                <span className="text-gold-gradient">suas finanças</span>?
              </h2>

              <p className="text-slate-400 max-w-md mx-auto mb-10 text-base sm:text-lg">
                Crie sua conta gratuitamente e tenha controle total do seu dinheiro.
                Sem cartão de crédito, sem pegadinhas.
              </p>

              <Link
                to="/register"
                className="btn-shimmer group inline-flex items-center gap-2.5 px-10 py-4.5 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white font-bold text-base transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/25 hover:scale-[1.03] active:scale-[0.98]"
              >
                <Zap size={20} />
                Começar Agora — É Grátis
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Banknote size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-400 font-display">
              Money<span className="text-brand-400">Trail</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MoneyTrail. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
