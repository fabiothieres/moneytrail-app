-- ============================================================
-- MIGRAÇÃO — Seletor de Meses e Correção Contábil
-- Execute no SQL Editor do Supabase
-- ============================================================

create or replace function public.get_financial_summary(p_year int default null, p_month int default null)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid          uuid := auth.uid();
  v_total_income  numeric := 0;
  v_total_expense numeric := 0;
  v_month_income  numeric := 0;
  v_month_expense numeric := 0;
  v_target_date   date;
begin

  -- Determinar a data alvo baseada nos parâmetros
  if p_year is null or p_month is null then
    v_target_date := current_date;
  else
    v_target_date := make_date(p_year, p_month, 1);
  end if;

  -- Totais consolidados (Todos os tempos)
  select
    coalesce(sum(case when type = 'income'  then amount else 0 end), 0),
    coalesce(sum(case when type = 'expense' then amount else 0 end), 0)
  into v_total_income, v_total_expense
  from public.transactions
  where user_id = v_uid
    and status  = 'confirmed';

  -- Totais do mês selecionado
  select
    coalesce(sum(case when type = 'income'  then amount else 0 end), 0),
    coalesce(sum(case when type = 'expense' then amount else 0 end), 0)
  into v_month_income, v_month_expense
  from public.transactions
  where user_id = v_uid
    and status  = 'confirmed'
    and date_trunc('month', date) = date_trunc('month', v_target_date);

  return json_build_object(
    'total_income',   v_total_income,
    'total_expense',  v_total_expense,
    'total_balance',  v_total_income - v_total_expense,
    'month_income',   v_month_income,
    'month_expense',  v_month_expense,
    'month_balance',  v_month_income - v_month_expense
  );

end;
$$;
