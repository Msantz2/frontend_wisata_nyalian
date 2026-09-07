export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsEmbed: string;
  socialMedia: {
    instagram: string;
    facebook: string;
    youtube: string;
    tiktok: string;
  };
}
