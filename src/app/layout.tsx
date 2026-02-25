import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starbook - Auspicious Day Calendar",
  description:
    "Discover the most auspicious days with Starbook. A free calendar combining Western astrology and Chinese almanac to find the best days for your plans.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Starbook - Auspicious Day Calendar",
    description:
      "Discover the most auspicious days with Starbook. A free calendar combining Western astrology and Chinese almanac.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
