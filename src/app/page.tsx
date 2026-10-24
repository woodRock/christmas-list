import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight, Gift, Link2, Plus, TreePine } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Alert from '@/components/ui/Alert'
import EmptyState from '@/components/ui/EmptyState'
import { buttonClasses } from '@/components/ui/Button'

function daysUntilChristmas() {
  const now = new Date()
  let christmas = new Date(now.getFullYear(), 11, 25)
  if (now > new Date(now.getFullYear(), 11, 26)) christmas = new Date(now.getFullYear() + 1, 11, 25)
  return Math.max(0, Math.ceil((christmas.getTime() - now.getTime()) / 86_400_000))
}

const tileColors = [
  'bg-primary-soft text-primary',
  'bg-accent-soft text-accent',
  'bg-gold-soft text-gold',
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const [{ data: families, error }, { data: profile }] = await Promise.all([
    supabase.rpc('get_lists_for_user', { p_user_id: user.id }),
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  const firstName = (profile?.full_name || user.user_metadata?.full_name || '').split(' ')[0]
  const days = daysUntilChristmas()
  const lists = (families ?? []) as { id: string; name: string }[]

  return (
    <div>
      <PageHeader
        title={firstName ? `Hi, ${firstName}` : 'Your lists'}
        description={
          days === 0 ? 'Merry Christmas! 🎄' : (
            <span className="inline-flex items-center gap-1.5">
              <TreePine className="h-4 w-4 text-primary" aria-hidden />
              {days} {days === 1 ? 'day' : 'days'} until Christmas
            </span>
          )
        }
        actions={
          lists.length > 0 && (
            <Link href="/create-family" className={buttonClasses()}>
              <Plus className="h-4 w-4" aria-hidden />
              New list
            </Link>
          )
        }
      />

      {error && <Alert className="mb-6">We couldn&apos;t load your lists: {error.message}</Alert>}

      {lists.length === 0 && !error ? (
        <Card>
          <EmptyState
            icon={<Gift className="h-6 w-6" />}
            title="Start your first gift list"
            description="A list brings your family together in one place. Everyone adds their wishes, and you can quietly claim what you'll buy for each other."
            action={
              <div className="flex flex-col items-center gap-3">
                <Link href="/create-family" className={buttonClasses({ size: 'lg' })}>
                  <Plus className="h-4 w-4" aria-hidden />
                  Create a list
                </Link>
                <p className="inline-flex items-center gap-1.5 text-sm text-muted">
                  <Link2 className="h-4 w-4" aria-hidden />
                  Joining someone else&apos;s? Open the invite link they sent you.
                </p>
              </div>
            }
          />
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {lists.map((family, i) => (
            <li key={family.id}>
              <Link
                href={`/list/${family.id}`}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card transition hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lift sm:p-5"
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tileColors[i % tileColors.length]}`}>
                  <Gift className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-lg font-semibold text-ink">{family.name}</span>
                  <span className="text-sm text-muted">Open list</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
