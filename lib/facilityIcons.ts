import {
  Car,
  UtensilsCrossed,
  Accessibility,
  Eye,
  UserCheck,
  MapPin,
  Camera,
  Trees,
  Home,
  Coffee,
  ShoppingBag,
  Circle,
  type LucideIcon,
} from "lucide-react";

const facilityIconMap: Record<string, LucideIcon> = {
  "parking": Car,
  "parking area": Car,
  "restaurant": UtensilsCrossed,
  "toilet": Accessibility,
  "restroom": Accessibility,
  "viewing platform": Eye,
  "viewing deck": Eye,
  "tour guide": UserCheck,
  "local guide": UserCheck,
  "guide service": UserCheck,
  "photo spot": Camera,
  "rest area": Trees,
  "rest areas": Trees,
  "seating areas": Trees,
  "walking trail": MapPin,
  "walking paths": MapPin,
  "prayer area": Home,
  "prayer space": Home,
  "prayer room": Home,
  "changing rooms": Home,
  "changing room": Home,
  "warung": Coffee,
  "traditional warung": Coffee,
  "refreshments": Coffee,
  "first aid kit": Circle,
  "shop": ShoppingBag,
  "product shop": ShoppingBag,
  "craft shop": ShoppingBag,
};

export function getFacilityIcon(facility: string): LucideIcon {
  const normalizedFacility = facility.toLowerCase().trim();
  
  const icon = facilityIconMap[normalizedFacility];
  if (icon) {
    return icon;
  }
  
  for (const [key, value] of Object.entries(facilityIconMap)) {
    if (normalizedFacility.includes(key) || key.includes(normalizedFacility)) {
      return value;
    }
  }
  
  return Circle;
}
