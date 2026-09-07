import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import ReviewCarousel from "@/components/review/ReviewCarousel";
import type { Review } from "@/types/review";

interface ReviewPreviewProps {
  reviews: Review[];
}

export default function ReviewPreview({ reviews }: ReviewPreviewProps) {
  if (reviews.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle
        title="Kata-Kata Pengunjung"
        subtitle="Dengarkan dari para wisatawan yang telah mengalami Desa Nyalian"
      />
      
      <ReviewCarousel reviews={reviews} />
    </SectionContainer>
  );
}
