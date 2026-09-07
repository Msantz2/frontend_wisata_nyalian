"use client";

import ErrorState from "@/components/shared/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center">
      <ErrorState
        message={error.message || "Something went wrong. Please try again."}
        onRetry={reset}
      />
    </div>
  );
}
