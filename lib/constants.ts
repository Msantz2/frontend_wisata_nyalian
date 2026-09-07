export const PAGINATION = {
  DESTINATIONS_PER_PAGE: 9,
  PACKAGES_PER_PAGE: 6,
  ARTICLES_PER_PAGE: 9,
} as const;

export const SITE_NAME = "Nyalian Tourism Village";

export const DEFAULT_LOCALE = "id-ID";

export const PRICE_RANGE = {
  BUDGET: { min: 0, max: 250000, label: "Budget" },
  STANDARD: { min: 250000, max: 400000, label: "Standard" },
  PREMIUM: { min: 400000, max: Infinity, label: "Premium" },
} as const;
