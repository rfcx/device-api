export default {
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN ?? 'auth.rfcx.org',
  CORE_URL: process.env.CORE_URL ?? 'https://staging-api.rfcx.org',
  DB_HOSTNAME: process.env.DB_HOSTNAME ?? 'localhost',
  DB_PORT: process.env.DB_PORT ?? '5432',
  DB_SSL_ENABLED: process.env.DB_SSL_ENABLED ?? 'false',
  DB_DBNAME: process.env.DB_DBNAME ?? 'postgres',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'test',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY ?? 'AKIA45B7YWBXTKC253TT',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY ?? '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',
  AWS_REGION_ID: process.env.AWS_REGION_ID ?? 'eu-west-1',
  AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID ?? '887044485231'
}
