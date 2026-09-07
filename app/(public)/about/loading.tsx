import SectionContainer from "@/components/shared/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SectionContainer className="py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
