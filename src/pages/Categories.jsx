import { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Trash2, Loader2, Tag } from 'lucide-react'

const EMOJI_OPTIONS = ['💼','💻','📈','🎯','🏠','🍔','🚗','🏥','📚','🎮','📱','💳','✈️','🎵','🛍️','💡','🏋️','🐾','🎁','🍕','☕','🏖️','💰','📊']
const COLOR_OPTIONS = ['#22c55e','#3b82f6','#8b5cf6','#f97316','#ef4444','#eab308','#ec4899','#14b8a6','#06b6d4','#a855f7','#6366f1','#64748b','#f43f5e','#84cc16','#fb923c']

export default function Categories() {
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [tab,        setTab]        = useState('expense') // 'income' | 'expense'
  const [form, setForm] = useState({ name: '', type: 'expense', icon: '🎯', color: '#22c55e' })

  const fetchCategories = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    if (!error) setCategories(data ?? [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  // Sincroniza o type do form com a aba ativa
  useEffect(() => {
    setForm(prev => ({ ...prev, type: tab }))
  }, [tab])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Informe o nome da categoria.')
      return
    }
    setSaving(true)
    const { error } = await supabase.from('categories').insert({
      user_id: user.id,
      name:    form.name.trim(),
      type:    form.type,
      icon:    form.icon,
      color:   form.color,
    })
    setSaving(false)
    if (error) {
      toast.error('Erro ao criar categoria: ' + error.message)
    } else {
      toast.success('Categoria criada!')
      setForm(prev => ({ ...prev, name: '' }))
      fetchCategories()
    }
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao deletar: ' + error.message)
    } else {
      toast.success('Categoria removida.')
      setCategories(prev => prev.filter(c => c.id !== id))
    }
  }

  const filtered = categories.filter(c => c.type === tab)

  const inputClass = 'w-full bg-surface border border-surface-border rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-surface-muted focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all'
  const labelClass = 'block text-xs font-medium text-surface-muted mb-1.5'

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
          <Tag size={20} className="text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-sm text-surface-muted">Gerencie e crie suas categorias personalizadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Formulário de criação */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-5 animate-slide-up">
            <h2 className="text-base font-semibold text-white">Nova Categoria</h2>

            {/* Tipo */}
            <div className="grid grid-cols-2 gap-2">
              {[{ v:'income', l:'Entrada' }, { v:'expense', l:'Saída' }].map(t => (
                <button
                  key={t.v}
                  type="button"
                  onClick={() => { setTab(t.v); setForm(p => ({ ...p, type: t.v })) }}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    form.type === t.v
                      ? t.v === 'income'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                      : 'bg-surface border-surface-border text-surface-muted hover:text-white'
                  }`}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {/* Nome */}
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                placeholder="Ex.: Pet Shop"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className={inputClass}
                maxLength={40}
                required
              />
            </div>

            {/* Emoji */}
            <div>
              <label className={labelClass}>Ícone</label>
              <div className="grid grid-cols-8 gap-1.5">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, icon: emoji }))}
                    className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all border ${
                      form.icon === emoji
                        ? 'border-brand-500 bg-brand-500/20 scale-110'
                        : 'border-surface-border bg-surface hover:border-brand-500/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className={labelClass}>Cor</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, color }))}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full transition-all ${
                      form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-card scale-110' : 'hover:scale-110'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-surface-border">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ backgroundColor: form.color + '22', border: `1px solid ${form.color}44` }}
              >
                {form.icon}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{form.name || 'Nome da categoria'}</p>
                <p className="text-xs" style={{ color: form.color }}>{form.type === 'income' ? 'Entrada' : 'Saída'}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-brand-500/30"
            >
              {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando…</> : <><Plus size={16} /> Criar Categoria</>}
            </button>
          </form>
        </div>

        {/* Lista de categorias */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {[{ v:'expense', l:'Saídas' }, { v:'income', l:'Entradas' }].map(t => (
              <button
                key={t.v}
                onClick={() => setTab(t.v)}
                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  tab === t.v
                    ? t.v === 'income'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-red-500/20 text-red-400 border-red-500/40'
                    : 'border-surface-border text-surface-muted hover:text-white'
                }`}
              >
                {t.l} ({categories.filter(c => c.type === t.v).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-surface-card rounded-xl animate-pulse border border-surface-border" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-surface-muted">
              <Tag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nenhuma categoria nesta aba.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(cat => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 bg-surface-card border border-surface-border rounded-xl group hover:border-white/20 transition-all animate-fade-in"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ backgroundColor: (cat.color ?? '#64748b') + '22', border: `1px solid ${cat.color ?? '#64748b'}44` }}
                    >
                      {cat.icon ?? '🏷️'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{cat.name}</p>
                      <p className="text-xs" style={{ color: cat.color ?? '#64748b' }}>
                        {cat.type === 'income' ? 'Entrada' : 'Saída'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    title="Remover categoria"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
