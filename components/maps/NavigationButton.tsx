import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavigationButtonProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function NavigationButton({
  latitude,
  longitude,
  label = "Open in Google Maps",
}: NavigationButtonProps) {
  const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Button size="lg" className="w-full gap-2">
        <Navigation className="w-5 h-5" />
        {label}
      </Button>
    </a>
  );
}
