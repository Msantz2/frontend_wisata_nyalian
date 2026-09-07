import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import EmptyState from "@/components/shared/EmptyState";
import PackageCard from "@/components/package/PackageCard";
import { Button } from "@/components/ui/button";
import type { TourPackage } from "@/types/package";

interface FeaturedPackagesProps {
  packages: TourPackage[];
}

export default function FeaturedPackages({ packages }: FeaturedPackagesProps) {
  const featured = packages.slice(0, 3);
  
  return (
    <SectionContainer background="section">
      <SectionTitle
        title="Paket Wisata Unggulan"
        subtitle="Pengalaman pilihan yang menggabungkan pesona Desa Nyalian"
      />
      
      {featured.length === 0 ? (
        <EmptyState message="Tidak ada paket wisata unggulan tersedia saat ini" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featured.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
          
          <div className="text-center">
            <Link href="/packages">
              <Button size="lg" className="font-semibold">
                Lihat Semua Paket
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </SectionContainer>
  );
}
