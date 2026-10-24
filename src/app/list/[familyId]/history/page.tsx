import { redirect } from 'next/navigation'
import { Gift, History } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { formatPrice } from '../types'

interface ArchivedItem {
  id: string
  name: string
  price: number | null
  product_image_url: string | null
  user_id: string
  purchased_by: string | null
  archived_at: string
  archived_season: string | null
}

export default async function HistoryPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('id, name, user_id, list_members(profile_id)')
    .eq('id', familyId)
    .single()

  if (listError || !list) {
    return <ErrorState title="List not found" message={listError?.message} />
  }

  const isMember = list.user_id === user.id || list.list_members.some((m: { profile_id: string }) => m.profile_id === user.id)
  if (!isMember) {
    redirect('/')
  }

  const { data: items, error } = await supabase
    .from('items')
    .select('id, name, price, product_image_url, user_id, purchased_by, archived_at, archived_season')
    .eq('list_id', familyId)
    .not('archived_at', 'is', null)
    .order('archived_at', { ascending: false })
    .order('name')

  if (error) {
    return <ErrorState title="We couldn’t load previous years" message={error.message} />
  }

  const archived = items as ArchivedItem[]
  const profileIds = [...new Set(archived.flatMap((i) => [i.user_id, i.purchased_by]).filter((id): id is string => Boolean(id)))]
  const { data: profiles } = profileIds.length
    ? await supabase.from('profiles').select('id, full_name').in('id', profileIds)
    : { data: [] }
  const names = new Map((profiles ?? []).map((p: { id: string; full_name: string }) => [p.id, p.full_name]))
  const nameOf = (id: string | null) => (id === user.id ? 'You' : (id && names.get(id)) || 'Someone')

  // Season → recipient → gifts, newest season first.
  const seasons: { name: string; people: Map<string, ArchivedItem[]> }[] = []
  for (const item of archived) {
    const seasonName = item.archived_season || 'Earlier'
    let season = seasons.find((s) => s.name === seasonName)
    if (!season) {
      season = { name: seasonName, people: new Map() }
      seasons.push(season)
    }
    season.people.set(item.user_id, [...(season.people.get(item.user_id) ?? []), item])
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader back={{ href: `/list/${familyId}`, label: list.name }} title="Previous years" description="Gifts given in past seasons, so nobody gets the same thing twice." />

      {seasons.length === 0 ? (
        <Card>
          <EmptyState
            icon={<History className="h-6 w-6" />}
            title="No past seasons yet"
            description="When the list owner starts a new season, everything that was claimed moves here."
          />
        </Card>
      ) : (
        <div className="space-y-10">
          {seasons.map((season) => (
            <section key={season.name} aria-labelledby={`season-${season.name}`}>
              <h2 id={`season-${season.name}`} className="mb-4 font-display text-2xl font-semibold text-ink">{season.name}</h2>
              <div className="space-y-4">
                {[...season.people.entries()]
                  .sort(([a], [b]) => nameOf(a).localeCompare(nameOf(b)))
                  .map(([recipientId, gifts]) => (
                    <Card key={recipientId} className="p-4 sm:p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <Avatar name={names.get(recipientId)} id={recipientId} size="sm" />
                        <h3 className="font-semibold text-ink">{recipientId === user.id ? 'You received' : `${nameOf(recipientId)} received`}</h3>
                      </div>
                      <ul className="divide-y divide-line">
                        {gifts.map((gift) => (
                          <li key={gift.id} className="flex items-center gap-3 py-2.5">
                            {gift.product_image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={gift.product_image_url} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-lg border border-line bg-white object-contain p-0.5" />
                            ) : (
                              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted/60">
                                <Gift className="h-4 w-4" />
                              </span>
                            )}
                            <span className="min-w-0 flex-1">
                              <span className="block break-words text-sm font-medium text-ink">{gift.name}</span>
                              <span className="text-xs text-muted">
                                {gift.purchased_by ? `From ${nameOf(gift.purchased_by)}` : 'Giver unknown'}
                                {formatPrice(gift.price) ? ` · ${formatPrice(gift.price)}` : ''}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
