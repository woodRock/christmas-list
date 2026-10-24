'use client'

import { Check, ExternalLink, Gift as GiftIcon, GripVertical, Pencil, ShoppingBag, Trash2, Undo2 } from 'lucide-react'
import type { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd'
import Button from '@/components/ui/Button'
import { cn } from '@/components/ui/cn'
import { formatPrice, type Gift } from './types'

// Turns URLs inside notes into clickable links.
function NotesWithLinks({ notes }: { notes: string }) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return (
    <>
      {notes.split(urlRegex).map((part, index) =>
        /^https?:\/\//.test(part) ? (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline-offset-2 hover:underline">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </>
  )
}

interface GiftCardProps {
  gift: Gift
  view: 'list' | 'grid'
  isMine: boolean
  currentUserId: string
  claimerName?: string
  busy?: boolean
  dragHandleProps?: DraggableProvidedDragHandleProps | null
  isDragging?: boolean
  onEdit: () => void
  onDelete: () => void
  onClaim: () => void
  onUnclaim: () => void
}

export default function GiftCard({ gift, view, isMine, currentUserId, claimerName, busy, dragHandleProps, isDragging, onEdit, onDelete, onClaim, onUnclaim }: GiftCardProps) {
  const price = formatPrice(gift.price)
  // Claim state is hidden from the recipient so surprises stay surprises.
  const claimedByMe = !isMine && gift.is_purchased && gift.purchased_by === currentUserId
  const claimedByOther = !isMine && gift.is_purchased && gift.purchased_by !== currentUserId
  const grid = view === 'grid'

  const image = gift.product_image_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={gift.product_image_url}
      alt=""
      loading="lazy"
      className={cn('bg-white object-contain', grid ? 'aspect-[4/3] w-full rounded-t-2xl p-2' : 'h-16 w-16 shrink-0 rounded-xl border border-line p-1 sm:h-20 sm:w-20')}
    />
  ) : (
    <span
      aria-hidden
      className={cn('flex items-center justify-center bg-surface-muted text-muted/60', grid ? 'aspect-[4/3] w-full rounded-t-2xl' : 'h-16 w-16 shrink-0 rounded-xl sm:h-20 sm:w-20')}
    >
      <GiftIcon className={grid ? 'h-10 w-10' : 'h-6 w-6'} />
    </span>
  )

  const linkButton = gift.product_url && (
    <a
      href={gift.product_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink"
      aria-label={`View ${gift.description} in a new tab`}
      title="View product"
    >
      <ExternalLink className="h-4 w-4" aria-hidden />
    </a>
  )

  const actions = isMine ? (
    <div className="flex items-center">
      {linkButton}
      <button type="button" onClick={onEdit} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-muted hover:text-ink" aria-label={`Edit ${gift.description}`} title="Edit">
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
      <button type="button" onClick={onDelete} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-accent" aria-label={`Delete ${gift.description}`} title="Delete">
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-1">
      {linkButton}
      {claimedByMe ? (
        <Button variant="secondary" size="sm" onClick={onUnclaim} disabled={busy} aria-label={`Unclaim ${gift.description}`} className="text-muted">
          <Undo2 className="h-4 w-4" aria-hidden />
          Unclaim
        </Button>
      ) : !claimedByOther ? (
        <Button size="sm" onClick={onClaim} disabled={busy} aria-label={`Claim ${gift.description}`}>
          <ShoppingBag className="h-4 w-4" aria-hidden />
          I&apos;ll get this
        </Button>
      ) : null}
    </div>
  )

  const status = claimedByMe ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
      <Check className="h-3 w-3" aria-hidden /> You&apos;re getting this
    </span>
  ) : claimedByOther ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-muted">
      <Check className="h-3 w-3" aria-hidden /> Claimed{claimerName ? ` by ${claimerName}` : ''}
    </span>
  ) : null

  const body = (
    <div className="min-w-0 flex-1">
      <p className={cn('font-medium text-ink break-words', grid && 'line-clamp-2', claimedByOther && 'text-muted')}>{gift.description}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        {price && <span className={cn('text-sm font-semibold', claimedByOther ? 'text-muted' : 'text-ink')}>{price}</span>}
        {status}
      </div>
      {gift.notes && (
        <p className={cn('mt-1.5 text-sm text-muted whitespace-pre-line', grid ? 'line-clamp-2' : 'line-clamp-3')}>
          <NotesWithLinks notes={gift.notes} />
        </p>
      )}
    </div>
  )

  const shell = cn(
    'group rounded-2xl border bg-surface transition-shadow',
    isDragging ? 'border-primary shadow-lift' : 'border-line shadow-card',
    claimedByOther && 'bg-surface/60',
  )

  if (grid) {
    return (
      <div className={cn(shell, 'flex h-full flex-col')}>
        <div className={cn(claimedByOther && 'opacity-50 grayscale')}>{image}</div>
        <div className="flex flex-1 flex-col p-3.5">
          {body}
          <div className="mt-3 flex items-center justify-end">{actions}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(shell, 'flex items-start gap-3 p-3 sm:items-center sm:gap-4')}>
      {dragHandleProps !== undefined && (
        <span
          {...(dragHandleProps ?? {})}
          className="-ml-1 flex h-16 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg text-muted/50 transition-colors hover:text-muted active:cursor-grabbing sm:h-20"
          aria-label={`Reorder ${gift.description}`}
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </span>
      )}
      <div className={cn(claimedByOther && 'opacity-50 grayscale')}>{image}</div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        {body}
        <div className="flex shrink-0 justify-end">{actions}</div>
      </div>
    </div>
  )
}
