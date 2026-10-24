'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { Field, Input } from '@/components/ui/Field'
import { useToast } from '@/components/ui/Toast'

export default function CreateFamily() {
  const [familyName, setFamilyName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const toast = useToast()
  const [supabase] = useState(createClient)

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSubmitting(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setMessage('You must be signed in to create a list.')
      setSubmitting(false)
      return
    }

    const { data: list, error: listError } = await supabase
      .from('lists')
      .insert([{ name: familyName.trim(), user_id: user.id }])
      .select()
      .single()

    if (listError) {
      setMessage(listError.message)
      setSubmitting(false)
      return
    }

    // Add the list owner to the list_members table
    const { error: memberError } = await supabase
      .from('list_members')
      .insert([{ list_id: list.id, profile_id: user.id, role: 'owner' }])

    if (memberError) {
      setMessage(memberError.message)
      setSubmitting(false)
      return
    }

    toast(`“${list.name}” is ready. Invite your family to join!`)
    router.push(`/list/${list.id}`)
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        back={{ href: '/', label: 'My lists' }}
        title="Create a list"
        description="One list per group — your family, friends, or a secret Santa."
      />
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleCreateFamily} className="space-y-5">
          <Field label="List name" htmlFor="familyName" hint="You can change this later in settings.">
            <Input
              id="familyName"
              placeholder="e.g. The Smiths — Christmas 2026"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              required
              autoFocus
              maxLength={80}
            />
          </Field>
          {message && <Alert>{message}</Alert>}
          <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={!familyName.trim()}>
            Create list
          </Button>
        </form>
      </Card>
    </div>
  )
}
