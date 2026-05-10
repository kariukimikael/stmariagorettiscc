'use client'

import { useState } from 'react'
import type { Member } from '@/lib/actions/members'
import { sendSms, type SendSmsResult } from '@/lib/actions/messages'

const MAX_SMS_LENGTH = 160

interface Props {
  members: Member[]
}

export default function NotificationForm({ members }: Props) {
  const activeMembers = members.filter((m) => m.status === 'active')

  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<SendSmsResult | null>(null)

  // ── Selection helpers ────────────────────────────────────────
  const allSelected =
    selected.length === activeMembers.length && activeMembers.length > 0

  function toggleAll() {
    setSelected(allSelected ? [] : activeMembers.map((m) => m.phone))
  }

  function toggleMember(phone: string) {
    setSelected((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone],
    )
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSend() {
    if (!selected.length || !message.trim()) return

    setSending(true)
    setResult(null)

    const res = await sendSms({ to: selected, message: message.trim() })
    setResult(res)
    setSending(false)

    if (res.success) {
      setMessage('')
      setSelected([])
    }
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Member selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">
            Recipients
            {selected.length > 0 && (
              <span className="ml-2 text-xs text-slate-400">
                {selected.length} selected
              </span>
            )}
          </label>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-medium text-sky-600 hover:underline"
          >
            {allSelected ? 'Deselect all' : 'Select all active'}
          </button>
        </div>

        <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
          {activeMembers.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-400">
              No active members found.
            </p>
          ) : (
            activeMembers.map((m) => {
              const checked = selected.includes(m.phone)
              return (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition hover:bg-slate-50 ${
                    checked ? 'bg-sky-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleMember(m.phone)}
                    className="accent-sky-600"
                  />
                  <span className="flex-1 text-sm text-slate-700">
                    {m.first_name} {m.last_name}
                  </span>
                  <span className="text-xs text-slate-400">{m.phone}</span>
                </label>
              )
            })
          )}
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <span
            className={`text-xs ${message.length > MAX_SMS_LENGTH ? 'text-rose-500' : 'text-slate-400'}`}
          >
            {message.length}/{MAX_SMS_LENGTH}
            {message.length > MAX_SMS_LENGTH && (
              <span className="ml-1">
                (+{Math.ceil(message.length / MAX_SMS_LENGTH) - 1} extra SMS)
              </span>
            )}
          </span>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here…"
          rows={4}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 resize-none"
        />
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            result.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {result.error ? (
            <p>Error: {result.error}</p>
          ) : (
            <p>
              {result.sent > 0 && (
                <span>
                  ✓ Sent to {result.sent} recipient{result.sent > 1 ? 's' : ''}
                  .{' '}
                </span>
              )}
              {result.failed > 0 && (
                <span>
                  ✗ Failed for {result.failed} recipient
                  {result.failed > 1 ? 's' : ''}.
                </span>
              )}
            </p>
          )}
          {/* Per-recipient breakdown */}
          {result.responses.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs opacity-80">
              {result.responses.map((r) => (
                <li key={r.number}>
                  {r.number} — {r.status}{' '}
                  {r.cost !== 'N/A' ? `(${r.cost})` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Send button */}
      <button
        type="button"
        onClick={handleSend}
        disabled={sending || !selected.length || !message.trim()}
        className="w-full rounded-xl bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 transition"
      >
        {sending
          ? 'Sending…'
          : `Send SMS${selected.length > 0 ? ` to ${selected.length} member${selected.length > 1 ? 's' : ''}` : ''}`}
      </button>
    </div>
  )
}
