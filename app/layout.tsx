import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nyalian Tourism Village | Authentic Balinese Mountain Experience",
    template: "%s | Nyalian Tourism Village",
  },
  description: "Discover the hidden gem of Bangli Regency. Experience pristine waterfalls, rice terraces, rich cultural heritage, and warm hospitality in Bali's mountains.",
  keywords: ["Bali tourism", "Nyalian Village", "Bangli Regency", "waterfall Bali", "rice terraces", "cultural tourism", "ecotourism", "village tourism Bali"],
  authors: [{ name: "Nyalian Tourism Village" }],
  creator: "Nyalian Tourism Village",
  publisher: "Nyalian Tourism Village",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nyalianvillage.com"),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Nyalian Tourism Village",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
