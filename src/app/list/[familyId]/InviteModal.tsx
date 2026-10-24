'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'
import { Check, Copy, Share2 } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { Input } from '@/components/ui/Field'

export default function InviteModal({ open, onClose, token, listName }: { open: boolean; onClose: () => void; token: string | null; listName: string }) {
  const [copied, setCopied] = useState(false)
  const url = token && typeof window !== 'undefined' ? `${window.location.origin}/invite?token=${token}` : ''
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const share = () => {
    navigator.share({ title: `Join ${listName} on Giftd`, text: `Join our gift list “${listName}”`, url }).catch(() => {})
  }

  return (
    <Modal open={open && Boolean(token)} onClose={onClose} title="Invite to this list" description="Anyone with this link or QR code can join. It expires in 24 hours." size="sm">
      <div className="space-y-4">
        <div className="mx-auto w-fit rounded-2xl border border-line bg-white p-4">
          <QRCode value={url || ' '} size={176} />
        </div>
        <div className="flex gap-2">
          <Input value={url} readOnly aria-label="Invite link" onFocus={(e) => e.target.select()} className="text-sm" />
          <Button variant="secondary" onClick={copy} className="shrink-0" aria-live="polite">
            {copied ? <Check className="h-4 w-4 text-primary" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        {canShare && (
          <Button className="w-full" onClick={share}>
            <Share2 className="h-4 w-4" aria-hidden />
            Share invite
          </Button>
        )}
      </div>
    </Modal>
  )
}
