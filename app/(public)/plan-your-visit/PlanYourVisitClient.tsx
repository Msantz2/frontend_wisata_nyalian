"use client";

import { Car, Clock, Sun, Backpack } from "lucide-react";
import GoogleMap from "@/components/maps/GoogleMap";
import Coordinates from "@/components/maps/Coordinates";
import NavigationButton from "@/components/maps/NavigationButton";
import InformationCard from "@/components/plan/InformationCard";
import ContactCard from "@/components/shared/ContactCard";
import WhatsAppCTA from "@/components/shared/WhatsAppCTA";
import type { SiteSettings } from "@/types/settings";

interface PlanYourVisitClientProps {
  settings: SiteSettings;
}

export default function PlanYourVisitClient({ settings }: PlanYourVisitClientProps) {
  return (
    <div className="container mx-auto px-4 py-12 pt-32 space-y-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Plan Your Visit
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Everything you need to know before visiting Nyalian Village
        </p>
      </div>

      <div>
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-bold text-text-primary">
            Location & Map
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GoogleMap
              embedUrl={settings.googleMapsEmbed}
              title="Nyalian Village Location"
            />
          </div>
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-primary mt-1 flex-shrink-0">📍</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-text-primary">Location</h3>
                  <p className="text-sm text-text-secondary">{settings.address}</p>
                </div>
              </div>
            </div>
            <Coordinates
              latitude={settings.latitude}
              longitude={settings.longitude}
            />
            <NavigationButton
              latitude={settings.latitude}
              longitude={settings.longitude}
              label="Get Directions"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <InformationCard
          icon={Car}
          title="Transportation & Directions"
          content={
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-text-primary mb-2">By Private Vehicle or Taxi:</p>
                <p>From Denpasar, take the route via Gianyar-Bangli-Nyalian. The journey takes approximately 1.5-2 hours depending on traffic. GPS coordinates: -8.4993, 115.3673</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-2">By Public Transport:</p>
                <p>Take a bus from Denpasar to Bangli town (Rp 25,000), then a local bemo to Nyalian Village (Rp 15,000). Note that public transport options are limited and schedules may be irregular.</p>
              </div>
              <div>
                <p className="font-semibold text-text-primary mb-2">Arranged Transportation:</p>
                <p>We can arrange hotel pickup and drop-off for groups of 4 or more. Contact us in advance for rates and availability.</p>
              </div>
            </div>
          }
        />

        <InformationCard
          icon={Clock}
          title="Opening Hours"
          content={
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-text-primary">Village Tourism Office:</span> Daily, 8:00 AM - 5:00 PM
              </p>
              <p>
                <span className="font-semibold text-text-primary">Destinations (Waterfall, Rice Terraces, etc.):</span> Daily, 7:00 AM - 6:00 PM
              </p>
              <p>
                <span className="font-semibold text-text-primary">Cultural Activities & Workshops:</span> By appointment only
              </p>
              <p className="text-sm italic">
                Note: Some areas may close early during ceremonies or adverse weather conditions. We recommend checking before your visit.
              </p>
            </div>
          }
        />

        <InformationCard
          icon={Sun}
          title="Best Time to Visit"
          content={
            <div className="space-y-3">
              <p>
                <span className="font-semibold text-text-primary">Dry Season (April - October):</span> Ideal for trekking and outdoor activities. Clear skies and minimal rainfall. Best months: May, June, and September.
              </p>
              <p>
                <span className="font-semibold text-text-primary">Wet Season (November - March):</span> Dramatic waterfalls and lush vegetation. Fewer tourists and lower prices. Trails can be muddy.
              </p>
              <p>
                <span className="font-semibold text-text-primary">Temperature:</span> Cool mountain climate year-round. Daytime: 22-26°C, Evening: 15-18°C.
              </p>
              <p>
                <span className="font-semibold text-text-primary">Time of Day:</span> Early morning (7-10 AM) offers the best light for photography and cooler temperatures for trekking.
              </p>
            </div>
          }
        />

        <InformationCard
          icon={Backpack}
          title="What to Bring"
          content={
            <ul className="space-y-2">
              <li>• Comfortable walking/trekking shoes with good grip</li>
              <li>• Modest clothing for temple visits (covered shoulders and knees)</li>
              <li>• Swimwear and towel for waterfall visits</li>
              <li>• Sun protection: hat, sunscreen, and sunglasses</li>
              <li>• Insect repellent for outdoor activities</li>
              <li>• Reusable water bottle to stay hydrated</li>
              <li>• Small backpack for personal items</li>
              <li>• Cash (many places don&apos;t accept cards)</li>
              <li>• Light jacket for cool evenings</li>
              <li>• Rain gear during wet season</li>
              <li>• Camera and waterproof case for waterfall photography</li>
            </ul>
          }
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <ContactCard
          email={settings.email}
          phone={settings.phone}
          whatsapp={settings.whatsapp}
          address={settings.address}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center bg-background-section rounded-lg p-8">
        <h3 className="font-heading text-2xl font-bold text-text-primary mb-4">
          Ready to Visit?
        </h3>
        <p className="text-text-secondary mb-6">
          Contact us on WhatsApp for reservations, tour packages, or any questions about your visit.
        </p>
        <WhatsAppCTA
          phone={settings.whatsapp}
          message="Hello! I would like to plan my visit to Nyalian Village."
        />
      </div>
    </div>
  );
}
