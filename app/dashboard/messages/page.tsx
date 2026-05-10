// app/notifications/page.tsx
import { getMembers } from '@/lib/actions/members'
import NotificationForm from '../components/MessagesForm'

export default async function NotificationsPage() {
  const members = await getMembers()

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            St. Maria Goretti
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            Send notification
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Send an SMS to one or more active members via Africa&apos;s Talking.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <NotificationForm members={members} />
        </div>
      </div>
    </main>
  )
}
