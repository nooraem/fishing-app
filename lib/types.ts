export type Catch = {
    id: string;
    species: string;
    lenghtCm?: number;
    weightKg?: number;
    photoUri?: string;
    notes?: string;
    location?: {
        latitude: number;
        longitude: number;
    };
};

export type Trip = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  catches: Catch[];
};
