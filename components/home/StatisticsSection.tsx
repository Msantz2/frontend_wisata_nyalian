"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import SectionContainer from "@/components/shared/SectionContainer";

interface StatisticProps {
  value: string;
  label: string;
  index: number;
}

function StatisticCard({ value, label, index }: StatisticProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
        {value}
      </div>
      <div className="text-xs sm:text-sm md:text-base text-text-secondary px-2">
        {label}
      </div>
    </motion.div>
  );
}

export default function StatisticsSection() {
  const statistics = [
    { value: "5", label: "Documented Destinations" },
    { value: "7", label: "Curated Tour Packages" },
    { value: "2019", label: "Community Tourism Development Began" },
    { value: "1", label: "Sister Village Partnership" },
    { value: "3", label: "Desa Pakraman (Customary Communities)" },
  ];

  return (
    <SectionContainer background="section">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
        {statistics.map((stat, index) => (
          <StatisticCard
            key={`stat-${index}-${stat.value}`}
            value={stat.value}
            label={stat.label}
            index={index}
          />
        ))}
      </div>
    </SectionContainer>
  );
}
