export interface Geography {
  location: string;
  area: string;
  banjarCount: number;
  banjarNames: string[];
  administrativeBorders: {
    north: string;
    east: string;
    south: string;
    west: string;
  };
  riverSystems: string[];
  landscape: string;
}

export interface Demographics {
  population: number;
  populationYear: number;
  males: number;
  females: number;
  households: number;
  lowIncomeHouseholds: number;
  religion: string;
  description: string;
}

export interface VillageProfile {
  name: string;
  introduction: string;
  geography: Geography;
  demographics: Demographics;
  socialCulturalLife: string;
  origin: string;
  philosophy: string;
  vision: string;
  mission: string[];
  tourismPotential: string[];
  culturalHeritage: string;
  heroImage: string;
  gallery: string[];
}
