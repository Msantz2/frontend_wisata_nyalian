import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Destinations | Nyalian Tourism Village",
  description: "Discover the natural beauty and cultural heritage of Nyalian Village. Explore waterfalls, rice terraces, temples, and traditional Balinese experiences.",
};

export default function DestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
