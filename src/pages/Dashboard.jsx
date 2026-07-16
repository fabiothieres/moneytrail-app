import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import { supabase } from '../lib/supabase'
import {
  Wallet, TrendingUp, TrendingDown, BarChart3,
  CalendarDays, RefreshCw, Filter
} from 'lucide-react'

function formatBRL(n = 0) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    let args = {}
    if (selectedMonth) {
      const [y, m] = selectedMonth.split('-')
      args = { p_year: parseInt(y), p_month: parseInt(m) }
    }
    const { data, error } = await supabase.rpc('get_financial_summary', args)
    if (!error && data) {
      setSummary(data)
      setLastUpdated(new Date())
    }
    setLoading(false)
  }, [selectedMonth])

  useEffect(() => { fetchSummary() }, [fetchSummary, selectedMonth])

  const stats = summary
    ? [
        {
          title: 'Saldo Total',
          value: formatBRL(summary.total_balance),
          Icon:  Wallet,
          color: summary.total_balance >= 0 ? 'brand' : 'red',
          trend: summary.total_balance >= 0 ? 'up' : 'down',
        },
        {
          title: 'Entradas Totais',
          value: formatBRL(summary.total_income),
          Icon:  TrendingUp,
          color: 'green',
          trend: 'up',
        },
        {
          title: 'Saídas Totais',
          value: formatBRL(summary.total_expense),
          Icon:  TrendingDown,
          color: 'red',
          trend: 'down',
        },
        {
          title: 'Saldo do Mês',
          value: formatBRL(summary.month_balance),
          Icon:  BarChart3,
          color: summary.month_balance >= 0 ? 'blue' : 'red',
          trend: summary.month_balance >= 0 ? 'up' : 'down',
        },
        {
          title: 'Entradas do Mês',
          value: formatBRL(summary.month_income),
          Icon:  TrendingUp,
          color: 'green',
          trend: 'up',
        },
        {
          title: 'Saídas do Mês',
          value: formatBRL(summary.month_expense),
          Icon:  TrendingDown,
          color: 'red',
          trend: 'down',
        },
      ]
    : Array.from({ length: 6 }).map((_, i) => ({ title: '—', value: 0, Icon: Wallet, color: 'brand', trend: 'neutral', i }))

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-muted mt-1 flex items-center gap-1.5">
            <CalendarDays size={14} />
            Resumo financeiro atualizado
            {lastUpdated && ` às ${lastUpdated.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
            <Filter size={14} className="text-surface-muted" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
            {!selectedMonth && <span className="text-xs text-surface-muted ml-1">(Exibindo mês atual)</span>}
          </div>

          <button
            onClick={fetchSummary}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border text-surface-muted hover:text-white hover:border-brand-500 disabled:opacity-40 transition-all text-sm h-[38px]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <StatCard
            key={i}
            title={s.title}
            value={s.value}
            Icon={s.Icon}
            color={s.color}
            trend={s.trend}
            loading={loading}
          />
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl border border-surface-border bg-surface-card/50 text-xs text-surface-muted flex items-center gap-2">
        <BarChart3 size={14} className="text-brand-500 flex-shrink-0" />
        Os totais são calculados no banco de dados via função RPC segura — nenhum dado sensível é exposto ao front-end.
      </div>
    </Layout>
  )
}
