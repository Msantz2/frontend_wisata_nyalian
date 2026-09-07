"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ImageGallery from "@/components/gallery/ImageGallery";
import { galeriService, GalleryImage } from "@/lib/api/galeri";
import { Button } from "@/components/ui/button";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });

interface DestinationGallerySectionProps {
  destinationName: string;
  destinationApiId?: number;
}

export default function DestinationGallerySection({ destinationName, destinationApiId }: DestinationGallerySectionProps) {
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [displayImages, setDisplayImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!destinationApiId) {
          setAllImages([]);
          setDisplayImages([]);
          setIsLoading(false);
          return;
        }

        const response = await galeriService.getAll(100, destinationApiId);
        const matchedPhotos = response.data || [];
        
        setAllImages(matchedPhotos);
        setDisplayImages(matchedPhotos.slice(0, 10));
      } catch (err) {
        void err;
        setError('Gallery unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [destinationApiId]);

  const validImages = displayImages.filter((img) => {
    return img && img.url_foto_cdn && typeof img.url_foto_cdn === 'string' && img.url_foto_cdn.trim().length > 0;
  });

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (error) {
    return null;
  }

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (validImages.length === 0) {
    return null;
  }

  return (
    <div>
      <ImageGallery images={validImages} onImageClick={handleImageClick} variant="carousel" />

      {allImages.length > 10 && (
        <div className="flex justify-center mt-8">
          <Link href={`/galeri?destinasi=${encodeURIComponent(destinationName)}`}>
            <Button variant="default" size="lg">
              Lihat Semua Galeri
            </Button>
          </Link>
        </div>
      )}

      <Lightbox
        images={validImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
