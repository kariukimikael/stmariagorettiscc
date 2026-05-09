'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { memberSchema, type MemberFormValues } from '@/lib/validators/members'
import { addMember } from '@/lib/actions/members'

const ROLES = [
  'Moderator',
  'V. Moderator',
  'Secretary',
  'Treasurer',
  'V. Secretary',
  'Security',
  'Liturgy',
  'Social & Development',
  'CJPD',
  ' Member',
]

const NewMembersForm = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      status: 'active',
      joined_at: new Date().toISOString().split('T')[0],
    },
  })

  async function onSubmit(values: MemberFormValues) {
    await addMember(values)
    router.push('/dashboard/members')
    router.refresh()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* First name & Last name */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            First name
          </label>
          <input
            {...register('first_name')}
            placeholder="e.g. Maria"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.first_name && (
            <p className="text-xs text-rose-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Last name
          </label>
          <input
            {...register('last_name')}
            placeholder="e.g. Wanjiku"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
          />
          {errors.last_name && (
            <p className="text-xs text-rose-500">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Phone number
        </label>
        <div className="flex items-center rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
          <span className="select-none border-r border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 rounded-l-lg">
            +254
          </span>
          <input
            {...register('phone')}
            placeholder="712345678"
            maxLength={10}
            inputMode="numeric"
            className="w-full rounded-r-lg px-3 py-2 text-sm outline-none"
          />
        </div>
        <p className="text-xs text-slate-400">
          Enter 9 digits, or 10 starting with 0 (e.g. 0712345678).
        </p>
        {errors.phone && (
          <p className="text-xs text-rose-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Role & Status */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Role</label>
          <select
            {...register('role')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-rose-500">{errors.role.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <select
            {...register('status')}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400 bg-white"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="text-xs text-rose-500">{errors.status.message}</p>
          )}
        </div>
      </div>

      {/* Joined at */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">
          Joined date
        </label>
        <input
          type="date"
          {...register('joined_at')}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-400"
        />
        {errors.joined_at && (
          <p className="text-xs text-rose-500">{errors.joined_at.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60 transition"
        >
          {isSubmitting ? 'Saving…' : 'Add member'}
        </button>
      </div>
    </form>
  )
}

export default NewMembersForm
