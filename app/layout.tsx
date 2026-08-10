import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindSpark Gemma - AI Study & Technical Learning Companion',
  description: 'An advanced AI learning assistant built with Google Gemma models for the Build with Gemma Kaggle Hackathon.',
  keywords: ['Gemma', 'Google AI', 'Kaggle', 'AI Study Helper', 'Build with Gemma', 'Next.js', 'Vercel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#090d16] text-slate-100 antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
