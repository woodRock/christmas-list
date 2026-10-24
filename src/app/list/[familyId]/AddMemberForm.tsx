'use client'

import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'

interface AddMemberFormProps {
  open: boolean
  familyId: string
  onClose: () => void
  onMemberAdded: () => Promise<void>
}

export default function AddMemberForm({ open, familyId, onClose, onMemberAdded }: AddMemberFormProps) {
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (open) {
      setNewMemberName('')
      setNewMemberEmail('')
      setMessage('')
    }
  }, [open])

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)

    try {
      const res = await fetch(`/api/lists/${familyId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberName: newMemberName.trim(), memberEmail: newMemberEmail.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        toast(data.message || `Added ${newMemberName}`)
        await onMemberAdded()
        onClose()
      } else {
        setMessage(data.error || 'Couldn’t add that person.')
      }
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Couldn’t add that person.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add a person"
      description="Add someone by name and email. The quickest way is usually to share an invite link from the list page."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button type="submit" form="add-member-form" loading={submitting}>Add person</Button>
        </>
      }
    >
      <form id="add-member-form" onSubmit={handleAddMember} className="space-y-4">
        <Field label="Name" htmlFor="newMemberName">
          <Input id="newMemberName" autoComplete="off" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required />
        </Field>
        <Field label="Email" htmlFor="newMemberEmail">
          <Input id="newMemberEmail" type="email" autoComplete="off" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required />
        </Field>
        {message && <Alert>{message}</Alert>}
      </form>
    </Modal>
  )
}
