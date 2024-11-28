// next.config.js
module.exports = {
  // output: 'standalone',
   eslint: {
     // Warning: This allows production builds to successfully complete even if
     // your project has ESLint errors.
     ignoreDuringBuilds: true,
   },
   typescript: {
    // This allows the build to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lms.prasmul-eli.co',
        port: '', 
        pathname: '**',
      },
    ],
  },
 };
 