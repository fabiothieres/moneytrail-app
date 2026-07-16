
export default function StatCard({ title, value, Icon, trend = 'neutral', color = 'brand', loading = false }) {
  const colorMap = {
    brand:  { bg: 'bg-brand-500/10',   text: 'text-brand-400',   border: 'border-brand-500/20'  },
    green:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    red:    { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/20'    },
    purple: { bg: 'bg-purple-500/10',  text: 'text-purple-400',  border: 'border-purple-500/20' },
    blue:   { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/20'   },
  }

  const c = colorMap[color] ?? colorMap.brand

  const trendIcon = { up: '↑', down: '↓', neutral: '—' }[trend]
  const trendColor = { up: 'text-emerald-400', down: 'text-red-400', neutral: 'text-slate-500' }[trend]

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${c.border} bg-surface-card p-6 animate-slide-up transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30`}>
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 ${c.bg}`} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
            <Icon size={20} />
          </div>
          <span className={`text-xs font-medium ${trendColor}`}>{trendIcon}</span>
        </div>

        {loading ? (
          <div className="space-y-2">
            <div className="h-7 w-32 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
            <p className="text-sm text-surface-muted mt-1">{title}</p>
          </>
        )}
      </div>
    </div>
  )
}
