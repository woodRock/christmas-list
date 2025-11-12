create table public.items (
  id uuid not null default gen_random_uuid (),
  list_id uuid not null,
  name text null,
  is_purchased boolean null default false,
  purchased_by uuid null,
  user_id uuid null,
  order_index integer null,
  constraint items_pkey primary key (id),
  constraint items_list_id_fkey foreign KEY (list_id) references lists (id),
  constraint items_purchased_by_fkey foreign KEY (purchased_by) references auth.users (id),
  constraint items_user_id_fkey foreign KEY (user_id) references auth.users (id)
) TABLESPACE pg_default;