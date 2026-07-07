jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { ok: true } })
}))

describe('email sender', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      EMAIL_SEND_URL: 'https://notify.rfcx.org/email/v1/send',
      EMAIL_SEND_TOKEN: 'test-token',
      MANDRILL_KEY: ''
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('renders deployment success email with shared template package and sends via notify gateway', async () => {
    const axios = await import('axios')
    ;(axios.default.post as jest.Mock).mockClear()
    const email = (await import('./index')).default

    await email.sendNewDeploymentSuccessEmail({
      deploymentType: 'audiomoth',
      deployedAt: '2025-05-16T15:24:00Z'
    } as any, {
      email: 'user@example.com',
      name: 'Test User'
    } as any)

    expect(axios.default.post).toHaveBeenCalledTimes(1)
    expect(axios.default.post).toHaveBeenCalledWith(
      'https://notify.rfcx.org/email/v1/send',
      expect.objectContaining({
        subject: 'Your AudioMoth device was deployed successfully',
        text: expect.stringContaining('Your AudioMoth device was successfully deployed'),
        html: expect.stringContaining('AudioMoth deployment complete!'),
        from_email: 'contact@rfcx.org',
        from_name: 'Rainforest Connection',
        to: [{ email: 'user@example.com', name: 'Test User', type: 'to' }],
        auto_html: true
      }),
      expect.objectContaining({
        headers: { Authorization: 'Bearer test-token' },
        timeout: 10000
      })
    )
  })
})
