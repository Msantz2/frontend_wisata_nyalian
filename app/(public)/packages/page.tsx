import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PackagesClient from "./PackagesClient";
import { getPackages } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Paket Tur",
    description: "Pengalaman yang dikurasi menggabungkan yang terbaik dari Desa Nyalian. Pilih dari petualangan seharian penuh, immersion budaya, perjalanan spiritual, dan banyak lagi.",
    path: "/packages",
    keywords: ["Paket tur Bali", "Tur Nyalian", "tur desa", "tur budaya", "paket petualangan", "tur spiritual"],
  });
}

export default async function PackagesPage() {
  const packages = await getPackages();
  return <PackagesClient packages={packages} />;
}
