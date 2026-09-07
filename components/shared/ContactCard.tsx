import { Mail, Phone, MapPin } from "lucide-react";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";

interface ContactCardProps {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
}

export default function ContactCard({
  email,
  phone,
  whatsapp,
  address,
}: ContactCardProps) {
  return (
    <div className="h-full bg-card rounded-lg shadow-md p-6 flex flex-col">
      <h3 className="font-heading text-2xl font-bold text-text-primary mb-6">
        Contact Information
      </h3>
      
      <div className="space-y-4 mb-6 flex-1">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-muted mb-1">Email</p>
            <a
              href={`mailto:${email}`}
              className="text-text-primary hover:text-primary transition-colors"
            >
              {email}
            </a>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-muted mb-1">Phone</p>
            <a
              href={`tel:${phone}`}
              className="text-text-primary hover:text-primary transition-colors"
            >
              {phone}
            </a>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-muted mb-1">Address</p>
            <p className="text-text-primary">{address}</p>
          </div>
        </div>
      </div>
      
      <WhatsAppCTA
        phone={whatsapp}
        message="Hello! I would like to inquire about visiting Nyalian Village."
      />
    </div>
  );
}
