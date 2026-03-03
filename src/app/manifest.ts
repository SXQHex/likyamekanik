import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Likya Mekanik',
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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.png',
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
