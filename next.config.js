const path = require('path');

module.exports = {
    reactStrictMode: true,
    experimental: { publicDir: true },
    async headers() {
      return [
        {
          source: '/public/upload/(.*)',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
          ],
        },
      ];
    },
    async rewrites() {
      return [
        {
          source: '/api/upload/:filename*',
          destination: '/upload/:filename*',
        },
      ];
    },
  };
  