import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "TerminalMaster — Linux & Tmux o'rganish",
  description: "Linux terminal va Tmux asoslarini interaktiv tarzda o'rganing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('terminalmaster_theme')||'dark';document.documentElement.setAttribute('data-theme',t);})();` }} />
        {children}
      </body>
    </html>
  );
}
