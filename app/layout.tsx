import './globals.css';
import { Inter } from 'next/font/google';
import { ToastProvider } from '@/providers/ToastProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'sosocontent.ai 🇭🇰 - 地道廣東話 AI 內容營銷',
  description: '專為香港中小企打造的營銷文案生成器',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-HK" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply saved theme before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light');})();` }} />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
