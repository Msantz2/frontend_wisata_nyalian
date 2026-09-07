"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Clock, MapPin, Star, Ticket } from "lucide-react";
import type { Destination } from "@/types/destination";
import type { Video } from "@/types/video";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionContainer from "@/components/shared/SectionContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/card";
import { getFacilityIcon } from "@/lib/facilityIcons";
import ImageGallery from "@/components/gallery/ImageGallery";
import DestinationGallerySection from "@/components/destination/DestinationGallerySection";
import VideoGallery from "@/components/gallery/VideoGallery";
import AddressCard from "@/components/maps/AddressCard";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import SocialShare from "@/components/shared/SocialShare";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import DestinationGrid from "./DestinationGrid";
import SectionTitle from "@/components/shared/SectionTitle";
import DetailHero from "@/components/shared/DetailHero";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });
const VideoModal = dynamic(() => import("@/components/gallery/VideoModal"), { ssr: false });
const GoogleMap = dynamic(() => import("@/components/maps/GoogleMap"), { ssr: false });

interface DestinationDetailContentProps {
  destination: Destination;
  videos: Video[];
  relatedDestinations: Destination[];
  whatsappPhone: string;
}

export default function DestinationDetailContent({
  destination,
  videos,
  relatedDestinations,
  whatsappPhone,
}: DestinationDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const whatsappMessage = `Halo, saya ingin mengetahui lebih lanjut tentang ${destination.name}. Terima kasih.`;

  return (
    <>
      <DetailHero
        backgroundImage={getPlaceholderImage(destination.images[0] || destination.fullImageUrl)}
        title={destination.name}
        category={destination.category}
        metadata={
          <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-accent text-accent" />
              <span className="font-semibold">{destination.rating.toFixed(1)}</span>
              <span className="text-white/80">({destination.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-5 h-5" />
              <span>{destination.location.village}</span>
            </div>
          </div>
        }
      />

      <SectionContainer className="py-12">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Destinations", href: "/destinations" },
              { label: destination.name },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 space-y-8 sm:space-y-12">

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Ringkasan
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                {destination.shortDescription}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Deskripsi
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {destination.description}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Fasilitas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.facilities.map((facility) => {
                  const Icon = getFacilityIcon(facility);
                  return (
                    <div
                      key={facility}
                      className="flex items-center gap-3 bg-card border border-border rounded-lg p-4"
                    >
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-text-primary">{facility}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Galeri
              </h2>
              <div className="bg-gray-100 rounded-lg p-6">
                <DestinationGallerySection 
                  destinationName={destination.name} 
                  destinationApiId={destination.apiId}
                />
              </div>
            </section>

            {videos.length > 0 && (
              <section>
                <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                  Video
                </h2>
                <VideoGallery videos={videos} onVideoClick={handleVideoClick} />
              </section>
            )}

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                Lokasi
              </h2>
              <div className="space-y-4">
                <AddressCard
                  village={destination.location.village}
                  district={destination.location.district}
                  regency={destination.location.regency}
                  province={destination.location.province}
                  address={destination.location.address}
                />
                <Coordinates
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                />
                <GoogleMap
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                  title={destination.name}
                />
                <NavigationButton
                  latitude={destination.location.latitude}
                  longitude={destination.location.longitude}
                />
              </div>
            </section>

            {relatedDestinations.length > 0 && (
              <section>
                <SectionTitle
                  title="Destinasi Terkait"
                  subtitle="Jelajahi lebih banyak tempat di kategori yang sama"
                  align="left"
                />
                <DestinationGrid destinations={relatedDestinations} />
              </section>
            )}

            <section>
              <div className="flex justify-center">
                <SocialShare
                  title={destination.name}
                  description={destination.shortDescription}
                />
              </div>
            </section>
          </main>

          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <Card className="p-6 lg:sticky lg:top-24">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                Informasi Kunjungan
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-text-primary">Jam Operasional</p>
                    <p className="text-sm text-text-secondary">
                      {destination.operatingHours.open} - {destination.operatingHours.close}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-text-primary mb-2">Harga Tiket</p>
                    {destination.ticketPrice.adult === 0 && destination.ticketPrice.child === 0 ? (
                      <p className="text-lg font-bold text-primary">Gratis</p>
                    ) : (
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Dewasa:</span>
                          <span className="font-semibold text-text-primary">
                            {typeof destination.ticketPrice.adult === 'number' 
                              ? formatCurrency(destination.ticketPrice.adult)
                              : destination.ticketPrice.adult}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary">Anak:</span>
                          <span className="font-semibold text-text-primary">
                            {typeof destination.ticketPrice.child === 'number' 
                              ? formatCurrency(destination.ticketPrice.child)
                              : destination.ticketPrice.child}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <WhatsAppCTA
                phone={whatsappPhone}
                message={whatsappMessage}
                label="Tanya Detail"
                size="lg"
              />
            </Card>
          </aside>
        </div>
      </SectionContainer>

      <Lightbox
        images={destination.images}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      <VideoModal
        video={selectedVideo}
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
}
