import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6">
            <Search className="w-12 h-12 text-primary" />
          </div>
          <h1 className="font-heading text-6xl text-primary mb-4">404</h1>
          <h2 className="font-heading text-3xl text-text-primary mb-4">
            Page Not Found
          </h2>
          <p className="font-body text-text-secondary mb-8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
          </p>
        </div>
        
        <Link href="/">
          <Button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-6 rounded-md transition-colors">
            <Home className="w-5 h-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
