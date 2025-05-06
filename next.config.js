// next.config.js
module.exports = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'www.operacolorado.org',
          pathname: '/wp-content/uploads/**',
        },
      ],
    },
  };