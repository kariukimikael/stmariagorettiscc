import AfricasTalking from 'africastalking'

let _sms: ReturnType<typeof AfricasTalking>['SMS'] | null = null

export function getSms() {
  if (!_sms) {
    const apiKey = process.env.AT_API_KEY
    const username = process.env.AT_USERNAME

    if (!apiKey || !username) {
      throw new Error(
        'Missing AT_API_KEY or AT_USERNAME in environment variables',
      )
    }

    const client = AfricasTalking({ apiKey, username })
    _sms = client.SMS
  }

  return _sms
}
