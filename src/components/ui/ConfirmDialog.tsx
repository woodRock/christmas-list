'use client'

import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { Field, Input } from './Field'
import Alert from './Alert'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  description: React.ReactNode
  confirmLabel: string
  /** When set, the user must type this exact text to enable the confirm button. */
  confirmText?: string
  destructive?: boolean
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  // Mount the body only while open so its state starts fresh each time.
  return props.open ? <ConfirmDialogBody {...props} /> : null
}

function ConfirmDialogBody({ open, onClose, onConfirm, title, description, confirmLabel, confirmText, destructive = true }: ConfirmDialogProps) {
  const [typed, setTyped] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const canConfirm = !confirmText || typed.trim() === confirmText.trim()

  const handleConfirm = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canConfirm) return
    setBusy(true)
    setError('')
    try {
      await onConfirm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button variant={destructive ? 'danger' : 'primary'} onClick={() => handleConfirm()} disabled={!canConfirm} loading={busy} data-autofocus={!confirmText || undefined}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="text-[15px] text-muted">{description}</div>
        {confirmText && (
          <form onSubmit={handleConfirm}>
            <Field label={`Type “${confirmText}” to confirm`} htmlFor="confirm-text">
              <Input id="confirm-text" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
            </Field>
          </form>
        )}
        {error && <Alert>{error}</Alert>}
      </div>
    </Modal>
  )
}
