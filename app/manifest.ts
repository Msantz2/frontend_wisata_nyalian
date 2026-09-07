import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nyalian Tourism Village",
    short_name: "Nyalian Village",
    description: "Discover the hidden gem of Bangli Regency. Experience pristine waterfalls, rice terraces, rich cultural heritage, and warm hospitality in Bali's mountains.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2C5F2D",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
