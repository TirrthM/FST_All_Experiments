import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pragmatic Books Store Portal",
  description: "Next.js App Router practical demonstration portal. Contains responsive dashboard, route boundaries, and actions mutations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Zero-Flash Theme Script (Runs synchronously before page paints) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = savedTheme || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  console.error('Zero-Flash theme script failed:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col relative overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 transition-colors duration-300 font-sans">

        <ThemeProvider>
          <Header />
          <main className="flex-grow flex flex-col relative z-10">{children}</main>
          
          {/* Global Footer */}
          <footer className="py-6 border-t border-slate-200/30 dark:border-slate-850/40 text-center text-xs text-slate-500 dark:text-slate-400 glass-panel mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-4">
              © {new Date().getFullYear()} Pragmatic Books Store. Built with Next.js App Router, Tailwind CSS v4, and Localized Layouts.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
