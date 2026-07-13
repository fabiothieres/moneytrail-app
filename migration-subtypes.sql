-- ============================================================
-- MIGRAÇÃO — Novas colunas para subtipo de transação
-- Execute no SQL Editor do Supabase
-- ============================================================

alter table public.transactions
  add column if not exists income_subtype  text check (income_subtype  in ('fixed', 'variable')),
  add column if not exists expense_subtype text check (expense_subtype in ('essential', 'superfluous', 'investment'));
