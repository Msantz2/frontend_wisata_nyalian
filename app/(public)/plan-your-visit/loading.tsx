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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          ))}
        </div>

        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </SectionContainer>
  );
}
