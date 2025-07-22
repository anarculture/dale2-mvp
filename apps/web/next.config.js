/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dale/ui"],
  i18n: {
    // Spanish-only for MVP
    locales: ['es'],
    defaultLocale: 'es',
  },
};

module.exports = nextConfig;
