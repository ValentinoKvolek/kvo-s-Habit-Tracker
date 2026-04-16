import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Constantia — Tu tracker de hábitos",
  description:
    "Constantia es un tracker de hábitos open source, gratis para siempre. Construí rutinas que duran sin paywalls.",
  keywords: ["habit tracker", "hábitos", "rutinas", "open source", "gratuito"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Constantia",
  },
  openGraph: {
    title: "Constantia — Tu tracker de hábitos",
    description: "Gratis, open source, sin límites.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#8b4513" />
        <link rel="apple-touch-icon" href="/logo.png" />
        {/* Blocking script — applies .dark before first paint to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme'),d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t!=='light'&&d)){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();` }} />
      </head>
      <body>
        {children}
        <Toaster position="bottom-center" theme="system" />
      </body>
    </html>
  );
}
