"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Clock, Users, Star, CheckCircle, XCircle } from "lucide-react";
import type { TourPackage } from "@/types/package";
import type { Destination } from "@/types/destination";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { formatCurrency } from "@/utils/formatCurrency";
import SectionContainer from "@/components/shared/SectionContainer";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ImageGallery from "@/components/gallery/ImageGallery";
import SocialShare from "@/components/shared/SocialShare";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import DestinationGrid from "@/components/destination/DestinationGrid";
import PackageGrid from "./PackageGrid";
import SectionTitle from "@/components/shared/SectionTitle";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });

interface PackageDetailContentProps {
  package: TourPackage;
  linkedDestinations: Destination[];
  relatedPackages: TourPackage[];
  whatsappPhone: string;
}

export default function PackageDetailContent({
  package: pkg,
  linkedDestinations,
  relatedPackages,
  whatsappPhone,
}: PackageDetailContentProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const whatsappMessage = `Hello, I am interested in the ${pkg.name}. Could you please provide more information? Thank you.`;

  const parseItineraryTime = (item: string | { time?: string; activity?: string; day?: number; waktu?: string }) => {
    if (typeof item === 'object' && item !== null) {
      const time = item.time || item.waktu || '';
      const activity = item.activity || '';
      return { time, activity };
    }
    const match = String(item).match(/^(\d{1,2}:\d{2})\s*-\s*(.+)$/);
    if (match) {
      return { time: match[1], activity: match[2] };
    }
    return { time: "", activity: String(item) };
  };

   return (
     <>
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <Image
            src={getPlaceholderImage(pkg.gallery?.[0])}
            alt={pkg.name}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto max-w-7xl">
            <Badge className="bg-secondary text-white mb-4">
              {pkg.category}
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {pkg.name}
            </h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{pkg.rating ? pkg.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5" />
                <span>{pkg.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-5 h-5" />
                <span>{pkg.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SectionContainer className="py-12">
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "Packages", href: "/packages" },
              { label: pkg.name },
            ]}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <main className="flex-1 space-y-8 sm:space-y-12">

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Overview
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed">
                {pkg.shortDescription}
              </p>
            </section>

            <section>
              <h2 className="font-heading text-3xl font-bold text-text-primary mb-4">
                Description
              </h2>
              <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                {pkg.description}
              </p>
            </section>

            {pkg.highlights && pkg.highlights.length > 0 && (
               <section>
                 <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                   Highlights
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {pkg.highlights.map((highlight, index) => (
                     <div
                       key={`highlight-${index}-${highlight.substring(0, 20)}`}
                       className="flex items-center gap-3 bg-card border border-border rounded-lg p-4"
                     >
                       <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                       <span className="text-text-primary">{highlight}</span>
                     </div>
                   ))}
                 </div>
               </section>
            )}

             <section>
               <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                 What&apos;s Included
               </h2>
                <div className="space-y-3">
                  {pkg.included.map((item, index) => (
                    <div key={`included-${index}-${typeof item === 'string' ? item.substring(0, 20) : index}`} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-text-primary">{item}</span>
                    </div>
                  ))}
                </div>
             </section>

             <section>
               <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                 What&apos;s Not Included
               </h2>
                <div className="space-y-3">
                  {pkg.excluded.map((item, index) => (
                    <div key={`excluded-${index}-${typeof item === 'string' ? item.substring(0, 20) : index}`} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-text-muted mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
             </section>

             <section>
               <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                 Itinerary
               </h2>
               <div className="relative space-y-6">
                 <div className="absolute left-[15px] top-8 bottom-8 w-0.5 bg-border" />
                  {pkg.itinerary.map((item, index) => {
                    const { time, activity } = parseItineraryTime(item);
                    return (
                      <div key={`itinerary-${index}-${activity?.substring(0, 20) || index}`} className="relative flex gap-6">
                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center relative z-10">
                         <div className="w-2 h-2 rounded-full bg-white" />
                       </div>
                       <div className="flex-1 pb-6">
                         {time && (
                           <div className="font-semibold text-primary mb-1">
                             {time}
                           </div>
                         )}
                         <p className="text-text-primary">{activity}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
             </section>

            {linkedDestinations.length > 0 && (
              <section>
                <SectionTitle
                  title="Destinations Included"
                  subtitle="Places you'll visit on this package"
                  align="left"
                />
                <DestinationGrid destinations={linkedDestinations} />
              </section>
            )}

            {pkg.gallery.length > 0 && (
              <section>
                <h2 className="font-heading text-3xl font-bold text-text-primary mb-8">
                  Gallery
                </h2>
                <ImageGallery
                  images={pkg.gallery}
                  onImageClick={handleImageClick}
                  variant="grid"
                />
              </section>
            )}

            {relatedPackages.length > 0 && (
              <section>
                <SectionTitle
                  title="Related Packages"
                  subtitle="Explore more packages you might like"
                  align="left"
                />
                <PackageGrid packages={relatedPackages} />
              </section>
            )}

            <section>
              <div className="flex justify-center">
                <SocialShare
                  title={pkg.name}
                  description={pkg.shortDescription}
                />
              </div>
            </section>
          </main>

          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <Card className="p-6 lg:sticky lg:top-24">
              <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                Package Information
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-primary">
                    {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
                  </p>
                  <p className="text-sm text-text-muted">per person</p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary">Duration</p>
                      <p className="text-sm text-text-secondary">{pkg.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-text-primary">Capacity</p>
                      <p className="text-sm text-text-secondary">{pkg.capacity}</p>
                    </div>
                  </div>
                </div>
              </div>

              <WhatsAppCTA
                phone={whatsappPhone}
                message={whatsappMessage}
                label="Book This Package"
                size="lg"
              />
            </Card>
          </aside>
        </div>
      </SectionContainer>

      <Lightbox
        images={pkg.gallery}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
