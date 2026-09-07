import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSettings } from "@/lib/data";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "Articles", href: "/articles" },
];

const infoLinks = [
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const settings = getSettings();

  return (
    <footer className="bg-text-primary text-white" role="contentinfo">
      <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="font-heading text-2xl font-bold text-accent mb-4">
              {settings.siteName}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed">
              {settings.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-body font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-lg mb-4">Information</h4>
            <ul className="space-y-2">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-text-muted hover:text-accent transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-text-muted text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-2 text-text-muted text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center space-x-2 text-text-muted text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{settings.email}</span>
              </li>
            </ul>
            <div className="flex items-center space-x-4 mt-6">
              <a
                href={settings.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-text-muted/20 text-text-muted hover:bg-accent hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <span className="text-sm font-semibold">f</span>
              </a>
              <a
                href={settings.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-text-muted/20 text-text-muted hover:bg-accent hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <span className="text-sm font-semibold">ig</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-text-secondary/20 mt-12 pt-8 text-center">
          <p className="text-text-muted text-sm">
            &copy; {currentYear} {settings.siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
