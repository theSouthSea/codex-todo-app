create extension if not exists pgcrypto;

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) > 0),
  tags text[] not null default array['notUrgent', 'notImportant']::text[],
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint todos_tags_allowed check (
    tags <@ array['urgent', 'important', 'notUrgent', 'notImportant']::text[]
  ),
  constraint todos_urgency_tags_mutually_exclusive check (
    not ('urgent' = any(tags) and 'notUrgent' = any(tags))
  ),
  constraint todos_importance_tags_mutually_exclusive check (
    not ('important' = any(tags) and 'notImportant' = any(tags))
  )
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists todos_set_updated_at on public.todos;
create trigger todos_set_updated_at
before update on public.todos
for each row
execute function public.set_updated_at();

alter table public.todos enable row level security;

drop policy if exists "Todos are publicly readable" on public.todos;
drop policy if exists "Todos are publicly insertable" on public.todos;
drop policy if exists "Todos are publicly updatable" on public.todos;
drop policy if exists "Todos are publicly deletable" on public.todos;

create policy "Todos are publicly readable" on public.todos
  for select
  to anon, authenticated
  using (true);

create policy "Todos are publicly insertable" on public.todos
  for insert
  to anon, authenticated
  with check (true);

create policy "Todos are publicly updatable" on public.todos
  for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Todos are publicly deletable" on public.todos
  for delete
  to anon, authenticated
  using (true);

create index if not exists todos_created_at_idx on public.todos (created_at desc);
