"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import SafeImage from "@/components/shared/SafeImage";
import { getPlaceholderImage } from "@/lib/placeholderImage";
import { galeriService, GalleryImage, groupGalleriesByDestination } from "@/lib/api/galeri";

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<Map<string, GalleryImage[]> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [allPhotos, setAllPhotos] = useState<GalleryImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await galeriService.getAll(100);
        const grouped = groupGalleriesByDestination(response.data);
        setGalleryData(grouped);
        setAllPhotos(response.data);
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
        setError('Gagal memuat galeri foto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openLightbox = (photo: GalleryImage) => {
    const index = allPhotos.findIndex(p => p.id_galeri === photo.id_galeri);
    setCurrentIndex(index);
    setSelectedImage(photo);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(allPhotos[newIndex]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allPhotos.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(allPhotos[newIndex]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, currentIndex]);

   if (isLoading) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
         <div className="max-w-7xl mx-auto px-4 py-12">
           <div className="mb-12">
             <h1 className="text-4xl font-bold text-slate-900 mb-6">Galeri Foto Desa Nyalian</h1>
             <Breadcrumb
               items={[
                 { label: "Home", href: "/" },
                 { label: "Galeri" },
               ]}
             />
           </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

   if (error) {
     return (
       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
         <div className="max-w-7xl mx-auto px-4 py-12">
           <div className="mb-12">
             <h1 className="text-4xl font-bold text-slate-900 mb-6">Galeri Foto Desa Nyalian</h1>
             <Breadcrumb
               items={[
                 { label: "Home", href: "/" },
                 { label: "Galeri" },
               ]}
             />
           </div>
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

   return (
     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24">
       <div className="max-w-7xl mx-auto px-4 py-12">
         <div className="mb-12">
           <h1 className="text-4xl font-bold text-slate-900 mb-6">Galeri Foto Desa Nyalian</h1>
           <Breadcrumb
             items={[
               { label: "Home", href: "/" },
               { label: "Galeri" },
             ]}
           />
         </div>

        {galleryData && galleryData.size > 0 ? (
          <div className="space-y-12">
            {Array.from(galleryData.entries()).map(([category, photos]) => (
              <div key={category}>
                <h2 className="text-2xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-primary">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo) => (
                    <button
                      key={photo.id_galeri}
                      onClick={() => openLightbox(photo)}
                      className="group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                        <SafeImage
                          src={getPlaceholderImage(photo.url_foto_cdn)}
                          alt={photo.alt_text || photo.caption || 'Foto galeri'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 bg-white text-left">
                        <p className="text-sm text-slate-600 font-medium">
                          {photo.caption || photo.alt_text || 'Foto galeri'}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500">Tidak ada foto galeri</p>
          </div>
        )}
      </div>

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 text-white hover:text-gray-300 z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-12 h-12" />
            </button>
          )}

          {currentIndex < allPhotos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 text-white hover:text-gray-300 z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-12 h-12" />
            </button>
          )}

          <div 
            className="max-w-7xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <SafeImage
                src={getPlaceholderImage(selectedImage.url_foto_cdn)}
                alt={selectedImage.alt_text || selectedImage.caption || 'Foto galeri'}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="text-lg font-medium">
                {selectedImage.caption || selectedImage.alt_text || 'Foto galeri'}
              </p>
              <p className="text-sm text-gray-300 mt-2">
                {currentIndex + 1} / {allPhotos.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
