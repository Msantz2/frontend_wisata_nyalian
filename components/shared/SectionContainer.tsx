import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  background?: "white" | "light" | "section";
}

export default function SectionContainer({
  children,
  className,
  background = "white",
}: SectionContainerProps) {
  const bgClasses = {
    white: "bg-background",
    light: "bg-background-light",
    section: "bg-background-section",
  };

  return (
    <section className={cn("py-section-mobile md:py-section-tablet lg:py-section-desktop", bgClasses[background])}>
      <div className={cn("max-w-container mx-auto px-4 sm:px-6 lg:px-8", className)}>
        {children}
      </div>
    </section>
  );
}
