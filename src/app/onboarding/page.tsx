import Link from 'next/link'
import { EyeOff, GripVertical, Pencil, Plus, ShoppingBag, UserPlus } from 'lucide-react'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import { buttonClasses } from '@/components/ui/Button'

const steps = [
  {
    Icon: Plus,
    title: 'Add what you’d love',
    body: 'Open a list and tap “Add gift”. Paste a product link and we’ll fill in the name, picture and price for you — or just type it in.',
  },
  {
    Icon: UserPlus,
    title: 'Invite your family',
    body: 'Tap “Invite” on a list to get a link and QR code. Anyone who opens it can join and add their own wishlist.',
  },
  {
    Icon: ShoppingBag,
    title: 'Claim a gift for someone',
    body: 'On someone else’s wishlist, tap “I’ll get this”. Everyone else sees it’s taken, so nobody buys the same thing twice.',
  },
  {
    Icon: EyeOff,
    title: 'Surprises stay secret',
    body: 'You’ll never see which of your own gifts have been claimed, or by whom. Only the people buying for you know.',
  },
]

const tips = [
  { Icon: Pencil, text: 'Use the pencil and bin icons on your own gifts to edit or delete them.' },
  { Icon: GripVertical, text: 'Drag the handle on your gifts to put your favourites first (in list view, wishlist order).' },
  { Icon: ShoppingBag, text: 'Your Shopping list collects everything you’ve claimed, grouped by person, with a running total.' },
]

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="How Giftd works" description="Four steps to a stress-free gift season." />

      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map(({ Icon, title, body }, i) => (
          <li key={title}>
            <Card className="h-full p-5">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">Step {i + 1}</span>
              </div>
              <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{body}</p>
            </Card>
          </li>
        ))}
      </ol>

      <Card className="mt-6 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-ink">Handy tips</h2>
        <ul className="mt-3 space-y-3">
          {tips.map(({ Icon, text }) => (
            <li key={text} className="flex gap-3 text-[15px] text-muted">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              {text}
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/" className={buttonClasses({ size: 'lg' })}>Go to my lists</Link>
      </div>
    </div>
  )
}
