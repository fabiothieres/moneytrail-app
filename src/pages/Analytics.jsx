import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { BarChart2, PieChart as PieIcon, RefreshCw, Filter } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'

const CHART_COLORS = [
  '#22c55e','#3b82f6','#f97316','#a855f7','#ec4899',
  '#eab308','#14b8a6','#6366f1','#ef4444','#06b6d4',
  '#84cc16','#fb923c','#8b5cf6','#64748b','#f43f5e',
]

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function formatBRLShort(n) {
  if (n >= 1000) return `R$${(n / 1000).toFixed(1)}k`
  return `R$${n.toFixed(0)}`
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-white mb-1">{d.name}</p>
      <p style={{ color: d.payload.fill ?? d.fill }}>{formatBRL(d.value)}</p>
    </div>
  )
}

function ChartCard({ title, data, colorOffset = 0, loading }) {
  const [chartType, setChartType] = useState('pie') // 'pie' | 'bar'

  const colored = data.map((d, i) => ({
    ...d,
    fill: CHART_COLORS[(i + colorOffset) % CHART_COLORS.length],
  }))

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <div className="flex gap-1 bg-surface rounded-lg p-1 border border-surface-border">
          <button
            onClick={() => setChartType('pie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              chartType === 'pie'
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-surface-muted hover:text-white'
            }`}
          >
            <PieIcon size={13} /> Pizza
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              chartType === 'bar'
                ? 'bg-brand-500/20 text-brand-400'
                : 'text-surface-muted hover:text-white'
            }`}
          >
            <BarChart2 size={13} /> Torres
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-surface-muted text-sm">
          Nenhum dado para exibir
        </div>
      ) : chartType === 'pie' ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={colored}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={45}
              paddingAngle={3}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {colored.map((entry, i) => (
                <Cell key={i} fill={entry.fill} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={colored} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#64748b', fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              interval={0}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={formatBRLShort}
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {colored.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default function Analytics() {
  const { user } = useAuth()
  const [expenseData, setExpenseData] = useState([])
  const [incomeData,  setIncomeData]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    let query = supabase
      .from('transactions')
      .select('type, amount, income_subtype, categories(name)')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')

    if (selectedMonth) {
      const [y, m] = selectedMonth.split('-').map(Number)
      const start = new Date(y, m - 1, 1).toISOString().slice(0, 10)
      const end = new Date(y, m, 0).toISOString().slice(0, 10)
      query = query.gte('date', start).lte('date', end)
    }

    const { data, error } = await query.limit(100)

    if (error) {
      toast.error('Erro ao carregar gráficos: ' + error.message)
      setLoading(false)
      return
    }

    const expenseMap = {}

    const SUBTYPE_LABEL = { fixed: 'Renda Fixa', variable: 'Renda Variável' }
    const incomeMap  = {}

    ;(data ?? []).forEach(tx => {
      if (tx.type === 'expense') {
        const name = tx.categories?.name ?? 'Sem categoria'
        expenseMap[name] = (expenseMap[name] ?? 0) + Number(tx.amount)
      } else {
        const label = SUBTYPE_LABEL[tx.income_subtype] ?? 'Sem classificação'
        incomeMap[label] = (incomeMap[label] ?? 0) + Number(tx.amount)
      }
    })

    const toArray = (map) =>
      Object.entries(map)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)

    setExpenseData(toArray(expenseMap))
    setIncomeData(toArray(incomeMap))
    setLoading(false)
  }, [user, selectedMonth])

  useEffect(() => { fetchData() }, [fetchData])

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Gráficos</h1>
          <p className="text-sm text-surface-muted mt-1">
            Análise visual {selectedMonth ? `do mês ${selectedMonth.split('-').reverse().join('/')}` : 'de todos os períodos'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all h-[38px]">
            <Filter size={14} className="text-surface-muted" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          
          <button
            onClick={() => setSelectedMonth(selectedMonth ? '' : new Date().toISOString().slice(0, 7))}
            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all h-[38px] ${
              !selectedMonth
                ? 'bg-brand-500/20 border-brand-500/40 text-brand-400'
                : 'border-surface-border text-surface-muted hover:text-white'
            }`}
          >
            Ver Todos
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-surface-border text-surface-muted hover:text-white hover:border-brand-500 disabled:opacity-40 transition-all text-sm h-[38px]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ChartCard
          title="Tipos de Gastos"
          data={expenseData}
          colorOffset={4}
          loading={loading}
        />
        <ChartCard
          title="Entradas: Fixa vs Variável"
          data={incomeData}
          colorOffset={0}
          loading={loading}
        />
      </div>

      <p className="text-xs text-surface-muted text-center mt-6">
        Exibindo transações confirmadas {selectedMonth ? 'do mês selecionado' : 'de todos os meses'} · máx. 100 registros
      </p>
    </Layout>
  )
}
