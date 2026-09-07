import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import AboutClient from "./AboutClient";
import { getVillageProfile, getSettings } from "@/lib/data";

export function generateMetadata(): Metadata {
  const village = getVillageProfile();
  return buildMetadata({
    title: "Tentang Desa Nyalian",
    description: "Jelajahi sejarah resmi, geografis, demografi, dan warisan budaya Desa Nyalian di Banjarangkan, Klungkung, Bali. Pelajari tentang filosofi Tri Hita Karana, kehidupan adat, dan asal usul nama Nyalian dari dokumentasi official.",
    path: "/about",
    image: village.gallery[0],
    keywords: ["Desa Nyalian", "Banjarangkan", "Klungkung", "Bali", "sejarah desa", "budaya Balinese", "Tri Hita Karana", "pariwisata berkelanjutan", "Desa Adat", "warisan budaya"],
  });
}

export default function AboutPage() {
  const village = getVillageProfile();
  const settings = getSettings();
  
  return <AboutClient village={village} settings={settings} />;
}
