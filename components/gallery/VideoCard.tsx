import { Play } from "lucide-react";
import Image from "next/image";
import type { Video } from "@/types/video";
import { getValidImageUrl, getYouTubeThumbnail } from "@/lib/placeholderImage";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  // Try to use local thumbnail first, fall back to YouTube thumbnail
  const localThumbnail = getValidImageUrl(video.thumbnail);
  const thumbnailUrl = localThumbnail || getYouTubeThumbnail(video.youtubeId);
  
  return (
    <button
      onClick={onClick}
      className="h-full group relative block w-full rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
       <div className="relative aspect-video w-full">
         <Image
           src={thumbnailUrl || '/images/logonyalian.webp'}
           alt={video.title}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
           className="object-cover"
         />
        
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
          </div>
        </div>
        
        {video.category && (
          <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-semibold px-3 py-1 rounded-full">
            {video.category}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-card text-left">
        <h3 className="font-heading text-lg font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
          {video.title}
        </h3>
        <p className="text-text-secondary text-sm mt-2 line-clamp-2">
          {video.description}
        </p>
      </div>
    </button>
  );
}
