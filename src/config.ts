export default {
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ?? '',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? '',
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET ?? 'rfcx-device-assets-staging',
  AWS_REGION_ID: process.env.AWS_REGION_ID ?? 'eu-west-1',
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? 'auth.rfcx.org',
  CORE_URL: process.env.CORE_URL ?? 'https://staging-api.rfcx.org',
  NONCORE_URL: process.env.NONCORE_URL ?? 'https://staging-api.rfcx.org',
  DB_HOSTNAME: process.env.DB_HOSTNAME ?? 'localhost',
  DB_PORT: process.env.DB_PORT !== undefined ? parseInt(process.env.DB_PORT) : 5432,
  DB_SSL_ENABLED: process.env.DB_SSL_ENABLED === 'true',
  DB_DEVICE_NAME: process.env.DB_DEVICE_NAME ?? 'device',
  DB_GUARDIAN_NAME: process.env.DB_GUARDIAN_NAME ?? 'guardian',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'test',
  MANDRILL_KEY: process.env.MANDRILL_KEY ?? ''
}
