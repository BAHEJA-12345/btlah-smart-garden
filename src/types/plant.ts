export interface Plant {
  id: string;
  nameAr: string;
  season: string;
  temperature: string;
  waterMl: number;
  potSize: string;
  soilType: string;
  lightType: string;
  benefit: string;
  isFavorite?: boolean;
}

export interface PlantFilters {
  potSize: string;
  soilType: string;
  lightType: string;
  temperature: string;
  season: string;
}
