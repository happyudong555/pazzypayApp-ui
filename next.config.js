const withTM = require('next-transpile-modules')([
  'antd-mobile',
]);
module.exports = withTM({
  reactStrictMode: true,
  distDir: 'nextjs',
  compress: false,
  eslint: {
    ignoreDuringBuilds: true
  }
})