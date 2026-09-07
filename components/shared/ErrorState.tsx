import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center" role="alert" aria-live="assertive">
      <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mb-4" aria-hidden="true">
        <AlertCircle className="w-8 h-8 text-error" />
      </div>
      <p className="text-text-secondary text-lg mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
