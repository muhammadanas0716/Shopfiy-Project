/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Use worker_threads instead of spawning child node processes.
    // Helps avoid ENOENT when a global Node path changes on macOS/Homebrew.
    workerThreads: true,
    cpus: 1,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**'
      }
    ]
  }
};

module.exports = nextConfig;
