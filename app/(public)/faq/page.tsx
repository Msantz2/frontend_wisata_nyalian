import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { createFAQPageSchema } from "@/lib/structuredData";
import StructuredData from "@/components/seo/StructuredData";
import FAQClient from "./FAQClient";
import { getFAQs } from "@/lib/faq";
import { getSettings } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about visiting Nyalian Village, including tickets, facilities, transportation, and reservations.",
    path: "/faq",
    keywords: ["Nyalian FAQ", "visitor information", "travel questions", "booking information", "Bali travel help"],
  });
}

export default async function FAQPage() {
  const faqs = await getFAQs();
  const settings = getSettings();
  
  const faqSchema = createFAQPageSchema(faqs);
  
  return (
    <>
      <StructuredData data={faqSchema} />
      <FAQClient faqs={faqs} settings={settings} />
    </>
  );
}
