import Home from '../app/page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipe Explorer | Home',
  description:
    'Discover delicious recipes from around the world with our curated collection of meals, cuisines, and cooking tips.',
  keywords: ['recipes', 'cooking', 'food', 'cuisine', 'meals', 'home cooking'],
  openGraph: {
    title: 'Recipe Explorer | Home',
    description:
      'Discover delicious recipes from around the world with our curated collection of meals, cuisines, and cooking tips.',
    images: [
      {
        url: '/assets/breakfast.jpeg',
        width: 1200,
        height: 630,
        alt: 'Recipe Explorer',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recipe Explorer | Home',
    description:
      'Discover delicious recipes from around the world with our curated collection of meals, cuisines, and cooking tips.',
    images: ['/assets/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function HomePage() {
  return <Home />;
}
