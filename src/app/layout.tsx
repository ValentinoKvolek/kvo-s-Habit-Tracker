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
    <html lang="es" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "#ede3d5",
              border: "1px solid #d4c4b0",
              color: "#1c1410",
              fontFamily: "var(--font-sans)",
            },
          }}
        />
      </body>
    </html>
  );
}
