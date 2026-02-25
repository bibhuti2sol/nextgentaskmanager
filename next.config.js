module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/product',
        permanent: true,
      },
    ];
  },
};