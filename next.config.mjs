/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    { source: '/', destination: '/es', permanent: false },
  ],
  images: {
    // Autoriza el host REAL de tu proyecto de Supabase
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xcfdnkkxvmosdvkvitl.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // (temporal) si tienes alguna URL con el host mal escrito,
      // lo permitimos para que no crashee mientras lo corriges en los datos:
      {
        protocol: 'https',
        hostname: 'xcfdnkxkvmosdvkvitll.supabase.co',
        pathname: '/storage/v1/object/**',
      },
      // si usas placeholders
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
}

export default nextConfig
