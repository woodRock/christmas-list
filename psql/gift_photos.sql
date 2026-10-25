-- Gift photos: a public-read Storage bucket with files under <list_id>/<random>.
-- Anyone with a photo's exact URL can view it (like retailer images); only
-- members of the list can upload, list or delete files in its folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gift-photos', 'gift-photos', true, 5242880, array['image/jpeg', 'image/webp', 'image/png'])
on conflict (id) do nothing;

-- The list a photo belongs to, from its path; null for anything malformed so
-- policies never fail on a bad cast.
create or replace function public.gift_photo_list (p_name text)
returns uuid as $$
  select case
    when split_part(p_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then split_part(p_name, '/', 1)::uuid
  end;
$$ language sql immutable set search_path = public;

-- Whether any gift (current or archived) still shows this photo.
create or replace function public.gift_photo_in_use (p_name text)
returns boolean as $$
  select exists (
    select 1 from public.items
    where list_id = public.gift_photo_list(p_name)
      and product_image_url like '%/storage/v1/object/public/gift-photos/' || p_name
  );
$$ language sql stable security definer set search_path = public;

revoke all on function public.gift_photo_list(text), public.gift_photo_in_use(text) from public, anon;
grant execute on function public.gift_photo_list(text), public.gift_photo_in_use(text) to authenticated;

drop policy if exists "gift_photos_insert" on storage.objects;
drop policy if exists "gift_photos_select" on storage.objects;
drop policy if exists "gift_photos_delete" on storage.objects;

create policy "gift_photos_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'gift-photos' and public.is_list_member(public.gift_photo_list(name)));

-- Needed by the Storage API to delete; viewing goes through public URLs.
create policy "gift_photos_select" on storage.objects for select to authenticated
  using (bucket_id = 'gift-photos' and public.is_list_member(public.gift_photo_list(name)));

-- Only photos no gift uses any more, so cleanup can't break anyone's gift.
create policy "gift_photos_delete" on storage.objects for delete to authenticated
  using (
    bucket_id = 'gift-photos'
    and public.is_list_member(public.gift_photo_list(name))
    and not public.gift_photo_in_use(name)
  );
