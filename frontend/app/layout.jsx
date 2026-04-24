import '../src/index.css';

export const metadata = {
  title: 'SantalGPT',
  description: 'AI chat for the Santali community with Ol Chiki support.',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-32.svg', type: 'image/svg+xml' },
      { url: '/favicon-16.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
