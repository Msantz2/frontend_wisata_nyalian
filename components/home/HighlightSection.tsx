import {
  Crown,
  Droplets,
  Sprout,
  Paintbrush,
} from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import HighlightCard from "./HighlightCard";
import type { VillageProfile } from "@/types/village";

interface HighlightSectionProps {
  village: VillageProfile;
}

export default function HighlightSection({ }: HighlightSectionProps) {
  const highlights = [
    {
      icon: Crown,
      title: "Warisan Kerajaan & Seni Pertunjukan",
      description: "Rumah Puri Agung Nyalian — kediaman kerajaan hidup dan tempat lahirnya teater Arja Bali.",
    },
    {
      icon: Droplets,
      title: "Wisata Spiritual & Penglukatan",
      description: "Melukat di mata air tebing yang benar-benar suci, bukan pengalaman spa buatan.",
    },
    {
      icon: Sprout,
      title: "Alam & Lanskap Pertanian",
      description: "Persawahan dan pemandangan lembah sungai yang komunitas Nyalian masih aktif garap hari ini.",
    },
    {
      icon: Paintbrush,
      title: "Kehidupan Desa & Kerajinan Lokal",
      description: "Bertemu pengrajin di balik tradisional topi capil Nyalian di Dusun Pemenang.",
    },
  ];

  return (
    <SectionContainer background="section">
      <SectionTitle
        title="Mengapa Mengunjungi Nyalian"
        subtitle="Temukan apa yang membuat desa kami istimewa"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={`highlight-${index}-${highlight.title}`}
            icon={highlight.icon}
            title={highlight.title}
            description={highlight.description}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
