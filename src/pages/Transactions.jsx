import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import TransactionForm from '../components/TransactionForm'
import TransactionList from '../components/TransactionList'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Zap, Loader2, Filter, TrendingUp, TrendingDown, LayoutList } from 'lucide-react'

const MOCK_TRANSACTIONS = [
  { type: 'income',  amount: 5000.00, description: 'Salário Julho',       date: '2026-07-05', status: 'confirmed', income_subtype: 'fixed'      },
  { type: 'expense', amount:  850.00, description: 'Aluguel',             date: '2026-07-10', status: 'confirmed', expense_subtype: 'essential'  },
  { type: 'expense', amount:  320.50, description: 'Supermercado',        date: '2026-07-12', status: 'confirmed', expense_subtype: 'essential'  },
  { type: 'income',  amount:  750.00, description: 'Freelance Design',    date: '2026-07-08', status: 'confirmed', income_subtype: 'variable'    },
  { type: 'expense', amount:   99.90, description: 'Assinatura Adobe CC', date: '2026-07-01', status: 'confirmed', expense_subtype: 'superfluous' },
]

const PAGE_SIZE = 20

function getMonthRange(monthStr) {
  if (!monthStr) return null
  const [y, m] = monthStr.split('-').map(Number)
  const start = new Date(y, m - 1, 1).toISOString().slice(0, 10)
  const end = new Date(y, m, 0).toISOString().slice(0, 10)
  return { start, end }
}

// Filtros de tipo: all | income | expense
const TYPE_FILTERS = [
  { value: 'all',     label: 'Todos',     Icon: LayoutList,    active: 'bg-slate-700/50 text-white border-slate-600'        },
  { value: 'income',  label: 'Entradas',  Icon: TrendingUp,    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
  { value: 'expense', label: 'Saídas',    Icon: TrendingDown,  active: 'bg-red-500/20 text-red-400 border-red-500/40'       },
]

export default function Transactions() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState([])
  const [categories,   setCategories]   = useState([])
  const [loading,      setLoading]      = useState(true)
  const [page,         setPage]         = useState(1)
  const [totalPages,   setTotalPages]   = useState(1)
  const [selectedMonth,setSelectedMonth]= useState(new Date().toISOString().slice(0, 7))
  const [typeFilter,   setTypeFilter]   = useState('all')   // 'all' | 'income' | 'expense'
  const [mockLoading,  setMockLoading]  = useState(false)

  // Carrega categorias para o modal de edição
  useEffect(() => {
    if (!user) return
    supabase
      .from('categories')
      .select('id, name, type')
      .eq('user_id', user.id)
      .order('name')
      .then(({ data }) => setCategories(data ?? []))
  }, [user])

  const fetchTransactions = useCallback(async (p = 1) => {
    if (!user) return
    setLoading(true)

    const from = (p - 1) * PAGE_SIZE
    const to   = from + PAGE_SIZE - 1

    let query = supabase
      .from('transactions')
      .select('*, categories(name)', { count: 'exact' })
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (selectedMonth) {
      const { start, end } = getMonthRange(selectedMonth)
      query = query.gte('date', start).lte('date', end)
    }

    // Filtro de tipo (income / expense)
    if (typeFilter !== 'all') {
      query = query.eq('type', typeFilter)
    }

    const { data, count, error } = await query

    if (error) {
      toast.error('Erro ao buscar transações: ' + error.message)
    } else {
      setTransactions(data ?? [])
      setTotalPages(Math.ceil((count ?? 0) / PAGE_SIZE) || 1)
      setPage(p)
    }

    setLoading(false)
  }, [user, selectedMonth, typeFilter])

  useEffect(() => { fetchTransactions(1) }, [fetchTransactions])

  const handleMockImport = async () => {
    if (!user) return
    setMockLoading(true)

    const rows = MOCK_TRANSACTIONS.map(tx => ({
      user_id:         user.id,
      type:            tx.type,
      amount:          tx.amount,
      description:     tx.description,
      date:            tx.date,
      status:          tx.status,
      income_subtype:  tx.income_subtype  ?? null,
      expense_subtype: tx.expense_subtype ?? null,
      category_id:     null,
    }))

    const { error } = await supabase.from('transactions').insert(rows)
    setMockLoading(false)

    if (error) {
      toast.error('Erro ao importar mock: ' + error.message)
    } else {
      toast.success('5 transações mock importadas! 🎉')
      fetchTransactions(1)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transações</h1>
          <p className="text-sm text-surface-muted mt-1">
            {selectedMonth ? `Período: ${selectedMonth.split('-').reverse().join('/')}` : 'Todos os períodos'}
            {typeFilter !== 'all' && ` · ${typeFilter === 'income' ? 'Somente entradas' : 'Somente saídas'}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro de mês */}
          <div className="flex items-center gap-2 bg-surface border border-surface-border rounded-xl px-3 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all h-[38px]">
            <Filter size={14} className="text-surface-muted" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm text-white focus:outline-none [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
            />
          </div>
          
          {/* Botão Ver Todos */}
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

          {/* Mock import (Apenas admin) */}
          {user?.email === 'fabio_08cardoso@hotmail.com' && (
            <button
              onClick={handleMockImport}
              disabled={mockLoading}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 disabled:opacity-50 text-sm font-medium transition-all"
            >
              {mockLoading
                ? <><Loader2 size={14} className="animate-spin" /> Importando…</>
                : <><Zap size={14} /> Mock API</>
              }
            </button>
          )}
        </div>
      </div>

      {/* Filtros de tipo (Todos / Entradas / Saídas) */}
      <div className="flex gap-2 mb-6">
        {TYPE_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => { setTypeFilter(f.value); fetchTransactions(1) }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${
              typeFilter === f.value
                ? f.active
                : 'border-surface-border text-surface-muted hover:text-white hover:bg-white/5'
            }`}
          >
            <f.Icon size={14} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TransactionForm onSuccess={() => fetchTransactions(1)} />
        </div>
        <div className="lg:col-span-2">
          <TransactionList
            transactions={transactions}
            categories={categories}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={fetchTransactions}
            onRefresh={() => fetchTransactions(page)}
          />
        </div>
      </div>
    </Layout>
  )
}
