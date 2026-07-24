-- Mi Lente en Cusco — reacciones ilustradas por foto
-- Pega y ejecuta esto en Supabase: Project > SQL Editor > New query > Run
-- (Aditivo, no toca las tablas existentes)

create table if not exists reacciones (
  id uuid primary key default gen_random_uuid(),
  foto_id uuid not null references fotos(id) on delete cascade,
  autor text not null,
  tipo text not null check (tipo in ('corazon', 'estrella', 'cafe', 'llorando')),
  created_at timestamptz not null default now(),
  unique (foto_id, autor, tipo)
);

alter table reacciones enable row level security;

create policy "Cualquiera con la anon key puede leer reacciones"
  on reacciones for select
  using (true);

create policy "Cualquiera con la anon key puede reaccionar"
  on reacciones for insert
  with check (true);

create policy "Cualquiera con la anon key puede quitar su reaccion"
  on reacciones for delete
  using (true);

alter publication supabase_realtime add table reacciones;
