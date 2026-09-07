"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  CheckCircle, 
  Share2, 
  Phone, 
  Car,
  Calendar,
  Globe,
  TrendingUp,
  Package as PackageIcon,
  Check,
  XCircle
} from "lucide-react";
import { usePackageModal } from "@/contexts/PackageModalContext";
import { useDestinationModal } from "@/contexts/DestinationModalContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/shared/SafeImage";
import Lightbox from "@/components/gallery/Lightbox";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { formatCurrency } from "@/utils/formatCurrency";
import type { TourPackage } from "@/types/package";
import type { Destination } from "@/types/destination";
import Link from "next/link";

interface PackageModalProps {
  allPackages: TourPackage[];
  allDestinations: Destination[];
}

export default function PackageModal({ allPackages, allDestinations }: PackageModalProps) {
  const { isOpen, package: pkg, closeModal, switchPackage } = usePackageModal();
  const { openModal: openDestinationModal } = useDestinationModal();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, closeModal]);

  if (!pkg) return null;

  const relatedPackages = allPackages
    .filter((p) => p.id !== pkg.id && p.category === pkg.category)
    .slice(0, 3);

  const packageDestinations = allDestinations.filter((d) => 
    pkg.destinations.includes(d.id)
  );

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/packages/${pkg.slug}`;
    const shareText = `Check out ${pkg.name} - ${pkg.shortDescription}`;
    
    if (navigator.share) {
      navigator.share({
        title: pkg.name,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleBookNow = () => {
    const message = `Hi, I'm interested in booking: ${pkg.name}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDestinationClick = (destinationId: string) => {
    const destination = allDestinations.find((d) => d.id === destinationId);
    if (destination) {
      openDestinationModal(destination);
    }
  };

  const allImages = pkg.gallery && pkg.gallery.length > 0 ? pkg.gallery : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 py-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-background rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-20 p-2 bg-background/90 hover:bg-background rounded-full shadow-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-text-primary" />
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                  {/* Hero Section */}
                  <div className="relative h-64 md:h-80 w-full">
                    {allImages.length > 1 ? (
                      <div className="relative h-full w-full group">
                         <SafeImage
                           src={getPlaceholderImage(allImages[activeImageIndex])}
                           alt={pkg.name}
                           fill
                           sizes="(max-width: 768px) 100vw, 90vw"
                           className="object-cover"
                         />
                        {allImages.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Previous image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Next image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                               {allImages.slice(0, 5).map((image, idx) => (
                                 <button
                                   key={`image-indicator-${idx}-${image}`}
                                   onClick={() => setActiveImageIndex(idx)}
                                   className={`w-2 h-2 rounded-full transition-all ${
                                     idx === activeImageIndex ? 'bg-white w-6' : 'bg-white/50'
                                   }`}
                                   aria-label={`Go to image ${idx + 1}`}
                                 />
                               ))}
                             </div>
                          </>
                        )}
                      </div>
                     ) : (
                       <SafeImage
                         src={getPlaceholderImage(pkg.gallery?.[0])}
                         alt={pkg.name}
                         fill
                         sizes="(max-width: 768px) 100vw, 90vw"
                         className="object-cover"
                       />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                     <div className="absolute bottom-6 left-6 right-6">
                       <Badge className="bg-secondary text-white mb-3">
                         {pkg.category}
                       </Badge>
                       <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2" style={{ color: '#22c55e' }}>
                         {pkg.name}
                       </h2>
                      <div className="flex flex-wrap items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{pkg.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-semibold">{pkg.rating ? pkg.rating.toFixed(1) : 'N/A'}</span>
                          {pkg.totalReviews && (
                            <span className="text-sm text-white/80">({pkg.totalReviews} reviews)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-accent">
                            {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Main Content */}
                      <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                         <section>
                           <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">
                             Tentang Paket Ini
                           </h3>
                           <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                             {pkg.description}
                           </p>
                         </section>

                         {/* Highlights */}
                         {pkg.highlights && pkg.highlights.length > 0 && (
                           <section>
                             <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                               Sorotan
                             </h3>
                             <div className="space-y-2">
                               {pkg.highlights.map((highlight, idx) => (
                                 <div key={`highlight-${idx}-${highlight.substring(0, 20)}`} className="flex items-start gap-2">
                                   <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                   <span className="text-text-secondary">{highlight}</span>
                                 </div>
                               ))}
                             </div>
                          </section>
                        )}

                        {/* Itinerary */}
                         {pkg.itinerary && pkg.itinerary.length > 0 && (
                           <section>
                             <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                               Itinerary
                             </h3>
                              <div className="space-y-4">
                                {pkg.itinerary.map((item, idx) => {
                                  const itemKey = typeof item === 'object' && item !== null && 'activity' in item
                                    ? ((item as any).activity || (item as any).time || idx)
                                    : String(item).substring(0, 20);
                                  const displayText = typeof item === 'object' && item !== null && 'activity' in item
                                    ? `${(item as any).time || ''} - ${(item as any).activity || ''}`
                                    : String(item);
                                  return (
                                  <div key={`itinerary-${idx}-${itemKey}`} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {idx + 1}
                                      </div>
                                      {idx < pkg.itinerary.length - 1 && (
                                        <div className="w-0.5 h-full bg-primary/30 mt-2" />
                                      )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                      <p className="text-text-secondary">{displayText}</p>
                                    </div>
                                  </div>
                                  );
                                })}
                              </div>
                           </section>
                         )}

                         {/* Destinations Included */}
                         {packageDestinations.length > 0 && (
                           <section>
                             <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                               Destinasi yang Disertakan
                             </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {packageDestinations.map((destination) => (
                                <button
                                  key={destination.id}
                                  onClick={() => handleDestinationClick(destination.id)}
                                  className="group text-left bg-background-light rounded-lg overflow-hidden hover:shadow-lg transition-all"
                                >
                                  <div className="relative h-32 w-full">
                                   <SafeImage
                                     src={getPlaceholderImage(destination.images[0])}
                                     alt={destination.name}
                                     fill
                                     sizes="(max-width: 768px) 50vw, 33vw"
                                     className="object-cover group-hover:scale-110 transition-transform duration-300"
                                   />
                                  </div>
                                  <div className="p-3">
                                    <h4 className="font-semibold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                                      {destination.name}
                                    </h4>
                                    <p className="text-xs text-text-muted mt-1 flex items-center">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {destination.location.village}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </section>
                        )}

                         {/* Inclusions & Exclusions */}
                         <section>
                           <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                             Yang Disertakan & Tidak Disertakan
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Included */}
                             <div className="space-y-3">
                               <h4 className="font-semibold text-text-primary flex items-center gap-2">
                                 <Check className="w-5 h-5 text-green-600" />
                                 Disertakan
                               </h4>
                                 <div className="space-y-2">
                                   {pkg.included.map((item, idx) => (
                                     <div key={`included-${idx}-${typeof item === 'string' ? item.substring(0, 20) : idx}`} className="flex items-start gap-2">
                                       <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                       <span className="text-sm text-text-secondary">{item}</span>
                                     </div>
                                   ))}
                                 </div>
                             </div>

                             {/* Excluded */}
                             <div className="space-y-3">
                               <h4 className="font-semibold text-text-primary flex items-center gap-2">
                                 <XCircle className="w-5 h-5 text-red-600" />
                                 Tidak Disertakan
                               </h4>
                                 <div className="space-y-2">
                                   {pkg.excluded.map((item, idx) => (
                                     <div key={`excluded-${idx}-${typeof item === 'string' ? item.substring(0, 20) : idx}`} className="flex items-start gap-2">
                                       <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                       <span className="text-sm text-text-secondary">{item}</span>
                                     </div>
                                   ))}
                                 </div>
                             </div>
                           </div>
                         </section>

                         {/* Photo Gallery */}
                         {allImages.length > 1 && (
                           <section>
                             <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                               Galeri Foto
                             </h3>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                               {allImages.slice(0, 10).map((image, idx) => (
                                 <div
                                   key={`gallery-${idx}-${image}`}
                                   className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                                   onClick={() => handleImageClick(idx)}
                                 >
                                   <SafeImage
                                     src={getPlaceholderImage(image)}
                                     alt={`${pkg.name} - Photo ${idx + 1}`}
                                     fill
                                     sizes="(max-width: 768px) 50vw, 33vw"
                                     className="object-cover group-hover:scale-110 transition-transform duration-300"
                                   />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </section>
                        )}

                         {/* Terms & Important Notes */}
                         {pkg.terms && pkg.terms.length > 0 && (
                           <section>
                             <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                               Syarat & Catatan Penting
                             </h3>
                             <div className="bg-background-light rounded-lg p-4 space-y-2">
                               {pkg.terms.map((term, idx) => (
                                 <div key={`term-${idx}-${term.substring(0, 20)}`} className="flex items-start gap-2">
                                   <span className="text-primary font-bold mt-1">•</span>
                                   <span className="text-sm text-text-secondary">{term}</span>
                                 </div>
                               ))}
                             </div>
                          </section>
                        )}
                      </div>

                      {/* Sidebar - Quick Info */}
                      <div className="space-y-6">
                        <div className="bg-background-light rounded-lg p-6 space-y-4 sticky top-4">
                          <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                            Informasi Cepat
                          </h3>

                          {/* Price */}
                          <div className="flex items-start gap-3">
                            <PackageIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Harga</p>
                              <p className="text-lg font-bold text-primary">
                                {typeof pkg.price === 'number' ? formatCurrency(pkg.price) : pkg.price}
                              </p>
                            </div>
                          </div>

                          {/* Duration */}
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Durasi</p>
                              <p className="text-sm text-text-secondary">{pkg.duration}</p>
                            </div>
                          </div>

                          {/* Group Capacity */}
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Kapasitas Grup</p>
                              <p className="text-sm text-text-secondary">{pkg.capacity}</p>
                            </div>
                          </div>

                          {/* Additional Quick Info */}
                          {pkg.quickInfo?.languages && pkg.quickInfo.languages.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Bahasa</p>
                                <p className="text-sm text-text-secondary">{pkg.quickInfo.languages.join(', ')}</p>
                              </div>
                            </div>
                          )}

                          {pkg.quickInfo?.transportation !== undefined && (
                            <div className="flex items-start gap-3">
                              <Car className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Transportasi</p>
                                <p className="text-sm text-text-secondary">
                                  {pkg.quickInfo.transportation ? 'Disertakan' : 'Tidak disertakan'}
                                </p>
                              </div>
                            </div>
                          )}

                          {pkg.quickInfo?.availability && (
                            <div className="flex items-start gap-3">
                              <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Ketersediaan</p>
                                <p className="text-sm text-text-secondary">{pkg.quickInfo.availability}</p>
                              </div>
                            </div>
                          )}

                          {pkg.quickInfo?.physicalLevel && (
                            <div className="flex items-start gap-3">
                              <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Tingkat Fisik</p>
                                <p className="text-sm text-text-secondary">{pkg.quickInfo.physicalLevel}</p>
                              </div>
                            </div>
                          )}

                          {pkg.quickInfo?.suitableFor && pkg.quickInfo.suitableFor.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Cocok Untuk</p>
                                <p className="text-sm text-text-secondary">{pkg.quickInfo.suitableFor.join(', ')}</p>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="pt-4 space-y-2">
                            <Button
                              onClick={handleBookNow}
                              variant="default"
                              className="w-full"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Pesan Sekarang
                            </Button>
                            <Button
                              onClick={handleShare}
                              variant="outline"
                              className="w-full"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Bagikan
                            </Button>
                            <Link href="/plan-your-visit" className="block">
                              <Button variant="outline" className="w-full">
                                <Phone className="w-4 h-4 mr-2" />
                                Hubungi Pokdarwis
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Related Packages */}
                    {relatedPackages.length > 0 && (
                      <section className="mt-12 pt-8 border-t border-border">
                        <h3 className="font-heading text-2xl font-bold text-text-primary mb-6">
                          Paket Serupa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {relatedPackages.map((related) => (
                            <button
                              key={related.id}
                              onClick={() => {
                                switchPackage(related);
                                setActiveImageIndex(0);
                              }}
                              className="group text-left bg-background-light rounded-lg overflow-hidden hover:shadow-lg transition-all"
                            >
                               <div className="relative h-32 w-full">
                                 <SafeImage
                                    src={getPlaceholderImage(related.gallery?.[0])}
                                    alt={related.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                              </div>
                              <div className="p-3">
                                <h4 className="font-semibold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                                  {related.name}
                                </h4>
                                <p className="text-xs text-text-muted mt-1 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {related.duration}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Lightbox for full-screen image viewing */}
          {lightboxOpen && (
            <Lightbox
              images={allImages}
              initialIndex={lightboxIndex}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
