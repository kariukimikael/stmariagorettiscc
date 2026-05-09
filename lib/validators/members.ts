// lib/validators/member.ts
import { z } from 'zod'

export const memberSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z
    .string()
    .regex(/^\d{9,10}$/, 'Enter 9 digits (or 10 starting with 0)')
    .transform((val) =>
      // if they typed 0712345678, strip the leading 0
      val.startsWith('0') ? `+254${val.slice(1)}` : `+254${val}`,
    ),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['active', 'inactive']),
  joined_at: z.string().min(1, 'Joined date is required'),
})

export type MemberFormValues = z.infer<typeof memberSchema>
