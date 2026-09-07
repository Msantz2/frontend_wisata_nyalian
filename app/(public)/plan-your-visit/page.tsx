import { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import PlanYourVisitClient from "./PlanYourVisitClient";
import { getSettings } from "@/lib/data";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Plan Your Visit",
    description: "Essential information for planning your visit to Nyalian Village, including directions, opening hours, what to bring, and booking information.",
    path: "/plan-your-visit",
    keywords: ["visit Nyalian", "travel planning", "directions", "booking", "visitor guide", "Bali travel tips"],
  });
}

export default function PlanYourVisitPage() {
  const settings = getSettings();
  return <PlanYourVisitClient settings={settings} />;
}
