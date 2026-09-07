import DestinationCard from "./DestinationCard";
import type { Destination } from "@/types/destination";

interface DestinationGridProps {
  destinations: Destination[];
}

export default function DestinationGrid({ destinations }: DestinationGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} destination={destination} />
      ))}
    </div>
  );
}
