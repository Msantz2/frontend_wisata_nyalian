import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhatsAppCTAProps {
  phone: string;
  message: string;
  label?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export default function WhatsAppCTA({
  phone,
  message,
  label = "Contact via WhatsApp",
  variant = "default",
  size = "default",
}: WhatsAppCTAProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const whatsappLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Button
        variant={variant}
        size={size}
        className="w-full gap-2 bg-primary hover:bg-primary/90 min-h-[44px]"
      >
        <MessageCircle className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </Button>
    </a>
  );
}
