import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Loader2 } from 'lucide-react'

const INCOME_SUBTYPES = [
  { value: 'fixed',    label: 'Fixa'     },
  { value: 'variable', label: 'Variável' },
]

const EXPENSE_SUBTYPES = [
  { value: 'essential',   label: 'Essencial'   },
  { value: 'superfluous', label: 'Supérfluo'   },
  { value: 'investment',  label: 'Investimento' },
]

export default function TransactionForm({ onSuccess }) {
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [form, setForm] = useState({
    type:           'expense',
    amount:         '',
    category_id:    '',
    date:           new Date().toISOString().slice(0, 10),
    description:    '',
    status:         'confirmed',
    income_subtype: '',
    expense_subtype:'',
  })

  useEffect(() => {
    if (!user) return
    supabase
      .from('categories')
      .select('id, name, type')
      .eq('user_id', user.id)
      .order('name')
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setCategories(data ?? [])
      })
  }, [user])

  const filteredCategories = categories.filter(c => c.type === form.type)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category_id: '', income_subtype: '', expense_subtype: '' } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Informe um valor válido.')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('transactions').insert({
      user_id:         user.id,
      type:            form.type,
      amount:          Number(form.amount),
      category_id:     form.category_id || null,
      date:            form.date,
      description:     form.description,
      status:          form.status,
      income_subtype:  form.type === 'income'  ? (form.income_subtype  || null) : null,
      expense_subtype: form.type === 'expense' ? (form.expense_subtype || null) : null,
    })
    setLoading(false)

    if (error) {
      toast.error('Erro ao salvar transação: ' + error.message)
    } else {
      toast.success('Transação adicionada!')
      setForm(prev => ({ ...prev, amount: '', description: '', category_id: '', income_subtype: '', expense_subtype: '' }))
      onSuccess?.()
    }
  }

  const inputClass = 'w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all'
  const labelClass = 'block text-xs font-medium text-surface-muted mb-1.5'

  const subtypes = form.type === 'income' ? INCOME_SUBTYPES : EXPENSE_SUBTYPES
  const subtypeField = form.type === 'income' ? 'income_subtype' : 'expense_subtype'
  const subtypeLabel = form.type === 'income' ? 'Tipo de Renda' : 'Tipo de Gasto'

  return (
    <form onSubmit={handleSubmit} className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5 animate-slide-up">
      <h2 className="text-base font-semibold text-white">Nova Transação</h2>

      {/* Tipo entrada/saída */}
      <div className="grid grid-cols-2 gap-2">
        {['income', 'expense'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setForm(prev => ({ ...prev, type: t, category_id: '', income_subtype: '', expense_subtype: '' }))}
            className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              form.type === t
                ? t === 'income'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-surface border border-surface-border text-surface-muted hover:text-white'
            }`}
          >
            {t === 'income' ? '+ Entrada' : '− Saída'}
          </button>
        ))}
      </div>

      {/* Subtipo (Tipo de Renda / Tipo de Gasto) */}
      <div>
        <label className={labelClass}>{subtypeLabel}</label>
        <div className="grid grid-cols-3 gap-2">
          {subtypes.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, [subtypeField]: prev[subtypeField] === s.value ? '' : s.value }))}
              className={`py-2 rounded-xl text-xs font-medium transition-all duration-200 border ${
                form[subtypeField] === s.value
                  ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                  : 'bg-surface border-surface-border text-surface-muted hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Valor e Data */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Valor (R$)</label>
          <input
            type="number"
            name="amount"
            min="0.01"
            step="0.01"
            placeholder="0,00"
            value={form.amount}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>Data</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Categoria */}
      <div>
        <label className={labelClass}>Categoria</label>
        <select name="category_id" value={form.category_id} onChange={handleChange} className={inputClass}>
          <option value="">— Selecione —</option>
          {filteredCategories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Descrição */}
      <div>
        <label className={labelClass}>Descrição</label>
        <input
          type="text"
          name="description"
          placeholder="Ex.: Aluguel julho"
          value={form.description}
          onChange={handleChange}
          className={inputClass}
          maxLength={120}
        />
      </div>

      {/* Status */}
      <div>
        <label className={labelClass}>Status</label>
        <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
          <option value="confirmed">Confirmado</option>
          <option value="pending">Pendente</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/30"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Salvando…</>
          : <><Plus size={16} /> Adicionar</>
        }
      </button>
    </form>
  )
}
