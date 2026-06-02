/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '9000' },
      { protocol: 'https', hostname: 'storage.amigitos.app' },
    ],
  },
  allowedDevOrigins: ['http://127.0.0.1', 'http://localhost'],
};

module.exports = nextConfig;
