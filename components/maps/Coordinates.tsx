"use client";

import { useState } from "react";
import { MapPin, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CoordinatesProps {
  latitude: number;
  longitude: number;
}

export default function Coordinates({ latitude, longitude }: CoordinatesProps) {
  const [copied, setCopied] = useState(false);
  const coordinateString = `${latitude}, ${longitude}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coordinateString);
      setCopied(true);
      toast.success("Coordinates copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy coordinates");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group"
    >
      <MapPin className="w-4 h-4" />
      <span className="font-mono">{coordinateString}</span>
      {copied ? (
        <Check className="w-4 h-4 text-success" />
      ) : (
        <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
