import SectionContainer from "@/components/shared/SectionContainer";
import DestinationGridSkeleton from "@/components/destination/DestinationGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DestinationsLoading() {
  return (
    <SectionContainer className="py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-12 w-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-80 flex-shrink-0 space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>

          <DestinationGridSkeleton />
        </div>
      </div>
    </SectionContainer>
  );
}
