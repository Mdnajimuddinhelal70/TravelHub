export interface IDivision {
  name: string;
  slug: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  districts?: string[];
  location?: { type: "Point"; coordinates: [number, number] };
  isActive: boolean;
  isDeleted?: boolean;
}

export interface ICreateDivisionInput {
  name: string;
  thumbnail?: string;
  images?: string[];
  description?: string;
  districts?: string[];
  location?: { type: "Point"; coordinates: [number, number] };
  isActive?: boolean;
}

export type IUpdateDivisionInput = Partial<ICreateDivisionInput>;
