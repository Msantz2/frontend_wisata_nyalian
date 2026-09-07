import SectionContainer from "@/components/shared/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <SectionContainer className="py-12">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
