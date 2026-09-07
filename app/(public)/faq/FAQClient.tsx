"use client";

import { useState, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
import FAQSearch from "@/components/faq/FAQSearch";
import FAQCategory from "@/components/faq/FAQCategory";
import PopularQuestions from "@/components/faq/PopularQuestions";
import FAQAccordion from "@/components/faq/FAQAccordion";
import EmptyState from "@/components/shared/EmptyState";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import type { FAQ } from "@/types/faq";
import type { SiteSettings } from "@/types/settings";

interface FAQClientProps {
  faqs: FAQ[];
  settings: SiteSettings;
}

export default function FAQClient({ faqs, settings }: FAQClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const { query: searchTerm, setQuery: setSearchTerm, results: searchedFaqs } = useSearch(
    faqs,
    ["pertanyaan", "jawaban"]
  );

  const categories = useMemo(() => {
    const activeFaqs = searchTerm || activeCategory !== "all" ? searchedFaqs : faqs;
    const uniqueCategories = new Set(activeFaqs.map((faq: FAQ) => faq.kategori));
    return Array.from(uniqueCategories).sort();
  }, [faqs, searchedFaqs, searchTerm, activeCategory]);

  const filteredFaqs = useMemo(() => {
    let filtered = searchedFaqs;

    if (activeCategory !== "all") {
      filtered = filtered.filter((faq: FAQ) => faq.kategori === activeCategory);
    }

    return filtered.sort((a: FAQ, b: FAQ) => a.urutan - b.urutan);
  }, [searchedFaqs, activeCategory]);

  const showPopularQuestions = !searchTerm && activeCategory === "all";

  return (
    <div className="container mx-auto px-4 py-12 pt-32 space-y-12">
      <div className="text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Find answers to common questions about visiting Nyalian Village
        </p>
      </div>

      <FAQSearch value={searchTerm} onChange={setSearchTerm} />

      <FAQCategory
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {showPopularQuestions && <PopularQuestions faqs={faqs} />}

      {filteredFaqs.length === 0 ? (
        <div className="max-w-3xl mx-auto">
          <EmptyState message="No questions found. Try using different keywords or browse all categories." />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          {!showPopularQuestions && (
            <h2 className="font-heading text-2xl font-bold text-text-primary mb-8">
              All Questions
            </h2>
          )}
          <FAQAccordion items={filteredFaqs} />
        </div>
      )}

      <div className="max-w-2xl mx-auto text-center bg-background-section rounded-lg p-8">
        <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">
          Didn&apos;t find your answer?
        </h3>
        <p className="text-text-secondary mb-6">
          Contact us via WhatsApp and we&apos;ll be happy to help you with your questions.
        </p>
        <WhatsAppCTA
          phone={settings.whatsapp}
          message="Hello! I have a question about visiting Nyalian Village."
        />
      </div>
    </div>
  );
}
