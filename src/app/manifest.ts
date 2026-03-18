import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Likya Mekanik Tesisat',
    short_name: 'LikyaMekanik',
    description: 'Mekanik tesisat, iklimlendirme ve mühendislik çözümleri',
    start_url: '/',
    display: 'standalone',
    background_color: 'transparent',
    theme_color: 'var(--primary)',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: '/branding/icons/favicon1.svg',
        sizes: '16x16 32x32 48x48',
        type: 'image/svg+xml',
      },
      {
        src: '/branding/icons/favicon.svg',
        sizes: '72x72 96x96 128x128 256x256 512x512',
        type: 'image/svg+xml',
      },
      {
        src: '/branding/icons/icon-512x512.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/branding/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'utilities', 'engineering'],
    lang: 'tr',
    dir: 'ltr',
  };
}
