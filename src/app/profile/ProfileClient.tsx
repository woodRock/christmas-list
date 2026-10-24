'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { KeyRound, LogOut, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import PageHeader from '@/components/ui/PageHeader'
import Card, { CardSection } from '@/components/ui/Card'
import Button, { buttonClasses } from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { Field, Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'

interface UserProfile {
  id: string
  full_name: string
  email: string
}

export default function ProfileClient({ initialProfile }: { initialProfile: UserProfile }) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [newName, setNewName] = useState(initialProfile.full_name)
  const [saving, setSaving] = useState(false)
  const [showDeleteGifts, setShowDeleteGifts] = useState(false)
  const [supabase] = useState(createClient)
  const router = useRouter()
  const toast = useToast()

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: newName.trim() }),
    })
    setSaving(false)

    if (res.ok) {
      setProfile((prev) => ({ ...prev, full_name: newName.trim() }))
      toast('Name updated')
      router.refresh()
    } else {
      toast(`Couldn’t update your name: ${await res.text()}`, { tone: 'error' })
    }
  }

  const handleDeleteAllGifts = async () => {
    const res = await fetch('/api/profile/delete-gifts', { method: 'DELETE' })
    if (!res.ok) throw new Error(await res.text())
    setShowDeleteGifts(false)
    toast('All your gifts have been deleted')
    router.refresh()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const nameChanged = newName.trim() !== profile.full_name && newName.trim().length > 0

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Profile" />

      <div className="space-y-5">
        <Card className="flex items-center gap-4 p-5 sm:p-6">
          <Avatar name={profile.full_name} id={profile.id} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold text-ink">{profile.full_name}</p>
            <p className="truncate text-sm text-muted">{profile.email}</p>
          </div>
        </Card>

        <CardSection title="Display name" description="This is how you appear to everyone on your lists.">
          <form onSubmit={handleUpdateName} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Name" htmlFor="full-name" className="flex-1">
              <Input id="full-name" autoComplete="name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            </Field>
            <Button type="submit" disabled={!nameChanged} loading={saving} className="shrink-0">Save</Button>
          </form>
        </CardSection>

        <CardSection title="Account">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/auth/update-password" className={buttonClasses({ variant: 'secondary' })}>
              <KeyRound className="h-4 w-4" aria-hidden />
              Change password
            </Link>
            <Button variant="secondary" onClick={signOut}>
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </div>
        </CardSection>

        <CardSection title="Danger zone" description="Delete every gift you’ve added to your wishlists, across all lists. This can’t be undone." className="border-accent/30">
          <Button variant="danger" onClick={() => setShowDeleteGifts(true)}>
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete all my gifts
          </Button>
        </CardSection>
      </div>

      <ConfirmDialog
        open={showDeleteGifts}
        onClose={() => setShowDeleteGifts(false)}
        onConfirm={handleDeleteAllGifts}
        title="Delete all your gifts?"
        description="Every gift on your wishlists will be removed from every list, including any that people have already claimed."
        confirmText={profile.full_name}
        confirmLabel="Delete all gifts"
      />
    </div>
  )
}
