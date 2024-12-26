// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: false,
});

module.exports = {
  reactStrictMode: true,
  ...withPWA({}),
  images: {
    domains: ['localhost:8000/api', '127.0.0.1:8000/api'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};