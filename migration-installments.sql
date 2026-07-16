alter table public.transactions
  add column if not exists is_installment      boolean default false,
  add column if not exists installment_current integer,
  add column if not exists installment_total   integer;
