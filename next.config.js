const withPWA = require('next-pwa')({
    dest: 'public', // 将 service worker 和其他文件放在 public 文件夹
    register: true, // 自动注册 service worker
    skipWaiting: true, // 自动接管旧的 service worker
  });
  
  module.exports = withPWA({
    // 这里可以放其他 Next.js 配置
    reactStrictMode: true,
  });