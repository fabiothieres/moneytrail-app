create extension if not exists "uuid-ossp";

create table if not exists public.categories (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null check (type in ('income', 'expense')),
  icon        text,
  color       text,
  created_at  timestamptz default now() not null
);

create index if not exists idx_categories_user_id on public.categories(user_id);

alter table public.categories enable row level security;

drop policy if exists "categories: select own" on public.categories;
drop policy if exists "categories: insert own" on public.categories;
drop policy if exists "categories: update own" on public.categories;
drop policy if exists "categories: delete own" on public.categories;

create policy "categories: select own"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "categories: insert own"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "categories: update own"
  on public.categories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "categories: delete own"
  on public.categories for delete
  using (auth.uid() = user_id);


create table if not exists public.transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  category_id   uuid references public.categories(id) on delete set null,
  amount        numeric(14, 2) not null check (amount > 0),
  type          text not null check (type in ('income', 'expense')),
  date          date not null default current_date,
  description   text,
  status        text not null default 'confirmed' check (status in ('confirmed', 'pending', 'cancelled')),
  income_subtype  text check (income_subtype in ('fixed', 'variable')),
  expense_subtype text check (expense_subtype in ('essential', 'superfluous', 'investment')),
  is_installment      boolean default false,
  installment_current integer,
  installment_total   integer,
  created_at    timestamptz default now() not null
);

create index if not exists idx_transactions_user_id   on public.transactions(user_id);
create index if not exists idx_transactions_date      on public.transactions(date desc);
create index if not exists idx_transactions_user_date on public.transactions(user_id, date desc);

alter table public.transactions enable row level security;

drop policy if exists "transactions: select own" on public.transactions;
drop policy if exists "transactions: insert own" on public.transactions;
drop policy if exists "transactions: update own" on public.transactions;
drop policy if exists "transactions: delete own" on public.transactions;

create policy "transactions: select own"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "transactions: insert own"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "transactions: update own"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "transactions: delete own"
  on public.transactions for delete
  using (auth.uid() = user_id);


create or replace function public.get_financial_summary(p_year int default null, p_month int default null)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid           uuid := auth.uid();
  v_total_income  numeric := 0;
  v_total_expense numeric := 0;
  v_month_income  numeric := 0;
  v_month_expense numeric := 0;
  v_target_date   date;
begin

  if p_year is null or p_month is null then
    v_target_date := current_date;
  else
    v_target_date := make_date(p_year, p_month, 1);
  end if;

  select
    coalesce(sum(case when type = 'income'  then amount else 0 end), 0),
    coalesce(sum(case when type = 'expense' then amount else 0 end), 0)
  into v_total_income, v_total_expense
  from public.transactions
  where user_id = v_uid
    and status  = 'confirmed';

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

revoke execute on function public.get_financial_summary(int, int) from public;
grant  execute on function public.get_financial_summary(int, int) to authenticated;


create or replace function public.seed_default_categories()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.categories (user_id, name, type, icon, color) values
    (new.id, 'Salário',       'income',  '💼', '#22c55e'),
    (new.id, 'Freelance',     'income',  '💻', '#3b82f6'),
    (new.id, 'Investimentos', 'income',  '📈', '#8b5cf6'),
    (new.id, 'Outros',        'income',  '🎯', '#06b6d4'),
    (new.id, 'Moradia',       'expense', '🏠', '#f97316'),
    (new.id, 'Alimentação',   'expense', '🍔', '#ef4444'),
    (new.id, 'Transporte',    'expense', '🚗', '#eab308'),
    (new.id, 'Saúde',         'expense', '🏥', '#ec4899'),
    (new.id, 'Educação',      'expense', '📚', '#14b8a6'),
    (new.id, 'Lazer',         'expense', '🎮', '#a855f7'),
    (new.id, 'Assinaturas',   'expense', '📱', '#6366f1'),
    (new.id, 'Outros',        'expense', '💳', '#64748b');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.seed_default_categories();
