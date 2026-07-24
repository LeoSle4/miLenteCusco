-- Mi Lente en Cusco — hilo de comentarios por foto
-- Pega y ejecuta esto en Supabase: Project > SQL Editor > New query > Run
-- (No borra ni toca la tabla 'fotos' existente, solo agrega esta nueva)

create table if not exists comentarios (
  id uuid primary key default gen_random_uuid(),
  foto_id uuid not null references fotos(id) on delete cascade,
  autor text not null,
  texto text not null,
  created_at timestamptz not null default now()
);

alter table comentarios enable row level security;

create policy "Cualquiera con la anon key puede leer comentarios"
  on comentarios for select
  using (true);

create policy "Cualquiera con la anon key puede comentar"
  on comentarios for insert
  with check (true);

alter publication supabase_realtime add table comentarios;
