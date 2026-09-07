interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  embedUrl?: string;
  title: string;
  className?: string;
}

export default function GoogleMap({
  latitude,
  longitude,
  embedUrl,
  title,
  className = "",
}: GoogleMapProps) {
  const mapUrl =
    embedUrl ||
    `https://www.google.com/maps?q=${latitude},${longitude}&hl=id&z=15&output=embed`;

  return (
    <div className={`relative w-full aspect-video rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={mapUrl}
        title={title}
        width="100%"
        height="100%"
        loading="lazy"
        className="border-0"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
