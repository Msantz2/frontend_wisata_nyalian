import PackageCard from "./PackageCard";
import type { TourPackage } from "@/types/package";

interface PackageGridProps {
  packages: TourPackage[];
}

export default function PackageGrid({ packages }: PackageGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} package={pkg} />
      ))}
    </div>
  );
}
