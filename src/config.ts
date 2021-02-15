export default {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? 'auth.rfcx.org',
  AUTH0_API_AUDIENCE: process.env.AUTH0_API_AUDIENCE ?? '',
  CORE_URL: process.env.CORE_URL ?? 'https://staging-api.rfcx.org',
  DB_HOSTNAME: process.env.DB_HOSTNAME ?? 'localhost',
  DB_PORT: process.env.DB_PORT ?? '5432',
  DB_SSL_ENABLED: process.env.DB_SSL_ENABLED ?? 'false',
  DB_DBNAME: process.env.DB_DBNAME ?? 'postgres',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'test'
}
