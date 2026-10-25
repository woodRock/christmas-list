'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ClipboardCopy, ExternalLink, Gift, ShoppingBag, Undo2 } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button, { buttonClasses } from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import EmptyState from '@/components/ui/EmptyState'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/components/ui/cn'
import { useLocalStorage } from '@/components/ui/useLocalStorage'

export interface ClaimedItem {
  id: string
  name: string
  notes?: string
  price?: number
  product_url?: string
  product_title?: string
  product_image_url?: string
  recipient_id: string
  recipient_name: string
  list_id: string
  list_name?: string
}

// "Bought" ticks are a personal shopping aid, so they live in this browser only.
const BOUGHT_KEY = 'giftd:bought'

const money = (n: number) => `$${n.toFixed(2)}`

export default function ClaimedItemsClient({ claimedItems: initialClaimedItems }: { claimedItems: ClaimedItem[] }) {
  const [items, setItems] = useState<ClaimedItem[]>(initialClaimedItems)
  const [boughtRaw, setBoughtRaw] = useLocalStorage(BOUGHT_KEY, '[]')
  const bought = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(boughtRaw))
    } catch {
      return new Set<string>()
    }
  }, [boughtRaw])
  const toast = useToast()

  const toggleBought = (id: string) => {
    const next = new Set(bought)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setBoughtRaw(JSON.stringify([...next]))
  }

  const groups = useMemo(() => {
    const map = new Map<string, { id: string; name: string; items: ClaimedItem[] }>()
    for (const item of items) {
      const group = map.get(item.recipient_id) ?? { id: item.recipient_id, name: item.recipient_name, items: [] }
      group.items.push(item)
      map.set(item.recipient_id, group)
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  const total = items.reduce((sum, i) => sum + (i.price ?? 0), 0)
  const remaining = items.filter((i) => !bought.has(i.id)).length

  const unclaim = async (item: ClaimedItem) => {
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    const res = await fetch(`/api/gifts/${item.id}/unclaim`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } })
    if (res.ok) {
      toast(`Unclaimed “${item.name}”`, {
        action: {
          label: 'Undo',
          onClick: async () => {
            const claimRes = await fetch(`/api/gifts/${item.id}/claim`, { method: 'PATCH' })
            if (claimRes.ok) setItems((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)))
          },
        },
      })
    } else {
      setItems((prev) => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)))
      toast('Couldn’t unclaim that gift.', { tone: 'error' })
    }
  }

  const copyChecklist = async () => {
    let text = 'My Giftd shopping list\n'
    for (const group of groups) {
      text += `\nFor ${group.name}:\n`
      for (const item of group.items) {
        text += `${bought.has(item.id) ? '[x]' : '[ ]'} ${item.name}${item.price ? ` — ${money(item.price)}` : ''}\n`
        if (item.notes) text += `    ${item.notes}\n`
        if (item.product_url) text += `    ${item.product_url}\n`
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      toast('Shopping list copied — paste it into Notes or a message')
    } catch {
      toast('Couldn’t copy to the clipboard.', { tone: 'error' })
    }
  }

  return (
    <div>
      <PageHeader
        title="Shopping list"
        description={
          items.length === 0
            ? 'Gifts you claim from other people’s wishlists show up here.'
            : `${items.length} ${items.length === 1 ? 'gift' : 'gifts'} for ${groups.length} ${groups.length === 1 ? 'person' : 'people'} · ${remaining === 0 ? 'all bought 🎉' : `${remaining} still to buy`}${total > 0 ? ` · ${money(total)} total` : ''}`
        }
        actions={
          items.length > 0 && (
            <Button variant="secondary" onClick={copyChecklist}>
              <ClipboardCopy className="h-4 w-4" aria-hidden />
              Copy as checklist
            </Button>
          )
        }
      />

      {items.length === 0 ? (
        <Card>
          <EmptyState
            icon={<ShoppingBag className="h-6 w-6" />}
            title="Nothing claimed yet"
            description="Open a list and tap “I’ll get this” on a gift. Only you will know — the recipient never sees who claimed what."
            action={<Link href="/" className={buttonClasses()}>Browse your lists</Link>}
          />
        </Card>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => {
            const subtotal = group.items.reduce((s, i) => s + (i.price ?? 0), 0)
            return (
              <section key={group.id} aria-labelledby={`group-${group.id}`}>
                <div className="mb-3 flex items-center gap-3">
                  <Avatar name={group.name} id={group.id} />
                  <h2 id={`group-${group.id}`} className="flex-1 font-display text-xl font-semibold text-ink">For {group.name}</h2>
                  {subtotal > 0 && <span className="text-sm font-medium text-muted">{money(subtotal)}</span>}
                </div>
                <Card className="divide-y divide-line overflow-hidden">
                  {group.items.map((item) => {
                    const isBought = bought.has(item.id)
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isBought}
                          aria-label={`Mark ${item.name} as bought`}
                          onClick={() => toggleBought(item.id)}
                          className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                            isBought ? 'border-primary bg-primary text-on-primary' : 'border-line-strong hover:border-primary',
                          )}
                        >
                          {isBought && <Check className="h-4 w-4" strokeWidth={3} aria-hidden />}
                        </button>
                        {item.product_image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.product_image_url} alt="" loading="lazy" className={cn('h-14 w-14 shrink-0 rounded-xl border border-line bg-white object-contain p-1', isBought && 'opacity-50')} />
                        ) : (
                          <span aria-hidden className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-muted/60">
                            <Gift className="h-5 w-5" />
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={cn('font-medium text-ink break-words', isBought && 'text-muted line-through')}>{item.name}</p>
                          <p className="truncate text-sm text-muted">
                            {[item.price !== undefined ? money(item.price) : null, item.list_name].filter(Boolean).join(' · ')}
                          </p>
                          {item.notes && <p className="mt-0.5 line-clamp-1 text-sm text-muted">{item.notes}</p>}
                        </div>
                        <div className="flex shrink-0 items-center">
                          {item.product_url && (
                            <a
                              href={item.product_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"
                              aria-label={`View ${item.name} in a new tab`}
                              title="View product"
                            >
                              <ExternalLink className="h-4 w-4" aria-hidden />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => unclaim(item)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-muted hover:text-ink"
                            aria-label={`Unclaim ${item.name}`}
                            title="Unclaim"
                          >
                            <Undo2 className="h-4 w-4" aria-hidden />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </Card>
              </section>
            )
          })}
          <p className="text-center text-xs text-muted">Ticks are saved on this device only.</p>
        </div>
      )}
    </div>
  )
}
