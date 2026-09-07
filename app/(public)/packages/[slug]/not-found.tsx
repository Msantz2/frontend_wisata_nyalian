import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/shared/SectionContainer";

export default function NotFound() {
  return (
    <SectionContainer className="py-24">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <PackageX className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="font-heading text-3xl font-bold text-text-primary mb-3">
          Package Not Found
        </h1>
        
        <p className="text-text-secondary mb-8">
          The tour package you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>

        <div className="flex gap-4">
          <Button asChild variant="default">
            <Link href="/packages">Browse Packages</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </SectionContainer>
  );
}
