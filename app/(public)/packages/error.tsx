"use client";

import ErrorState from "@/components/shared/ErrorState";
import SectionContainer from "@/components/shared/SectionContainer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <SectionContainer className="py-12">
      <ErrorState
        message={error.message || "Failed to load packages. Please try again."}
        onRetry={reset}
      />
    </SectionContainer>
  );
}
