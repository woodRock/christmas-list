'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { User } from '@supabase/supabase-js'
import { Gift as GiftIcon, ImageIcon, LayoutGrid, List, LogOut, MoreHorizontal, Plus, Settings, UserPlus } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import Menu, { type MenuItem } from '@/components/ui/Menu'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Alert from '@/components/ui/Alert'
import { Select } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/components/ui/cn'
import { useLocalStorage } from '@/components/ui/useLocalStorage'
import GiftCard from './GiftCard'
import GiftFormModal from './GiftFormModal'
import InviteModal from './InviteModal'
import type { Family, Gift } from './types'

type SortKey = 'order' | 'name' | 'price-asc' | 'price-desc'
type View = 'list' | 'grid'

function sortGifts(gifts: Gift[], sort: SortKey) {
  const sorted = [...gifts]
  switch (sort) {
    case 'name':
      return sorted.sort((a, b) => a.description.localeCompare(b.description))
    case 'price-asc':
      return sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    case 'price-desc':
      return sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    default:
      return sorted.sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
  }
}

export default function FamilyListClient({ initialFamily, initialUser, familyId }: { initialFamily: Family, initialUser: User | null, familyId: string }) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const user = initialUser
  const [sort, setSort] = useState<SortKey>('order')
  const [storedView, setStoredView] = useLocalStorage('giftd:view', 'list')
  const view: View = storedView === 'grid' ? 'grid' : 'list'
  const [giftModal, setGiftModal] = useState<{ open: boolean; gift?: Gift | null; recipientId?: string }>({ open: false })
  const [deletingGift, setDeletingGift] = useState<Gift | null>(null)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [inviteToken, setInviteToken] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [creatingInvite, setCreatingInvite] = useState(false)
  const [busyGiftIds, setBusyGiftIds] = useState<Set<string>>(new Set())
  const [imageProgress, setImageProgress] = useState<{ done: number; total: number } | null>(null)
  const router = useRouter()
  const toast = useToast()

  const isOwner = user?.id === family.owner_id

  const changeView = (next: View) => setStoredView(next)

  // You first, then everyone else alphabetically.
  const members = useMemo(
    () => [...family.members].sort((a, b) => (a.id === user?.id ? -1 : b.id === user?.id ? 1 : a.name.localeCompare(b.name))),
    [family.members, user?.id],
  )
  const nameById = useMemo(() => new Map(family.members.map((m) => [m.id, m.name])), [family.members])
  const totalGifts = family.members.reduce((n, m) => n + m.gifts.length, 0)

  const refreshFamily = async () => {
    const res = await fetch(`/api/lists/${familyId}/details`)
    if (res.ok) {
      setFamily(await res.json())
    } else {
      toast('Couldn’t refresh the list. Pull to refresh or reload the page.', { tone: 'error' })
    }
  }

  const updateGift = (giftId: string, patch: Partial<Gift>) => {
    setFamily((f) => ({
      ...f,
      members: f.members.map((m) => ({ ...m, gifts: m.gifts.map((g) => (g.id === giftId ? { ...g, ...patch } : g)) })),
    }))
  }

  const setBusy = (giftId: string, busy: boolean) =>
    setBusyGiftIds((s) => {
      const next = new Set(s)
      if (busy) next.add(giftId)
      else next.delete(giftId)
      return next
    })

  const claimGift = async (gift: Gift) => {
    if (!user) return
    setBusy(gift.id, true)
    updateGift(gift.id, { is_purchased: true, purchased_by: user.id })
    const res = await fetch(`/api/gifts/${gift.id}/claim`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedByUserId: user.id }),
    })
    setBusy(gift.id, false)
    if (res.ok) {
      toast(`You're getting “${gift.description}”`, { action: { label: 'Shopping list', onClick: () => router.push('/claimed-items') } })
      refreshFamily()
    } else {
      updateGift(gift.id, { is_purchased: false, purchased_by: undefined })
      toast('Couldn’t claim that gift. Please try again.', { tone: 'error' })
    }
  }

  const unclaimGift = async (gift: Gift) => {
    setBusy(gift.id, true)
    updateGift(gift.id, { is_purchased: false, purchased_by: undefined })
    const res = await fetch(`/api/gifts/${gift.id}/unclaim`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' } })
    setBusy(gift.id, false)
    if (res.ok) {
      toast(`Unclaimed “${gift.description}”`, { action: { label: 'Undo', onClick: () => claimGift(gift) } })
      refreshFamily()
    } else {
      updateGift(gift.id, { is_purchased: true, purchased_by: user?.id })
      toast('Couldn’t unclaim that gift. Please try again.', { tone: 'error' })
    }
  }

  const deleteGift = async (gift: Gift) => {
    const res = await fetch(`/api/gifts/${gift.id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Couldn’t delete that gift.')
    }
    setFamily((f) => ({ ...f, members: f.members.map((m) => ({ ...m, gifts: m.gifts.filter((g) => g.id !== gift.id) })) }))
    setDeletingGift(null)
    toast(`Deleted “${gift.description}”`)
    refreshFamily()
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!user || !result.destination || result.destination.index === result.source.index) return

    const me = family.members.find((m) => m.id === user.id)
    if (!me) return

    const reordered = sortGifts(me.gifts, 'order')
    const [moved] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, moved)
    const withIndex = reordered.map((g, i) => ({ ...g, order_index: i }))

    const previous = family
    setFamily((f) => ({ ...f, members: f.members.map((m) => (m.id === me.id ? { ...m, gifts: withIndex } : m)) }))

    const res = await fetch('/api/gifts/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: withIndex.map((g) => ({ id: g.id, order_index: g.order_index, list_id: family.id })) }),
    })

    if (!res.ok) {
      setFamily(previous)
      toast('Couldn’t save the new order.', { tone: 'error' })
    }
  }

  const openInvite = async () => {
    if (inviteToken) {
      setShowInvite(true)
      return
    }
    setCreatingInvite(true)
    const res = await fetch(`/api/lists/${familyId}/invites`, { method: 'POST' })
    setCreatingInvite(false)
    if (res.ok) {
      const { token } = await res.json()
      setInviteToken(token)
      setShowInvite(true)
    } else {
      const { error } = await res.json().catch(() => ({ error: '' }))
      toast(`Couldn’t create an invite link${error ? `: ${error}` : '.'}`, { tone: 'error' })
    }
  }

  const leaveList = async () => {
    const res = await fetch(`/api/lists/${family.id}/leave`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error || 'Couldn’t leave this list.')
    }
    toast(`You left “${family.name}”`)
    router.push('/')
    router.refresh()
  }

  const findMissingImages = async () => {
    const missing = family.members.flatMap((m) => m.gifts).filter((g) => !g.product_image_url && g.description)
    if (missing.length === 0) {
      toast('Every gift already has an image')
      return
    }

    let found = 0
    setImageProgress({ done: 0, total: missing.length })
    for (const [i, gift] of missing.entries()) {
      try {
        const scrapeRes = await fetch(`/api/scrape-pricespy?query=${encodeURIComponent(gift.description)}`)
        const scrapeData = await scrapeRes.json()
        if (scrapeRes.ok && scrapeData.imageUrl) {
          const updateRes = await fetch('/api/gifts/update-image', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ giftId: gift.id, imageUrl: scrapeData.imageUrl }),
          })
          if (updateRes.ok) {
            found++
            updateGift(gift.id, { product_image_url: scrapeData.imageUrl })
          }
        }
      } catch (error) {
        console.error(`Error finding image for ${gift.description}:`, error)
      }
      setImageProgress({ done: i + 1, total: missing.length })
    }

    setImageProgress(null)
    toast(found > 0 ? `Found images for ${found} of ${missing.length} gifts` : 'No new images found', { tone: found > 0 ? 'success' : 'error' })
    refreshFamily()
  }

  const menuItems: MenuItem[] = isOwner
    ? [
        { label: 'List settings', href: `/list/${family.id}/settings`, icon: <Settings className="h-4 w-4" aria-hidden /> },
        { label: 'Find missing images', onSelect: findMissingImages, disabled: Boolean(imageProgress), icon: <ImageIcon className="h-4 w-4" aria-hidden /> },
      ]
    : [{ label: 'Leave list', onSelect: () => setConfirmLeave(true), destructive: true, icon: <LogOut className="h-4 w-4" aria-hidden /> }]

  const canReorder = view === 'list' && sort === 'order'

  return (
    <div>
      <PageHeader
        back={{ href: '/', label: 'My lists' }}
        title={family.name}
        description={`${family.members.length} ${family.members.length === 1 ? 'person' : 'people'} · ${totalGifts} ${totalGifts === 1 ? 'gift' : 'gifts'}`}
        actions={
          <>
            <Button variant="secondary" onClick={openInvite} loading={creatingInvite}>
              {!creatingInvite && <UserPlus className="h-4 w-4" aria-hidden />}
              Invite
            </Button>
            {user && (
              <Button onClick={() => setGiftModal({ open: true, recipientId: user.id })}>
                <Plus className="h-4 w-4" aria-hidden />
                Add gift
              </Button>
            )}
            <Menu
              label="More list actions"
              items={menuItems}
              trigger={({ open, toggle, id }) => (
                <Button variant="ghost" size="icon" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} aria-label="More list actions">
                  <MoreHorizontal className="h-5 w-5" aria-hidden />
                </Button>
              )}
            />
          </>
        }
      />

      {imageProgress && (
        <Alert tone="info" className="mb-4">
          Looking for images… {imageProgress.done} of {imageProgress.total}
        </Alert>
      )}

      {/* Jump-to-person chips + view controls */}
      <div className="sticky top-16 z-20 -mx-4 mb-6 border-b border-line/70 bg-bg/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex items-center gap-3">
          <nav aria-label="People on this list" className="-my-1 flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 [scrollbar-width:none]">
            {members.map((m) => (
              <a
                key={m.id}
                href={`#member-${m.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-sm font-medium text-ink transition-colors hover:border-line-strong"
              >
                <Avatar name={m.name} id={m.id} size="sm" />
                {m.id === user?.id ? 'You' : m.name.split(' ')[0]}
                <span className="text-xs text-muted">{m.gifts.length}</span>
              </a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <label htmlFor="sort" className="sr-only">Sort gifts</label>
            <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="hidden w-44 sm:block [&_select]:h-9 [&_select]:py-1.5 [&_select]:text-sm">
              <option value="order">Wishlist order</option>
              <option value="name">Name (A–Z)</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </Select>
            <div role="group" aria-label="Layout" className="flex rounded-xl border border-line bg-surface p-0.5">
              {([['list', List], ['grid', LayoutGrid]] as const).map(([v, Icon]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => changeView(v)}
                  aria-pressed={view === v}
                  aria-label={`${v === 'list' ? 'List' : 'Grid'} view`}
                  className={cn('flex h-8 w-8 items-center justify-center rounded-lg transition-colors', view === v ? 'bg-primary-soft text-primary' : 'text-muted hover:text-ink')}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </button>
              ))}
            </div>
          </div>
        </div>
        <Select aria-label="Sort gifts" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="mt-3 sm:hidden [&_select]:h-9 [&_select]:py-1.5 [&_select]:text-sm">
          <option value="order">Wishlist order</option>
          <option value="name">Name (A–Z)</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </Select>
      </div>

      <div className="space-y-10">
        {members.map((member) => {
          const isMe = member.id === user?.id
          const gifts = sortGifts(member.gifts, sort)
          const claimedCount = member.gifts.filter((g) => g.is_purchased).length

          const renderCard = (gift: Gift, extra?: Partial<React.ComponentProps<typeof GiftCard>>) => (
            <GiftCard
              gift={gift}
              view={view}
              isMine={isMe}
              currentUserId={user?.id ?? ''}
              claimerName={gift.purchased_by ? nameById.get(gift.purchased_by) : undefined}
              busy={busyGiftIds.has(gift.id)}
              onEdit={() => setGiftModal({ open: true, gift })}
              onDelete={() => setDeletingGift(gift)}
              onClaim={() => claimGift(gift)}
              onUnclaim={() => unclaimGift(gift)}
              {...extra}
            />
          )

          return (
            <section key={member.id} id={`member-${member.id}`} aria-labelledby={`member-title-${member.id}`} className="scroll-mt-40">
              <div className="mb-4 flex items-center gap-3">
                <Avatar name={member.name} id={member.id} />
                <div className="min-w-0 flex-1">
                  <h2 id={`member-title-${member.id}`} className="truncate font-display text-xl font-semibold text-ink">
                    {isMe ? 'Your wishlist' : `${member.name}’s wishlist`}
                  </h2>
                  <p className="text-sm text-muted">
                    {member.gifts.length} {member.gifts.length === 1 ? 'gift' : 'gifts'}
                    {!isMe && member.gifts.length > 0 && ` · ${claimedCount} claimed`}
                    {isMe && member.gifts.length > 0 && ' · claims are hidden from you'}
                  </p>
                </div>
                {isMe ? (
                  <Button variant="secondary" size="sm" onClick={() => setGiftModal({ open: true, recipientId: member.id })}>
                    <Plus className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Add gift</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setGiftModal({ open: true, recipientId: member.id })} aria-label={`Suggest a gift for ${member.name}`}>
                    <Plus className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Suggest</span>
                  </Button>
                )}
              </div>

              {gifts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-line-strong px-6 py-8 text-center">
                  <GiftIcon className="mx-auto mb-2 h-6 w-6 text-muted/60" aria-hidden />
                  <p className="text-sm text-muted">
                    {isMe ? 'Your wishlist is empty. Add a few things you’d love — big or small.' : `${member.name} hasn’t added anything yet.`}
                  </p>
                  {isMe && (
                    <Button className="mt-4" size="sm" onClick={() => setGiftModal({ open: true, recipientId: member.id })}>
                      <Plus className="h-4 w-4" aria-hidden />
                      Add your first gift
                    </Button>
                  )}
                </div>
              ) : isMe && canReorder ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId={member.id}>
                    {(provided) => (
                      <ul className="space-y-3" {...provided.droppableProps} ref={provided.innerRef}>
                        {gifts.map((gift, index) => (
                          <Draggable key={gift.id} draggableId={gift.id} index={index}>
                            {(dragProvided, snapshot) => (
                              <li ref={dragProvided.innerRef} {...dragProvided.draggableProps}>
                                {renderCard(gift, { dragHandleProps: dragProvided.dragHandleProps, isDragging: snapshot.isDragging })}
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <ul className={view === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4' : 'space-y-3'}>
                  {gifts.map((gift) => (
                    <li key={gift.id}>{renderCard(gift)}</li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>

      {user && (
        <GiftFormModal
          open={giftModal.open}
          onClose={() => setGiftModal({ open: false })}
          onSaved={refreshFamily}
          familyId={family.id}
          currentUserId={user.id}
          members={members}
          gift={giftModal.gift}
          defaultRecipientId={giftModal.recipientId}
        />
      )}

      <InviteModal open={showInvite} onClose={() => setShowInvite(false)} token={inviteToken} listName={family.name} />

      <ConfirmDialog
        open={Boolean(deletingGift)}
        onClose={() => setDeletingGift(null)}
        onConfirm={() => (deletingGift ? deleteGift(deletingGift) : undefined)}
        title="Delete this gift?"
        description={<>“{deletingGift?.description}” will be removed from your wishlist. If someone already claimed it, they&apos;ll lose it from their shopping list.</>}
        confirmLabel="Delete gift"
      />

      <ConfirmDialog
        open={confirmLeave}
        onClose={() => setConfirmLeave(false)}
        onConfirm={leaveList}
        title={`Leave “${family.name}”?`}
        description="You’ll lose access to everyone’s wishlists on this list. You can rejoin later with a new invite link."
        confirmLabel="Leave list"
      />
    </div>
  )
}
