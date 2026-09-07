import { MapPin } from "lucide-react";

interface AddressCardProps {
  village: string;
  district: string;
  regency: string;
  province: string;
  address: string;
}

export default function AddressCard({
  village,
  district,
  regency,
  province,
  address,
}: AddressCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-start gap-3">
        <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
        <div className="space-y-1">
          <h3 className="font-semibold text-text-primary">Location</h3>
          <div className="text-sm text-text-secondary space-y-0.5">
            <p>{address}</p>
            <p>
              {village}, {district}
            </p>
            <p>
              {regency}, {province}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
