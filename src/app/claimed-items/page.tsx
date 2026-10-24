import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import ErrorState from '@/components/ui/ErrorState'
import ClaimedItemsClient, { type ClaimedItem } from './ClaimedItemsClient'

export default async function ClaimedItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, notes, price, product_url, product_title, product_image_url, user_id, list_id')
    .eq('purchased_by', user.id)
    .is('archived_at', null)
    .order('name', { ascending: true })

  if (error) {
    return <ErrorState title="We couldn’t load your shopping list" message={error.message} />
  }

  // Look up who each gift is for and which list it's on, so the page can group them.
  const recipientIds = [...new Set(items.map((i) => i.user_id))]
  const listIds = [...new Set(items.map((i) => i.list_id))]
  const [{ data: profiles }, { data: lists }] = await Promise.all([
    recipientIds.length ? supabase.from('profiles').select('id, full_name').in('id', recipientIds) : Promise.resolve({ data: [] }),
    listIds.length ? supabase.from('lists').select('id, name').in('id', listIds) : Promise.resolve({ data: [] }),
  ])
  const names = new Map((profiles ?? []).map((p: { id: string; full_name: string }) => [p.id, p.full_name]))
  const listNames = new Map((lists ?? []).map((l: { id: string; name: string }) => [l.id, l.name]))

  const claimedItems: ClaimedItem[] = items.map((item) => ({
    id: item.id,
    name: item.name,
    notes: item.notes ?? undefined,
    price: item.price ?? undefined,
    product_url: item.product_url ?? undefined,
    product_title: item.product_title ?? undefined,
    product_image_url: item.product_image_url ?? undefined,
    recipient_id: item.user_id,
    recipient_name: names.get(item.user_id) ?? 'Someone',
    list_id: item.list_id,
    list_name: listNames.get(item.list_id),
  }))

  return <ClaimedItemsClient claimedItems={claimedItems} currentUserId={user.id} />
}
