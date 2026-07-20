-- Execute no SQL Editor do Supabase.
create extension if not exists "pgcrypto";

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  short_description text not null,
  result_description text not null,
  image_url text,
  live_url text,
  status text not null default 'online' check (status in ('online','desenvolvimento','demonstracao')),
  featured boolean not null default false,
  published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute procedure public.set_updated_at();

alter table public.admins enable row level security;
alter table public.projects enable row level security;

create policy "Public can read published projects" on public.projects for select using (published = true or exists(select 1 from public.admins a where a.user_id = auth.uid()));
create policy "Admins can insert projects" on public.projects for insert with check (exists(select 1 from public.admins a where a.user_id = auth.uid()));
create policy "Admins can update projects" on public.projects for update using (exists(select 1 from public.admins a where a.user_id = auth.uid())) with check (exists(select 1 from public.admins a where a.user_id = auth.uid()));
create policy "Admins can delete projects" on public.projects for delete using (exists(select 1 from public.admins a where a.user_id = auth.uid()));
create policy "Admin can read own membership" on public.admins for select using (user_id = auth.uid());

insert into storage.buckets (id, name, public) values ('project-images','project-images',true) on conflict (id) do update set public=true;
create policy "Public can view project images" on storage.objects for select using (bucket_id='project-images');
create policy "Admins can upload project images" on storage.objects for insert with check (bucket_id='project-images' and exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "Admins can update project images" on storage.objects for update using (bucket_id='project-images' and exists(select 1 from public.admins a where a.user_id=auth.uid()));
create policy "Admins can delete project images" on storage.objects for delete using (bucket_id='project-images' and exists(select 1 from public.admins a where a.user_id=auth.uid()));

-- Depois de criar o usuário em Authentication > Users, substitua o UUID abaixo:
-- insert into public.admins(user_id) values ('UUID-DO-SEU-USUARIO');
