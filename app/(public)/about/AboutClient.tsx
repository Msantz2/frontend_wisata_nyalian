"use client";

import { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import HeroSlideshow from "@/components/shared/HeroSlideshow";
import GoogleMap from "@/components/maps/GoogleMap";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import GallerySection from "@/components/about/GallerySection";
import type { VillageProfile } from "@/types/village";
import type { SiteSettings } from "@/types/settings";

const HERO_IMAGES = [
  "/images/Desa Nyalian_1.webp",
  "/images/Desa Nyalian_2.webp",
  "/images/Desa Nyalian_3.webp",
  "/images/Desa Nyalian_4.webp",
  "/images/Desa Nyalian_5.webp",
  "/images/Desa Nyalian_6.webp",
  "/images/Desa Nyalian_7.webp",
  "/images/Desa Nyalian_8.webp",
  "/images/Desa Nyalian_9.webp",
  "/images/Desa Nyalian_10.webp",
  "/images/Desa Nyalian_11.webp",
  "/images/Desa Nyalian_12.webp",
  "/images/Desa Nyalian_13.webp",
  "/images/Desa Nyalian_14.webp",
  "/images/Jamu Sirkuma_1.webp",
  "/images/Jamu Sirkuma_2.webp",
  "/images/Jamu Sirkuma_3.webp",
  "/images/Pura Puncak Sari_1.webp",
  "/images/Pura Puncak Sari_2.webp",
  "/images/Pura Tirta Tadah Uwuk_1.webp",
  "/images/Pura Tirta Tadah Uwuk_2.webp",
  "/images/Pura Tirta Tadah Uwuk_3.webp",
  "/images/Pura Tirta Tadah Uwuk_4.webp",
  "/images/Pura Tirta Tadah Uwuk_5.webp",
  "/images/Pura Tirta Tadah Uwuk_6.webp",
  "/images/Pura Tirta Tadah Uwuk_7.webp",
  "/images/Pura Tirta Tadah Uwuk_8.webp",
  "/images/Pura Tirta Tadah Uwuk_9.webp",
  "/images/Pura Tirta Tadah Uwuk_10.webp",
  "/images/Pura Tirtha Harum_1.webp",
  "/images/Pura Tirtha Harum_2.webp",
  "/images/Pura Tirtha Harum_3.webp",
  "/images/Pura Tirtha Harum_4.webp",
  "/images/Pura Tirtha Harum_5.webp",
  "/images/Pura Tirtha Harum_6.webp",
  "/images/Pura Tirtha Harum_7.webp",
  "/images/Pura Tirtha Harum_8.webp",
  "/images/Sanggar Seni Tirtapudja_1.webp",
  "/images/Sanggar Seni Tirtapudja_2.webp",
  "/images/Sanggar Seni Tirtapudja_3.webp",
  "/images/Topi Capil_1.webp",
  "/images/Topi Capil_2.webp",
  "/images/Topi Capil_3.webp",
];

interface AboutClientProps {
  village: VillageProfile;
  settings: SiteSettings;
}

export default function AboutClient({ village, settings }: AboutClientProps) {
  return (
    <div className="pt-20">
      <HeroSlideshow images={HERO_IMAGES} title={village.name} />

      <div className="container mx-auto px-4 py-12 space-y-16">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Tentang", href: "/about" },
            ]}
          />
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Pengenalan
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.introduction}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Lokasi Geografis
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              {village.geography.location}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-card rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-text-primary mb-2">Luas Wilayah</h3>
                <p className="text-text-secondary">{village.geography.area}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border">
                <h3 className="font-semibold text-text-primary mb-2">Jumlah Banjar</h3>
                <p className="text-text-secondary">{village.geography.banjarCount} banjar</p>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
              <h3 className="font-semibold text-text-primary mb-3">Daftar Banjar</h3>
              <ul className="list-disc list-inside space-y-1 text-text-secondary">
                {village.geography.banjarNames.map((banjar, index) => (
                  <li key={`banjar-${index}-${banjar}`}>{banjar}</li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
              <h3 className="font-semibold text-text-primary mb-3">Batas Administratif</h3>
              <div className="space-y-2 text-text-secondary text-sm">
                <p><span className="font-semibold">Utara:</span> {village.geography.administrativeBorders.north}</p>
                <p><span className="font-semibold">Timur:</span> {village.geography.administrativeBorders.east}</p>
                <p><span className="font-semibold">Selatan:</span> {village.geography.administrativeBorders.south}</p>
                <p><span className="font-semibold">Barat:</span> {village.geography.administrativeBorders.west}</p>
              </div>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {village.geography.landscape}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Demografi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <p className="text-sm text-text-secondary mb-1">Total Penduduk</p>
                <p className="text-2xl font-bold text-text-primary">{village.demographics.population.toLocaleString()}</p>
                <p className="text-xs text-text-secondary mt-1">Tahun {village.demographics.populationYear}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <p className="text-sm text-text-secondary mb-1">Laki-laki / Perempuan</p>
                <p className="text-2xl font-bold text-text-primary">{village.demographics.males.toLocaleString()} / {village.demographics.females.toLocaleString()}</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border text-center">
                <p className="text-sm text-text-secondary mb-1">Rumah Tangga</p>
                <p className="text-2xl font-bold text-text-primary">{village.demographics.households.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border mb-6">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold">Agama:</span> {village.demographics.religion}
              </p>
            </div>
            <p className="text-text-secondary leading-relaxed">
              {village.demographics.description}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Kehidupan Sosial, Adat, dan Komunitas
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.socialCulturalLife}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Asal Usul Nama &quot;Nyalian&quot;
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.origin}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Filosofi Desa
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.philosophy}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Visi
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.vision}
            </p>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Misi
            </h2>
              <ul className="list-disc list-inside space-y-3 text-text-secondary leading-relaxed">
                {village.mission.map((item, index) => (
                  <li key={`mission-${index}-${typeof item === 'string' ? item.substring(0, 20) : index}`} className="ml-2">
                    {item}
                  </li>
                ))}
              </ul>
          </section>

          <section>
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Warisan Budaya
            </h2>
            <p className="text-text-secondary leading-relaxed">
              {village.culturalHeritage}
            </p>
          </section>
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
              Potensi Pariwisata
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Desa Nyalian menawarkan daya tarik beragam yang menampilkan keindahan alam dan kekayaan budaya kehidupan pegunungan Bali.
            </p>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {village.tourismPotential.map((potential, index) => (
               <div key={`tourism-${index}-${potential.substring(0, 20)}`} className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                 <p className="text-text-secondary leading-relaxed">{potential}</p>
               </div>
             ))}
           </div>
        </div>

        <div>
          <GallerySection />
        </div>

        <div>
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold text-text-primary">
              Lokasi
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GoogleMap
                embedUrl={settings.googleMapsEmbed}
                title="Lokasi Desa Nyalian"
              />
            </div>
            <div className="space-y-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-primary mt-1 flex-shrink-0">📍</div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-text-primary">Lokasi</h3>
                    <p className="text-sm text-text-secondary">{settings.address}</p>
                  </div>
                </div>
              </div>
              <Coordinates
                latitude={settings.latitude}
                longitude={settings.longitude}
              />
              <NavigationButton
                latitude={settings.latitude}
                longitude={settings.longitude}
                label="Dapatkan Arah"
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center bg-background-section rounded-lg p-8">
          <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">
            Rencanakan Kunjungan Anda
          </h3>
          <p className="text-text-secondary mb-6">
            Hubungi kami melalui WhatsApp untuk reservasi, paket tur, atau pertanyaan apa pun tentang mengunjungi Desa Nyalian.
          </p>
          <WhatsAppCTA
            phone={settings.whatsapp}
            message="Halo! Saya ingin tahu lebih lanjut tentang Desa Nyalian."
          />
        </div>
      </div>
    </div>
  );
}
