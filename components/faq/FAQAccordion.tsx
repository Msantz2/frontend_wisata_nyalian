"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import type { FAQ } from "@/types/faq";

interface FAQAccordionProps {
  items: FAQ[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((faq) => (
        <AccordionItem key={faq.id_faq} value={String(faq.id_faq)}>
          <AccordionTrigger className="text-left font-heading text-lg font-semibold text-text-primary hover:text-primary">
            {faq.pertanyaan}
          </AccordionTrigger>
          <AccordionContent className="text-text-secondary leading-relaxed">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-2">{children}</li>,
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {faq.jawaban}
            </ReactMarkdown>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
