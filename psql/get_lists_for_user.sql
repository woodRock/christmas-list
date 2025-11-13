create or replace function get_lists_for_user(p_user_id uuid)
returns table(id uuid, name text) as
$$
  select id, name from lists
  where user_id = p_user_id
  union
  select l.id, l.name from lists l
  join list_members lm on l.id = lm.list_id
  where lm.profile_id = p_user_id
$$ language sql;