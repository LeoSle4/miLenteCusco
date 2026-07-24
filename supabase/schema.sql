-- Mi Lente en Cusco — esquema de base de datos
-- Pega y ejecuta esto en Supabase: Project > SQL Editor > New query > Run

-- 1. Tabla de fotos
create table if not exists fotos (
  id uuid primary key default gen_random_uuid(),
  dia int not null,
  reto_id text,
  nota text default '',
  mood text,
  formato text default 'cuadrado',
  image_path text not null, -- ruta dentro del bucket 'fotos'
  created_at timestamptz not null default now()
);

-- 2. Habilitar Row Level Security
alter table fotos enable row level security;

-- 3. Políticas: como no hay cuentas de usuario (acceso por PIN en el cliente),
--    dejamos lectura y escritura abiertas a través de la anon key.
--    La app la protege con el PIN antes de dejar entrar a esta pantalla.
create policy "Cualquiera con la anon key puede leer fotos"
  on fotos for select
  using (true);

create policy "Cualquiera con la anon key puede subir fotos"
  on fotos for insert
  with check (true);

-- 4. Bucket de Storage para las imágenes
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do nothing;

-- 5. Políticas de Storage: lectura pública, escritura abierta (protegida por PIN en la app)
create policy "Lectura pública de fotos"
  on storage.objects for select
  using (bucket_id = 'fotos');

create policy "Subida pública de fotos"
  on storage.objects for insert
  with check (bucket_id = 'fotos');

-- 6. Habilitar Realtime para que la galería se actualice sola cuando suban fotos nuevas
alter publication supabase_realtime add table fotos;
