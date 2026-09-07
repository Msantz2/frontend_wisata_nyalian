import Image from "next/image";
import { Star } from "lucide-react";
import type { Review } from "@/types/review";
import { formatDate } from "@/utils/formatDate";
import { getPlaceholderAvatar } from "@/lib/placeholderImage";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const avatarUrl = getPlaceholderAvatar(review.visitorName);
  const fullStars = Math.floor(review.rating);
  const hasHalfStar = review.rating % 1 >= 0.5;
  
  return (
    <div className="bg-card rounded-lg shadow-md p-6 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
         <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
           <Image
             src={avatarUrl}
             alt={review.visitorName}
             fill
             sizes="64px"
             className="object-cover"
           />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-heading text-lg font-bold text-text-primary truncate">
            {review.visitorName}
          </h3>
          <p className="text-text-muted text-sm">
            {review.visitorCountry}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${
              index < fullStars
                ? "text-accent fill-accent"
                : index === fullStars && hasHalfStar
                ? "text-accent fill-accent/50"
                : "text-border"
            }`}
          />
        ))}
        <span className="ml-2 text-text-primary font-semibold">
          {review.rating.toFixed(1)}
        </span>
      </div>
      
      <p className="text-text-secondary leading-relaxed mb-4 flex-1 line-clamp-5">
        &ldquo;{review.comment}&rdquo;
      </p>
      
      <p className="text-text-muted text-sm mt-auto">
        Visited {formatDate(review.visitDate)}
      </p>
    </div>
  );
}
