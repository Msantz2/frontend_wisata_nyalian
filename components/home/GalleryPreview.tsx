"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import ImageGallery from "@/components/gallery/ImageGallery";
import { galeriService, GalleryImage } from "@/lib/api/galeri";
import { Button } from "@/components/ui/button";

const Lightbox = dynamic(() => import("@/components/gallery/Lightbox"), { ssr: false });

interface GalleryPreviewProps {
  images?: string[];
}

export default function GalleryPreview({ images: fallbackImages }: GalleryPreviewProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await galeriService.getAll(100);
        setImages(response.data.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch gallery images:', err);
        setError('Failed to load gallery images');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter valid images
  const validImages = images.filter((img) => {
    return img && img.url_foto_cdn && typeof img.url_foto_cdn === 'string' && img.url_foto_cdn.trim().length > 0;
  });

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  if (error) {
    console.error('Gallery error:', error);
    return null;
  }

  if (isLoading) {
    return (
      <SectionContainer>
        <SectionTitle
          title="Galeri Foto"
          subtitle="Jelajahi keindahan Desa Nyalian melalui gambar"
        />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SectionContainer>
    );
  }

  if (validImages.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle
        title="Galeri Foto"
        subtitle="Jelajahi keindahan Desa Nyalian melalui gambar"
      />
      
      <ImageGallery images={validImages} onImageClick={handleImageClick} />
      
      <div className="flex justify-center mt-8">
        <Link href="/galeri">
          <Button variant="default" size="lg">
            Lihat Semua Galeri
          </Button>
        </Link>
      </div>
      
      <Lightbox
        images={validImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </SectionContainer>
  );
}
