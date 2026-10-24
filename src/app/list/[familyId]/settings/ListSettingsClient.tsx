'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, UserMinus, UserPlus } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import { CardSection } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'
import AddMemberForm from '../AddMemberForm'

interface Member {
  id: string
  name: string
}

interface Family {
  id: string
  name: string
  owner_id: string
  members: Member[]
}

interface ListSettingsClientProps {
  initialFamily: Family
  currentUserId: string
}

export default function ListSettingsClient({ initialFamily, currentUserId }: ListSettingsClientProps) {
  const [family, setFamily] = useState<Family>(initialFamily)
  const [listName, setListName] = useState(initialFamily.name)
  const [savingName, setSavingName] = useState(false)
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const [removingMember, setRemovingMember] = useState<Member | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const router = useRouter()
  const toast = useToast()

  const refreshFamily = async () => {
    const res = await fetch(`/api/lists/${family.id}/details`)
    if (res.ok) {
      const updatedFamily = await res.json()
      setFamily(updatedFamily)
      setListName(updatedFamily.name)
    } else {
      toast('Couldn’t refresh list details.', { tone: 'error' })
    }
  }

  const handleUpdateListName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!listName.trim()) return

    setSavingName(true)
    const res = await fetch(`/api/lists/${family.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: listName.trim() }),
    })
    setSavingName(false)

    if (res.ok) {
      toast('List renamed')
      refreshFamily()
    } else {
      toast(`Couldn’t rename the list: ${await res.text()}`, { tone: 'error' })
    }
  }

  const handleRemoveMember = async (member: Member) => {
    const res = await fetch(`/api/lists/${family.id}/members/${member.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    setRemovingMember(null)
    toast(`Removed ${member.name}`)
    refreshFamily()
  }

  const handleDeleteList = async () => {
    const res = await fetch(`/api/lists/${family.id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    toast(`Deleted “${family.name}”`)
    router.push('/')
    router.refresh()
  }

  const nameChanged = listName.trim() !== family.name && listName.trim().length > 0

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader back={{ href: `/list/${family.id}`, label: family.name }} title="List settings" />

      <div className="space-y-5">
        <CardSection title="List name">
          <form onSubmit={handleUpdateListName} className="flex flex-col gap-3 sm:flex-row">
            <Input aria-label="List name" value={listName} onChange={(e) => setListName(e.target.value)} required maxLength={80} />
            <Button type="submit" disabled={!nameChanged} loading={savingName} className="shrink-0">Save</Button>
          </form>
        </CardSection>

        <CardSection title="People" description={`${family.members.length} ${family.members.length === 1 ? 'person' : 'people'} on this list.`}>
          <ul className="-mx-2 divide-y divide-line">
            {family.members.map((member) => (
              <li key={member.id} className="flex items-center gap-3 px-2 py-3">
                <Avatar name={member.name} id={member.id} />
                <span className="min-w-0 flex-1 truncate font-medium text-ink">
                  {member.name}
                  {member.id === currentUserId && <span className="ml-1.5 text-sm font-normal text-muted">(you)</span>}
                </span>
                {member.id === family.owner_id ? (
                  <span className="rounded-full bg-gold-soft px-2.5 py-0.5 text-xs font-medium text-gold">Owner</span>
                ) : (
                  <Button variant="danger-ghost" size="sm" onClick={() => setRemovingMember(member)} aria-label={`Remove ${member.name}`}>
                    <UserMinus className="h-4 w-4" aria-hidden />
                    <span className="hidden sm:inline">Remove</span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <Button variant="secondary" className="mt-3" onClick={() => setShowAddMemberModal(true)}>
            <UserPlus className="h-4 w-4" aria-hidden />
            Add a person
          </Button>
        </CardSection>

        <CardSection title="Danger zone" description="Deleting this list removes every wishlist and claim on it, for everyone. This can’t be undone." className="border-accent/30">
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete list
          </Button>
        </CardSection>
      </div>

      <AddMemberForm open={showAddMemberModal} familyId={family.id} onClose={() => setShowAddMemberModal(false)} onMemberAdded={refreshFamily} />

      <ConfirmDialog
        open={Boolean(removingMember)}
        onClose={() => setRemovingMember(null)}
        onConfirm={() => (removingMember ? handleRemoveMember(removingMember) : undefined)}
        title={`Remove ${removingMember?.name}?`}
        description="They’ll lose access to this list, and all of their gifts on it will be deleted."
        confirmLabel="Remove"
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteList}
        title="Delete this list?"
        description={<>This permanently deletes <strong className="text-ink">{family.name}</strong>, including every gift and claim on it.</>}
        confirmText={family.name}
        confirmLabel="Delete list"
      />
    </div>
  )
}
