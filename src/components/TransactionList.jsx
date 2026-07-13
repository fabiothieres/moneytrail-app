import { useState } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { TrendingUp, TrendingDown, Clock, XCircle, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import EditTransactionModal from './EditTransactionModal'

const STATUS_MAP = {
  confirmed: { label: 'Confirmado', color: 'text-emerald-400', Icon: TrendingUp },
  pending:   { label: 'Pendente',   color: 'text-yellow-400',  Icon: Clock      },
  cancelled: { label: 'Cancelado',  color: 'text-red-400',     Icon: XCircle    },
}

const INCOME_SUBTYPE_MAP = {
  fixed:    { label: 'Fixa',     color: 'text-blue-400   bg-blue-500/10   border-blue-500/30'   },
  variable: { label: 'Variável', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
}

const EXPENSE_SUBTYPE_MAP = {
  essential:   { label: 'Essencial',    color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  superfluous: { label: 'Supérfluo',    color: 'text-pink-400   bg-pink-500/10   border-pink-500/30'   },
  investment:  { label: 'Investimento', color: 'text-cyan-400   bg-cyan-500/10   border-cyan-500/30'   },
}

function formatBRL(n) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)
}

function tryFormatDate(d) {
  try {
    return format(new Date(d + 'T00:00:00'), 'dd MMM yy', { locale: ptBR })
  } catch {
    return d
  }
}

function SubtypeBadge({ tx }) {
  const map   = tx.type === 'income' ? INCOME_SUBTYPE_MAP : EXPENSE_SUBTYPE_MAP
  const field = tx.type === 'income' ? tx.income_subtype  : tx.expense_subtype
  const entry = field ? map[field] : null
  if (!entry) return <span className="text-surface-muted text-xs">—</span>
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${entry.color}`}>
      {entry.label}
    </span>
  )
}

/**
 * TransactionList — Lista paginada com edição e exclusão.
 * Props:
 *  - transactions: array
 *  - categories:   array  (para o modal de edição)
 *  - loading:      boolean
 *  - page:         number
 *  - totalPages:   number
 *  - onPageChange: (page) => void
 *  - onRefresh:    () => void
 */
export default function TransactionList({ transactions = [], categories = [], loading, page, totalPages, onPageChange, onRefresh }) {
  const [editing,   setEditing]   = useState(null)   // transação sendo editada
  const [deletingId, setDeletingId] = useState(null) // id sendo deletado

  const handleDelete = async (tx) => {
    if (!window.confirm(`Deletar "${tx.description || 'esta transação'}"? Essa ação não pode ser desfeita.`)) return
    setDeletingId(tx.id)
    const { error } = await supabase.from('transactions').delete().eq('id', tx.id)
    setDeletingId(null)
    if (error) {
      toast.error('Erro ao deletar: ' + error.message)
    } else {
      toast.success('Transação removida.')
      onRefresh?.()
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-surface-card rounded-xl animate-pulse border border-surface-border" />
        ))}
      </div>
    )
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-16 text-surface-muted animate-fade-in">
        <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Nenhuma transação encontrada.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-2xl border border-surface-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                {['Descrição', 'Categoria', 'Tipo', 'Data', 'Status', 'Valor', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-surface-muted uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {transactions.map(tx => {
                const status   = STATUS_MAP[tx.status] ?? STATUS_MAP.confirmed
                const isIncome = tx.type === 'income'
                const isDeleting = deletingId === tx.id
                return (
                  <tr key={tx.id} className="hover:bg-white/3 transition-colors animate-fade-in">
                    <td className="px-4 py-3 text-white font-medium max-w-[140px] truncate">
                      {tx.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-surface-muted text-xs">
                      {tx.categories?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <SubtypeBadge tx={tx} />
                    </td>
                    <td className="px-4 py-3 text-surface-muted text-xs whitespace-nowrap">
                      {tryFormatDate(tx.date)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs ${status.color}`}>
                        <status.Icon size={12} />
                        {status.label}
                      </span>
                    </td>
                    <td className={`px-4 py-3 font-semibold whitespace-nowrap ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isIncome ? '+' : '−'} {formatBRL(tx.amount)}
                    </td>
                    {/* Ações */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditing(tx)}
                          className="p-1.5 rounded-lg text-surface-muted hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                          title="Editar"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx)}
                          disabled={isDeleting}
                          className="p-1.5 rounded-lg text-surface-muted hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all"
                          title="Deletar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-surface-muted">Página {page} de {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg border border-surface-border text-surface-muted hover:text-white hover:border-brand-500 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg border border-surface-border text-surface-muted hover:text-white hover:border-brand-500 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edição */}
      {editing && (
        <EditTransactionModal
          transaction={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSuccess={() => { setEditing(null); onRefresh?.() }}
        />
      )}
    </>
  )
}
