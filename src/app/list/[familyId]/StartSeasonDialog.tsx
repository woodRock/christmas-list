'use client'

import { useState } from 'react'
import { Archive, RotateCcw } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import { suggestedSeasonName } from './season'

interface StartSeasonDialogProps {
  open: boolean
  onClose: () => void
  onStarted: () => Promise<void> | void
  listId: string
  listName: string
  claimedCount: number
  unclaimedCount: number
}

export default function StartSeasonDialog(props: StartSeasonDialogProps) {
  // Mount the form only while open so it starts from the suggested name.
  return props.open ? <StartSeasonForm {...props} /> : null
}

function StartSeasonForm({ open, onClose, onStarted, listId, listName, claimedCount, unclaimedCount }: StartSeasonDialogProps) {
  const [name, setName] = useState(suggestedSeasonName)
  // Lists named after a year ("Christmas 2025") should follow the new season.
  const [renameList, setRenameList] = useState(/\b20\d\d\b/.test(listName))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/lists/${listId}/season`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, renameList }),
    })
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      setError(data.error || 'Couldn’t start a new season.')
      setSubmitting(false)
      return
    }

    toast(`${name.trim()} has begun 🎄`)
    await onStarted()
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Start a new season"
      description="Same list, same people — a fresh start for this year’s wishes."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="season-form" loading={submitting} disabled={!name.trim()}>Start {name.trim() || 'season'}</Button>
        </>
      }
    >
      <form id="season-form" onSubmit={handleSubmit} className="space-y-5">
        <Field label="Season name" htmlFor="season-name" hint="e.g. Christmas 2026, or Mum’s 60th">
          <Input id="season-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
          <input type="checkbox" checked={renameList} onChange={(e) => setRenameList(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--primary)]" />
          <span>
            Also rename the list to “{name.trim() || '…'}”
            <span className="block text-xs text-muted">Currently “{listName}”</span>
          </span>
        </label>

        <ul className="space-y-3 rounded-xl bg-surface-muted p-4 text-sm">
          <li className="flex gap-3">
            <Archive className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">{claimedCount} claimed {claimedCount === 1 ? 'gift moves' : 'gifts move'} to Previous years.</strong>{' '}
              <span className="text-muted">Everyone can look back at who gave what.</span>
            </span>
          </li>
          <li className="flex gap-3">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
            <span>
              <strong className="font-semibold text-ink">{unclaimedCount} unclaimed {unclaimedCount === 1 ? 'wish stays' : 'wishes stay'} on the list,</strong>{' '}
              <span className="text-muted">marked “From last year” so each person can keep or clear them.</span>
            </span>
          </li>
        </ul>

        {error && <Alert>{error}</Alert>}
      </form>
    </Modal>
  )
}
