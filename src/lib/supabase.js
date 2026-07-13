import { createClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase singleton.
 *
 * As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 * devem estar no arquivo .env (nunca comite o .env!).
 *
 * A chave anon é segura para uso no front-end pois o acesso
 * real aos dados é controlado pelas políticas RLS no Supabase.
 */
const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    '[supabase.js] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas.\n' +
    'Copie .env.example para .env e preencha com seus dados do Supabase.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
