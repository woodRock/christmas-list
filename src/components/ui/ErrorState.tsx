import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import EmptyState from './EmptyState'
import Card from './Card'
import { buttonClasses } from './Button'

export default function ErrorState({ title = 'Something went wrong', message }: { title?: string; message?: string }) {
  return (
    <Card className="mx-auto max-w-lg">
      <EmptyState
        icon={<AlertTriangle className="h-6 w-6" />}
        title={title}
        description={message}
        action={<Link href="/" className={buttonClasses({ variant: 'secondary' })}>Back to my lists</Link>}
      />
    </Card>
  )
}
