create or replace function reorder_items (items_data json) returns void as $$
declare
  item record;
begin
  for item in
    select * from json_to_recordset(items_data) as x(id uuid, order_index int)
  loop
    update public.items
    set order_index = item.order_index
    where id = item.id;
  end loop;
end;
$$ language plpgsql;