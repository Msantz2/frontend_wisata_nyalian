import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import FAQAccordion from "@/components/faq/FAQAccordion";
import { Button } from "@/components/ui/button";
import type { FAQ } from "@/types/faq";

interface FAQPreviewProps {
  faqs: FAQ[];
}

export default function FAQPreview({ faqs }: FAQPreviewProps) {
  const displayFaqs = faqs.slice(0, 5);

  if (displayFaqs.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <SectionTitle
        title="Pertanyaan yang Sering Diajukan"
        subtitle="Temukan jawaban atas pertanyaan umum tentang mengunjungi Desa Nyalian"
      />
      
      <div className="max-w-3xl mx-auto mb-12">
        <FAQAccordion items={displayFaqs} />
      </div>
      
      <div className="text-center">
        <Link href="/faq">
          <Button size="lg" variant="outline" className="font-semibold">
            Lihat Semua FAQ
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </Link>
      </div>
    </SectionContainer>
  );
}
