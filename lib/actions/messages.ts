'use server'

import { getSms } from "../africastalking/africastalking"

// ── Local types (AT SDK types are unreliable) ─────────────────
interface ATRecipient {
  number: string
  status: string
  cost: string
}

interface ATSmsResponse {
  SMSMessageData: {
    Recipients: ATRecipient[]
  }
}

// ── Public types ──────────────────────────────────────────────
export interface SendSmsPayload {
  to: string[]
  message: string
}

export interface SmsRecipientResult {
  number: string
  status: string
  cost: string
}

export interface SendSmsResult {
  success: boolean
  sent: number
  failed: number
  responses: SmsRecipientResult[]
  error?: string
}

// ── Action ────────────────────────────────────────────────────
export async function sendSms(payload: SendSmsPayload): Promise<SendSmsResult> {
  const { to, message } = payload

  try {
    const sms = getSms()

    const options: { to: string[]; message: string; from?: string } = {
      to,
      message,
    }
    if (process.env.AT_SENDER_ID) {
      options.from = process.env.AT_SENDER_ID
    }

    const response = await (
      sms.send as unknown as (opts: typeof options) => Promise<ATSmsResponse>
    )(options)

    const recipients = response.SMSMessageData.Recipients

    const responses: SmsRecipientResult[] = recipients.map((r) => ({
      number: r.number,
      status: r.status,
      cost: r.cost,
    }))

    const sent = responses.filter((r) => r.status === 'Success').length
    const failed = responses.length - sent

    return { success: failed === 0, sent, failed, responses }
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      sent: 0,
      failed: to.length,
      responses: [],
      error: msg,
    }
  }
}
