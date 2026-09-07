import FAQAccordion from "./FAQAccordion";
import type { FAQ } from "@/types/faq";

interface PopularQuestionsProps {
  faqs: FAQ[];
}

export default function PopularQuestions({ faqs }: PopularQuestionsProps) {
  if (faqs.length === 0) {
    return null;
  }

  const popularFaqs = faqs
    .filter((faq) => faq.featured)
    .sort((a, b) => a.urutan - b.urutan)
    .slice(0, 5);

  if (popularFaqs.length === 0) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <h2 className="font-heading text-2xl font-bold text-text-primary mb-6 text-center">
        Popular Questions
      </h2>
      <FAQAccordion items={popularFaqs} />
    </div>
  );
}
