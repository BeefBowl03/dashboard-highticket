/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    NAMECOM_USERNAME: process.env.NAMECOM_USERNAME,
    NAMECOM_TOKEN: process.env.NAMECOM_TOKEN,
  },
}

module.exports = nextConfig
