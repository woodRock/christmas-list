create table public.lists (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  name text null,
  constraint lists_pkey primary key (id),
  constraint lists_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;