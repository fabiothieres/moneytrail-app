import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import { X, Loader2, Save } from 'lucide-react'

const INCOME_SUBTYPES  = [
  { value: 'fixed',       label: 'Fixa'          },
  { value: 'variable',    label: 'Variável'       },
]
const EXPENSE_SUBTYPES = [
  { value: 'essential',   label: 'Essencial'      },
  { value: 'superfluous', label: 'Supérfluo'      },
  { value: 'investment',  label: 'Investimento'   },
]

/**
 * EditTransactionModal
 * Props:
 *  - transaction: objeto completo da transação
 *  - categories:  array de categorias do usuário
 *  - onClose:     () => void
 *  - onSuccess:   () => void   (recarrega a lista)
 */
export default function EditTransactionModal({ transaction, categories, onClose, onSuccess }) {
  const [form,    setForm]    = useState({ ...transaction })
  const [loading, setLoading] = useState(false)

  // Fecha ao pressionar ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category_id: '', income_subtype: null, expense_subtype: null } : {}),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || Number(form.amount) <= 0) {
      toast.error('Informe um valor válido.')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('transactions')
      .update({
        type:            form.type,
        amount:          Number(form.amount),
        category_id:     form.category_id || null,
        date:            form.date,
        description:     form.description,
        status:          form.status,
        income_subtype:  form.type === 'income'  ? (form.income_subtype  || null) : null,
        expense_subtype: form.type === 'expense' ? (form.expense_subtype || null) : null,
      })
      .eq('id', transaction.id)

    setLoading(false)

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
    } else {
      toast.success('Transação atualizada!')
      onSuccess?.()
      onClose()
    }
  }

  const filteredCategories = categories.filter(c => c.type === form.type)
  const subtypes     = form.type === 'income' ? INCOME_SUBTYPES  : EXPENSE_SUBTYPES
  const subtypeField = form.type === 'income' ? 'income_subtype' : 'expense_subtype'
  const subtypeLabel = form.type === 'income' ? 'Tipo de Renda'  : 'Tipo de Gasto'

  const inputClass = 'w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all'
  const labelClass = 'block text-xs font-medium text-surface-muted mb-1.5'

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-2xl shadow-black/50 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-white">Editar Transação</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-surface-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">

          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2">
            {['income', 'expense'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, type: t, category_id: '', income_subtype: null, expense_subtype: null }))}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'bg-surface border-surface-border text-surface-muted hover:text-white'
                }`}
              >
                {t === 'income' ? '+ Entrada' : '− Saída'}
              </button>
            ))}
          </div>

          {/* Subtipo */}
          <div>
            <label className={labelClass}>{subtypeLabel}</label>
            <div className="grid grid-cols-3 gap-2">
              {subtypes.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, [subtypeField]: prev[subtypeField] === s.value ? null : s.value }))}
                  className={`py-2 rounded-xl text-xs font-medium transition-all border ${
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
            <select name="category_id" value={form.category_id ?? ''} onChange={handleChange} className={inputClass}>
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
              value={form.description ?? ''}
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
              <option value="cancelled">Cancelado</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-surface-border text-surface-muted hover:text-white text-sm font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-brand-500/30"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Salvando…</>
                : <><Save size={16} /> Salvar</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
