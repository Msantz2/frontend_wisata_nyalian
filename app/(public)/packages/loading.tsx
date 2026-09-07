import SectionContainer from "@/components/shared/SectionContainer";
import SectionTitle from "@/components/shared/SectionTitle";
import PackageGridSkeleton from "@/components/package/PackageGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SectionContainer className="py-12">
      <SectionTitle
        title="Tour Packages"
        subtitle="Curated experiences combining the best of Nyalian Village"
        align="center"
      />

      <div className="mb-8">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <Skeleton className="h-96 w-full" />
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <PackageGridSkeleton />
        </div>
      </div>
    </SectionContainer>
  );
}
