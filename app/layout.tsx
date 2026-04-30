import type {Metadata} from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Bit - Tecnología y Digitalización',
  description: 'Chatbot educativo iterativo para aprender Tecnología y Digitalización.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-slate-900 text-slate-200 antialiased font-sans selection:bg-blue-500/30" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}