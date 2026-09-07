"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  Ticket, 
  CheckCircle, 
  ExternalLink, 
  Share2, 
  Phone, 
  Car, 
  Users, 
  Timer, 
  Sun,
  Package,
  Coffee,
  ShoppingBag,
  Home,
  UserCheck
} from "lucide-react";
import { useDestinationModal } from "@/contexts/DestinationModalContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/shared/SafeImage";
import Lightbox from "@/components/gallery/Lightbox";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { formatCurrency } from "@/utils/formatCurrency";
import { getFacilityIcon } from "@/lib/facilityIcons";
import type { Destination } from "@/types/destination";
import Link from "next/link";

interface DestinationModalProps {
  allDestinations: Destination[];
}

export default function DestinationModal({ allDestinations }: DestinationModalProps) {
  const { isOpen, destination, closeModal, switchDestination } = useDestinationModal();
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

  if (!destination) return null;

  const relatedDestinations = allDestinations
    .filter((d) => d.id !== destination.id && d.category === destination.category)
    .slice(0, 3);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/destinations/${destination.slug}`;
    const shareText = `Check out ${destination.name} - ${destination.shortDescription}`;
    
    if (navigator.share) {
      navigator.share({
        title: destination.name,
        text: shareText,
        url: shareUrl,
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination.location.latitude},${destination.location.longitude}`;
    window.open(mapsUrl, "_blank");
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const facilityIconsMap: Record<string, { icon: typeof Car; label: string }> = {
    parking: { icon: Car, label: "Parking" },
    toilet: { icon: Home, label: "Toilet" },
    changingRoom: { icon: Home, label: "Changing Room" },
    prayerArea: { icon: Home, label: "Prayer Area" },
    coffeeShop: { icon: Coffee, label: "Coffee Shop" },
    guideAvailable: { icon: UserCheck, label: "Guide Available" },
    souvenirShop: { icon: ShoppingBag, label: "Souvenir Shop" },
  };

  const getHighlights = () => {
    if (destination.highlights && destination.highlights.length > 0) {
      return destination.highlights;
    }
    return destination.shortDescription
      .split('.')
      .filter(s => s.trim())
      .slice(0, 3)
      .map(s => s.trim());
  };

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
                    {destination.images.length > 1 ? (
                      <div className="relative h-full w-full group">
                         <SafeImage
                           src={getPlaceholderImage(destination.images[activeImageIndex])}
                           alt={destination.name}
                           fill
                           sizes="(max-width: 768px) 100vw, 90vw"
                           className="object-cover"
                         />
                        {destination.images.length > 1 && (
                          <>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === 0 ? destination.images.length - 1 : prev - 1))}
                              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Previous image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setActiveImageIndex((prev) => (prev === destination.images.length - 1 ? 0 : prev + 1))}
                              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Next image"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                               {destination.images.slice(0, 5).map((image, idx) => (
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
                         src={getPlaceholderImage(destination.images[0])}
                         alt={destination.name}
                         fill
                         sizes="(max-width: 768px) 100vw, 90vw"
                         className="object-cover"
                       />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                     <div className="absolute bottom-6 left-6 right-6">
                       <Badge className="bg-primary text-white mb-3">
                         {destination.category}
                       </Badge>
                       <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2" style={{ color: '#22c55e' }}>
                         {destination.name}
                       </h2>
                      <div className="flex flex-wrap items-center gap-4 text-white">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{destination.location.village}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="text-sm font-semibold">{destination.rating.toFixed(1)}</span>
                          <span className="text-sm text-white/80">({destination.totalReviews} reviews)</span>
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
                            About This Destination
                          </h3>
                          <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                            {destination.description}
                          </p>
                        </section>

                        {/* Highlights */}
                        {(destination.highlights || destination.shortDescription) && (
                          <section>
                            <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                              Highlights
                            </h3>
                             <div className="space-y-2">
                               {getHighlights().map((highlight, idx) => (
                                 <div key={`highlight-${idx}-${highlight.substring(0, 20)}`} className="flex items-start gap-2">
                                   <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                   <span className="text-text-secondary">{highlight}</span>
                                 </div>
                               ))}
                             </div>
                          </section>
                        )}

                        {/* Photo Gallery */}
                        {destination.images.length > 1 && (
                          <section>
                            <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                              Photo Gallery
                            </h3>
                             <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                               {destination.images.slice(0, 10).map((image, idx) => (
                                 <div
                                   key={`gallery-${idx}-${image}`}
                                   className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                                   onClick={() => handleImageClick(idx)}
                                 >
                                   <SafeImage
                                     src={getPlaceholderImage(image)}
                                     alt={`${destination.name} - Photo ${idx + 1}`}
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

                        {/* Facilities */}
                        {destination.facilities.length > 0 && (
                          <section>
                            <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                              Facilities & Amenities
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {destination.facilities.map((facility) => {
                                const Icon = getFacilityIcon(facility);
                                return (
                                  <div
                                    key={facility}
                                    className="flex items-center gap-2 p-3 bg-background-light rounded-lg"
                                  >
                                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                                    <span className="text-sm text-text-primary">{facility}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </section>
                        )}

                        {/* Location Map */}
                        <section>
                          <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                            Location
                          </h3>
                          <div className="space-y-3">
                            <div className="aspect-video w-full rounded-lg overflow-hidden">
                              <iframe
                                src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${destination.location.longitude}!3d${destination.location.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${destination.name}`}
                              />
                            </div>
                            <Button
                              onClick={handleGetDirections}
                              variant="outline"
                              className="w-full"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Get Directions
                            </Button>
                          </div>
                        </section>
                      </div>

                      {/* Sidebar - Quick Info */}
                      <div className="space-y-6">
                        <div className="bg-background-light rounded-lg p-6 space-y-4 sticky top-4">
                          <h3 className="font-heading text-xl font-bold text-text-primary mb-4">
                            Quick Information
                          </h3>

                          {/* Operating Hours */}
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Operating Hours</p>
                              <p className="text-sm text-text-secondary">
                                {destination.operatingHours.open} - {destination.operatingHours.close}
                              </p>
                            </div>
                          </div>

                          {/* Ticket Price */}
                          <div className="flex items-start gap-3">
                            <Ticket className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Ticket Price</p>
                              {destination.ticketPrice.adult === 0 && destination.ticketPrice.child === 0 ? (
                                <p className="text-sm font-bold text-primary">Free Entry</p>
                              ) : (
                                <div className="text-sm text-text-secondary space-y-1">
                                  <div className="flex justify-between gap-2">
                                    <span>Adult:</span>
                                    <span className="font-semibold">
                                      {typeof destination.ticketPrice.adult === 'number' 
                                        ? formatCurrency(destination.ticketPrice.adult)
                                        : destination.ticketPrice.adult}
                                    </span>
                                  </div>
                                  <div className="flex justify-between gap-2">
                                    <span>Child:</span>
                                    <span className="font-semibold">
                                      {typeof destination.ticketPrice.child === 'number' 
                                        ? formatCurrency(destination.ticketPrice.child)
                                        : destination.ticketPrice.child}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-text-primary">Address</p>
                              <p className="text-sm text-text-secondary">
                                {destination.location.address}
                              </p>
                            </div>
                          </div>

                          {/* Additional Quick Info */}
                          {destination.quickInfo?.difficultyLevel && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Difficulty Level</p>
                                <p className="text-sm text-text-secondary">{destination.quickInfo.difficultyLevel}</p>
                              </div>
                            </div>
                          )}

                          {destination.quickInfo?.estimatedDuration && (
                            <div className="flex items-start gap-3">
                              <Timer className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Estimated Duration</p>
                                <p className="text-sm text-text-secondary">{destination.quickInfo.estimatedDuration}</p>
                              </div>
                            </div>
                          )}

                          {destination.quickInfo?.suitableFor && destination.quickInfo.suitableFor.length > 0 && (
                            <div className="flex items-start gap-3">
                              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Suitable For</p>
                                <p className="text-sm text-text-secondary">{destination.quickInfo.suitableFor.join(', ')}</p>
                              </div>
                            </div>
                          )}

                          {destination.quickInfo?.bestTimeToVisit && (
                            <div className="flex items-start gap-3">
                              <Sun className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Best Time to Visit</p>
                                <p className="text-sm text-text-secondary">{destination.quickInfo.bestTimeToVisit}</p>
                              </div>
                            </div>
                          )}

                          {destination.quickInfo?.contactNumber && (
                            <div className="flex items-start gap-3">
                              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-semibold text-text-primary">Contact</p>
                                <a 
                                  href={`tel:${destination.quickInfo.contactNumber}`}
                                  className="text-sm text-primary hover:underline"
                                >
                                  {destination.quickInfo.contactNumber}
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Facilities Available Icons */}
                          {destination.facilitiesAvailable && (
                            <div className="pt-4 border-t border-border">
                              <p className="text-sm font-semibold text-text-primary mb-3">Available Facilities</p>
                              <div className="grid grid-cols-3 gap-2">
                                {Object.entries(facilityIconsMap).map(([key, { icon: Icon, label }]) => {
                                  const isAvailable = destination.facilitiesAvailable?.[key as keyof typeof destination.facilitiesAvailable];
                                  return (
                                    <div
                                      key={key}
                                      className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
                                        isAvailable ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                                      }`}
                                      title={label}
                                    >
                                      <Icon className="w-5 h-5" />
                                      <span className="text-xs text-center">{label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="pt-4 space-y-2">
                            {destination.relatedPackages && destination.relatedPackages.length > 0 && (
                              <Link href="/tour-packages" className="block">
                                <Button variant="default" className="w-full">
                                  <Package className="w-4 h-4 mr-2" />
                                  View Related Packages
                                </Button>
                              </Link>
                            )}
                            <Button
                              onClick={handleShare}
                              variant="outline"
                              className="w-full"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                            <Link href="/plan-your-visit" className="block">
                              <Button variant="outline" className="w-full">
                                <Phone className="w-4 h-4 mr-2" />
                                Contact Pokdarwis
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Related Destinations */}
                    {relatedDestinations.length > 0 && (
                      <section className="mt-12 pt-8 border-t border-border">
                        <h3 className="font-heading text-2xl font-bold text-text-primary mb-6">
                          Similar Destinations
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {relatedDestinations.map((related) => (
                            <button
                              key={related.id}
                              onClick={() => {
                                switchDestination(related);
                                setActiveImageIndex(0);
                              }}
                              className="group text-left bg-background-light rounded-lg overflow-hidden hover:shadow-lg transition-all"
                            >
                              <div className="relative h-32 w-full">
                                 <SafeImage
                                   src={getPlaceholderImage(related.images[0])}
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
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {related.location.village}
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
              images={destination.images}
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
